import { detectionGetImage } from './detection-get-image';

const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const timeout = 1200000;
const expectedImagePrecisionInCm = 5;
const expectedIsExtendedValueAfterExtendImage = true;

const HaveWeASuccessFullDetection = {
  yes() {
    cy.contains('546.40m²', { timeout });
    cy.contains('Note de dégradation globale');
    cy.contains("Taux d'usure");
    cy.contains('Taux de moisissure');
    cy.contains("Taux d'humidité");
    cy.contains('Obstacle / Velux').parent('.MuiStack-root').siblings('.MuiTypography-root').contains('OUI');
  },
  no() {
    cy.contains('La détection sur cette zone a échoué, veuillez réessayer');
  },
};

const HaveTheCorrectImagePrecision5Cm = {
  yes: () => {
    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.", { timeout });

    cy.get('button')
      .contains(`Elargir la zone`)
      .click()
      .then(() => {
        cy.wait('@createAreaPicture', { timeout }).then(({ response, request }) => {
          const currentPrecisionInCm = response?.body?.actualLayer?.precisionLevelInCm;
          const currentIsExtendedValue = response?.body?.isExtended;
          expect(currentPrecisionInCm).to.equal(expectedImagePrecisionInCm, cy.addInstatusErrorPrefix('The precisionLevelInCm should be equal to 5cm', 'api'));
          if (request.body?.actualLayer?.precisionLevelInCm) expect(currentIsExtendedValue).to.equal(expectedIsExtendedValueAfterExtendImage);
        });
      });

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-reset').click();

    const getX = (x: number) => Math.floor(x + 70);
    const getY = (y: number) => Math.floor(y + 4);

    cy.dataCy(canvas_cursor_sel).click(getX(243), getY(156), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(221), getY(237), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(229), getY(249), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(261), getY(259), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(417), getY(275), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(492), getY(278), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(435), getY(171), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(436), getY(180), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(375), getY(174), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(358), getY(200), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(329), getY(204), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(334), getY(185), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(292), getY(167), { force: true });
    cy.dataCy(canvas_cursor_sel).click(getX(243), getY(156), { force: true });

    cy.dataCy(process_detection_sel).should('not.have.class', 'Mui-disabled');

    cy.dataCy(process_detection_sel).click();

    cy.contains('Veuillez saisir les informations suivantes.');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type(process.env.REACT_IT_TEST_PHONE || '');
    cy.dataName('email').type(process.env.REACT_IT_TEST_EMAIL || '');

    cy.intercept('POST', '/detections/**/sync').as('createSynchronousDetection');

    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@createSynchronousDetection', { timeout }).then(({ response }) => {
      const statusCode = response?.statusCode;
      if (statusCode === 200) HaveWeASuccessFullDetection.yes();
      else HaveWeASuccessFullDetection.no();
    });
  },
  no() {
    cy.contains("L'adresse que vous avez spécifiée n'est pas encore prise en charge.");
  },
};

xdescribe('Test extended detection', () => {
  it('Extended image detection', () => {
    detectionGetImage('1 Rue de la Vau Saint-Jacques, 79200 Parthenay').then(() => HaveTheCorrectImagePrecision5Cm.yes());
  });
});
