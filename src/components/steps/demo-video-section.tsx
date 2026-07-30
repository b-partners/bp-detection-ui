import { Box, Stack, Typography } from '@mui/material';
import ReactPlayer from 'react-player';
import { DemoVideoStyle as style } from './styles';

const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=B2qkOKyKkp0';

const steps = ['Saisissez votre adresse', 'Délimitez votre toiture', 'Lancez le diagnostic', 'Un couvreur vous rappelle'];
const activeStep = 2;

export const DemoVideoSection = () => {
  return (
    <Stack sx={style}>
      <Box className='demo-card'>
        <Stack direction='row' className='demo-topbar'>
          <Box className='demo-badge'>
            <Box className='dot' />
            <span>Démo en direct</span>
          </Box>
          <Typography className='demo-topbar-title'>Comment ça marche · Analyse de votre toiture en 4 étapes</Typography>
        </Stack>

        <Stack className='demo-body'>
          <Box className='demo-player'>
            <ReactPlayer src={DEMO_VIDEO_URL} width='100%' height='100%' controls />
          </Box>

          <Stack className='demo-caption'>
            <Typography className='demo-eyebrow'>Étape {activeStep + 1}</Typography>
            <Typography className='demo-title' component='h3'>
              Lancez le diagnostic de votre toiture
            </Typography>
            <Typography className='demo-desc'>
              Notre IA analyse votre toit : surface, pente, matériaux, taux d'usure, moisissure, humidité, fissures et obstacles.
            </Typography>
          </Stack>
        </Stack>

        <Stack direction='row' className='demo-progress'>
          {steps.map((label, index) => (
            <Box key={label} className={`demo-progress-segment ${index <= activeStep ? 'is-active' : ''}`} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};
