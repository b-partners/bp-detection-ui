import { detectionGetImage } from './detection-get-image';

const addressToDetect = '1 Rue de la Vau Saint-Jacques, 79200 Parthenay';

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const timeout = 1200000;
const expectedRoofArea = '265.64m²';
const expectedUsureRate = '2.68%';
const expectedMoisissureRate = '43.09%';
const expectedHumidityRate = '0%';
const expectedGlobalRage = `18.58%`;
const expectedGPSValues = `46.6519823, 46.6519823`;
const expectedImageSource = `cite:PCRS`;

const HaveRoofDelimiterSucceeded = {
  yes: () => {
    cy.contains(expectedRoofArea, { timeout });
    cy.contains(`(GPS ${expectedGPSValues})`);
    cy.contains(`Source : ${expectedImageSource}`);
    cy.contains('Comprendre votre rapport').click();
    cy.contains('Chargement des explications du rapport...', { timeout });
    cy.contains('COMPRENDRE VOTRE RAPPORT', { timeout });
    cy.contains('CATÉGORIE B', { timeout });
    cy.contains('CONSEILS DE L’ARTISAN COUVREUR', { timeout });

    cy.contains(`Note de dégradation globale : ${expectedGlobalRage}`);
    cy.contains('Obstacle / Velux: OUI');
    cy.contains(`Taux de moisissure: ${expectedMoisissureRate}`);
    cy.contains(`Taux d'usure: ${expectedUsureRate}`);
    cy.contains(`Taux d'humidité: ${expectedHumidityRate}`);
  },
  no: () => cy.contains('La détection sur cette zone a échoué, veuillez réessayer'),
};

const HaveTheCorrectImagePrecision5Cm = {
  yes() {
    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.", { timeout });

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

    cy.dataCy(process_detection_sel).should('not.have.class', 'Mui-disabled');

    cy.dataCy(process_detection_sel).click();

    cy.contains('Veuillez saisir les informations suivantes.');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type(process.env.REACT_IT_TEST_PHONE || '');
    cy.dataName('email').type(process.env.REACT_IT_TEST_EMAIL || '');

    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@createDetection', { timeout }).then(({ response }) => {
      if (response?.statusCode !== 200) HaveRoofDelimiterSucceeded.no();
      else HaveRoofDelimiterSucceeded.yes();
    });
  },
};

describe('test detection on ' + addressToDetect, () => {
  it('Default image detection', () => {
    cy.prodRequestUtilities();
    //steppers state
    cy.contains('Récupération de votre adresse').should('have.class', 'Mui-active');
    cy.contains('Délimitation de votre toiture').should('not.have.class', 'Mui-active');
    //steppers state

    cy.contains("Clé d'API invalide");
    cy.contains("Votre clé d'API est invalide. Veuillez specifier une clé valide");

    cy.dataCy('api-key-input').type(process.env.REACT_PROD_API_KEY || '');
    cy.contains('Valider').click();

    cy.contains('Récupération de votre adresse');
    cy.dataCy(search_input_sel).type(addressToDetect);
    detectionGetImage(addressToDetect, () => HaveTheCorrectImagePrecision5Cm.yes());
  });
});
