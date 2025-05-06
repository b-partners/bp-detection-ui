import { useStep } from '@/hooks';
import { useGeojsonQueryResult } from '@/queries';
import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

export const DetectionLoadingStep = () => {
  const { data } = useGeojsonQueryResult();

  const setStep = useStep(({ setStep }) => setStep);

  useEffect(() => {
    if (data) {
      setStep({ actualStep: 3, params: {} });
    }
  }, [data, setStep]);

  return (
    <Stack className='progress-bar-detection'>
      <Paper>
        <Typography>Analyse de la toiture en cours.</Typography>
        <Typography>Cela peut prendre un peu de temps. Veuillez ne pas fermer l'onglet.</Typography>
      </Paper>
      <LinearProgress />
    </Stack>
  );
};
