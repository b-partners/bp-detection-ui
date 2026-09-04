import { whoami_mock as _whoami_mock, account_holder_mock, account_mock, locations_mock } from '../../../src/__tests__/mocks';
import { offlineUrlWithApiKey } from './utilities';

const whoami_mock = JSON.parse(JSON.stringify(_whoami_mock));
whoami_mock.user.logoFileId = '';
const defaultRooferLogo = '/assets/images/bird-ia-lg-logo.png';
const base64Indicator = 'base64';

describe('Roofer dynamic logo', () => {
  beforeEach(() => {
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');
    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');
    cy.intercept('GET', `/accounts/account-mock-id/files/${_whoami_mock.user.logoFileId}/raw?apiKey=api-key-mock&fileType=LOGO`, { statusCode: 500 }).as(
      'getRooferLogo'
    );

    // user informations
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
    // user informations

    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');
  });

  it('Test if the roofer does not have logo id', () => {
    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
    cy.visit(offlineUrlWithApiKey);
    cy.contains('Renseignez votre adresse');
    // check if the app does not fetch the user logo if there is no roofer logo (bug: fix)
    cy.get('@getRooferLogo.all').should('have.length', 0);
  });

  it('Test if the roofer does not have correct logo', () => {
    cy.intercept('GET', '/whoami', _whoami_mock).as('getWhoami');
    cy.visit(offlineUrlWithApiKey);
    cy.contains('Renseignez votre adresse');
    // there is no roofer logo so the app use the default image
    cy.get('.partner-card-logo img').should('have.attr', 'src').and('include', defaultRooferLogo);
  });

  it('Test if the roofer have correct logo', () => {
    cy.intercept('GET', `/accounts/account-mock-id/files/${_whoami_mock.user.logoFileId}/raw?apiKey=api-key-mock&fileType=LOGO`, {
      fixture: 'bird-ia-lg-logo.png',
    });
    cy.intercept('GET', '/whoami', _whoami_mock).as('getWhoami');
    cy.visit(offlineUrlWithApiKey);
    cy.contains('Renseignez votre adresse');
    // use the roofer logo as base64
    cy.get('.partner-card-logo img').should('have.attr', 'src').and('include', base64Indicator);
  });
});
