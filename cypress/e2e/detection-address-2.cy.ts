import { detectionGetImage } from './detection-get-image';
import { defaultTimeout, syncDetectionTimeout } from './utilities';

const addressToDetect = '16 Rue Rameau, 21000 Dijon';

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const expectedRoofArea = '270.00m²';
const expectedUsureRate = '0%';
const expectedMoisissureRate = '0%';
const expectedHumidityRate = '22.53%';
const expectedGlobalRage = `9.01%`;
const expectedGPSValues = `47.3212159, 5.042935099999999`;
const expectedImageSource = `COTE_D_OR_2024_5cm`;
const expectedCovering1 = `Ardoise`;
const expectedCovering2 = `Asphalte Bitume`;

const HaveRoofDelimiterSucceeded = {
  yes: () => {
    cy.contains(expectedRoofArea, { timeout: defaultTimeout });
    cy.contains(`(GPS ${expectedGPSValues})`);
    cy.contains(`Source : ${expectedImageSource}`);
    cy.contains('Comprendre votre rapport').click();
    cy.contains('Chargement des explications du rapport...', { timeout: defaultTimeout });
    cy.contains('COMPRENDRE VOTRE RAPPORT', { timeout: syncDetectionTimeout });
    cy.contains('CATÉGORIE B', { timeout: defaultTimeout });
    cy.contains('CONSEILS DE L’ARTISAN COUVREUR', { timeout: defaultTimeout });

    cy.contains(`Note de dégradation globale : ${expectedGlobalRage}`);
    cy.contains('Obstacle / Velux: OUI');
    cy.contains(`Taux de moisissure: ${expectedMoisissureRate}`);
    cy.contains(`Taux d'usure: ${expectedUsureRate}`);
    cy.contains(`Taux d'humidité: ${expectedHumidityRate}`);

    cy.contains(`Revêtement 1: ${expectedCovering1}`);
    cy.contains(`Revêtement 2: ${expectedCovering2}`);
  },
  no: () => cy.contains('La détection sur cette zone a échoué, veuillez réessayer'),
};

const HaveTheCorrectImagePrecision5Cm = {
  yes() {
    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.", { timeout: defaultTimeout });

    const getX = (x: number) => Math.floor(x + 145 - 71);
    const getY = (y: number) => Math.floor(y + 397 - 387);

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-reset').click();

    cy.dataCy(canvas_cursor_sel).click(getX(74), getY(411), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(139), getY(416), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(134), getY(481), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(436), getY(481), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(433), getY(364), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(450), getY(213), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(130), getY(191), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(124), getY(274), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(86), getY(269), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(79), getY(340), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(74), getY(411), { force: true });

    cy.dataCy(process_detection_sel).should('not.have.class', 'Mui-disabled');

    cy.dataCy(process_detection_sel).click();

    cy.contains('Veuillez saisir les informations suivantes.');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type(process.env.REACT_IT_TEST_PHONE || '');
    cy.dataName('email').type(process.env.REACT_IT_TEST_EMAIL || '');

    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@createDetection', { timeout: syncDetectionTimeout }).then(({ response }) => {
      if (response?.statusCode !== 200) HaveRoofDelimiterSucceeded.no();
      else HaveRoofDelimiterSucceeded.yes();
    });
  },
};

describe('test detection on ' + addressToDetect, () => {
  it('test detection on ' + addressToDetect, () => {
    // temporary until new implementation
    cy.intercept('PUT', '/detections/*/roofs/properties', {
      roofDelimiter: {
        roofHeightInMeter: 10,
        roofSlopeInDegree: 10,
      },
    });
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
