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

export const detection_mock = {
  id: 'detection-mock-id',
  geoJsonUrl: 'http://mock.url.com',
};

export const mercator_mock = {
  '20_123456_123456.jpg': {
    size: null,
    zoom: null,
    filename: '20_123456_123456.jpg',
    base64_img_data: null,
    regions: {
      '665049086': {
        shape_attributes: {
          name: 'Polygon',
          all_points_x: [
            48.92149379076139, 48.92142461417994, 48.92146052432813, 48.92149445168368, 48.92148916430511, 48.92151824488031, 48.9215191261096,
            48.92149379076139, 48.92149379076139,
          ],
          all_points_y: [
            2.234780341386795, 2.234825938940048, 2.2349566966295242, 2.234932892024517, 2.2349080815911293, 2.234887294471264, 2.234875224530697,
            2.234780341386795, 2.234780341386795,
          ],
        },
        region_attributes: {
          label: 'polygon',
          confidence: null,
        },
      },
    },
  },
};
