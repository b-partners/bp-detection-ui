import {
  account_holder_mock,
  account_mock,
  area_picture_mock,
  llmResult_mock,
  locations_mock,
  prospect_mock,
  roofAnalyseLimitExceededResponse_Mock,
  tooBigPolygonResponse_mock,
  whoami_mock,
} from '../../../src/__tests__/mocks';
import {
  expectNoRequest,
  expectResponses,
  footprint_mock,
  geoSessionInterceptions,
  lowPrecisionCoverage_mock,
  offlineUrl,
  roofAnalysisInterceptions,
} from './utilities';

const search_input_sel = 'address-search-input';
const process_detection_on_form_sel = 'process-detection-on-form-button';

/** From the address to the roof analyser, its roof outline pre-filled: what every analysis below starts from. */
const openRoofAnalyser = () => {
  cy.contains("Veuillez specifier votre clé d'api");
  cy.dataCy('api-key-input').type('api-key-mock{enter}');

  cy.dataCy(search_input_sel).type('24 rue mozart');
  cy.wait('@location-search');

  cy.contains('24 rue mozart mock 2').click();

  cy.contains('Demander une intervention urgente').click();
  cy.contains('Jamais entretenu').click();
  cy.dataCy('qcm-continue-button').click();

  cy.dataName('phone').type('+000000000000');
  cy.dataName('email').type('john.doe@example.com');
  cy.dataCy('consent-checkbox').check();
  cy.dataCy(process_detection_on_form_sel).click();

  cy.wait('@createProspect');
  cy.wait('@createAreaPicture');

  cy.dataCy('roof-annotator');
  cy.wait('@getFootprint');
  cy.contains('Emprise du bâtiment détectée automatiquement');
};

/** The imagery coverage asked for the outline's centre before the detection is sent. */
const expectCoverageAsked = () =>
  cy.wait('@getImageryCoverage').then(({ request }) => {
    expect(request.headers['x-api-key']).to.eq('api-key-mock');
    const params = new URL(request.url).searchParams;
    expect(params.get('types')).to.eq('IMAGERY');
    expect(Number(params.get('longitude'))).to.be.closeTo(footprint_mock.coordinates[0][0][0], 0.001);
    expect(Number(params.get('latitude'))).to.be.closeTo(footprint_mock.coordinates[0][0][1], 0.001);
  });

/** The detection request the roof analyser sends with `modelName`, and the error status it gets back. */
const expectDetectionSent = (statusCode: number, modelName = 'BP_TOITURE') =>
  cy.wait('@detectionSync').then(({ request, response }) => {
    expect(request.headers['x-api-key']).to.eq('api-key-mock');
    expect(request.body.detectableObjectModel.modelName).to.eq(modelName);
    // the low-precision model is read at the layer's own resolution: no zoom is asked for
    if (modelName === 'BP_TOITURE') expect(request.body.geoJsonZone[0].properties.zoom).to.eq(20);
    else expect(request.body.geoJsonZone[0].properties).not.to.have.property('zoom');
    expect(request.body.geoJsonDelimitationType).to.eq('ROOF');
    expect(request.body.geoJsonZone[0].geometry.type).to.eq('Polygon');
    expect(response?.statusCode).to.eq(statusCode);
  });

const launchAnalysis = (statusCode: number, modelName?: string) => {
  cy.contains('button', "Lancer l'analyse").should('not.be.disabled').click();
  expectCoverageAsked();
  expectDetectionSent(statusCode, modelName);
};

/** A failed detection stops the analysis there: no result, report, export nor roofer notification is requested. */
const expectAnalysisStopped = () => {
  ['getDetectionResultVgg', 'getLlmReport', 'uploadAttachment', 'exportPdf', 'createAttachmentUpload', 'putAttachment', 'notifyRoofer'].forEach(
    expectNoRequest
  );
};

/**
 * The roof analyser's error panel for a failed detection. The couvreur's walk is read-only: the panel never offers
 * to correct the outline nor to take the analysis in hand, only to relaunch it when the failure is worth retrying.
 */
