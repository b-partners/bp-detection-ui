import { detectionGetImage } from './detection-get-image';
import { defaultTimeout, syncDetectionTimeout } from './utilities';

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const expectedRoofArea = '220.25m²';
const expectedUsureRate = '0%';
const expectedHumidityRate = '1.14%';
const expectedGlobalRate = `0.45%`;
const expectedGPSValues = `47.6653675, -2.7623357`;
const expectedImageSource = `PCRS.LAMB93`;

const HaveRoofDelimiterSucceeded = {
  yes: () => {
    cy.contains(expectedRoofArea, { timeout: defaultTimeout });
    cy.contains(`(GPS ${expectedGPSValues})`);
    cy.contains(`Source : ${expectedImageSource}`);
    cy.contains(`Note de dégradation globale : ${expectedGlobalRate}`);
    cy.contains("Taux d'humidité");
    cy.contains('Obstacle / Velux: NON');
    cy.contains('Taux de moisissure: 0%');
    cy.contains(`Taux d'usure: ${expectedUsureRate}`);
    cy.contains(`Taux d'humidité: ${expectedHumidityRate}`);
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

    cy.dataCy(canvas_cursor_sel).click(getX(71), getY(387), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(235), getY(41), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(416), getY(132), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(251), getY(477), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(71), getY(387), { force: true });

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

xdescribe('test detection', () => {
  it('Default image detection', () => {
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
    cy.dataCy(search_input_sel).type('13 Rue Honoré Daumier, 56000 Vannes');
    detectionGetImage('13 Rue Honoré Daumier, 56000 Vannes', () => HaveTheCorrectImagePrecision5Cm.yes());
  });
});
