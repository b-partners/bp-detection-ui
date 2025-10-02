import App from '@/App';
import { cache, ParamsUtilities, theme } from '@/utilities';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  account_holder_mock,
  account_mock,
  area_picture_mock,
  detection_mock,
  detectionSync,
  locations_mock,
  mercator_mock,
  prospect_mock,
  whoami_mock,
} from './mocks';

const queryClient = new QueryClient();

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

describe('Test process detection error', () => {
  it('Test process detection error', () => {
    cy.intercept('GET', `/vgg`, { fixture: 'mock.vgg-slope-unavailable.json', headers: { 'content-type': 'application/json' } }).as(
      'getDetectionResultGeojson'
    );
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
    cy.intercept('POST', `**/detections/**/roofer`, detection_mock).as('createDetection');
    cy.intercept('GET', `**/detections/**`, detection_mock).as('getDetection');
    cy.intercept('POST', `**/detections/**/image`, detection_mock).as('createDetectionImage');
    cy.intercept('GET', ` http://mock.url.com/`, { fixture: 'mock.geojson', headers: { 'content-type': 'application/geojson' } }).as(
      'getDetectionResultGeojson'
    );
    // detection

    // points conversion
    cy.intercept('POST', `/Prod/mercator`, mercator_mock).as('createDetectionImage');
    // points conversion

    // email message
    cy.intercept('POST', `**/detections/${detection_mock.id}/pdf`, { body: {} }).as('sendPdf');
    cy.intercept('POST', `**/detections/${detection_mock.id}/roofer/email`, { body: {} }).as('sendUserInfo');
    // email message

    cy.mount(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    );

    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains('Récupération de votre adresse');

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock');
    cy.contains('24 rue mozart mock 1');
    cy.contains('24 rue mozart mock 2');
    cy.contains('24 rue mozart mock 3');

    cy.contains('24 rue mozart mock 2').click();

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

    cy.contains('Veuillez saisir les informations suivantes.');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('123987456');
    cy.dataName('email').type('john@gmail.com');

    cy.intercept('POST', `**/detections/**/roofer`, { statusCode: 500 }).as('createDetection');
    cy.intercept('POST', `**/detections/*/sync`, { statusCode: 500 });

    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains('La détection sur cette zone a échoué, veuillez réessayer');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();

    cy.intercept('POST', `**/detections/*/sync`, {
      statusCode: 501,
      body: { message: 'Provided geojson polygon is too large to be processed synchronously' },
    }).as('createDetection');

    cy.dataCy(process_detection_sel).click();

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('123987456');
    cy.dataName('email').type('john@gmail.com');

    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains('La délimitation que vous avez faite est trop grande et ne peut pas encore être prise en charge.');
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();

    cy.intercept('POST', `/detections/*/sync`, detectionSync).as('detectionSync');
    cy.dataCy(process_detection_sel).click();

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('123987456');
    cy.dataName('email').type('john@gmail.com');

    cy.dataCy(process_detection_on_form_sel).click();
    cy.contains('La pente et la hauteur du bâtiment ne sont pas encore disponibles.');
  });
});
