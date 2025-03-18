import { Divider, Paper, Stack, Typography } from '@mui/material';

export const DetectionResultStep = () => {
  return (
    <Stack sx={{ mb: 10 }}>
      <Divider sx={{ my: 10 }} />
      <Typography variant='h4' mb={2}>
        Résultats de l'analyse :{' '}
      </Typography>
      <Paper>
        <Typography>Humidité : </Typography>
        <Typography variant='h5'>10%</Typography>
      </Paper>
      <Paper>
        <Typography>Moisissures :</Typography>
        <Typography variant='h5'>10%</Typography>
      </Paper>
      <Paper>
        <Typography>Usures :</Typography>
        <Typography variant='h5'>10%</Typography>
      </Paper>
    </Stack>
  );
};
