const search_input_sel = 'address-search-input';
const canvas_cursor_sel = 'annotator-canvas-cursor';
const process_detection_sel = 'process-detection-button';
const process_detection_on_form_sel = 'process-detection-on-form-button';

describe('test detection', () => {
  beforeEach(() => {
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
    cy.intercept('POST', `/detections/**/roofer`).as('createDetection');
    cy.intercept('GET', '/detections/roofer/image**').as('getDetectionResultImage');
    cy.intercept('GET', /\/detections\/[\w\d\-^\/]+$/).as('getDetection');
    cy.intercept('GET', '/vgg**').as('getDetectionResultVgg');
    cy.intercept('POST', `/detections/**/image`).as('createDetectionImage');
    // detection

    cy.intercept('POST', '/Prod/mercator').as('mercatorConversion');

    cy.visit('https://roof.birdia.fr');
  });

  it('1024 image detection', () => {
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

    cy.wait('@getWhoami');
    cy.wait('@getAccounts');
    cy.wait('@getAccountHolders');
    cy.wait('@createProspect');
    cy.wait('@createAreaPicture');
    cy.wait('@getImage');
    cy.wait('@createDetection');

    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.");

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

    cy.wait('@createDetectionImage');
    cy.wait('@mercatorConversion');
    cy.wait('@createProspect');
    cy.wait('@createDetection');
    cy.wait('@getDetection');

    cy.contains('220.77m²');
    cy.contains("Taux d'humidité").parent('.MuiStack-root').siblings('.MuiTypography-root').contains('0.3%');
    cy.contains('Obstacle / Velux').parent('.MuiStack-root').siblings('.MuiTypography-root').contains('OUI');
  });

  it('extended image detection', () => {
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
    cy.wait('@location-search');

    cy.contains('12 Boulevard de la Croisette, 06400 Cannes, France').click();

    cy.wait('@getWhoami');
    cy.wait('@getAccounts');
    cy.wait('@getAccountHolders');
    cy.wait('@createProspect');
    cy.wait('@createAreaPicture');
    cy.wait('@getImage');
    cy.wait('@createDetection');

    cy.contains("Veuillez délimiter votre toiture sur l'image suivante.");

    cy.get('button').contains(`Recentrer`).click();

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

    cy.wait('@createDetectionImage');
    cy.wait('@mercatorConversion');
    cy.wait('@createProspect');
    cy.wait('@createDetection');
    cy.wait('@getDetection');

    cy.contains('210.86m²');
    cy.contains('Note de dégradation globale : 3.74%');
    cy.contains("Taux d'usure").parent('.MuiStack-root').siblings('.MuiTypography-root').contains('0.77%');
    cy.contains('Taux de moisissure').parent('.MuiStack-root').siblings('.MuiTypography-root').contains('11.46%');
    cy.contains("Taux d'humidité").parent('.MuiStack-root').siblings('.MuiTypography-root').contains('0%');
    cy.contains('Obstacle / Velux').parent('.MuiStack-root').siblings('.MuiTypography-root').contains('OUI');
  });
});
