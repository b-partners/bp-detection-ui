import { detectionGetImage } from './detection-get-image';
import { defaultTimeout, syncDetectionTimeout } from './utilities';

const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const expectedImagePrecisionInCm = 5;
const expectedIsExtendedValueAfterExtendImage = true;
const expectedMoisissure = `13.44%`;
const expectedHumidity = `0%`;
const expectedUsure = `0%`;

const HaveWeASuccessFullDetection = {
  yes() {
    cy.contains('210.99m²', { timeout: defaultTimeout });
    cy.contains('Note de dégradation globale');
    cy.contains(`Taux d'usure: ${expectedUsure}`);
    cy.contains(`Taux de moisissure: ${expectedMoisissure}`);
    cy.contains(`Taux d'humidité: ${expectedHumidity}`);
    cy.contains('Obstacle / Velux: OUI');
  },
  no() {},
};

const HaveTheCorrectImagePrecision5Cm = {
  yes: () => {
    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.", { timeout: defaultTimeout });

    cy.get('button')
      .contains(`Elargir la zone`)
      .click()
      .then(() => {
        cy.wait('@createAreaPicture', { timeout: defaultTimeout }).then(({ response, request }) => {
          const currentPrecisionInCm = response?.body?.actualLayer?.precisionLevelInCm;
          const currentIsExtendedValue = response?.body?.isExtended;
          expect(currentPrecisionInCm).to.equal(expectedImagePrecisionInCm, 'The precisionLevelInCm should be equal to 5cm');
          if (request.body?.actualLayer?.precisionLevelInCm) expect(currentIsExtendedValue).to.equal(expectedIsExtendedValueAfterExtendImage);
        });
      });

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-reset').click();

    const getX = (x: number) => Math.floor(x + 70);
    const getY = (y: number) => Math.floor(y + 4);

    cy.dataCy(canvas_cursor_sel).click(getX(244), getY(175), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(225), getY(244), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(232), getY(256), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(305), getY(276), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(334), getY(215), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(336), getY(202), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(244), getY(175), { force: true });

    cy.dataCy(process_detection_sel).should('not.have.class', 'Mui-disabled');

    cy.dataCy(process_detection_sel).click();

    cy.contains('Veuillez saisir les informations suivantes.');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type(process.env.REACT_IT_TEST_PHONE || '');
    cy.dataName('email').type(process.env.REACT_IT_TEST_EMAIL || '');

    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@createDetection', { timeout: syncDetectionTimeout }).then(({ response }) => {
      const statusCode = response?.statusCode;
      if (statusCode === 200) HaveWeASuccessFullDetection.yes();
      else HaveWeASuccessFullDetection.no();
    });
  },
  no() {
    cy.contains('Adresse momentanément indisponible.');
  },
};

describe('Test extended detection', () => {
  it('Extended image detection', () => {
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
    cy.dataCy(search_input_sel).type('12 Boulevard de la Croisette, 06400 Cannes');

    detectionGetImage('12 Boulevard de la Croisette, 06400 Cannes', () => HaveTheCorrectImagePrecision5Cm.yes());
  });
});
