import { useDetectionForm } from '@/forms';
import { useDialog, useStep } from '@/hooks';
import { useQueryImageFromAddress } from '@/queries';
import { wait } from '@/utilities';
import { Info } from '@mui/icons-material';
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import { stagger, useAnimate } from 'motion/react';
import { FC, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { BpInput } from './bp-input';
import { EarthSatellites, LoadingSteps, ScreenShotAnimation } from './loading';

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

  const [scope, animate] = useAnimate();
  const [satellites, setSatellites] = useState({ show: false, end: false, screnShot: false });

  useEffect(() => {
    if (imageSrc && areaPictureDetails && prospect) {
      setStep({ actualStep: 1, params: { imageSrc, areaPictureDetails, prospect } });
    }
  }, [imageSrc, areaPictureDetails, setStep, prospect]);

  const handleSubmit = form.handleSubmit(async data => {
    const { email, phone, firstName, lastName } = data;
    queryImage({ address, email, firstName, lastName, phone });
    await animate('.input-anime', { transform: 'translateX(100%)', opacity: 0, display: 'none' }, { duration: 0.5, delay: stagger(0.2, { from: 'last' }) });
    setSatellites({ end: false, show: true, screnShot: false });
    await wait(12000);
    setSatellites({ end: true, show: true, screnShot: false });
    await wait(1000);
    setSatellites({ end: false, show: false, screnShot: true });
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
        {Object.values(satellites).includes(true) && <LoadingSteps />}
        <Stack ref={scope} component='form' position='relative' minWidth='600px' minHeight='400px' p={2} onSubmit={handleSubmit}>
          {satellites.screnShot && (
            <Box sx={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden' }}>
              <ScreenShotAnimation />
            </Box>
          )}
          {satellites.show && <EarthSatellites endAnimation={satellites.end} />}
          <BpInput className='input-anime' type='text' name='lastName' label='Nom' />
          <BpInput className='input-anime' type='text' name='firstName' label='Prénoms' />
          <BpInput className='input-anime' title='Le numéro de téléphone est obligatoire' type='tel' name='phone' label='Numéro de téléphone' required />
          <BpInput
            className='input-anime'
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
