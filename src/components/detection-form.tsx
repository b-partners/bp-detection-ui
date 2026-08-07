import { useDetectionForm } from '@/forms';
import { useDialog, useStep } from '@/hooks';
import { useAccountInfoStore, useQueryImageFromAddress } from '@/queries';
import { wait } from '@/utilities';
import { ArrowBack, Info } from '@mui/icons-material';
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import { stagger, useAnimate } from 'motion/react';
import { FC, ReactNode, useEffect, useState } from 'react';
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
  comment?: string;
  onBack?: () => void;
}

export const DetectionForm: FC<DetectionFormProps> = ({ address, comment, onBack }) => {
  const { isQueryImagePending, queryImage, imageSrc, areaPictureDetails, prospect } = useQueryImageFromAddress();
  const { close: closeDialog } = useDialog();
  const { setStep } = useStep();
  const { name } = useAccountInfoStore();
  const form = useDetectionForm();

  const partnerName = name || 'votre couvreur';

  const [scope, animate] = useAnimate();
  const [satellites, setSatellites] = useState({ show: false, end: false, screnShot: false });

  useEffect(() => {
    if (imageSrc && areaPictureDetails && prospect) {
      setStep({ actualStep: 1, params: { imageSrc, areaPictureDetails, prospect } });
    }
  }, [imageSrc, areaPictureDetails, setStep, prospect]);

  const handleSubmit = form.handleSubmit(async data => {
    const { email, phone, firstName, lastName } = data;
    queryImage({ address, email, firstName, lastName, phone, comment });
    await animate('.input-anime', { transform: 'translateX(100%)', opacity: 0, display: 'none' }, { duration: 0.5, delay: stagger(0.2, { from: 'last' }) });
    setSatellites({ end: false, show: true, screnShot: false });
    await wait(12000);
    setSatellites({ end: true, show: true, screnShot: false });
    await wait(1000);
    setSatellites({ end: false, show: false, screnShot: true });
  });

  const field = (label: ReactNode, input: ReactNode) => (
    <Box className='bp-field'>
      <Typography className='bp-field-label'>{label}</Typography>
      {input}
    </Box>
  );

  return (
    <FormProvider {...form}>
      <DialogTitle>
        <Stack width='100%' direction='row' justifyContent='space-between' alignItems='flex-start' gap={2}>
          <Stack>
            <Typography className='dialog-eyebrow'>Presque terminé</Typography>
            <Typography className='dialog-title'>Vos coordonnées pour recevoir le rapport</Typography>
            <Typography className='dialog-subtitle'>{partnerName} vous rappelle sous 24 h avec votre pré-diagnostic complet.</Typography>
          </Stack>
          <Tooltip title="Seuls le numéro de téléphone et l'adresse email sont obligatoires afin que vous puissiez recevoir les résultats de l'analyse de votre toiture.">
            <Box className='dialog-info'>
              <Info />
            </Box>
          </Tooltip>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {Object.values(satellites).includes(true) && <LoadingSteps />}
        <Stack ref={scope} component='form' spacing={2.5} position='relative' minWidth='600px' minHeight='400px' p={2} onSubmit={handleSubmit}>
          {satellites.screnShot && (
            <Box sx={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden' }}>
              <ScreenShotAnimation />
            </Box>
          )}
          {satellites.show && <EarthSatellites endAnimation={satellites.end} />}
          <Box className='input-anime bp-field-row'>
            {field('Prénom', <BpInput type='text' name='firstName' placeholder='Marie' fullWidth />)}
            {field('Nom', <BpInput type='text' name='lastName' placeholder='Dupont' fullWidth />)}
          </Box>
          <Box className='input-anime'>
            {field(
              'Email',
              <BpInput
                title="L'adresse e-mail est obligatoire afin que vous puissiez recevoir les résultats par courrier électronique."
                type='email'
                name='email'
                placeholder='marie.dupont@exemple.fr'
                fullWidth
                required
              />
            )}
          </Box>
          <Box className='input-anime'>
            {field(
              'Téléphone',
              <BpInput title='Le numéro de téléphone est obligatoire' type='tel' name='phone' placeholder='06 12 34 56 78' fullWidth required />
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ArrowBack />} disabled={isQueryImagePending} onClick={onBack ?? closeDialog}>
          Retour
        </Button>
        <Button
          variant='contained'
          disabled={isQueryImagePending}
          startIcon={isQueryImagePending && <CircularProgress size={25} />}
          onClick={handleSubmit}
          data-cy='process-detection-on-form-button'
        >
          Envoyer
        </Button>
      </DialogActions>
    </FormProvider>
  );
};
