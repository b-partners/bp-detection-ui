import { LegalFilesPdfRenderer } from '@/components';
import { useDialog } from '@/hooks';
import { useValidateApiKey } from '@/queries';
import { Button, Card, CardContent, CardHeader, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react';

export const ApiKeyPage = () => {
  const [apiKey, setApiKey] = useState('');
  const { isValidating, validate, validationError } = useValidateApiKey();
  const { open } = useDialog();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => setApiKey(event?.target.value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    validate(apiKey ?? '');
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
      <CardHeader title="Veuillez specifier votre clé d'api" />
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
