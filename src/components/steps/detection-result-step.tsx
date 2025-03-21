import { useStep } from '@/hooks';
import { AnnotatorCanvas } from '@bpartners/annotator-component';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { DetectionResultStepStyle as style } from './styles';

export const DetectionResultStep = () => {
  const { imageSrc } = useStep(({ params }) => params);
  return (
    <Box sx={style}>
      <Box>{imageSrc && <AnnotatorCanvas width='100%' height='500px' image={imageSrc} setPolygons={() => {}} polygonList={[]} zoom={20} />}</Box>
      <Stack className='text-result'>
        <Typography variant='h4' mb={2}>
          Résultats de l'analyse :
        </Typography>
        <Paper>
          <Typography>Surface total : </Typography>
          <Typography variant='h5'>145m²</Typography>
        </Paper>
        <Paper>
          <Typography>Revêtement 1: </Typography>
          <Typography variant='h6'>Ardoise</Typography>
        </Paper>
        <Paper>
          <Typography>Revêtement 1: </Typography>
          <Typography variant='h6'>Asphalte</Typography>
        </Paper>
        <Paper>
          <Typography>Taux d'usures :</Typography>
          <Typography variant='h5'>10%</Typography>
        </Paper>
        <Paper>
          <Typography>Taux de moisissures :</Typography>
          <Typography variant='h5'>10%</Typography>
        </Paper>
        <Paper>
          <Typography>Taux d'humidité : </Typography>
          <Typography variant='h5'>10%</Typography>
        </Paper>
        <Paper>
          <Typography>Taux de mutation : </Typography>
          <Typography variant='h6'>Dégradation</Typography>
        </Paper>
        <Paper>
          <Typography>Obstacle / Velux : </Typography>
          <Typography variant='h6'>Oui</Typography>
        </Paper>
      </Stack>
    </Box>
  );
};
