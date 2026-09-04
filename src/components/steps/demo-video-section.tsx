import { Box, Stack, Typography } from '@mui/material';
import ReactPlayer from 'react-player';
import { DemoVideoStyle as style } from './styles';

const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=B2qkOKyKkp0';

export const DemoVideoSection = () => {
  return (
    <Stack sx={style}>
      <Stack className='section-header'>
        <Typography className='section-eyebrow'>Démonstration</Typography>
        <Typography className='section-title' component='h2'>
          Voyez BIRDIA <span className='accent'>en action</span>
        </Typography>
        <Typography className='section-subtitle'>Une adresse, une image satellite, un diagnostic complet — découvrez le parcours en vidéo.</Typography>
      </Stack>

      <Box className='demo-card'>
        <Stack direction='row' className='demo-topbar'>
          <Box className='demo-badge'>
            <Box className='dot' />
            <span>Démo</span>
          </Box>
          <Typography className='demo-topbar-title'>Comment ça marche · Analyse de votre toiture en 4 étapes</Typography>
        </Stack>

        <Box className='demo-player'>
          <ReactPlayer src={DEMO_VIDEO_URL} width='100%' height='100%' controls playing={false} light />
        </Box>
      </Box>
    </Stack>
  );
};
