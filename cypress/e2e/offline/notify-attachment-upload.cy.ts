import { account_holder_mock, account_mock, prospect_mock, whoami_mock } from '../../../src/__tests__/mocks';
import { DEMO_API_KEY } from '../../../src/providers/demo/demo-mode';
import { notifyRooferAfterAnalyze } from '../../../src/providers/detection-provider';
import { cache } from '../../../src/utilities/cache';

const apiKey = 'api-key-mock';
const uploadUrl = 'https://s3.mock.bpartners.test/attachments/report.pdf?X-Amz-Signature=mock';
const fileKey = 'attachment-file-key-mock';
const attachmentUploadsPath = `/accountHolders/${account_holder_mock.id}/prospects/${prospect_mock.id}/notifications/attachmentUploads`;
// the key of the uploaded file travels in the query string, so the route has to accept one
const notificationsPath = `/accountHolders/${account_holder_mock.id}/prospects/${prospect_mock.id}/notifications*`;

const pdf = () => new File(['%PDF-1.4 mock report'], 'report.pdf', { type: 'application/pdf' });

/** Turns the outcome into a string, so a rejection can be asserted on instead of failing the test. */
const settle = (call: Promise<unknown>) =>
  call.then(
    () => 'resolved',
    (error: Error) => error.message
  );

/** The provider reads the apiKey from the page url and the user ids from the cache, exactly like the app does. */
const signIn = (key = apiKey) => {
  window.history.replaceState(null, '', `?apiKey=${key}`);
  cache.userInfo(whoami_mock.user.id, account_mock.id, account_holder_mock.id);
};

describe('Roofer notification attachment upload', () => {
  beforeEach(() => {
    signIn();
    cy.intercept('GET', `/users/${whoami_mock.user.id}/legalFiles`, []).as('getLegalFiles');
  });

  it('uploads the pdf to the presigned url, then notifies the roofer with the file key', () => {
    cy.intercept('POST', attachmentUploadsPath, { body: { fileKey, uploadUrl } }).as('createAttachmentUpload');
    cy.intercept('PUT', uploadUrl, { statusCode: 200 }).as('putAttachment');
    cy.intercept('POST', notificationsPath, { body: prospect_mock }).as('notifyProspects');

    const file = pdf();
    cy.then(() => notifyRooferAfterAnalyze(prospect_mock.id, file)).should('deep.include', { id: prospect_mock.id });

    // the upload is announced with the real size of the file
    cy.wait('@createAttachmentUpload').its('request.body').should('deep.equal', { fileSize: file.size });
    // the file itself goes straight to storage, as the raw pdf
    cy.wait('@putAttachment').then(({ request }) => {
      expect(request.method).to.eq('PUT');
      expect(request.body).to.have.length(file.size);
    });
    // the notification only carries the key of what was uploaded
    cy.wait('@notifyProspects').then(({ request }) => {
      expect(new URL(request.url).searchParams.get('attachmentFileKey')).to.eq(fileKey);
      // and no file is sent inline anymore
      expect(request.headers['content-type'] ?? '').not.to.contain('application/pdf');
    });
  });

  it('does not notify the roofer when the upload to the presigned url fails', () => {
    cy.intercept('POST', attachmentUploadsPath, { body: { fileKey, uploadUrl } }).as('createAttachmentUpload');
    cy.intercept('PUT', uploadUrl, { statusCode: 403 }).as('putAttachment');
    cy.intercept('POST', notificationsPath, cy.spy().as('notifySpy')).as('notifyProspects');

    cy.then(() => settle(notifyRooferAfterAnalyze(prospect_mock.id, pdf()))).should('eq', "Échec de l'upload de la pièce jointe (403)");

    cy.wait('@putAttachment');
    cy.get('@notifySpy').should('not.have.been.called');
  });

  it('does not upload anything when the upload url cannot be created', () => {
    cy.intercept('POST', attachmentUploadsPath, { statusCode: 500, body: { message: 'Internal Server Error' } }).as('createAttachmentUpload');
    cy.intercept('PUT', uploadUrl, cy.spy().as('putSpy')).as('putAttachment');
    cy.intercept('POST', notificationsPath, cy.spy().as('notifySpy')).as('notifyProspects');

    cy.then(() => settle(notifyRooferAfterAnalyze(prospect_mock.id, pdf()))).should('match', /status code 500/);

    cy.wait('@createAttachmentUpload');
    cy.get('@putSpy').should('not.have.been.called');
    cy.get('@notifySpy').should('not.have.been.called');
  });

  it('skips the storage upload in demo mode, where the upload url is a placeholder', () => {
    signIn(DEMO_API_KEY);
    cy.intercept('PUT', '**', cy.spy().as('putSpy'));

    cy.then(() => settle(notifyRooferAfterAnalyze(prospect_mock.id, pdf()))).should('eq', 'resolved');

    cy.get('@putSpy').should('not.have.been.called');
  });
});
