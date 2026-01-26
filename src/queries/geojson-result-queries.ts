import { DomainPolygonResultType } from '@/components';
import { createImage, getCroppedImageAndPolygons, useStep } from '@/hooks';
import { detectionResultMapper, Feature, filterRegionByLabel, geoJsonMapper, geoShapeAttributesToPoints, roofGlobalIdRef } from '@/mappers';
import { geoPointsToPoins, referencerPointsToGeoPoints } from '@/providers';
import { ExportAreaPictureAnnotationMeasurement } from '@bpartners/typescript-client';
import { useQuery } from '@tanstack/react-query';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';
import { v4 } from 'uuid';
import { DetectionResultInVgg, Region, useAnnotatorImageUploadQuery } from '.';

const getRegions = (detectionResult: DetectionResultInVgg) => {
  const detections = Object.values(detectionResult);

  const regions: Region[] = [];

  detections.forEach(({ regions: currentRegion }) => {
    const regionsValues = Object.values(currentRegion);
    regions.push(...regionsValues);
  });

  return regions;
};

const isThereAnObstacle = (regions: Region[]) => {
  for (const region of regions) {
    if (['OBSTACLE', 'VELUX', 'CHEMINEE'].includes(region.region_attributes.label)) {
      return true;
    }
  }

  return false;
};

const calculateMeasurement = (roofPolygonInGeoPoint: [number, number][]) => {
  const measurements: ExportAreaPictureAnnotationMeasurement[] = [];

  // calculate measurement
  if (roofPolygonInGeoPoint.length > 0) {
    for (let i = 1; i < roofPolygonInGeoPoint.length; i++) {
      const prevCoordinate = roofPolygonInGeoPoint[i - 1];
      const currentCoordinate = roofPolygonInGeoPoint[i];
      const measurement: ExportAreaPictureAnnotationMeasurement = {
        isInvisible: false,
        unit: 'm',
        value: +getDistance(
          { longitude: prevCoordinate[0], latitude: prevCoordinate[1] },
          { longitude: currentCoordinate[0], latitude: currentCoordinate[1] },
          0.2
        ).toFixed(2),
      };

      measurements.push(measurement);
    }

    const startPoint = roofPolygonInGeoPoint[0];
    const endPoint = roofPolygonInGeoPoint[roofPolygonInGeoPoint.length - 1];
    const startToEndPointMeasurement: ExportAreaPictureAnnotationMeasurement = {
      isInvisible: false,
      unit: 'm',
      value: +getDistance({ longitude: endPoint[0], latitude: endPoint[1] }, { longitude: startPoint[0], latitude: startPoint[1] }, 0.2).toFixed(2),
    };
    measurements.push(startToEndPointMeasurement);
  }

  return measurements;
};

const createFeature = (roofPolygonInGeoPoint: [number, number][]) => {
  return {
    geometry: {
      coordinates: [[roofPolygonInGeoPoint]],
      type: 'MultiPolygon',
    },
    properties: {
      confidence: 1,
      label: 'polygon',
    },
    type: 'Feature',
  } as Feature;
};

