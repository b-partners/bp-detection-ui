import { whoami_mock as _whoami_mock, account_holder_mock, account_mock, locations_mock } from '../../../src/__tests__/mocks';
import { offlineUrlWithApiKey } from './utilities';

const whoami_mock = JSON.parse(JSON.stringify(_whoami_mock));
whoami_mock.user.logoFileId = '';
/** The roofer's logo: the browser loads it itself, straight from this url. */
const rooferLogoPath = `/accounts/account-mock-id/files/${_whoami_mock.user.logoFileId}/raw?apiKey=api-key-mock&fileType=LOGO`;

describe('Roofer logo and card', () => {
  beforeEach(() => {
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');
    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');
    cy.intercept('GET', rooferLogoPath, { statusCode: 500 }).as('getRooferLogo');

    // user informations
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
    // user informations

    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');
  });

  it('Test if the roofer does not have logo id', () => {
    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
    cy.visit(offlineUrlWithApiKey);
    cy.contains('Pré-diagnostiquez votre toiture');
    // check if the app does not fetch the user logo if there is no roofer logo (bug: fix)
    cy.get('@getRooferLogo.all').should('have.length', 0);
  });

  it('Test that the roofer card stays hidden while its account info still loads', () => {
    cy.intercept('GET', '/whoami', _whoami_mock).as('getWhoami');
    cy.visit(offlineUrlWithApiKey);
    cy.contains('Pré-diagnostiquez votre toiture');
    // the account info still loads: it feeds the report preview's roofer name and the final feedback link
    cy.wait('@getAccountHolders');
    // but no roofer card is shown, so its logo is never loaded
    cy.get('.partner-card').should('not.exist');
    cy.get('@getRooferLogo.all').should('have.length', 0);
  });
});
