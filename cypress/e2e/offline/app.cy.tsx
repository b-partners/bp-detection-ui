import {
  account_holder_mock,
  account_mock,
  area_picture_mock,
  detectionSync,
  llmResult_mock,
  locations_mock,
  prospect_mock,
  whoami_mock,
} from '../../../src/__tests__/mocks';
import { geoSessionInterceptions, offlineUrl, roofAnalysisInterceptions } from './utilities';

const search_input_sel = 'address-search-input';
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
  cy.intercept('POST', `/detections/*/sync`, detectionSync).as('detectionSync');
  // detection

  cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');

  geoSessionInterceptions();
  roofAnalysisInterceptions(llmResult_mock);
};

describe('Component testing', () => {
  beforeEach(() => {
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');
  });

  it('Test the app', () => {
    requestsInterceptions();
    cy.visit(offlineUrl);

    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Pré-diagnostiquez votre toiture');

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock');
    cy.contains('24 rue mozart mock 1');
    cy.contains('24 rue mozart mock 2');
    cy.contains('24 rue mozart mock 3');

    cy.contains('24 rue mozart mock 2').click();

    cy.contains('Avant de commencer');
    cy.contains('Quelques infos pour mieux vous orienter');
    cy.contains('2 questions rapides pour préparer la meilleure analyse possible de votre toiture.');
    cy.contains('Quel est l’objectif de votre demande ?');
    cy.contains('Demander une intervention urgente').click();
    cy.contains('Entretien / réparation préventive');
    cy.contains('Diagnostic avant vente immobilière');

    cy.contains('À quand remonte votre dernier entretien ?');
    cy.contains('Moins de 3 ans');
    cy.contains('Moins de 10 ans');
    cy.contains('Jamais entretenu').click();

    cy.dataCy('qcm-continue-button').click();

    cy.contains('Vos coordonnées pour recevoir le rapport');

    cy.dataCy(process_detection_on_form_sel).click();
    cy.contains('Numéro de téléphone non valide');
    cy.contains('Adresse email non valide');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();
    cy.get('.consent-invalid');
    cy.dataCy('consent-checkbox').check();
    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@createProspect');
    cy.wait('@createAreaPicture');
    cy.wait('@geocode');

    //steppers state
    cy.contains('Renseignez votre adresse').closest('.step-item').should('have.class', 'done');
    cy.contains('Visualisez et délimitez votre toiture').closest('.step-item').should('have.class', 'active');
    //steppers state

    // the roof analyser takes over from here, on the geocoded position, with the building's outline pre-filled
    cy.dataCy('roof-annotator');
    cy.wait('@getActualMapLayer');
    cy.wait('@getFootprint');
    cy.contains('Emprise du bâtiment détectée automatiquement');

    cy.contains('button', "Lancer l'analyse").should('not.be.disabled').click();
    cy.wait('@detectionSync');

    //steppers state
    cy.contains('Analysez l’état via BIRDIA').closest('.step-item').should('have.class', 'active');
    //steppers state

    cy.contains("Résultats de l'analyse");
    cy.contains('Surface totale');
    cy.contains('Revêtement');
    cy.contains('Tuiles');
    cy.contains("Taux d'usure");
    cy.contains('Taux de moisissure');
    cy.contains("Taux d'humidité");
    cy.contains('Obstacle / Velux');

    // the report is asked of the LLM as soon as the analysis lands, then exported and sent to the roofer
    cy.wait('@getLlmReport');
    cy.contains('button', 'Comprendre votre rapport').click();
    cy.contains('COMPRENDRE VOTRE RAPPORT');
    cy.contains('CATÉGORIE B : ENTRETIEN À PRÉVOIR');
    cy.wait('@exportPdf');
    cy.wait('@notifyRoofer');

    cy.contains('button', 'Terminer').click();
    cy.contains('Merci d’avoir analysé votre toiture, votre pré-diagnostic BIRDIA est prêt.');
  });
});
