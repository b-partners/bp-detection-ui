import { useDialog } from '@/hooks';
import { ParamsUtilities } from '@/utilities';
import { Button, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';

export const CheckApiKeyDialog = () => {
  const [apiKey, setApiKey] = useState('');
  const { close } = useDialog();

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => setApiKey(event?.target.value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    ParamsUtilities.setQueryParams('apiKey', apiKey);
    close();
  };

  return (
    <>
      <DialogTitle>Clé d'API invalide</DialogTitle>
      <DialogContent>
        <Typography my={2}>Votre clé d'API est invalide. Veuillez specifier une clé valide</Typography>
        <Stack component='form' gap={1} onSubmit={handleSubmit}>
          <TextField data-cy='api-key-input' label="Clé d'api" value={apiKey} onChange={handleChange} required />
          <Button type='submit'>Valider</Button>
        </Stack>
      </DialogContent>
    </>
  );
};
