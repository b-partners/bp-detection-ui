import { ReferencerGeoJSON } from '@/providers';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { create } from 'zustand';

interface State {
  actualStep: 0 | 1 | 2 | 3;
  params: {
    imageSrc?: string;
    areaPictureDetails?: AreaPictureDetails;
    geojsonBody?: ReferencerGeoJSON;
    geoJsonResultUrl?: any;
  };
}

interface Action {
  setStep(step: State): void;
}

const areaPictureDetails: any = {
  id: 'a3b5b0f4-3055-4134-9b04-86dcdee6d58e',
  xTile: 530798,
  yTile: 360453,
  xOffset: 548,
  yOffset: 1206,
  currentTile: {
    x: 530798,
    y: 360453,
    zoom: {
      level: 'HOUSES_0',
      number: 20,
    },
  },
  referenceTile: {
    x: 530798,
    y: 360453,
    zoom: {
      level: 'HOUSES_0',
      number: 20,
    },
  },
  currentGeoPosition: {
    score: 0.0,
    longitude: 2.235043300000001,
    latitude: 48.9212174,
  },
  availableLayers: ['tous_fr'],
  actualLayer: {
    id: '07c9f3da-d290-474f-a5f2-ce0281b94313',
    name: 'Hauts-de-seine_Département_2023_5cm',
    year: 2023,
    source: 'GEOSERVER',
    departementName: 'Hauts-De-Seine',
    maximumZoomLevel: 'HOUSES_0',
    maximumZoom: {
      level: 'HOUSES_0',
      number: 20,
    },
    precisionLevelInCm: 5,
  },
  otherLayers: [
    {
      id: '07c9f3da-d290-474f-a5f2-ce0281b94313',
      name: 'Hauts-de-seine_Département_2023_5cm',
      year: 2023,
      source: 'GEOSERVER',
      departementName: 'Hauts-De-Seine',
      maximumZoomLevel: 'HOUSES_0',
      maximumZoom: {
        level: 'HOUSES_0',
        number: 20,
      },
      precisionLevelInCm: 5,
    },
    {
      id: '726f5b3b-d23b-40c3-b38e-68a43d7ae155',
      name: 'cite:PCRS',
      year: 2024,
      source: 'GEOSERVER',
      departementName: 'ALL',
      maximumZoomLevel: 'HOUSES_0',
      maximumZoom: {
        level: 'HOUSES_0',
        number: 20,
      },
      precisionLevelInCm: 5,
    },
    {
      id: '2f343dba-dd5f-4895-9006-49472f576c02',
      name: 'cite:PHOTO_AERIENNE',
      year: 2023,
      source: 'GEOSERVER',
      departementName: 'ALL',
      maximumZoomLevel: 'HOUSES_0',
      maximumZoom: {
        level: 'HOUSES_0',
        number: 20,
      },
      precisionLevelInCm: 20,
    },
    {
      id: '1cccfc17-cbef-4320-bdfa-0d1920b91f11',
      name: 'ORTHOIMAGERY.ORTHOPHOTOS',
      year: 2023,
      source: 'GEOSERVER_IGN',
      departementName: 'ALL',
      maximumZoomLevel: 'HOUSES_0',
      maximumZoom: {
        level: 'HOUSES_0',
        number: 20,
      },
      precisionLevelInCm: 20,
    },
  ],
  geoPositions: [
    {
      score: 0.0,
      longitude: 2.235043300000001,
      latitude: 48.9212174,
    },
  ],
  address: '24 rue mozart colombe',
  zoomLevel: 'HOUSES_0',
  zoom: {
    level: 'HOUSES_0',
    number: 20,
  },
  fileId: 'fe609b1b-4f0b-446c-bf7e-e1ac6bd65893',
  filename: 'Hauts-de-seine_Département_2023_5cm_HOUSES_0_530798_360453',
  prospectId: '6a093c6c-686e-466a-95b3-895c7e059031',
  layer: 'tous_fr',
  isExtended: false,
  shiftNb: 0,
};

export const useStep = create<State & Action>(set => ({
  params: {
    geoJsonResultUrl: 'http://localhost:8080/geojsonFile',
    areaPictureDetails,
    imageSrc: 'http://localhost:8080/image',
  },
  setStep(step) {
    set(prev => ({ ...step, params: { ...prev, ...step.params } }));
  },
  actualStep: 3,
}));
