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
} from '../../../src/__tests__/mocks';
import { offlineUrl } from './utilities';

describe('Test legal files not all approved', () => {
  it('Test the app', () => {
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');

    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');

    // user informations
    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, legalFiles_mock).as('getLegalFiles');
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
    cy.visit(offlineUrl);

    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.contains("Conditions générales d'utilisation");

    cy.dataCy('next-button').click({ force: true });
    cy.dataCy('prev-button').click({ force: true });

    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, legalFilesOneNonApproved_mock);
    cy.contains('Accepter').click();
    cy.intercept('PUT', `/users/${whoami_mock.user.id}/legalFiles/${legalFiles_mock[0].id}`, legalFilesOneNonApproved_mock);

    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, legalFilesAllApproved_mock);
    cy.contains('Accepter').click();
    cy.intercept('PUT', `/users/${whoami_mock.user.id}/legalFiles/${legalFiles_mock[1].id}`, legalFilesAllApproved_mock);
  });
});
