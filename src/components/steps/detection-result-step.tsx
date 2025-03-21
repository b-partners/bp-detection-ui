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
        <Paper className='deep-space'>
          <Typography>Surface total : </Typography>
          <Typography variant='h5'>145m²</Typography>
        </Paper>
        <Paper className='ocean-breeze'>
          <Typography>Revêtement : </Typography>
          <Typography variant='h6'>Ardoise</Typography>
        </Paper>
        <Paper className='ocean-breeze'>
          <Typography >Revêtement : </Typography>
          <Typography variant='h6'>Asphalte</Typography>
        </Paper>
        <Paper className='deep-space'>
          <Typography>Taux d'humidité : </Typography>
          <Typography variant='h5'>10%</Typography>
        </Paper>
        <Paper className='ocean-breeze'>
          <Typography>Taux de mutation : </Typography>
          <Typography variant='h6'>Dégradation</Typography>
        </Paper>
        <Paper className='ocean-breeze'>
          <Typography>Obstacle : </Typography>
          <Typography variant='h6'>Velux</Typography>
        </Paper>
        <Paper className='deep-space'>
          <Typography>Taux de moisissures :</Typography>
          <Typography variant='h5'>10%</Typography>
        </Paper>
        <Paper className='deep-space'>
          <Typography>Taux d'usures :</Typography>
          <Typography variant='h5'>10%</Typography>
        </Paper>
      </Stack>
    </Box>
  );
};
