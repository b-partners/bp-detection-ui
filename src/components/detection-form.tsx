import { useDetectionForm } from '@/forms';
import { useDialog } from '@/hooks';
import { Info } from '@mui/icons-material';
import { Button, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { BpInput } from './bp-input';

interface DetectionFormProps {
  onValid(receiverEmail: string): void;
}

export const DetectionForm: FC<DetectionFormProps> = ({ onValid }) => {
  const { close: closeDialog } = useDialog();
  const form = useDetectionForm();

  const handleSubmit = form.handleSubmit(({ email }) => onValid(email));

  return (
    <FormProvider {...form}>
      <DialogTitle>
        <Typography>Veuillez saisir les informations suivantes.</Typography>
        <Tooltip title="Seule l'adresse email est obligatoire afin que vous puissiez recevoir les résultats de l'analyse de votre toiture.">
          <Info />
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <Stack component='form' onSubmit={handleSubmit}>
          <BpInput type='text' name='lastName' label='Nom' />
          <BpInput type='text' name='firstName' label='Prénoms' />
          <BpInput type='tel' name='phone' label='Numéro de téléphone' />
          <BpInput
            title="L'adresse e-mail est obligatoire afin que vous puissiez recevoir les résultats par courrier électronique."
            type='email'
            name='email'
            label='Adresse Email'
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Annuler</Button>
        <Button onClick={handleSubmit}>Analyser</Button>
      </DialogActions>
    </FormProvider>
  );
};
