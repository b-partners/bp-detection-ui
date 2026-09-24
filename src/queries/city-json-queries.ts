import { useStep } from '@/hooks';
import { getCityJSON } from '@/providers';
import { isDemoApiKey } from '@/providers/demo';
import { getCached, getFileUrl, getImageDimensions, ParamsUtilities } from '@/utilities';
import { FileType } from '@bpartners/typescript-client';
import { useQuery } from '@tanstack/react-query';
import { v4 } from 'uuid';

// One map tile is 1024px — the size the WMS GetMap in detection-provider asks for.
const TILE_SIZE_PX = 1024;
const VERTICES_TEXTURE_OFFSET_PER_SHIFT = TILE_SIZE_PX;

// Extended (mosaicked) tiles are 3x wider than a single tile, but the shift correction below
// is expressed in single-tile units — matches the same correction bpartners-web applies for
// this layer.
const EXTENDED_TRIPLE_TILE_LAYER = 'FLUX_IGN_2023_20CM';

const shiftVerticesTextures = (
  verticesTextures: [number, number][] = [],
  areaPictureDetails: { shiftNb?: number; shiftDirection?: string },
  imageSize: number
): [number, number][] => {
  const shift = areaPictureDetails?.shiftNb || 0;
  if (!shift) return verticesTextures;

  const offset = (shift * VERTICES_TEXTURE_OFFSET_PER_SHIFT) / imageSize;

  const xOffset = areaPictureDetails.shiftDirection === 'RIGHT_LEFT_SIDE' ? offset : 0;
  const yOffset = areaPictureDetails.shiftDirection === 'UP_DOWN_SIDE' ? offset : 0;

  return verticesTextures.map(([u, v]) => [u - xOffset, v + yOffset]);
};

type Point2 = { x: number; y: number };

const spanOf = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, span: max - min };
};

/** Convex hull (monotone chain) — the UV points are unordered, so they need an outline first. */
const convexHull = (points: Point2[]): Point2[] => {
  if (points.length < 4) return points;

  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Point2, a: Point2, b: Point2) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const build = (input: Point2[]) => {
    const half: Point2[] = [];
    input.forEach(point => {
      while (half.length >= 2 && cross(half[half.length - 2], half[half.length - 1], point) <= 0) half.pop();
      half.push(point);
    });
    half.pop();
    return half;
  };

  return [...build(sorted), ...build([...sorted].reverse())];
};

/**
 * Area centroid of a ring (shoelace). Unlike the mean of the vertices it doesn't drift toward
 * whichever side happens to carry more points — the delimiter's corners and the roof's ridge
 * vertices are spaced very differently, so a vertex mean biases the two shapes apart.
 */
const areaCentroid = (ring: Point2[]): Point2 => {
  let twiceArea = 0;
  let x = 0;
  let y = 0;

  for (let i = 0; i < ring.length; i++) {
    const current = ring[i];
    const next = ring[(i + 1) % ring.length];
    const cross = current.x * next.y - next.x * current.y;
    twiceArea += cross;
    x += (current.x + next.x) * cross;
    y += (current.y + next.y) * cross;
  }

  if (!twiceArea) {
    return {
      x: ring.reduce((total, point) => total + point.x, 0) / ring.length,
      y: ring.reduce((total, point) => total + point.y, 0) / ring.length,
    };
  }

  return { x: x / (3 * twiceArea), y: y / (3 * twiceArea) };
};

/**
 * The backend returns texture coordinates in tile units measured from the tile origin the
 * request declared, not normalised to the image — for a single-tile square picture the two
 * coincide, which is why bpartners-web never needs this step, but bp-detection-ui always
 * requests an extended zone so the raw coordinates land outside [0,1].
 *
 * Scale is known rather than fitted: one UV unit is one tile of `uvUnitInPixels` pixels — the
 * very value the request declared as tileImageSizePx — and cropping the image (createdImage)
 * moves content without changing pixels-per-metre. Only the offset is unknown, and it is
 * recovered by lining the roof's centroid up with the centroid of the same roof's polygon in
 * the texture image. Fitting scale too would mean matching two outlines that aren't the same
 * shape (reconstructed roof vs. drawn delimiter), which shows up as a visible edge offset.
 */
const fitVerticesTexturesToRoof = (
  verticesTextures: [number, number][] = [],
  roofPolygonPoints: Array<{ x: number; y: number }> = [],
  imageWidth: number,
  imageHeight: number,
  uvUnitInPixels: number
): [number, number][] | null => {
  if (verticesTextures.length < 2 || !roofPolygonPoints?.length || roofPolygonPoints.length < 2 || !imageWidth || !imageHeight || !uvUnitInPixels) return null;

  const uScale = uvUnitInPixels / imageWidth;
  const vScale = uvUnitInPixels / imageHeight;

  const source = areaCentroid(convexHull(verticesTextures.map(([u, v]) => ({ x: u * uScale, y: v * vScale }))));
  const target = areaCentroid(roofPolygonPoints.map(({ x, y }) => ({ x: x / imageWidth, y: y / imageHeight })));

  const uOffset = target.x - source.x;
  const vOffset = target.y - source.y;

  return verticesTextures.map(([u, v]) => [u * uScale + uOffset, v * vScale + vOffset]);
};

