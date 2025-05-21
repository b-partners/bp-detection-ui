const apiInstatusPrefix = '__API__INSTATUS__ERROR__';
const uiInstatusPrefix = '__UI__INSTATUS__ERROR__';
type InstatusError = 'api' | 'ui';

const addInstatusErrorPrefix = (message: string, type: InstatusError) => `${message}, ${type === 'api' ? apiInstatusPrefix : uiInstatusPrefix}`;

const formatInStatusError = (alias: string, statusCode: number, error: InstatusError, message?: string) =>
  addInstatusErrorPrefix(`Error on ${alias} request || ${statusCode} || ${message}`, error);

const verifyRequestFailedError = (alias: string, response: any) => {
  const statusCode = response?.statusCode;
  expect(statusCode).to.not.equal(400, formatInStatusError(alias, statusCode, 'ui', JSON.stringify(response?.body)));
  expect(statusCode).to.be.equal(200, formatInStatusError(alias, statusCode, 'api'));
};

declare global {
  namespace Cypress {
    interface Chainable {
      addInstatusErrorPrefix: typeof addInstatusErrorPrefix;
      verifyRequestFailedError: typeof verifyRequestFailedError;
    }
  }
}

Cypress.Commands.add('addInstatusErrorPrefix', addInstatusErrorPrefix);
Cypress.Commands.add('verifyRequestFailedError', verifyRequestFailedError);
