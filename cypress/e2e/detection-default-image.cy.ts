const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

const timeout = 300000;

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
    cy.wait('@location-search');

    cy.contains('13 Rue Honoré Daumier, 56000 Vannes, France').click();

    // cy.wait('@getWhoami');
    // cy.wait('@getAccounts');
    // cy.wait('@getAccountHolders');
    // cy.wait('@createProspect');
    // cy.wait('@createAreaPicture');
    // cy.wait('@getImage');
    // cy.wait('@createDetection');

    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.", { timeout });

    const getX = (x: number) => Math.floor(x + 145 - 71);
    const getY = (y: number) => Math.floor(y + 397 - 387);

    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-in').click();
    cy.dataCy('zoom-reset').click();

    // 71 387
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

    // cy.wait('@createDetectionImage');
    // cy.wait('@mercatorConversion');
    // cy.wait('@createProspect');
    // cy.wait('@createDetection');
    // cy.wait('@getDetection');

    cy.contains('220.77m²', { timeout });
    cy.contains("Taux d'humidité").parent('.MuiStack-root').siblings('.MuiTypography-root').contains('0.3%');
    cy.contains('Obstacle / Velux').parent('.MuiStack-root').siblings('.MuiTypography-root').contains('OUI');
  });
});