/** Whole-tile translation that leaves the least of `values` outside [0,1] (0 when already inside). */
const wholeTileShiftInto01 = (values: number[], perTile: number) => {
  const { min, max } = spanOf(values);

  let bestShift = 0;
  let bestOverflow = Infinity;

  for (let tiles = Math.floor(-max / perTile) - 1; tiles <= Math.ceil((1 - min) / perTile) + 1; tiles++) {
    const shift = tiles * perTile;
    const overflow = Math.max(0, -(min + shift)) + Math.max(0, max + shift - 1);
    // On a tie, stay put — coordinates that already fit must not be moved.
    if (overflow < bestOverflow - 1e-9 || (Math.abs(overflow - bestOverflow) < 1e-9 && Math.abs(shift) < Math.abs(bestShift))) {
      bestOverflow = overflow;
      bestShift = shift;
    }
  }

  return bestShift;
};

/** Fallback when the drawn roof polygon isn't available: rescale tile units to the image. */
const normalizeVerticesTextures = (verticesTextures: [number, number][] = [], imageWidth: number, imageHeight: number): [number, number][] => {
  if (!verticesTextures.length || !imageWidth || !imageHeight) return verticesTextures;

  const uPerTile = TILE_SIZE_PX / imageWidth;
  const vPerTile = TILE_SIZE_PX / imageHeight;
  const scaled = verticesTextures.map(([u, v]) => [u * uPerTile, v * vPerTile] as [number, number]);

  const uShift = wholeTileShiftInto01(
    scaled.map(([u]) => u),
    uPerTile
  );
  const vShift = wholeTileShiftInto01(
    scaled.map(([, v]) => v),
    vPerTile
  );

  return scaled.map(([u, v]) => [u + uShift, v + vShift]);
};

/**
 * Generates (or retrieves) the CityJSON 3D model for the roof already delimited during
 * detection, textured with the same image shown in the 2D result. Reuses the lat/lon roof
 * delimiter and tile metadata computed during detection — no extra geo-conversion needed.
 */
export const useCityJsonQuery = (textureDataUri?: string, areaPictureDataUri?: string, roofPolygonPoints?: Array<{ x: number; y: number }>, enabled = true) => {
  const { detection, areaPictureDetails } = useStep(({ params }) => params);
  const roofDelimiterLongLat = getCached.roofDelimiterLongLat();

  return useQuery({
    queryKey: ['city-json', detection?.imageTileInfoOrigin, roofDelimiterLongLat, areaPictureDetails?.id],
    enabled: enabled && !!textureDataUri && !!areaPictureDataUri && !!roofPolygonPoints?.length && !!roofDelimiterLongLat?.length && !!areaPictureDetails,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      // The demo backend has no city-json endpoint to simulate — no fabricated 3D model.
      const { apiKey } = ParamsUtilities.getQueryParams();
      if (isDemoApiKey(apiKey)) return null;

      // The request must describe the area picture the backend itself fetches, while the UVs are
      // normalised against the (cropped) image actually used as the texture.
      const { width: rawImageWidth } = await getImageDimensions(areaPictureDataUri as string);
      const { width: textureWidth, height: textureHeight } = await getImageDimensions(textureDataUri as string);

      let imageSize = rawImageWidth;
      if (areaPictureDetails?.actualLayer?.name === EXTENDED_TRIPLE_TILE_LAYER && areaPictureDetails?.isExtended) {
        imageSize = imageSize / 3;
      }

      // An extended area picture starts one tile up-left of the area picture's own tile, so the
      // texture origin has to be shifted by one — same convention as polygon-mapper's filename.
      const tileOffset = areaPictureDetails?.isExtended ? 1 : 0;
      // One UV unit is one tile of this many pixels — the backend measures in whatever unit the
      // request declares, so the client has to scale by the same number.
      const tileImageSizePx = imageSize > 2048 ? 1024 : imageSize;

      const cityJson = await getCityJSON(
        {
          id: v4(),
          roofDelimiter: [roofDelimiterLongLat as [number, number][]],
          imageUrl: getFileUrl(areaPictureDetails?.fileId ?? '', FileType.AREA_PICTURE),
          imageHeight: rawImageWidth,
          imageWidth: rawImageWidth,
          tileX: (areaPictureDetails?.xTile || 0) - tileOffset,
          tileY: (areaPictureDetails?.yTile || 0) - tileOffset,
          zoom: areaPictureDetails?.zoom?.number || 0,
          tileImageSizePx,
        },
        signal
      );

      // Texture the model with the image already loaded for the 2D result rather than
      // having the renderer re-fetch the backend's own copy (which needs an api key it
      // doesn't have).
      if (cityJson?.appearance?.textures?.[0]) {
        cityJson.appearance.textures[0].image = textureDataUri;
      }
      if (cityJson?.appearance) {
        const shifted = shiftVerticesTextures(cityJson.appearance['vertices-texture'], areaPictureDetails || {}, imageSize);
        const fitted = fitVerticesTexturesToRoof(shifted, roofPolygonPoints, textureWidth, textureHeight, tileImageSizePx);

        cityJson.appearance['vertices-texture'] = fitted ?? normalizeVerticesTextures(shifted, textureWidth, textureHeight);
      }

      return cityJson;
    },
  });
};
