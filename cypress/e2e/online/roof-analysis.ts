import { analysisTimeout, defaultTimeout, process_detection_on_form_sel, search_input_sel } from './utilities';

/** Every request the live walk goes through, aliased to be waited on and checked. None of them is mocked. */
const aliasRequests = () => {
  cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');

  cy.intercept('POST', '/address/autocomplete*').as('location-search');

  cy.intercept('POST', '/accountHolders/*/prospects').as('createProspect');
  cy.intercept('PUT', '/accounts/*/areaPictures/*').as('createAreaPicture');

  cy.intercept('GET', /\/geocode\?address=/).as('geocode');
  cy.intercept('GET', /\/geocode\?longitude=/).as('getFootprint');

  cy.intercept('POST', '**/detections/*/sync').as('detectionSync');
  cy.intercept('POST', '**/toiture?*').as('getLlmReport');
  cy.intercept('POST', '**/annotations/exports').as('exportPdf');
  cy.intercept('POST', '**/prospects/*/notifications').as('notifyRoofer');
};

const expectSuccess = (alias: string, timeout = defaultTimeout) =>
  cy.wait(`@${alias}`, { timeout }).then(({ request, response }) => expect(response?.statusCode, `${request.method} ${request.url}`).to.be.within(200, 299));

/**
 * In `cypress open`, the walk stops on the roof analyser for the outline to be traced by hand — the pans drawn, the
 * lines moved — then goes on with the resume button. A headless run keeps the outline the analyser pre-filled.
 */
const letTheUserDraw = () => {
  if (!Cypress.config('isInteractive')) return;
  cy.log('Tracez les pans et ajustez les lignes, puis reprenez le test (▶)');
  cy.pause();
};

/** The whole live walk on prod: api key, address, questions, contact form, roof analysis, report and acknowledgement. */
export const analyseRoof = (address: string) => {
  aliasRequests();
  cy.visit('https://roof.birdia.fr');

  // the page refuses the missing key first: only the whoami sent with the typed one has to succeed
  cy.contains("Veuillez specifier votre clé d'api");
  cy.intercept('GET', '/whoami').as('getWhoami');
  cy.dataCy('api-key-input').type(`${process.env.REACT_PROD_API_KEY}{enter}`);
  expectSuccess('getWhoami');

  cy.contains('Pré-diagnostiquez votre toiture');
  cy.dataCy(search_input_sel).type(address);
  expectSuccess('location-search');
  // the address is free text: it is submitted as typed rather than through a suggestion the popup may not show headless
  cy.dataCy(search_input_sel).closest('form').contains('button', 'Analyser').click();

  cy.contains('Quel est l’objectif de votre demande ?');
  cy.contains('Entretien / réparation préventive').click();
  cy.contains('Moins de 10 ans').click();
  cy.dataCy('qcm-continue-button').click();

  cy.contains('Vos coordonnées pour recevoir le rapport');
  cy.dataName('lastName').type('Doe');
  cy.dataName('firstName').type('John');
  cy.dataName('phone').type(process.env.REACT_IT_TEST_PHONE || '');
  cy.dataName('email').type(process.env.REACT_IT_TEST_EMAIL || '');
  cy.dataCy('consent-checkbox').check();
  cy.dataCy(process_detection_on_form_sel).click();

  expectSuccess('createProspect');
  expectSuccess('createAreaPicture');
  expectSuccess('geocode');

  cy.contains('Visualisez et délimitez votre toiture').closest('.step-item').should('have.class', 'active');
  cy.dataCy('roof-annotator');
  expectSuccess('getFootprint');

  letTheUserDraw();

  cy.contains('button', "Lancer l'analyse", { timeout: defaultTimeout }).should('not.be.disabled').click();
  expectSuccess('detectionSync', analysisTimeout);

  cy.contains('Analysez l’état via BIRDIA').closest('.step-item').should('have.class', 'active');
  cy.contains("Résultats de l'analyse", { timeout: defaultTimeout });
  ['Surface totale', 'Revêtement', "Taux d'usure", 'Taux de moisissure', "Taux d'humidité", 'Obstacle / Velux'].forEach(label => cy.contains(label));

  expectSuccess('getLlmReport', analysisTimeout);
  cy.contains('button', 'Comprendre votre rapport').click();
  cy.contains('COMPRENDRE VOTRE RAPPORT', { timeout: defaultTimeout });
  cy.contains('Diagnostic principal');
  expectSuccess('exportPdf', analysisTimeout);
  expectSuccess('notifyRoofer');

  cy.contains('button', 'Terminer').click();
  cy.contains('Merci d’avoir analysé votre toiture, votre pré-diagnostic BIRDIA est prêt.');
};
