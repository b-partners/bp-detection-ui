import { googleRecaptchaFn } from '@/queries';
import { ParamsUtilities } from '@/utilities';
import { account_holder_mock, account_mock, AppComponent_Mock, area_picture_mock, detection_mock, locations_mock, prospect_mock, whoami_mock } from '../mocks';

const search_input_sel = 'address-search-input';
const process_detection_on_form_sel = 'process-detection-on-form-button';

describe('Error message testing', () => {
  beforeEach(() => {
    cy.stub(googleRecaptchaFn, 'useGoogleReCaptcha').returns({ executeRecaptcha: () => Promise.resolve('mock-recaptcha-token'), valide: false });
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');
  });

  it('Test bad apikey', () => {
    cy.stub(ParamsUtilities, 'getQueryParams').returns('mock-api-key');
    cy.intercept('POST', '/address/autocomplete*', { statusCode: 403 }).as('location-search');

    cy.mount(<AppComponent_Mock />);

    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel).type('24 rue mozart');

    cy.contains("Clé d'API invalide");
    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');
    cy.dataCy('api-key-input').type('api-key-mock-2{enter}');
    cy.wait('@location-search');

    cy.dataCy(search_input_sel).type('24 rue mozart');

    cy.contains('24 rue mozart mock');
    cy.contains('24 rue mozart mock 1');
    cy.contains('24 rue mozart mock 2');
    cy.contains('24 rue mozart mock 3');

    cy.intercept('GET', '/whoami', { statusCode: 404 }).as('getWhoami');
    cy.contains('24 rue mozart mock 3').click();

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains("Clé d'API invalide");
  });

  it('Test get image error', () => {
    cy.stub(ParamsUtilities, 'getQueryParams').returns('mock-api-key');
    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');

    // user informations
    cy.intercept('GET', '/whoami', { statusCode: 500 }).as('getWhoami');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, { statusCode: 500 }).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, { statusCode: 500 }).as('getAccountHolders');
    // user informations

    // prospect & areaPictures & get image
    cy.intercept('PUT', `/accountHolders/${account_holder_mock.id}/prospects`, { statusCode: 500 }).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, { statusCode: 500 }).as('createAreaPicture');
    cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, { statusCode: 500 }).as('getImage');
    // prospect & areaPictures & get image

    cy.intercept('POST', `**/detections/**/roofer`, detection_mock).as('createDetection');

    cy.mount(<AppComponent_Mock />);

    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Récupération de votre adresse');

    //steppers state
    cy.contains('Récupération de votre adresse').should('have.class', 'Mui-active');
    cy.contains('Délimitation de votre toiture').should('not.have.class', 'Mui-active');
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

    cy.intercept('PUT', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');

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

  it('Test get email prospect already exist', () => {
    cy.stub(ParamsUtilities, 'getQueryParams').returns('mock-api-key');
    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');

    // user informations
    cy.intercept('GET', '/whoami', { statusCode: 500 }).as('getWhoami');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, { statusCode: 500 }).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, { statusCode: 500 }).as('getAccountHolders');
    // user informations

    // prospect & areaPictures & get image
    cy.intercept('PUT', `/accountHolders/${account_holder_mock.id}/prospects`, {
      statusCode: 400,
      body: { message: 'Prospect with mail john.doe@example.com already exists.' },
    }).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, { statusCode: 500 }).as('createAreaPicture');
    cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, { statusCode: 500 }).as('getImage');
    // prospect & areaPictures & get image

    cy.intercept('POST', `**/detections/**/roofer`, detection_mock).as('createDetection');

    cy.mount(<AppComponent_Mock />);

    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Récupération de votre adresse');

    //steppers state
    cy.contains('Récupération de votre adresse').should('have.class', 'Mui-active');
    cy.contains('Délimitation de votre toiture').should('not.have.class', 'Mui-active');
    //steppers state

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock');

    cy.contains('24 rue mozart mock 2').click();

    cy.dataCy(search_input_sel).type('{enter}');

    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains('Cette adresse email a déjà été utilisée pour faire une analyse.');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
  });

  it('Test detection initialization error', () => {
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
    cy.intercept('POST', `/detections/**/sync`, { statusCode: 500 }).as('createDetection');
    cy.intercept('GET', `**/detections/**`, detection_mock).as('getDetection');
    cy.intercept('POST', `**/detections/**/image`, detection_mock).as('createDetectionImage');
    cy.intercept('GET', ` http://mock.url.com/`, { fixture: 'mock.geojson', headers: { 'content-type': 'application/geojson' } }).as(
      'getDetectionResultGeojson'
    );
    // detection

    cy.mount(<AppComponent_Mock />);

    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Récupération de votre adresse');

    //steppers state
    cy.contains('Récupération de votre adresse').should('have.class', 'Mui-active');
    cy.contains('Délimitation de votre toiture').should('not.have.class', 'Mui-active');
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
