import { AreaPictureImageSource } from '@bpartners/typescript-client';
import { v4 } from 'uuid';
import { DEMO_ROOF_IMAGE_DATA_URI } from './demo-assets';

export const demoWhoami = {
  user: {
    id: 'demo-user-id',
    logoFileId: 'demo-logo-file-id',
  },
};

export const demoAccount = { id: 'demo-account-id', active: true };

export const demoAccountHolder = {
  id: 'demo-account-holder-id',
  name: 'Couvreur Démo',
  address: '12 rue des Tuiles',
  city: 'Paris',
  postalCode: '75011',
  contactAddress: { address: '12 rue des Tuiles', city: 'Paris', postalCode: '75011' },
  companyInfo: { website: 'https://www.birdia.fr', email: 'contact@demo-couvreur.fr', phone: '01 23 45 67 89' },
  feedback: { feedbackLink: 'https://www.bpartners.app/contact' },
};

const roofPixelPolygon = {
  all_points_x: [160, 160, 260, 380, 480, 480],
  all_points_y: [350, 220, 140, 140, 220, 350],
};

/**
 * VGG-shaped detection-result JSON (same shape as the real "vgg_file_url" payload,
 * see cypress/fixtures/mock.vgg.json), regions kept inside the roof drawn in the
 * placeholder aerial image so the overlay lines up.
 */
export const buildDemoVggResult = (filename = 'demo_20_0_0.jpg') => ({
  [filename]: {
    size: null,
    filename,
    base64_img_data: null,
    properties: {
      usure_rate: 12.5,
      global_rate_value: 22.4,
      global_rate_type: 'B',
      roof_area_in_m2: 145.6,
      moisissure_rate: 8.2,
      humidite_rate: 3.1,
      revetement_1: 'ROOF_TUILES',
      revetement_2: 'ROOF_ARDOISES',
      roof_height_data_status: 'AVAILABLE',
      roof_slope_data_status: 'AVAILABLE',
      roof_slope_in_degrees: 28.5,
      roof_height_in_meters: 8.4,
    },
    regions: {
      [v4()]: {
        shape_attributes: { name: 'Polygon', all_points_x: [230, 250, 250, 230], all_points_y: [200, 200, 230, 230] },
        region_attributes: { label: 'USURE_IMPORTANTE', confidence: 0.91 },
      },
      [v4()]: {
        shape_attributes: { name: 'Polygon', all_points_x: [340, 370, 370, 340], all_points_y: [180, 180, 210, 210] },
        region_attributes: { label: 'MOISISSURE_CLAIR', confidence: 0.86 },
      },
      [v4()]: {
        shape_attributes: { name: 'Polygon', all_points_x: [420, 440, 440, 420], all_points_y: [260, 260, 285, 285] },
        region_attributes: { label: 'VELUX', confidence: 0.97 },
      },
    },
  },
});

const demoVggDataUri = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(buildDemoVggResult()))}`;

/** Mirrors the real sync-detection response shape, see `detectionSync` in __tests__/mocks/mocks.ts. */
export const buildDemoDetectionResult = (zoneName = 'Adresse de démonstration') => ({
  id: v4(),
  step: {
    name: 'MACHINE_DETECTION',
    status: { progression: 'FINISHED', health: 'SUCCEEDED', creationDatetime: new Date(0).toISOString() },
    statistics: [],
    updatedAt: new Date(0).toISOString(),
  },
  geoJsonUrl: null,
  shapeUrl: null,
  excelUrl: null,
  imageUrl: null,
  pdfUrl: null,
  vggUrl: null,
  addresses: [],
  roofDelimiter: { roofHeightInMeter: 8.4, roofSlopeInDegree: 28.5 },
  emailReceiver: '',
  zoneName,
  geoServerProperties: {},
  detectableObjectModel: { modelName: 'BP_TOITURE' },
  geoJsonZone: [
    {
      type: 'Feature',
      geometry: { coordinates: [[[]]], type: 'MultiPolygon' },
      properties: {
        vgg_file_url: demoVggDataUri,
        zoom: 20,
        original_image_url: DEMO_ROOF_IMAGE_DATA_URI,
        id: v4(),
      },
    },
  ],
  geoJsonOutput: 'GEO_JSON',
});

export const buildDemoAreaPictureDetails = (accountId: string, id: string, body: any) => ({
  id,
  accountId,
  fileId: body?.fileId || v4(),
  address: body?.address || 'Adresse de démonstration',
  actualLayer: {
    id: 'demo-layer-id',
    source: AreaPictureImageSource.GEOSERVER,
    name: 'demo-layer',
    departementName: 'Démo',
    precisionLevelInCm: 5,
  },
  shiftNb: body?.shiftNb ?? 0,
  isExtended: body?.isExtended ?? true,
  filename: body?.filename || 'demo.jpg',
  xTile: 1,
  yTile: 1,
  isOpaque: true,
});

/** Mirrors `mercator_mock` — the mercator lambda's response shape. */
export const demoMercatorResult = {
  'demo_mercator.jpg': {
    size: null,
    zoom: null,
    filename: 'demo_mercator.jpg',
    base64_img_data: null,
    regions: {
      [v4()]: {
        shape_attributes: {
          name: 'Polygon',
          all_points_x: [48.8566, 48.8567, 48.8568, 48.8567, 48.8566],
          all_points_y: [2.3522, 2.3523, 2.3522, 2.3521, 2.3522],
        },
        region_attributes: { label: 'polygon', confidence: null },
      },
    },
  },
};

/** Mirrors `converter_mock` — the pixel-conversion response shape, kept in the drawn roof area. */
export const demoConverterResult = {
  'demo_converter.jpg': {
    size: 1024,
    filename: 'demo_converter.jpg',
    zoom: 20,
    regions: {
      'demo_converter.jpg': {
        shape_attributes: { name: null, all_points_x: roofPixelPolygon.all_points_x, all_points_y: roofPixelPolygon.all_points_y },
        region_attributes: null,
      },
    },
    base64_img_data: null,
  },
};

/** Mirrors the referencer lambda's `GeojsonReturn[]` response shape. */
export const demoReferencerResult = [
  {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [2.3521, 48.8566],
            [2.3523, 48.8566],
            [2.3523, 48.8568],
            [2.3521, 48.8568],
            [2.3521, 48.8566],
          ],
        ],
      ],
    },
    properties: { confidence: 1, label: 'polygon' },
  },
];

export const demoLegalFiles: any[] = [];

export const demoLlmResultHtml = `
<section>
  <h2>COMPRENDRE VOTRE RAPPORT (mode démo)</h2>
  <h3><span>🟡</span> CATÉGORIE B : ENTRETIEN À PRÉVOIR</h3>
  <ul>
    <li>Ceci est un rapport de démonstration généré sans appel au backend. La toiture simulée présente une usure modérée (12.5 %) et un léger taux de moisissure (8.2 %), cohérents avec un entretien préventif à prévoir dans les prochains mois.</li>
  </ul>
  <ul>
    <li>Le revêtement (tuiles / ardoises) limite les infiltrations. Aucune fissure ni risque d'incendie détecté dans ce scénario de démonstration.</li>
  </ul>
</section>
<section>
  <h2>CONSEILS DE L'ARTISAN COUVREUR</h2>
  <ul>
    <li>🔍 Inspection ciblée autour des points singuliers (velux, cheminée).</li>
    <li>🧼 Nettoyage préventif recommandé pour limiter la progression de la moisissure.</li>
    <li>📸 Suivi annuel conseillé.</li>
  </ul>
</section>
`;
