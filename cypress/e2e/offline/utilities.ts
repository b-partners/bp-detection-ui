export const offlineUrl = 'http://localhost:3000';
export const offlineUrlWithApiKey = 'http://localhost:3000?apiKey=api-key-mock';
export const search_input_sel = 'address-search-input';
export const process_detection_on_form_sel = 'process-detection-on-form-button';

const secureLinkToken_mock = { value: 'secure-link-token-mock', expiresAtEpochSecond: 4102444800 };
const mapLayer_mock = { id: 'map-layer-mock-id', name: 'map-layer-mock', year: 2024, precisionLevelInCm: 5 };

/** What the geo session needs once the prospect and the area picture exist: the geocoder, the imagery layers and their tiles. */
const position_mock = { latitude: 48.8566, longitude: 2.3522 };
const halfSide = 0.00008;
const { latitude: lat, longitude: lon } = position_mock;
/** The building footprint around the geocoded position, closed, in lon/lat. */
export const footprint_mock = {
  type: 'Polygon',
  coordinates: [
    [
      [lon - halfSide, lat - halfSide],
      [lon + halfSide, lat - halfSide],
      [lon + halfSide, lat + halfSide],
      [lon - halfSide, lat + halfSide],
      [lon - halfSide, lat - halfSide],
    ],
  ],
};

export const geoSessionInterceptions = () => {
  cy.intercept('GET', /\/geocode\?address=/, position_mock).as('geocode');
  // the reverse lookup the roof analyser pre-fills the roof outline from
  cy.intercept('GET', /\/geocode\?longitude=/, { geometry: footprint_mock }).as('getFootprint');
  // a fresh visit: nothing saved yet under the session's annotation
  cy.intercept('GET', '**/areaPictures/*/annotations/*', { statusCode: 404, body: { message: 'Not found' } }).as('getGeoSession');
  cy.intercept('GET', '**/map/layers/actual?*', { layer: mapLayer_mock, secureLinkToken: secureLinkToken_mock }).as('getActualMapLayer');
  cy.intercept('GET', '**/map/layers?*', { layers: [{ layer: mapLayer_mock, reachable: true }], secureLinkToken: secureLinkToken_mock }).as('getMapLayers');
  cy.intercept('GET', '**/geoserver/cite/wms?*', { fixture: 'bp-detection-image.png', headers: { 'content-type': 'image/png' } }).as('getWmsTile');
  cy.intercept('GET', '/wms-proxy?*', { fixture: 'bp-detection-image.png', headers: { 'content-type': 'image/png' } }).as('getWmsProxyTile');
};

/** What the roof analyser calls once the analysis is launched, besides `/detections/{id}/sync` which each spec answers itself. */
export const roofAnalysisInterceptions = (llmReport: string) => {
  cy.intercept('GET', '**/vgg', { fixture: 'mock.vgg.json', headers: { 'content-type': 'application/json' } }).as('getDetectionResultVgg');
  cy.intercept('POST', '**/3d/*/sync', { statusCode: 500, body: {} }).as('generateRoofModel');
  cy.intercept('POST', '**/toiture?*', { body: llmReport, headers: { 'content-type': 'text/html' } }).as('getLlmReport');
  cy.intercept('POST', '**/files/*/raw?fileType=ATTACHMENT', { statusCode: 200, body: {} }).as('uploadAttachment');
  cy.intercept('POST', '**/annotations/exports', { fixture: 'legal-file.pdf', headers: { 'content-type': 'application/pdf' } }).as('exportPdf');
  cy.intercept('POST', '**/prospects/*/notifications', { statusCode: 200, body: {} }).as('notifyRoofer');
};
