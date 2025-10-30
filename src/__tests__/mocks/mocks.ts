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
    precisionLevelInCm: 5,
  },
  address: '24 rue mozart mock 2',
  shiftNb: 0,
  filename: 'filename_1000_1000_zoom.jpg',
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

export const detectionSync = {
  id: '20dc6136-54d7-496f-b4ce-f2ea873aeb81',
  step: {
    name: 'MACHINE_DETECTION',
    status: {
      progression: 'FINISHED',
      health: 'SUCCEEDED',
      creationDatetime: '2025-08-04T06:40:09.567566528Z',
    },
    statistics: [],
    updatedAt: '2025-08-04T06:40:09.567576210Z',
  },
  geoJsonUrl: null,
  shapeUrl: null,
  excelUrl: null,
  imageUrl: null,
  pdfUrl: null,
  vggUrl: null,
  addresses: [],
  roofDelimiter: {
    roofHeightInMeter: 9.2,
    roofSlopeInDegree: 21,
  },
  emailReceiver: '',
  zoneName: '1 Rue de la Vau Saint-Jacques, 79200 Parthenay, France',
  geoServerProperties: {
    geoServerUrl: 'http://35.181.83.111/geoserver/cite/wms',
    geoServerParameter: {
      service: 'WMS',
      request: 'GetMap',
      layers: 'cite:PCRS',
      styles: '',
      format: 'image/jpeg',
      transparent: true,
      version: '1.0.0',
      width: 1024,
      height: 1024,
      srs: 'EPSG:3857',
    },
  },
  detectableObjectModel: {
    modelName: 'BP_TOITURE',
  },
  geoJsonZone: [
    {
      type: 'Feature',
      geometry: {
        coordinates: [
          [
            [
              [-0.249430350959301, 46.65204236181756],
              [-0.2494625374674797, 46.65196687496678],
              [-0.2494722604751587, 46.65191992577473],
              [-0.24946488440036774, 46.651904276035],
              [-0.2493824064731598, 46.65189530044693],
              [-0.24929624050855637, 46.65188701528739],
              [-0.2492208033800125, 46.65187965070007],
              [-0.249202698469162, 46.651925679354385],
              [-0.24924695491790771, 46.65196756539577],
              [-0.2492409199476242, 46.65200139640551],
              [-0.24931635707616806, 46.65202671211325],
              [-0.249430350959301, 46.65204236181756],
            ],
          ],
        ],
        type: 'MultiPolygon',
      },
      properties: {
        vgg_file_url: 'https://mock.com/vgg',
        zoom: 20,
        original_image_url: 'https://mock.com/image-result',
        id: '7f077387-587a-4d76-bf66-523668e7276b',
      },
    },
  ],
  geoJsonOutput: 'GEO_JSON',
};

export const detection_mock = {
  ...detectionSync,
};

export const legalFiles_mock = [
  {
    id: '05c96052-c2a1-4f1e-9e43-53ecd8642099',
    name: 'cgu_20-11-23.pdf',
    fileUrl: '/assets/legal-file.pdf',
    toBeConfirmed: true,
  },
  {
    id: '9214432d-7b7a-4fa2-9660-d00d4e0109a0',
    name: 'cgu_09-10-23.pdf',
    fileUrl: '/assets/legal-file.pdf',
    toBeConfirmed: true,
  },
];

export const legalFilesOneNonApproved_mock = [{ ...legalFiles_mock[0], toBeConfirmed: false }, legalFiles_mock[1]];
export const legalFilesAllApproved_mock = [
  { ...legalFiles_mock[0], toBeConfirmed: false },
  { ...legalFiles_mock[1], toBeConfirmed: false },
];

export const llmResult_mock = `<head>
  <link href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Kumbh Sans', sans-serif;
    }
  </style>
</head>
<section>
  <h2>COMPRENDRE VOTRE RAPPORT</h2>
  <h3>
      <span>🟡</span>
      CATÉGORIE B : ENTRETIEN À PRÉVOIR
  </h3>
  <ul>
    <li>L'analyse a montré que la toiture est dans un excellent état général. Le faible taux d'humidité de 8.04 % et la quasi-inexistence de moisissure à 0.74 % sont des signes très positifs. Avec un revêtement de gravier, ces niveaux indiquent qu'il n'y a pas de stagnation d'eau ni d'accumulation favorisant la prolifération de mousses ou de champignons. L'absence de fissures et de risque d'incendie atteste de la solidité et de la sécurisation optimale de la structure.</li>
  </ul>

  <ul>
    <li>Le revêtement en gravier est très bien adapté pour limiter les problèmes d'humidité et d'usure. L'absence totale d'usure (0.0 %) confirme que ce matériau fait preuve d'une remarquable longévité. Le faible taux de moisissure met en évidence l'efficacité du revêtement pour empêcher l'infiltration d'eau et la prolifération de végétations indésirables, même avec des obstacles présents.</li>
  </ul>
</section>
<section>
  <h2>CONSEILS DE L’ARTISAN COUVREUR</h2>
  <ul>
    <li>🔍 Inspection ciblée : Il est crucial de vérifier régulièrement les zones autour des obstacles tels que les pénétrations et les angles rentrants, où l'eau peut s'accumuler. </li>
    <li>🧼 Entretien recommandé : Procédez à un nettoyage préventif pour enlever les mousses et autres dépôts. Assurez-vous que les évacuations d'eau sont bien dégagées pour éviter tout risque lié à l'humidité.</li>
    <li>🛠️ Travaux à envisager : Bien que la toiture soit en excellent état, il est prudent de surveiller les joints périphériques et garantir leur étanchéité, surtout autour des obstacles.</li>
    <li>📸 Suivi : Un contrôle annuel, par inspection visuelle ou utilisation de drones, est préconisé pour détecter tout changement ou intrusion d'eau non visible à l'œil nu.</li>
    <li>🧪 Vérifications complémentaires : Envisagez des tests supplémentaires comme l'arrosage ciblé pour détecter d'éventuelles infiltrations, ainsi que l'utilisation de caméras thermiques pour vérifier l'intégrité thermique de la toiture.</li>
  </ul>
</section>
`;

export const converter_mock = {
  'mock_image_20_523561_370292.jpg': {
    size: 1024,
    filename: 'mock_image_20_523561_370292.jpg',
    zoom: 20,
    regions: {
      'mock_image_20_523561_370292.jpg': {
        shape_attributes: {
          name: null,
          all_points_x: [494.0, 397.0, 363.0, 400.0, 610.0, 887.0, 1117.0, 1164.0, 1172.0, 1028.0, 1059.0, 812.0, 494.0],
          all_points_y: [966.0, 1297.0, 1472.0, 1548.0, 1618.0, 1652.0, 1662.0, 1500.0, 1372.0, 1290.0, 1141.0, 1039.0, 966.0],
        },
        region_attributes: null,
      },
    },
    base64_img_data: null,
  },
};
