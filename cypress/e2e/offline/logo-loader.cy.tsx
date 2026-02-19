import { cache } from '@/utilities';
import {
  account_holder_mock,
  account_mock,
  area_picture_mock,
  converter_mock,
  detection_mock,
  detectionSync,
  llmResult_mock,
  locations_mock,
  mercator_mock,
  prospect_mock,
  whoami_mock,
} from '../../../src/__tests__/mocks';
import { offlineUrl } from './utilities';

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const requestsInterceptions = () => {
  cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');
  cy.intercept('GET', `/accounts/account-mock-id/files/${whoami_mock.user.logoFileId}/raw?apiKey=api-key-mock&fileType=LOGO`, {
    fixture: 'bird-ia-lg-logo.png',
    headers: { 'content-type': 'image/png' },
  }).as('getRooferLogo');

  // user informations
  cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
  cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
  cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
  // user informations

  // prospect & areaPictures & get image
  cy.intercept('POST', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');
  cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, area_picture_mock).as('createAreaPicture');
  cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, {
    fixture: 'bp-detection-image.png',
    headers: { 'content-type': 'image/png' },
  }).as('getImage');
  // prospect & areaPictures & get image

  // detection
  cy.intercept('GET', `**/detections/**`, detection_mock).as('getDetection');
  cy.intercept('POST', `**/detections/**/image`, detection_mock).as('createDetectionImage');
  cy.intercept('GET', `http://mock.url.com/`, { fixture: 'mock.geojson', headers: { 'content-type': 'application/geojson' } }).as('getDetectionResultGeojson');
  cy.intercept('GET', `/vgg`, { fixture: 'mock.vgg.json', headers: { 'content-type': 'application/json' } }).as('getDetectionResultVgg');
  cy.intercept('POST', `/detections/*/sync`, detectionSync).as('detectionSync');
  cy.intercept('GET', `/image-result`, { fixture: 'sync-result-image.jpg', headers: { 'content-type': 'image/jpg' } }).as('detectionSync');
  // detection

  // points conversion
  cy.intercept('POST', `/Prod/mercator`, mercator_mock).as('createDetectionImage');
  // points conversion

  // email message
  cy.intercept('POST', `**/detections/*/pdf`, { body: {} }).as('sendPdf');
  cy.intercept('POST', `**/detections/*/roofer/email`, { body: {} }).as('sendUserInfo');
  // email message

  cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');
};

describe('Component testing', () => {
  beforeEach(() => {
    // cy.stub(ParamsUtilities, 'getQueryParams').returns('mock-api-key');
    // cy.stub(googleRecaptchaFn, 'useGoogleReCaptcha').returns({ executeRecaptcha: () => Promise.resolve('mock-recaptcha-token'), valide: false });
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');
  });

  it('Test the app', () => {
    requestsInterceptions();
    cy.visit(offlineUrl);

    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Renseignez votre adresse');

    //steppers state
    cy.contains('Renseignez votre adresse').should('have.class', 'Mui-active');
    cy.contains('Visualisez et délimitez votre toiture').should('not.have.class', 'Mui-active');
    //steppers state

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock');
    cy.contains('24 rue mozart mock 1');
    cy.contains('24 rue mozart mock 2');
    cy.contains('24 rue mozart mock 3');

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

    cy.wait('@validateCaptcha');
    cy.wait('@getWhoami');
    cy.wait('@getAccounts');
    cy.wait('@getAccountHolders');
    cy.wait('@createProspect');
    cy.wait('@createAreaPicture').then(() => cache.detectionId(detection_mock.id));

    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.");
    //steppers state
    cy.contains('Renseignez votre adresse').should('have.class', 'Mui-completed');
  });
});
