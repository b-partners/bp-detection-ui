import { analysisTimeout, defaultTimeout, process_detection_on_form_sel, search_input_sel } from './utilities';

/**
 * Every request the live walk goes through, aliased to be waited on and checked. Only the pdf export and the roofer
 * notification are stubbed: the walk still triggers both, but no real report is generated nor sent to the roofer.
 */
const aliasRequests = () => {
  cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');

  cy.intercept('POST', '/address/autocomplete*').as('location-search');

  cy.intercept('POST', '/accountHolders/*/prospects').as('createProspect');
  cy.intercept('PUT', '/accounts/*/areaPictures/*').as('createAreaPicture');

  cy.intercept('GET', /\/geocode\?address=/).as('geocode');
  cy.intercept('GET', /\/geocode\?longitude=/).as('getFootprint');

  cy.intercept('POST', '**/detections/*/sync').as('detectionSync');
  cy.intercept('POST', '**/toiture?*').as('getLlmReport');
  cy.intercept('POST', '**/annotations/exports', { fixture: 'legal-file.pdf', headers: { 'content-type': 'application/pdf' } }).as('exportPdf');
  cy.intercept('POST', '**/prospects/*/notifications', { statusCode: 200, body: {} }).as('notifyRoofer');
};

const expectSuccess = (alias: string, timeout = defaultTimeout) =>
  cy.wait(`@${alias}`, { timeout }).then(({ request, response }) => expect(response?.statusCode, `${request.method} ${request.url}`).to.be.within(200, 299));

/** The sidebar's hint under the roof, shown only while an emprise is traced. */
const tracedRoofHint = "Le toit est l'emprise envoyée à la génération 3D et à l'analyse. Tracez-en une nouvelle sur la carte pour remplacer celle-ci.";

/** Reads the first number of a figure the analyser prints, `12.34 m²` or `5.6%` alike. */
const numberIn = (text: string) => parseFloat(text.replace(',', '.').match(/-?\d+(\.\d+)?/)?.[0] ?? 'NaN');

/**
 * The roof the analyser pre-filled is deleted with its red bin in the sidebar, then the walk stops for the roof to be
 * traced by hand, and goes on with the resume button. A headless run cannot trace one, so it keeps the pre-filled roof:
 * deleting it there would fail every scheduled run and open an Instatus incident for a roof.birdia.fr that works.
 */
const traceTheRoof = () => {
  cy.contains(tracedRoofHint, { timeout: defaultTimeout });
  if (!Cypress.config('isInteractive')) return;
  cy.contains(tracedRoofHint).parent().find('.geo-list-item button[aria-label^="Supprimer"]').click();
  cy.log('Tracez le toit, puis reprenez le test (▶)');
  cy.pause();
};

/**
 * The roof about to be analysed has a real area and at least three corners, and its measurements add up: every side
 * is a length, and the perimeter is their sum. Its area is kept as `@roofArea` for the analysis to be checked against.
 */
const checkTheRoofMeasurements = () => {
  cy.contains(tracedRoofHint)
    .parent()
    .within(() => {
      cy.get('.geo-list-item').should('have.length', 1);
      cy.get('.geo-list-item-area')
        .invoke('text')
        .then(text => {
          const [area, corners] = text.split('·').map(numberIn);
          expect(area, 'roof area (m²)').to.be.greaterThan(0);
          expect(corners, 'roof corners').to.be.at.least(3);
          cy.wrap(area).as('roofArea');
        });

      cy.get('.geo-list-item button[aria-label^="Afficher les mesures"]').click();
      cy.get('.geo-list-side-length').should('have.length.at.least', 3);
      cy.get('.geo-list-side-length').then($sides => {
        const sides = [...$sides].map(side => numberIn(side.textContent ?? ''));
        sides.forEach((side, index) => expect(side, `side ${index + 1} (m)`).to.be.greaterThan(0));
        cy.get('.geo-list-perimeter-value')
          .invoke('text')
          .then(perimeter =>
            expect(numberIn(perimeter), 'perimeter (m)').to.be.closeTo(
              sides.reduce((sum, side) => sum + side, 0),
              0.01 * sides.length
            )
          );
      });
      cy.get('.geo-list-item button[aria-label^="Masquer les mesures"]').click();
    });
};

/** The text of one of the six result lines the analysis is summed up in. */
const resultValue = (label: string) => cy.contains('.geo-summary-name', label).siblings('.geo-summary-value').invoke('text');

/**
 * The six results are real values: the slope only ever adds to the traced roof's area (a 60° roof doubles it, hence
 * the upper bound), the covering is named, the three rates are percentages and the obstacle is answered.
 */
const checkTheResults = () => {
  cy.contains("Résultats de l'analyse", { timeout: defaultTimeout });
  cy.get('.geo-summary-item', { timeout: defaultTimeout }).should('have.length', 6);

  cy.get<number>('@roofArea').then(roofArea =>
    resultValue('Surface totale').then(text => {
      expect(text, 'Surface totale').to.match(/^\d+(\.\d+)? m²$/);
      expect(numberIn(text), 'Surface totale (m²)').to.be.within(roofArea * 0.8, roofArea * 2.5);
    })
  );
  resultValue('Revêtement').should('not.be.empty').and('not.eq', 'Non renseigné');
  ["Taux d'usure", 'Taux de moisissure', "Taux d'humidité"].forEach(label =>
    resultValue(label).then(text => {
      expect(text, label).to.match(/^\d+(\.\d+)?%$/);
      expect(numberIn(text), label).to.be.within(0, 100);
    })
  );
  resultValue('Obstacle / Velux').should('be.oneOf', ['OUI', 'NON']);
};

/** The whole live walk on prod: api key, address, questions, contact form, roof analysis, report and acknowledgement. */
export const analyseRoof = (address: string) => {
  aliasRequests();
  cy.visit('https://roof.birdia.fr');

  // the page refuses the missing key first, and that keyless whoami can land after the intercept is set: only the
  // whoami carrying the typed key is aliased, so a late 403 for the empty one is never the one waited on
  const apiKey = `${process.env.REACT_PROD_API_KEY}`;
  cy.contains("Veuillez specifier votre clé d'api");
  cy.intercept('GET', '/whoami', req => {
    if (Object.values(req.headers).includes(apiKey)) req.alias = 'getWhoami';
  });
  cy.dataCy('api-key-input').type(`${apiKey}{enter}`);
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

  traceTheRoof();
  checkTheRoofMeasurements();

  cy.contains('button', "Lancer l'analyse", { timeout: defaultTimeout }).should('not.be.disabled').click();
  expectSuccess('detectionSync', analysisTimeout);

  cy.contains('Analysez l’état via BIRDIA').closest('.step-item').should('have.class', 'active');
  checkTheResults();

  expectSuccess('getLlmReport', analysisTimeout);
  cy.contains('button', 'Comprendre votre rapport').click();
  cy.contains('COMPRENDRE VOTRE RAPPORT', { timeout: defaultTimeout });
  cy.contains('Diagnostic principal');
  expectSuccess('exportPdf', analysisTimeout);
  expectSuccess('notifyRoofer');

  cy.contains('button', 'Terminer').click();
  cy.contains('Merci d’avoir analysé votre toiture, votre pré-diagnostic BIRDIA est prêt.');
};
