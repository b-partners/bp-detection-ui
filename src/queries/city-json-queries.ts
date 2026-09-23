import { useStep } from '@/hooks';
import { getCityJSON } from '@/providers';
import { isDemoApiKey } from '@/providers/demo';
import { getCached, getFileUrl, getImageSize, ParamsUtilities } from '@/utilities';
import { FileType } from '@bpartners/typescript-client';
import { useQuery } from '@tanstack/react-query';
import { v4 } from 'uuid';

const VERTICES_TEXTURE_OFFSET_PER_SHIFT = 1024;

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

/**
 * Generates (or retrieves) the CityJSON 3D model for the roof already delimited during
 * detection, textured with the same image shown in the 2D result. Reuses the lat/lon roof
 * delimiter and tile metadata computed during detection — no extra geo-conversion needed.
 */
export const useCityJsonQuery = (imageDataUri?: string, enabled = true) => {
  const { detection, areaPictureDetails } = useStep(({ params }) => params);
  const roofDelimiterLongLat = getCached.roofDelimiterLongLat();

  return useQuery({
    queryKey: ['city-json', detection?.imageTileInfoOrigin, roofDelimiterLongLat, areaPictureDetails?.id],
    enabled: enabled && !!imageDataUri && !!roofDelimiterLongLat?.length && !!areaPictureDetails,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      // The demo backend has no city-json endpoint to simulate — no fabricated 3D model.
      const { apiKey } = ParamsUtilities.getQueryParams();
      if (isDemoApiKey(apiKey)) return null;

      const { imageTileInfoOrigin } = detection || {};
      const rawImageSize = await getImageSize(imageDataUri as string);

      let imageSize = rawImageSize;
      if (areaPictureDetails?.actualLayer?.name === EXTENDED_TRIPLE_TILE_LAYER && areaPictureDetails?.isExtended) {
        imageSize = imageSize / 3;
      }

      const cityJson = await getCityJSON(
        {
          id: v4(),
          roofDelimiter: [roofDelimiterLongLat as [number, number][]],
          imageUrl: getFileUrl(areaPictureDetails?.fileId ?? '', FileType.AREA_PICTURE),
          imageHeight: rawImageSize,
          imageWidth: rawImageSize,
          tileX: (imageTileInfoOrigin?.coordinates?.x ?? areaPictureDetails?.xTile) || 0,
          tileY: (imageTileInfoOrigin?.coordinates?.y ?? areaPictureDetails?.yTile) || 0,
          zoom: imageTileInfoOrigin?.coordinates?.z || 0,
          tileImageSizePx: imageSize > 2048 ? 1024 : imageSize,
        },
        signal
      );

      // Texture the model with the image already loaded for the 2D result rather than
      // having the renderer re-fetch the backend's own copy (which needs an api key it
      // doesn't have).
      if (cityJson?.appearance?.textures?.[0]) {
        cityJson.appearance.textures[0].image = imageDataUri;
      }
      if (cityJson?.appearance) {
        cityJson.appearance['vertices-texture'] = shiftVerticesTextures(cityJson.appearance['vertices-texture'], areaPictureDetails || {}, imageSize);
      }

      return cityJson;
    },
  });
};
