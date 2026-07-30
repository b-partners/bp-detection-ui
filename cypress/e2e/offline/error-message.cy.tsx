import { account_holder_mock, account_mock, area_picture_mock, detection_mock, locations_mock, prospect_mock, whoami_mock } from '../../../src/__tests__/mocks';
import { offlineUrl } from './utilities';

const search_input_sel = 'address-search-input';
const process_detection_on_form_sel = 'process-detection-on-form-button';

describe('Error message testing', () => {
  beforeEach(() => {
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');
  });

  it('Test the app', () => {
    cy.intercept('POST', '/address/autocomplete*', { statusCode: 403 }).as('location-search');

    cy.visit(offlineUrl);
    cy.contains("Veuillez specifier votre clé d'api");

    cy.dataCy('api-key-input').type('api-key-mock{enter}');
    cy.contains('Veuillez specifier une clé valide');

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

    cy.dataCy('api-key-input').type('api-key-mock-2{enter}');
    cy.dataCy(search_input_sel).type('24 rue mozart');

    cy.wait('@location-search');

    cy.contains('24 rue mozart mock');
    cy.contains('24 rue mozart mock 1');
    cy.contains('24 rue mozart mock 2');
    cy.contains('24 rue mozart mock 3');

    cy.intercept('GET', '/whoami', { statusCode: 404 }).as('getWhoami');
    cy.contains('24 rue mozart mock 3').click();

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains("Veuillez specifier votre clé d'api");
  });

  it('Test get image error', () => {
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

    // prospect & areaPictures & get image
    cy.intercept('POST', `/accountHolders/${account_holder_mock.id}/prospects`, { statusCode: 500 }).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, { statusCode: 500 }).as('createAreaPicture');
    cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, { statusCode: 500 }).as('getImage');
    // prospect & areaPictures & get image

    cy.intercept('POST', `**/detections/**/roofer`, detection_mock).as('createDetection');

    cy.visit(offlineUrl);
    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Renseignez votre adresse');

    //steppers state
    cy.contains('Renseignez votre adresse').closest('.step-item').should('have.class', 'active');
    cy.contains('Visualisez et délimitez votre toiture').closest('.step-item').should('not.have.class', 'active');
    //steppers state

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock');
    cy.contains('24 rue mozart mock 1');
    cy.contains('24 rue mozart mock 2');
    cy.contains('24 rue mozart mock 3');

    cy.contains('24 rue mozart mock 2').click();

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');

    cy.contains("Erreur lors de la récupération de l'image.");
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();

    cy.dataCy(search_input_sel).type('{enter}');

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains("Erreur lors de la récupération de l'image.");
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();

    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');

    cy.dataCy(search_input_sel).type('{enter}');

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains("Erreur lors de la récupération de l'image.");
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();

    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');

    cy.dataCy(search_input_sel).type('{enter}');

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains("Erreur lors de la récupération de l'image.");
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();

    cy.intercept('POST', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');

    cy.dataCy(search_input_sel).type('{enter}');

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains("Erreur lors de la récupération de l'image.");
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();

    const no5CmAreaPictureMock = { ...area_picture_mock };
    no5CmAreaPictureMock.actualLayer = { ...area_picture_mock.actualLayer, precisionLevelInCm: 20 };

    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, no5CmAreaPictureMock).as('createAreaPicture');

    cy.dataCy(search_input_sel).type('{enter}');

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains('Adresse momentanément indisponible.');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
  });

  it('Test get image prospect already exist', () => {
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

    // prospect & areaPictures & get image
    cy.intercept('POST', `/accountHolders/${account_holder_mock.id}/prospects`, {
      statusCode: 400,
      body: {
        message: 'Prospect with mail john.doe@example.com already exists.',
      },
    }).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, { statusCode: 500 }).as('createAreaPicture');
    cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, { statusCode: 500 }).as('getImage');
    // prospect & areaPictures & get image

    cy.intercept('POST', `**/detections/**/roofer`, detection_mock).as('createDetection');

    cy.visit(offlineUrl);

    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Renseignez votre adresse');

    //steppers state
    cy.contains('Renseignez votre adresse').closest('.step-item').should('have.class', 'active');
    cy.contains('Visualisez et délimitez votre toiture').closest('.step-item').should('not.have.class', 'active');
    //steppers state

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock 2').click();

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains('Cette adresse email a déjà été utilisée pour faire une analyse.');
  });

  it('Test detection initialization error', () => {
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

    // prospect & areaPictures & get image
    cy.intercept('POST', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, area_picture_mock).as('createAreaPicture');
    cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, {
      fixture: 'bp-detection-image.png',
      headers: { 'content-type': 'image/png' },
    }).as('getImage');
    // prospect & areaPictures & get image

    // detection
    cy.intercept('POST', `/detections/**/sync`, { statusCode: 500 }).as('createDetection');
    cy.intercept('GET', `**/detections/**`, detection_mock).as('getDetection');
    cy.intercept('POST', `**/detections/**/image`, detection_mock).as('createDetectionImage');
    cy.intercept('GET', ` http://mock.url.com/`, { fixture: 'mock.geojson', headers: { 'content-type': 'application/geojson' } }).as(
      'getDetectionResultGeojson'
    );
    // detection

    cy.visit(offlineUrl);
    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Renseignez votre adresse');

    //steppers state
    cy.contains('Renseignez votre adresse').closest('.step-item').should('have.class', 'active');
    cy.contains('Visualisez et délimitez votre toiture').closest('.step-item').should('not.have.class', 'active');
    //steppers state

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock');
    cy.contains('24 rue mozart mock 1');
    cy.contains('24 rue mozart mock 2');
    cy.contains('24 rue mozart mock 3');

    cy.contains('24 rue mozart mock 2').click();
  });
});
