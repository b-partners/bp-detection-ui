import { useDetectionForm } from '@/forms';
import { useDialog } from '@/hooks';
import { Info } from '@mui/icons-material';
import { Alert, Button, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { BpInput } from './bp-input';

export interface DetectionFormInfo {
  email: string;
  lastName?: string;
  firstName?: string;
  phone: string;
}

interface DetectionFormProps {
  onValid(detectionFrom: DetectionFormInfo): void;
  withoutImage?: boolean;
}

export const DetectionForm: FC<DetectionFormProps> = ({ onValid, withoutImage = false }) => {
  const { close: closeDialog } = useDialog();
  const form = useDetectionForm();

  const handleSubmit = form.handleSubmit(data => onValid(data));

  return (
    <FormProvider {...form}>
      <DialogTitle>
        <Stack width="100%">
          <Stack width="100%" direction='row' justifyContent='space-between'>
            <Typography>Veuillez saisir les informations suivantes.</Typography>
            <Tooltip title="Seuls le numéro de téléphone et l'adresse email sont obligatoires afin que vous puissiez recevoir les résultats de l'analyse de votre toiture.">
              <Info />
            </Tooltip>
          </Stack>
          {withoutImage && (
            <Alert icon={false} color='info'>
              La toiture que vous avez sélectionnée est assez grande, la détection sur cette zone prendra un peu plus de temps.
            </Alert>
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack component='form' onSubmit={handleSubmit}>
          <BpInput type='text' name='lastName' label='Nom' />
          <BpInput type='text' name='firstName' label='Prénoms' />
          <BpInput title='Le numéro de téléphone est obligatoire' type='tel' name='phone' label='Numéro de téléphone' required />
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
        <Button onClick={handleSubmit} data-cy='process-detection-on-form-button'>
          Analyser
        </Button>
      </DialogActions>
    </FormProvider>
  );
};
