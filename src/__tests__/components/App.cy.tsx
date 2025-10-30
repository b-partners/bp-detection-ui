import { cache, ParamsUtilities } from '@/utilities';
import {
  account_holder_mock,
  account_mock,
  AppComponent_Mock,
  area_picture_mock,
  converter_mock,
  detection_mock,
  detectionSync,
  llmResult_mock,
  locations_mock,
  mercator_mock,
  prospect_mock,
  whoami_mock,
} from '../mocks';

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

describe('Component testing', () => {
  it('Test the app', () => {
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
    cy.intercept('GET', `**/detections/**`, detection_mock).as('getDetection');
    cy.intercept('POST', `**/detections/**/image`, detection_mock).as('createDetectionImage');
    cy.intercept('GET', `http://mock.url.com/`, { fixture: 'mock.geojson', headers: { 'content-type': 'application/geojson' } }).as(
      'getDetectionResultGeojson'
    );
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

    cy.contains('Veuillez saisir les informations suivantes.');

    cy.dataCy(process_detection_on_form_sel).click();
    cy.contains('Numéro de téléphone non valide');
    cy.contains('Adresse email non valide');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@getWhoami');
    cy.wait('@getAccounts');
    cy.wait('@getAccountHolders');
    cy.wait('@createProspect');
    cy.wait('@createAreaPicture').then(() => cache.detectionId(detection_mock.id));

    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.");
    //steppers state
    cy.contains('Récupération de votre adresse').should('have.class', 'Mui-completed');
    cy.contains('Délimitation de votre toiture').should('have.class', 'Mui-active');
    //steppers state
    //llm result
    cy.intercept('GET', '/toiture**', res => {
      res.reply({ body: llmResult_mock, headers: { 'content-type': 'text/html' } });
    });
    //llm result

    cy.dataCy(process_detection_sel).should('have.class', 'Mui-disabled');

    const getX = (x: number) => Math.floor(x + 145 - 71);
    const getY = (y: number) => Math.floor(y + 397 - 387);

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-reset').click();

    cy.dataCy(canvas_cursor_sel).click(getX(87), getY(120), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(42), getY(279), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(25), getY(362), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(44), getY(390), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(137), getY(423), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(273), getY(438), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(381), getY(447), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(408), getY(313), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(337), getY(271), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(354), getY(203), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(237), getY(151), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(87), getY(120), { force: true });

    cy.dataCy('zoom-out').click();
    cy.dataCy(process_detection_sel).should('not.have.class', 'Mui-disabled');

    cy.intercept('PUT', '/detections/*/roofs/properties', detection_mock);
    cy.intercept('POST', '/accounts/*/annotations/convert', converter_mock);
    cy.dataCy(process_detection_sel).click();

    cy.contains('Calcule de la pente en cours...');
    cy.contains('Calcule de la hauteur du bâtiment en cours...');

    cy.contains('Hauteur du bâtiment');
    cy.contains("Taux d'usure");
    cy.contains('Taux de moisissure');
    cy.contains("Taux d'humidité");
    cy.contains('Obstacle / Velux');

    cy.contains('Hauteur du bâtiment: 7.9m');
    cy.contains('Pente: 24.4%');

    cy.contains('Revêtement 1: Tuiles');
    cy.contains('Revêtement 2: Fibrociment');

    cy.contains('Comprendre votre rapport');
    cy.dataCy('toggle-llm-result-view').click();

    cy.contains('COMPRENDRE VOTRE RAPPORT');
    cy.contains('CATÉGORIE B : ENTRETIEN À PRÉVOIR');
  });
});
