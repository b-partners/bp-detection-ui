import { useDetectionForm } from '@/forms';
import { useDialog, useStep } from '@/hooks';
import { useQueryImageFromAddress } from '@/queries';
import { Info } from '@mui/icons-material';
import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { BpInput } from './bp-input';

export interface DetectionFormInfo {
  email: string;
  lastName?: string;
  firstName?: string;
  phone: string;
}

interface DetectionFormProps {
  address: string;
}

export const DetectionForm: FC<DetectionFormProps> = ({ address }) => {
  const { isQueryImagePending, queryImage, imageSrc, areaPictureDetails, prospect } = useQueryImageFromAddress();
  const { close: closeDialog } = useDialog();
  const { setStep } = useStep();
  const form = useDetectionForm();

  useEffect(() => {
    if (imageSrc && areaPictureDetails && prospect) {
      setStep({ actualStep: 1, params: { imageSrc, areaPictureDetails, prospect } });
    }
  }, [imageSrc, areaPictureDetails, setStep, prospect]);

  const handleSubmit = form.handleSubmit(data => {
    const { email, phone, firstName, lastName } = data;
    queryImage({ address, email, firstName, lastName, phone });
  });

  return (
    <FormProvider {...form}>
      <DialogTitle>
        <Stack width='100%'>
          <Stack width='100%' direction='row' justifyContent='space-between'>
            <Typography>Veuillez saisir les informations suivantes.</Typography>
            <Tooltip title="Seuls le numéro de téléphone et l'adresse email sont obligatoires afin que vous puissiez recevoir les résultats de l'analyse de votre toiture.">
              <Info />
            </Tooltip>
          </Stack>
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
        <Button disabled={isQueryImagePending} onClick={closeDialog}>
          Annuler
        </Button>
        <Button
          disabled={isQueryImagePending}
          startIcon={isQueryImagePending && <CircularProgress size={25} />}
          onClick={handleSubmit}
          data-cy='process-detection-on-form-button'
        >
          Continuer
        </Button>
      </DialogActions>
    </FormProvider>
  );
};
