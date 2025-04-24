import { AreaPictureDetails, AreaPictureImageSource } from '@bpartners/typescript-client';

export const locations_mock = [
  { description: '24 rue mozart mock' },
  { description: '24 rue mozart mock 1' },
  { description: '24 rue mozart mock 2' },
  { description: '24 rue mozart mock 3' },
];

export const whoami_mock = {
  user: {
    id: 'user-mock-id',
  },
};

export const account_mock = {
  id: 'account-mock-id',
};

export const account_holder_mock = {
  id: 'account-holder-mock-id',
};

export const prospect_mock = {
  id: 'prospect-mock-id',
};

export const area_picture_mock: AreaPictureDetails = {
  fileId: 'file-mock-id',
  id: 'area-picture-mock-id',
  actualLayer: {
    id: 'actual-layer-mock-id',
    source: AreaPictureImageSource.GEOSERVER,
    name: 'actual-layer-mock',
    departementName: 'actual-layer-departement-mock',
  },
  address: '24 rue mozart mock 2',
  shiftNb: 0,
  filename: 'filename_1000_1000_zoom.jpg',
};

export const detectionMock = {
  id: 'detection-mock-id',
};
