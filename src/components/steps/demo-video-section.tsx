import { Box, Stack, Typography } from '@mui/material';
import ReactPlayer from 'react-player';
import { DemoVideoStyle as style } from './styles';

const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=B2qkOKyKkp0';

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

        <Box className='demo-player'>
          <ReactPlayer src={DEMO_VIDEO_URL} width='100%' height='100%' controls />
        </Box>
      </Box>
    </Stack>
  );
};
