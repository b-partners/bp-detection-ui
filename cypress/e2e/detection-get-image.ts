import { e2eTimeout, expectedImagePrecisionInCm, search_input_sel } from './utilities';

type TDecision = {
  yes: () => void;
  no: () => void;
};

class GetImageStepUtilities {
  private readonly resolve: () => void;
  constructor(resolve: (value: unknown) => void) {
    this.resolve = () => resolve(undefined);
  }

  private haveRequestSuccessYesFunction = (alias: string, decision: TDecision) => {
    cy.wait(alias, { timeout: e2eTimeout }).then(({ response }) => {
      if (response?.statusCode !== 200) decision.no();
      else decision.yes();
    });
  };

  private getImageError = () => cy.contains("Erreur lors de la récupération de l'image.");

  private HaveTheCorrectImagePrecision5Cm = {
    yes: () => this.resolve(),
    no: () => cy.contains("L'adresse que vous avez spécifiée n'est pas encore prise en charge."),
    no_detectionInitializationError: () => cy.contains("Erreur lors de l'initialisation de la détection."),
    no_limitExceededForFreeTrial: () => cy.contains('La limite des analyses gratuites a été atteinte.'),
  };

  private HaveCreateProspectSucceeded = {
    yes: () =>
      cy.wait('@createAreaPicture', { timeout: e2eTimeout }).then(({ response }) => {
        const currentPrecisionInCm = response?.body?.actualLayer?.precisionLevelInCm;
        if (response?.statusCode !== 200) this.getImageError();
        else if (currentPrecisionInCm !== expectedImagePrecisionInCm) this.HaveTheCorrectImagePrecision5Cm.no();
        else this.resolve();
      }),
    no: this.getImageError,
  };

  private HaveCreateAccountHolderSucceeded = {
    yes: () => this.haveRequestSuccessYesFunction('@createProspect', this.HaveCreateProspectSucceeded),
    no: this.getImageError,
  };

  private HaveGetAccountsSucceeded = {
    yes: () => this.haveRequestSuccessYesFunction('@getAccountHolders', this.HaveCreateAccountHolderSucceeded),
    no: this.getImageError,
  };

  private HaveGetWhoamiSucceeded = {
    yes: () => this.haveRequestSuccessYesFunction('@getAccounts', this.HaveGetAccountsSucceeded),
    no: this.getImageError,
  };

  public init() {
    console.log(this);

    this.haveRequestSuccessYesFunction('@getWhoami', this.HaveGetWhoamiSucceeded);
  }
}

const HaveResultFromSearchLocation = {
  yes: () => cy.get('.location-list > .MuiPaper-root > :nth-child(1)').click(),
  no: (address: string) => cy.dataCy(search_input_sel).clear().type(`${address}{enter}`),
};

/**
 * Performs the initial phase of the detection process, including all necessary conditional checks.
 *
 * This function executes the following steps:
 * - Searches for the address.
 * - Retrieves all user information.
 * - Creates a prospect and an area picture.
 * - Checks the image precision.
 * - Redirects to the annotator board.
 */
export const detectionGetImage = (address: string, resolve: () => void) => {
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
  cy.dataCy(search_input_sel).type(address);
  cy.wait('@location-search', { timeout: e2eTimeout }).then(({ response }) => {
    if (response?.statusCode !== 200 || response?.body?.length === 0) HaveResultFromSearchLocation.no(address);
    else HaveResultFromSearchLocation.yes();
  });

  const getImageStepUtilities = new GetImageStepUtilities(resolve);

  getImageStepUtilities.init();
};
