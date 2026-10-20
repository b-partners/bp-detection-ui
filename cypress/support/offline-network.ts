import { refuseUnmockedRequests, thirdPartyInterceptions } from '../e2e/offline/utilities';

/** The offline specs never reach a real backend: every request they make has to be mocked. */
const isOfflineSpec = () => Cypress.spec.relative.includes('e2e/offline/');

let unmocked: string[] = [];

// Root hooks: they run before each spec's own beforeEach, so the refusal stays the last resort behind every mock.
beforeEach(() => {
  if (!isOfflineSpec()) return;
  unmocked = refuseUnmockedRequests();
  thirdPartyInterceptions();
});

afterEach(() => {
  if (!isOfflineSpec()) return;
  cy.then(() => expect(unmocked, `unmocked requests: ${unmocked.join(', ')}`).to.have.length(0));
});
