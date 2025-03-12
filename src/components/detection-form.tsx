import { useDetectionForm } from '@/forms';
import { useDialog } from '@/hooks';
import { Info } from '@mui/icons-material';
import { Button, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { BpInput } from './bp-input';

export const DetectionForm = () => {
  const { close: closeDialog } = useDialog();
  const form = useDetectionForm();

  const handleSubmit = form.handleSubmit(() => {});

  return (
    <FormProvider {...form}>
      <DialogTitle>
        <Typography>Veuillez renseigner les informations suivantes</Typography>
        <Tooltip title="Seule l'adresse email est obligatoire pour que vous puissiez recevoir les résulta de l'analyse de votre toiture.">
          <Info />
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <Stack component='form' onSubmit={handleSubmit}>
          <BpInput type='text' name='lastName' label='Nom' />
          <BpInput type='text' name='firstName' label='Prénoms' />
          <BpInput type='tel' name='phone' label='Numéro de téléphone' />
          <BpInput
            title="L'adresse est obligatoire pour que vous puissiez recevoir les résultats par email"
            type='email'
            name='email'
            label='Adresse Email'
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Annuler</Button>
        <Button>Valider</Button>
      </DialogActions>
    </FormProvider>
  );
};
