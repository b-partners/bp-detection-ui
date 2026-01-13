import { DomainPolygonResultType } from '@/components';
import { createImage, getCroppedImageAndPolygons, useStep } from '@/hooks';
import { detectionResultMapper, Feature, geoJsonMapper, geoShapeAttributesToPoints } from '@/mappers';
import { geoPointsToPoins } from '@/providers';
import { ExportAreaPictureAnnotationMeasurement } from '@bpartners/typescript-client';
import { useQuery } from '@tanstack/react-query';
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

export const useGeojsonQueryResult = (imageUrl?: string) => {
  const { geoJsonResultUrl, detection } = useStep(({ params }) => params);

  const { mutate: uploadAnalyzeImage, isPending: isUploadAnalyzeImagePending } = useAnnotatorImageUploadQuery();

  const queryFnVgg = async () => {
    const detectionResultText = await fetch(geoJsonResultUrl, { headers: { 'content-type': '*/*' } });

    const roofPolygonInGeoPoint = (detection?.roofDelimiter?.polygon || []) as [number, number][];

    const measurements: ExportAreaPictureAnnotationMeasurement[] = [];

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

    const feature: Feature = {
      geometry: {
        coordinates: [[roofPolygonInGeoPoint]],
        type: 'MultiPolygon',
      },
      properties: {
        confidence: 1,
        label: 'polygon',
      },
      type: 'Feature',
    };
    const { imageTileInfoOrigin } = detection || {};

    const pixelGeoJson = geoJsonMapper.toPixelGeoJson(
      [feature],
      imageTileInfoOrigin?.coordinates?.x,
      imageTileInfoOrigin?.coordinates?.y,
      imageTileInfoOrigin?.size?.width,
      imageTileInfoOrigin?.coordinates?.z
    );

    const pixelGeoJsonResult = await geoPointsToPoins(pixelGeoJson);

    const { regions: pixelGeoJsonResultRegion } = Object.values(pixelGeoJsonResult as any)?.[0] as any;
    const { shape_attributes: pixelGeoJsonResultShapeAttributes } = Object.values(pixelGeoJsonResultRegion)?.[0] as any;
    const roofPolygonPoints = geoShapeAttributesToPoints(pixelGeoJsonResultShapeAttributes);

    const roofPolygon: DomainPolygonResultType = {
      id: `${v4()}_roofPolygon`,
      label: 'TOIT',
      points: roofPolygonPoints,
      fillColor: '#00ff0000',
      strokeColor: '#00ff00',
    };

    const _detectionResultJson: DetectionResultInVgg = await detectionResultText.json();
    const detectionResultJson: DetectionResultInVgg = Array.isArray(_detectionResultJson) ? _detectionResultJson[0] : _detectionResultJson;
    const regions = getRegions(detectionResultJson);

    const filteredPolygons = detectionResultMapper.toPolygon(regions);
    const obstacle = isThereAnObstacle(regions);

    if (!imageUrl) return null;
    const image = await createImage(imageUrl);
    const { image: createdImage, polygons: mappedPolygons } = getCroppedImageAndPolygons([roofPolygon, ...filteredPolygons], [roofPolygon], image);

    // upload the cropped image and set it as the areaPicture's default image
    uploadAnalyzeImage(createdImage);

    return { properties: { ...Object.values(detectionResultJson)[0].properties, obstacle: obstacle }, polygons: mappedPolygons, measurements, createdImage };
  };

  const query = useQuery({ queryKey: [geoJsonResultUrl, imageUrl], queryFn: queryFnVgg, enabled: !!geoJsonResultUrl && !!imageUrl });

  return { ...query, isPending: query.isPending || isUploadAnalyzeImagePending, isLoading: query.isLoading || isUploadAnalyzeImagePending };
};
