import { fetchAuthSession, signIn } from '@aws-amplify/auth';
import { Configuration, SecurityApi } from '@bpartners/typescript-client';
import { Amplify } from 'aws-amplify';
import { COGNITO_ENV, isCognitoConfigured } from './cognito-config';

/** Cognito accepted the credentials but requires a new password before sign-in can complete. */
export class CognitoTemporaryPasswordError extends Error {}

let configured = false;
const ensureConfigured = () => {
  if (configured || !isCognitoConfigured()) return;
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: COGNITO_ENV.userPoolId as string,
        userPoolClientId: COGNITO_ENV.webClientId as string,
      },
    },
  });
  configured = true;
};

/**
 * Signs in with a Cognito email/password, then exchanges the resulting session for the
 * user's real bpartners API key (via SecurityApi.findApiKey) — the same two-step flow
 * bpartners-web uses (see its src/providers/auth-provider.ts `whoami` + `getApiKey`).
 */
export const signInWithCognito = async (username: string, password: string): Promise<string> => {
  ensureConfigured();

  const result = await signIn({ username, password });

  if (result.nextStep.signInStep !== 'DONE') {
    throw new CognitoTemporaryPasswordError('temporaryPassword');
  }

  const session = await fetchAuthSession();
  const accessToken = session.tokens?.idToken?.toString();
  if (!accessToken) throw new Error('noSession');

  const conf = new Configuration();
  conf.accessToken = accessToken;
  conf.baseOptions = { headers: { Authorization: `Bearer ${accessToken}` } };

  const { data } = await new SecurityApi(conf).findApiKey();
  const apiKey = data?.[0]?.apiKey;
  if (!apiKey) throw new Error('noApiKey');

  return apiKey;
};
