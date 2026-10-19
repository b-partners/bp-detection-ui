export const offlineUrl = 'http://localhost:3000';
export const offlineUrlWithApiKey = 'http://localhost:3000?apiKey=api-key-mock';
export const search_input_sel = 'address-search-input';
export const process_detection_on_form_sel = 'process-detection-on-form-button';

const secureLinkToken_mock = { value: 'secure-link-token-mock', expiresAtEpochSecond: 4102444800 };
const mapLayer_mock = { id: 'map-layer-mock-id', name: 'map-layer-mock', year: 2024, precisionLevelInCm: 5 };

/** What the geo session needs once the prospect and the area picture exist: the geocoder, the imagery layers and their tiles. */
export const geoSessionInterceptions = () => {
  cy.intercept('GET', '**/geocode?*', { latitude: 48.8566, longitude: 2.3522 }).as('geocode');
  cy.intercept('GET', '**/map/layers/actual?*', { layer: mapLayer_mock, secureLinkToken: secureLinkToken_mock }).as('getActualMapLayer');
  cy.intercept('GET', '**/map/layers?*', { layers: [{ layer: mapLayer_mock, reachable: true }], secureLinkToken: secureLinkToken_mock }).as('getMapLayers');
  cy.intercept('GET', '**/geoserver/cite/wms?*', { fixture: 'bp-detection-image.png', headers: { 'content-type': 'image/png' } }).as('getWmsTile');
  cy.intercept('GET', '/wms-proxy?*', { fixture: 'bp-detection-image.png', headers: { 'content-type': 'image/png' } }).as('getWmsProxyTile');
};
