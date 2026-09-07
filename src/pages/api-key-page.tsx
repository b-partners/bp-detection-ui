import { CognitoTemporaryPasswordError, isCognitoConfigured, signInWithCognito } from '@/auth/cognito';
import { LegalFilesPdfRenderer } from '@/components';
import { useDialog } from '@/hooks';
import { useValidateApiKey } from '@/queries';
import { Button, Card, CardContent, CardHeader, Link, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react';

export const ApiKeyPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [mode, setMode] = useState<'apiKey' | 'login'>('apiKey');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { isValidating, validate, validationError } = useValidateApiKey();
  const { open } = useDialog();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => setApiKey(event?.target.value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    validate(apiKey ?? '');
  };

  const handleLoginSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const foundApiKey = await signInWithCognito(credentials.email, credentials.password);
      validate(foundApiKey);
    } catch (error) {
      setLoginError(
        error instanceof CognitoTemporaryPasswordError
          ? 'Un changement de mot de passe est requis ; connectez-vous une première fois sur le tableau de bord bpartners.'
          : 'Identifiants invalides.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (validationError?.message?.includes('legalFileNotApproved')) {
      open(<LegalFilesPdfRenderer />, { closeOnBlur: false });
    }
  }, [validationError]);

  return (
    <Card
      elevation={isMdUp ? 1 : 0}
      sx={{ width: { xs: '100vw', md: '70vw', lg: '40vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }}
    >
      <CardHeader title={mode === 'apiKey' ? "Veuillez specifier votre clé d'api" : 'Connectez-vous avec votre compte bpartners'} />
      <CardContent>
        {mode === 'apiKey' ? (
          <Stack component='form' gap={1} onSubmit={handleSubmit}>
            <TextField
              helperText={validationError && !isValidating && 'Veuillez specifier une clé valide'}
              data-cy='api-key-input'
              label="Clé d'api"
              value={apiKey}
              onChange={handleChange}
              required
            />
            <Button type='submit' loading={isValidating} disabled={isValidating}>
              Valider
            </Button>
          </Stack>
        ) : (
          <Stack component='form' gap={1} onSubmit={handleLoginSubmit}>
            <TextField
              helperText={loginError}
              error={!!loginError}
              data-cy='login-email-input'
              label='Email'
              type='email'
              value={credentials.email}
              onChange={e => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <TextField
              data-cy='login-password-input'
              label='Mot de passe'
              type='password'
              value={credentials.password}
              onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            <Button type='submit' loading={isLoggingIn || isValidating} disabled={isLoggingIn || isValidating}>
              Se connecter
            </Button>
          </Stack>
        )}

        {isCognitoConfigured() && (
          <Link component='button' type='button' underline='hover' sx={{ mt: 2 }} onClick={() => setMode(m => (m === 'apiKey' ? 'login' : 'apiKey'))}>
            {mode === 'apiKey' ? 'Se connecter avec email et mot de passe' : "Utiliser une clé d'api à la place"}
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
