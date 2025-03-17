import { GeojsonReturn } from '@bpartners/annotator-component';
import { v4 } from 'uuid';
import { ReferencerGeoJSON } from './type';

const baseUrl = process.env.REACT_APP_GEO_DETECTION_API ?? '';

const geoServerProperties = {
  geoServerUrl: 'http://35.181.83.111/geoserver/cite/wms',
  geoServerParameter: {
    service: 'WMS',
    request: 'GetMap',
    layers: '::todo::',
    styles: '',
    format: 'image/jpeg',
    transparent: true,
    version: '1.0.0',
    width: 1024,
    height: 1024,
    srs: 'EPSG:3857',
  },
};

export const processDetection = async ({ geometry }: GeojsonReturn, emailReceiver: string, geoDetectionApiKey: string) => {
  const detectionId = v4();

  const geoJson: ReferencerGeoJSON = {
    geoServerProperties,
    emailReceiver,
    detectableObjectModel: {
      modelName: 'BP_TOITURE',
      toitureRevetement: false,
      arbre: false,
      velux: false,
      panneauPhotovoltaique: false,
      moisissure: true,
      usure: true,
      fissureCassure: false,
      obstacle: false,
      cheminee: false,
      humidite: true,
      risqueFeu: false,
    },
    geoJsonZone: [
      {
        geometry: {
          coordinates: geometry.coordinates,
          type: geometry.type,
        },
        id: v4(),
        zoom: 20,
      },
    ],
    zoneName: 'HOUSES_0',
  };

  const data = await fetch(`${baseUrl}/detections/${detectionId}`, {
    headers: { 'x-api-key': geoDetectionApiKey },
    method: 'POST',
    body: JSON.stringify(geoJson),
  });
  const result = await data.json();

  return result;
};
