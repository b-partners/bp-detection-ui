import { useStep } from '@/hooks';
import { useQueryDetectionResult } from '@/queries';
import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

export const DetectionLoadingStep = () => {
  const { data } = useQueryDetectionResult();

  const setStep = useStep(({ setStep }) => setStep);

  useEffect(() => {
    if (data) {
      setStep({ actualStep: 3, params: { geoJsonResultUrl: data.vggUrl } });
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
