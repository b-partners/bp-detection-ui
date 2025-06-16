const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const timeout = 1200000;
const expectedImagePrecisionInCm = 5;
const expedtedRoofArea = '220.77m²';

type TDecision = {
  yes: () => void;
  no: () => void;
};

const HaveResultFromSearchLocation = {
  yes() {
    cy.contains('13 Rue Honoré Daumier, 56000 Vannes, France').click();
  },
  no() {
    cy.dataCy(search_input_sel).clear().type('13 Rue Honoré Daumier, 56000 Vannes, France{enter}');
  },
};

const HaveTheCorrectImagePrecision5Cm = {
  yes() {
    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.", { timeout });

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

    cy.wait('@createDetection', { timeout }).then(({ response }) => cy.verifyRequestFailedError('@createDetection', response));

    cy.contains(expedtedRoofArea, { timeout });
    cy.contains("Taux d'humidité").parent('.MuiStack-root').siblings('.MuiTypography-root').contains('0.3%');
    cy.contains('Obstacle / Velux').parent('.MuiStack-root').siblings('.MuiTypography-root').contains('OUI');
  },
  no: () => cy.contains("L'adresse que vous avez spécifiée n'est pas encore prise en charge."),
  detectionInitializationError: () => cy.contains("Erreur lors de l'initialisation de la détection."),
  limitExceededForFreeTrial: () => cy.contains('La limite des analyses gratuites a été atteinte.'),
};

const haveRequestSuccesYesFunction = (alias: string, decision: TDecision) => {
  cy.wait(alias, { timeout }).then(({ response }) => {
    if (response?.statusCode !== 200) decision.no();
    else decision.yes();
  });
};

const getImageError = () => cy.contains("Erreur lors de la récupération de l'image.");

const HaveCreateAreaPitureSucceeded = {
  yes: () => {
    cy.wait('@createDetection', { timeout }).then(({ response }) => {
      if (response?.statusCode === 400 && response?.body?.message?.includes('limit exceeded for free trial period')) {
        HaveTheCorrectImagePrecision5Cm.limitExceededForFreeTrial();
      } else if (response?.statusCode === 200) {
        HaveTheCorrectImagePrecision5Cm.yes();
      } else HaveTheCorrectImagePrecision5Cm.detectionInitializationError();
    });
  },
  no: getImageError,
};

const HaveCreateProspectSucceeded = {
  yes: () =>
    cy.wait('@createAreaPicture', { timeout }).then(({ response }) => {
      cy.verifyRequestFailedError('@createAreaPicture', response);
      const currentPrecisionInCm = response?.body?.actualLayer?.precisionLevelInCm;
      if (response?.statusCode !== 200) getImageError();
      else if (currentPrecisionInCm !== expectedImagePrecisionInCm) HaveTheCorrectImagePrecision5Cm.no();
      else HaveCreateAreaPitureSucceeded.yes();
    }),
  no: getImageError,
};
const HaveCreateAccountHolderSucceeded = {
  yes: () => haveRequestSuccesYesFunction('@createProspect', HaveCreateProspectSucceeded),
  no: getImageError,
};

const HaveGetAccountsSucceeded = {
  yes: () => haveRequestSuccesYesFunction('@getAccountHolders', HaveCreateAccountHolderSucceeded),
  no: getImageError,
};

const HaveGetWhoamiSucceeded = {
  yes: () => haveRequestSuccesYesFunction('@getAccounts', HaveGetAccountsSucceeded),
  no: getImageError,
};

describe('test detection', () => {
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
    cy.dataCy(search_input_sel).type('13 Rue Honoré Daumier, 56000 Vannes');
    cy.wait('@location-search', { timeout }).then(({ response }) => {
      if (response?.statusCode !== 200) {
        HaveResultFromSearchLocation.no();
      } else {
        HaveResultFromSearchLocation.yes();
      }
    });

    haveRequestSuccesYesFunction('@getWhoami', HaveGetWhoamiSucceeded);
  });
});