export const useGeojsonQueryResult = (imageUrl?: string) => {
  const { geoJsonResultUrl, detection } = useStep(({ params }) => params);

  const { mutate: uploadAnalyzeImage, isPending: isUploadAnalyzeImagePending } = useAnnotatorImageUploadQuery();

  const queryFnVgg = async () => {
    const detectionResultText = await fetch(geoJsonResultUrl, { headers: { 'content-type': '*/*' } });

    const _detectionResultJson: DetectionResultInVgg = await detectionResultText.json();
    const detectionResultJson: DetectionResultInVgg = Array.isArray(_detectionResultJson) ? _detectionResultJson[0] : _detectionResultJson;
    const regions = getRegions(detectionResultJson);
    const filteredRegions = filterRegionByLabel(regions);
    const filteredPolygons = detectionResultMapper.toPolygon(regions);

    // sort polygons in the expected order
    const usurePolygons = filteredPolygons.filter(({ id: polygonId }) => polygonId.includes('USURE')) || [];
    const moisissurePolygons = filteredPolygons.filter(({ id: polygonId }) => polygonId.includes('MOISISSURE')) || [];
    const humiditePolygons = filteredPolygons.filter(({ id: polygonId }) => polygonId.includes('HUMIDITE')) || [];
    const othersPolygons =
      filteredPolygons.filter(({ id: polygonId }) => !polygonId.includes('HUMIDITE') && !polygonId.includes('MOISISSURE') && !polygonId.includes('USURE')) ||
      [];
    const sortedPolygons = [...usurePolygons, ...moisissurePolygons, ...humiditePolygons, ...othersPolygons];
    // sort polygons in the expected order

    const obstacle = isThereAnObstacle(regions);

    const roofPolygonInGeoPoint = (detection?.roofDelimiter?.polygon || []) as [number, number][];

    const measurements: ExportAreaPictureAnnotationMeasurement[] = calculateMeasurement(roofPolygonInGeoPoint);

    const roofFeature: Feature = createFeature(roofPolygonInGeoPoint);

    const { imageTileInfoOrigin } = detection || {};

    const geoJsonForReferencer = createGeoJsonForReferencer(
      imageTileInfoOrigin?.coordinates?.z || 0,
      imageTileInfoOrigin?.coordinates?.x || 0,
      imageTileInfoOrigin?.coordinates?.y || 0,
      imageTileInfoOrigin?.size?.width || 0,
      filteredRegions
    );

    const convertedFromReferencer = await referencerPointsToGeoPoints(geoJsonForReferencer);

    const areas: number[] = [];
    if (convertedFromReferencer) {
      convertedFromReferencer.forEach(geojson => {
        const coordinates = geojson.geometry.coordinates[0][0];
        areas.push(+getAreaOfPolygon(coordinates.map(value => ({ latitude: value[1], longitude: value[0] }))).toFixed(2));
      });
    }

    const conversionPromises = geoJsonMapper.toPixelGeoJson(
      [roofFeature],
      imageTileInfoOrigin?.coordinates?.x,
      imageTileInfoOrigin?.coordinates?.y,
      imageTileInfoOrigin?.size?.width,
      imageTileInfoOrigin?.coordinates?.z
    );

    const roofGeoJsonResultConversion = await geoPointsToPoins(conversionPromises);

    const { regions: pixelGeoJsonResultRegion } = Object.values(roofGeoJsonResultConversion as any)?.[0] as any;
    const { shape_attributes: pixelGeoJsonResultShapeAttributes } = Object.values(pixelGeoJsonResultRegion)?.[0] as any;
    const roofPolygonPoints = geoShapeAttributesToPoints(pixelGeoJsonResultShapeAttributes);

    const roofPolygon: DomainPolygonResultType = {
      id: `${v4()}_${roofGlobalIdRef}`,
      label: 'TOIT',
      points: roofPolygonPoints,
      fillColor: '#00ff0000',
      strokeColor: '#00ff00',
    };

    if (!imageUrl) return null;
    const image = await createImage(imageUrl);
    const { image: createdImage, polygons: mappedPolygons } = getCroppedImageAndPolygons([roofPolygon, ...sortedPolygons], [roofPolygon], image);

    // upload the cropped image and set it as the areaPicture's default image
    uploadAnalyzeImage(createdImage);

    return {
      properties: { ...Object.values(detectionResultJson)[0].properties, obstacle: obstacle },
      polygons: mappedPolygons.map((polygon, polygonIndex) => ({ ...polygon, surface: areas[polygonIndex + 1] })),
      measurements,
      createdImage,
    };
  };

  const query = useQuery({ queryKey: [geoJsonResultUrl, imageUrl], queryFn: queryFnVgg, enabled: !!geoJsonResultUrl && !!imageUrl });

  return { ...query, isPending: query.isPending || isUploadAnalyzeImagePending, isLoading: query.isLoading || isUploadAnalyzeImagePending };
};

const createGeoJsonForReferencer = (zoom: number, xTile: number, yTile: number, imageSize: number, regions: Region[]) => {
  const geoJsonForReferencer: any = {
    filename: `${v4().replace(/\-/gi, '')}_${zoom}_${xTile}_${yTile}.jpg`,
    regions: {},
    region_attributes: { label: 'pathway' },
    image_size: imageSize,
    zoom,
  };

  regions.forEach(region => {
    const id = v4();
    geoJsonForReferencer.regions[id] = { shape_attributes: region.shape_attributes, id };
  });
};
