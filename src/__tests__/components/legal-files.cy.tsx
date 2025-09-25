import App from '@/App';
import { ParamsUtilities, theme } from '@/utilities';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  account_holder_mock,
  account_mock,
  area_picture_mock,
  legalFiles_mock,
  legalFilesAllApproved_mock,
  legalFilesOneNonApproved_mock,
  locations_mock,
  prospect_mock,
  whoami_mock,
} from './mocks';

const queryClient = new QueryClient();

const search_input_sel = 'address-search-input';

describe('Test legal files not all approved', () => {
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
    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, legalFiles_mock).as('getLegalFiles');
    cy.intercept('GET', `/assets/legal-file.pdf`, { fixture: 'legal-file.pdf' }).as('getPdfLegalFiles');

    cy.mount(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    );

    cy.contains("Clé d'API invalide");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel).type('test{enter}');

    cy.contains("Conditions générales d'utilisation");

    cy.wait('@getPdfLegalFiles');

    cy.contains('Suivant').click();
    cy.contains('Suivant').click();
    cy.contains('Suivant').click();
    cy.contains('Précédent').click();

    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, legalFilesOneNonApproved_mock);
    cy.contains('Accepter').click();
    cy.intercept('PUT', `/users/${whoami_mock.user.id}/legalFiles/${legalFiles_mock[0].id}`, legalFilesOneNonApproved_mock);

    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, legalFilesAllApproved_mock);
    cy.contains('Accepter').click();
    cy.intercept('PUT', `/users/${whoami_mock.user.id}/legalFiles/${legalFiles_mock[1].id}`, legalFilesAllApproved_mock);
  });
});
