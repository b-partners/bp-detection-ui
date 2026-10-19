import {
  account_holder_mock,
  account_mock,
  area_picture_mock,
  llmResult_mock,
  locations_mock,
  prospect_mock,
  roofAnalyseLimitExceededResponse_Mock,
  tooBigPolygonResponse_mock,
  whoami_mock,
} from '../../../src/__tests__/mocks';
import { geoSessionInterceptions, offlineUrl, roofAnalysisInterceptions } from './utilities';

const search_input_sel = 'address-search-input';
const process_detection_on_form_sel = 'process-detection-on-form-button';

/** From the address to the roof analyser, its roof outline pre-filled: what every analysis below starts from. */
const openRoofAnalyser = () => {
  cy.contains("Veuillez specifier votre clé d'api");
  cy.dataCy('api-key-input').type('api-key-mock{enter}');

  cy.dataCy(search_input_sel).type('24 rue mozart');
  cy.wait('@location-search');

  cy.contains('24 rue mozart mock 2').click();

  cy.contains('Demander une intervention urgente').click();
  cy.contains('Jamais entretenu').click();
  cy.dataCy('qcm-continue-button').click();

  cy.dataName('phone').type('+000000000000');
  cy.dataName('email').type('john.doe@example.com');
  cy.dataCy('consent-checkbox').check();
  cy.dataCy(process_detection_on_form_sel).click();

  cy.wait('@createProspect');
  cy.wait('@createAreaPicture');

  cy.dataCy('roof-annotator');
  cy.wait('@getFootprint');
  cy.contains('Emprise du bâtiment détectée automatiquement');
};

const launchAnalysis = () => {
  cy.contains('button', "Lancer l'analyse").should('not.be.disabled').click();
  cy.wait('@detectionSync');
};

describe('Test process detection error', () => {
  beforeEach(() => {
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');

    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');

    // user informations
    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');
    cy.intercept('GET', `/accounts/account-mock-id/files/${whoami_mock.user.logoFileId}/raw?apiKey=api-key-mock&fileType=LOGO`, {
      fixture: 'bird-ia-lg-logo.png',
      headers: { 'content-type': 'image/png' },
    }).as('getRooferLogo');
    // user informations

    // prospect & areaPictures
    cy.intercept('POST', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, area_picture_mock).as('createAreaPicture');
    // prospect & areaPictures

    geoSessionInterceptions();
    roofAnalysisInterceptions(llmResult_mock);

    cy.visit(offlineUrl);
  });

  it('Test /sync error 500', () => {
    cy.intercept('POST', `/detections/*/sync`, { statusCode: 500 }).as('detectionSync');

    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock 2').click();

    cy.contains('Demander une intervention urgente').click();
    cy.contains('Jamais entretenu').click();
    cy.dataCy('qcm-continue-button').click();

    cy.contains('Vos coordonnées pour recevoir le rapport');

    cy.dataCy(process_detection_on_form_sel).click();
    cy.contains('Numéro de téléphone non valide');
    cy.contains('Adresse email non valide');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe+229@example.com');
    cy.dataCy('consent-checkbox').check();
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains('Adresse email non valide');

    cy.dataName('email').clear().type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@createProspect');
    cy.wait('@createAreaPicture');

    cy.dataCy('roof-annotator');
    cy.wait('@getFootprint');
    cy.contains('Emprise du bâtiment détectée automatiquement');

    launchAnalysis();

    cy.contains('Le service a rencontré une erreur de son côté.');
  });

  it('Test free limit', () => {
    cy.intercept('POST', `/detections/*/sync`, roofAnalyseLimitExceededResponse_Mock).as('detectionSync');

    openRoofAnalyser();
    launchAnalysis();

    cy.contains('La limite des analyses gratuites a été atteinte.');
  });

  it('Test too big polygon', () => {
    cy.intercept('POST', `/detections/*/sync`, tooBigPolygonResponse_mock).as('detectionSync');

    openRoofAnalyser();
    launchAnalysis();

    cy.contains('La délimitation que vous avez faite est trop grande et ne peut pas encore être prise en charge.');
  });
});