const expectAnalysisError = ({ title, message, code, retryable }: { title: string; message: string; code?: number; retryable: boolean }) => {
  cy.contains('.geo-error-title', title)
    .parent()
    .within(() => {
      cy.contains('.geo-error-message', message);
      if (code) cy.contains('.geo-error-detail', `Code ${code}`);
      else cy.get('.geo-error-detail').should('not.exist');
      cy.contains('button', "Relancer l'analyse").should(retryable ? 'not.be.disabled' : 'not.exist');
      cy.contains('button', "Faire l'analyse manuellement").should('not.exist');
      cy.contains('button', "Corriger l'emprise").should('not.exist');
    });
};

describe('Test process detection error', () => {
  beforeEach(() => {
    cy.intercept('GET', `/captcha/token**`, { body: true }).as('validateCaptcha');

    cy.intercept('POST', '/address/autocomplete*', locations_mock).as('location-search');

    // user informations
    cy.intercept('GET', '/whoami', whoami_mock).as('getWhoami');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts`, [account_mock]).as('getAccounts');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/accounts/${account_mock.id}/accountHolders`, [account_holder_mock]).as('getAccountHolders');
    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');
    cy.intercept('GET', `/accounts/account-mock-id/files/${whoami_mock.user.logoFileId}/raw?apiKey=api-key-mock&fileType=LOGO`, {
      fixture: 'bird-ia-lg-logo.png',
      headers: { 'content-type': 'image/png' },
    }).as('getRooferLogo');
    // user informations

    // prospect & areaPictures
    cy.intercept('POST', `/accountHolders/${account_holder_mock.id}/prospects`, [prospect_mock]).as('createProspect');
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/**`, area_picture_mock).as('createAreaPicture');
    // the roof analyser saving its session: the annotation sent is the one saved
    cy.intercept('PUT', `/accounts/${account_mock.id}/areaPictures/*/annotations/*`, req => req.reply(req.body)).as('saveGeoSession');
    // prospect & areaPictures

    geoSessionInterceptions();
    roofAnalysisInterceptions(llmResult_mock);

    cy.visit(offlineUrl);
  });

  afterEach(() => {
    // every request the flow sent was answered by its mock, with the status that mock gives
    expectResponses('location-search', 200);
    expectResponses('getWhoami', 200);
    expectResponses('getAccounts', 200);
    expectResponses('getAccountHolders', 200);
    expectResponses('getLegalFiles', 200);
    expectResponses('createProspect', 200);
    expectResponses('createAreaPicture', 200);
    expectResponses('saveGeoSession', 200);
    expectResponses('geocode', 200);
    expectResponses('getFootprint', 200);
    expectResponses('getGeoSession', 404);
    expectResponses('getActualMapLayer', 200);
    expectResponses('getMapLayers', 200);
    expectResponses('getWmsTile', 200);
    expectResponses('generateRoofModel', 500);
    expectResponses('getImageryCoverage', 200);
  });

  it('Test /sync error 500', () => {
    // wide enough for the 3D preview card to leave the error panel's buttons clear
    cy.viewport(1280, 900);
    cy.intercept('POST', `/detections/*/sync`, { statusCode: 500 }).as('detectionSync');

    cy.contains("Veuillez specifier votre clé d'api");
    cy.dataCy('api-key-input').type('api-key-mock{enter}');

    cy.dataCy(search_input_sel).type('24 rue mozart');
    cy.wait('@location-search');

    cy.contains('24 rue mozart mock 2').click();

    cy.contains('Demander une intervention urgente').click();
    cy.contains('Jamais entretenu').click();
    cy.dataCy('qcm-continue-button').click();

    cy.contains('Vos coordonnées pour recevoir le rapport');

    cy.dataCy(process_detection_on_form_sel).click();
    cy.contains('Numéro de téléphone non valide');
    cy.contains('Adresse email non valide');

    cy.dataName('lastName').type('Doe');
    cy.dataName('firstName').type('John');
    cy.dataName('phone').type('+000000000000');
    cy.dataName('email').type('john.doe+229@example.com');
    cy.dataCy('consent-checkbox').check();
    cy.dataCy(process_detection_on_form_sel).click();

    cy.contains('Adresse email non valide');
    expectNoRequest('createProspect');

    cy.dataName('email').clear().type('john.doe@example.com');
    cy.dataCy(process_detection_on_form_sel).click();

    cy.wait('@createProspect')
      .its('request.body')
      .then(body => expect(JSON.stringify(body)).to.contain('john.doe@example.com'));
    cy.wait('@createAreaPicture');

    cy.dataCy('roof-annotator');
    cy.wait('@getFootprint');
    cy.contains('Emprise du bâtiment détectée automatiquement');

    launchAnalysis(500);

    const unavailable = {
      title: 'Analyse indisponible',
      message: 'L’analyse de la toiture est indisponible : le service n’a pas pu la traiter. Réessayez dans un instant.',
      code: 500,
      retryable: true,
    };
    expectAnalysisError(unavailable);
    expectAnalysisStopped();

    // a server failure is worth retrying: the relaunch sends the detection again, and fails the same way
    cy.contains('button', "Relancer l'analyse").click();
    expectDetectionSent(500);
    cy.get('@detectionSync.all').should('have.length', 2);
    expectAnalysisError(unavailable);
    expectAnalysisStopped();
  });

  it('Test free limit', () => {
    cy.intercept('POST', `/detections/*/sync`, roofAnalyseLimitExceededResponse_Mock).as('detectionSync');

    openRoofAnalyser();
    launchAnalysis(400);

    expectAnalysisError({ title: 'Limite atteinte', message: 'La limite des analyses gratuites a été atteinte.', retryable: false });
    expectAnalysisStopped();
  });

  it('Test too big polygon', () => {
    cy.intercept('POST', `/detections/*/sync`, tooBigPolygonResponse_mock).as('detectionSync');

    openRoofAnalyser();
    launchAnalysis(501);

    expectAnalysisError({
      title: 'Zone trop grande',
      message: 'La délimitation que vous avez faite est trop grande et ne peut pas encore être prise en charge. Réduisez le contour puis relancez.',
      retryable: false,
    });
    expectAnalysisStopped();
  });

  it('Test /sync answering 200 without result file', () => {
    // a 200 the service did not label as a failure, but with nothing to read: said as the service-side failure it is
    cy.intercept('POST', `/detections/*/sync`, { statusCode: 200, body: { geoJsonZone: [{ type: 'Feature', properties: {} }] } }).as('detectionSync');

    openRoofAnalyser();
    launchAnalysis(200);

    expectAnalysisError({
      title: 'Analyse indisponible',
      message: 'L’analyse de la toiture est indisponible : le service n’a pas pu la traiter. Réessayez dans un instant.',
      code: 502,
      retryable: true,
    });
    expectAnalysisStopped();
  });

  it('Test 20 cm imagery read with the low-precision model', () => {
    // the coverage says the imagery is too coarse for the roof model: the detection goes straight to the revêtement/obstacle one
    cy.intercept('GET', '**/coverage?*', lowPrecisionCoverage_mock).as('getImageryCoverage');
    cy.intercept('POST', `/detections/*/sync`, { statusCode: 500 }).as('detectionSync');

    openRoofAnalyser();
    launchAnalysis(500, 'BP_REVETEMENT_OBSTACLE');

    cy.get('@detectionSync.all').should('have.length', 1);
    expectAnalysisStopped();
  });

  it('Test roof model refused for the image resolution', () => {
    // the coverage said HD but the service refuses the layer as too coarse: the same ring is sent again with the low-precision model
    cy.intercept('POST', `/detections/*/sync`, req =>
      req.body.detectableObjectModel.modelName === 'BP_TOITURE'
        ? req.reply({ statusCode: 400, body: { message: 'image resolution must be 5cm for BP_TOITURE. Current layer cite:ORTHO is 20cm' } })
        : req.reply({ statusCode: 500 })
    ).as('detectionSync');

    openRoofAnalyser();
    launchAnalysis(400);
    expectDetectionSent(500, 'BP_REVETEMENT_OBSTACLE');

    cy.get('@detectionSync.all').should('have.length', 2);
    expectAnalysisStopped();
  });
});
