import App from '@/App';
import { cache, ParamsUtilities, theme } from '@/utilities';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { account_holder_mock, account_mock, area_picture_mock, detectionMock, locations_mock, prospect_mock, whoami_mock } from './mocks';

const queryClient = new QueryClient();

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
// const process_detection_sel = 'process-detection-button';

describe('<App />', () => {
  it('Test the app', () => {
    cy.stub(ParamsUtilities, 'getQueryParams').returns('mock-api-key');
    cy.intercept('GET', '/location*', locations_mock).as('location-search');

    // user informations
    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
    // user informations

    // prospect & areaPictures & get image
    cy.intercept('PUT', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, area_picture_mock).as('createAreaPicture');
    cy.intercept('GET', `/accounts/${account_mock.id}/files/${area_picture_mock.fileId}/raw**`, {
      fixture: 'bp-detection-image.jpeg',
      headers: { 'content-type': 'image/jpeg' },
    }).as('getImage');
    // prospect & areaPictures & get image

    // detection
    cy.intercept('POST', `/detections/**/roofer`, detectionMock).as('createDetection');
    cy.intercept('POST', `/detections/**/image`, detectionMock).as('createDetectionImage');
    // detection

    cy.mount(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    );

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

    cy.dataCy(search_input_sel).type('{enter}');

    cy.wait('@getWhoami');
    cy.wait('@getAccounts');
    cy.wait('@getAccountHolders');
    cy.wait('@createProspect');
    cy.wait('@createAreaPicture');
    cy.wait('@createDetection').then(() => cache.detectionId(detectionMock.id));
    cy.wait('@createDetectionImage');

    cy.contains("Veuillez sélectionner votre toiture sur l'image suivante.");
    //steppers state
    cy.contains('Récupération de votre adresse').should('have.class', 'Mui-completed');
    cy.contains('Délimitation de votre toiture').should('have.class', 'Mui-active');
    cy.contains('Analyse de votre toiture').should('not.have.class', 'Mui-active');
    //steppers state

    // cy.dataCy(process_detection_sel).should('have.a.property', 'disabled').should('eq', true);

    cy.contains('zoom +').click();

    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 150, { force: true });
    cy.dataCy(canvas_cursor_sel).click(300, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 300, { force: true });
    cy.dataCy(canvas_cursor_sel).click(150, 150, { force: true });

    cy.contains('zoom -').click();
  });
});
