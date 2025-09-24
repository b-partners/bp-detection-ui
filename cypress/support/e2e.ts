import './commands';

const prodRequestUtilities = () => {
  cy.intercept('POST', '/address/autocomplete*').as('location-search');

  // user informations
  cy.intercept('GET', '/whoami').as('getWhoami');
  cy.intercept('GET', `/users/**/accounts`).as('getAccounts');
  cy.intercept('GET', `/users/**/accounts/**/accountHolders`).as('getAccountHolders');
  // user informations

  // prospect & areaPictures & get image
  cy.intercept('PUT', `/accountHolders/**/prospects`).as('createProspect');
  cy.intercept('PUT', `/accounts/**/areaPictures/**`).as('createAreaPicture');
  cy.intercept('GET', `/accounts/**/files/**/raw**`).as('getImage');
  // prospect & areaPictures & get image

  // detection
  cy.intercept('POST', `/detections/**/sync`).as('createDetection');
  cy.intercept('GET', '/detections/roofer/image**').as('getDetectionResultImage');
  cy.intercept('GET', /\/detections\/[\w\d\-^\/]+$/).as('getDetection');
  cy.intercept('GET', '/vgg**').as('getDetectionResultVgg');
  cy.intercept('POST', `/detections/**/image`).as('createDetectionImage');
  // detection

  cy.intercept('POST', '/Prod/mercator').as('mercatorConversion');

  cy.visit('https://roof.birdia.fr');
};

const verifyUiRequestError = () => {};

declare global {
  namespace Cypress {
    interface Chainable {
      prodRequestUtilities: typeof prodRequestUtilities;
      verifyUiRequestError: typeof verifyUiRequestError;
    }
  }
}

Cypress.Commands.add('prodRequestUtilities', prodRequestUtilities);
Cypress.Commands.add('verifyUiRequestError', verifyUiRequestError);
