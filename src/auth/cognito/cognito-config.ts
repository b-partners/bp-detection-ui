/**
 * The b-partners platform authenticates real users via AWS Cognito (see bpartners-web's
 * src/providers/aws-config.ts) — there is no email/password endpoint on the
 * @bpartners/typescript-client SDK itself. This env-driven flag lets the "log in instead
 * of pasting an API key" option on the api-key page stay dark until these are configured,
 * so the feature is safely pluggable rather than always-on with broken credentials.
 */
export const COGNITO_ENV = {
  userPoolId: process.env.REACT_APP_USERPOOL_ID,
  webClientId: process.env.REACT_APP_WEBCLIENT_ID,
};

export const isCognitoConfigured = () => Boolean(COGNITO_ENV.userPoolId && COGNITO_ENV.webClientId);
