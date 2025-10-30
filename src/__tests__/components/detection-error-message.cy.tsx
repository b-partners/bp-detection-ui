import { cache, ParamsUtilities } from '@/utilities';
import {
  account_holder_mock,
  account_mock,
  AppComponent_Mock,
  area_picture_mock,
  detection_mock,
  detectionSync,
  llmResult_mock,
  locations_mock,
  mercator_mock,
  prospect_mock,
  roofAnalyseLimitExceededResponse_Mock,
  tooBigPolygonResponse_mock,
  whoami_mock,
} from '../mocks';

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

describe('Test process detection error', () => {
  beforeEach(() => {
    cy.stub(ParamsUtilities, 'getQueryParams').returns('mock-api-key');

    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');

    // user informations
    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
    // user informations

    // prospect & areaPictures & get image
    cy.intercept('PUT', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, area_picture_mock).as('createAreaPicture');
    cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, {
      fixture: 'bp-detection-image.png',
      headers: { 'content-type': 'image/png' },
    }).as('getImage');
    // prospect & areaPictures & get image

    // detection
    cy.intercept('GET', `/vgg`, { fixture: 'mock.vgg.slope-unavailable.json', headers: { 'content-type': 'application/json' } }).as('getDetectionResultVgg');
    cy.intercept('GET', `/detections/**`, detection_mock).as('getDetection');
    cy.intercept('POST', `/detections/**/image`, detection_mock).as('createDetectionImage');
    cy.intercept('GET', ` http://mock.url.com/`, { fixture: 'mock.geojson', headers: { 'content-type': 'application/geojson' } }).as(
      'getDetectionResultGeojson'
    );
    // detection

    // points conversion
    cy.intercept('POST', `/Prod/mercator`, mercator_mock).as('convertPointMercator');
    // points conversion

    // llm result
    cy.intercept('GET', '/toiture**', res => res.reply({ body: llmResult_mock, headers: { 'content-type': 'text/html' } }));
    // llm result

    // email message
    cy.intercept('POST', `/detections/${detection_mock.id}/pdf`, { body: {} }).as('sendPdf');
    cy.intercept('POST', `/detections/${detection_mock.id}/roofer/email`, { body: {} }).as('sendUserInfo');
    // email message

    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');

    cy.mount(<AppComponent_Mock />);
  });

  it('Test /sync error 500', () => {
    cy.intercept('POST', `/detections/*/sync`, { statusCode: 500 }).as('detectionSync');

    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel, ' > input').type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock 2').click();

    cy.contains('Veuillez saisir les informations suivantes.');

    cy.dataCy(process_detection_on_form_sel).click();
    cy.contains('Numéro de téléphone non valide');
    cy.contains('Adresse email non valide');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait(['@getWhoami', '@getAccounts', '@getAccountHolders', '@createProspect']);
    cy.wait('@createAreaPicture').then(() => cache.detectionId(detection_mock.id));

    cy.dataCy(process_detection_sel).should('have.class', 'Mui-disabled');

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-out').click();

    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });

    cy.dataCy('zoom-out').click();
    cy.dataCy(process_detection_sel).should('not.have.class', 'Mui-disabled');

    cy.dataCy(process_detection_sel).click();

    cy.contains('La détection sur cette zone a échoué, veuillez réessayer');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
  });

  it('Test free limit', () => {
    cy.intercept('POST', `**/detections/**/sync`, roofAnalyseLimitExceededResponse_Mock).as('detectionSync');

    cy.dataCy('api-key-input', ' input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock 2').click();

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-out').click();

    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });

    cy.dataCy('zoom-out').click();

    cy.dataCy(process_detection_sel).click();

    cy.contains('La limite des analyses gratuites a été atteinte.');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
  });

  it('Test too big polygon', () => {
    cy.intercept('POST', `/detections/*/sync`, tooBigPolygonResponse_mock).as('detectionSync');
    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel, ' > input').type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock 2').click();

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait(['@getWhoami', '@getAccounts', '@getAccountHolders', '@createProspect']);
    cy.wait('@createAreaPicture').then(() => cache.detectionId(detection_mock.id));

    cy.dataCy(process_detection_sel).should('have.class', 'Mui-disabled');

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-out').click();

    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });

    cy.dataCy('zoom-out').click();

    cy.dataCy(process_detection_sel).click();

    cy.contains('La délimitation que vous avez faite est trop grande et ne peut pas encore être prise en charge.');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
  });

  it('Test slope & height unavailable', () => {
    cy.intercept('POST', `/detections/**/sync`, detectionSync).as('detectionSync');
    cy.intercept('PUT', '/detections/*/roofs/properties', detection_mock).as('setRoofProperties');
    cy.intercept('GET', `/detections/*`, detection_mock).as('getDetection');

    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel, ' > input').type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock 2').click();

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait(['@getWhoami', '@getAccounts', '@getAccountHolders', '@createProspect']);
    cy.wait('@createAreaPicture').then(() => cache.detectionId(detection_mock.id));

    cy.dataCy(process_detection_sel).should('have.class', 'Mui-disabled');

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-out').click();

    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });

    cy.dataCy('zoom-out').click();
    cy.dataCy(process_detection_sel).should('not.have.class', 'Mui-disabled');

    cy.dataCy(process_detection_sel).click();

    cy.wait(['@setRoofProperties', '@detectionSync', '@getDetection', '@getDetectionResultVgg']);
    cy.get('.MuiAlert-root').contains('La pente et la hauteur du bâtiment ne sont pas encore disponibles.');
  });
});
