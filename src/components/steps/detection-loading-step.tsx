import { useStep } from '@/hooks';
import { useQueryDetectionResult } from '@/queries';
import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

export const DetectionLoadingStep = () => {
  const { data } = useQueryDetectionResult();

  const setStep = useStep(({ setStep }) => setStep);

  useEffect(() => {
    console.log(data);
    
    if (data) {
      setStep({ actualStep: 3, params: { geoJsonResultUrl: data.geoJsonUrl } });
    }
  }, [data, setStep]);

  return (
    <Stack className='progress-bar-detection'>
      <Paper>
        <Typography>L'analyse de la toiture en cours</Typography>
        <Typography>Cela peut prendre un peu de temps. Veuillez ne pas fermer l'onglet suivant.</Typography>
      </Paper>
      <LinearProgress />
    </Stack>
  );
};
