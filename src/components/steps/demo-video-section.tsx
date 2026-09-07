import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Box, Stack, Typography } from '@mui/material';
import ReactPlayer from 'react-player';
import { DemoVideoStyle as style } from './styles';

const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=B2qkOKyKkp0';
const DEMO_VIDEO_POSTER = '/assets/images/landing/video-poster.jpg';

export const DemoVideoSection = () => {
  return (
    <Stack sx={style}>
      <Stack className='section-header'>
        <Typography className='section-title' component='h2'>
          Voir la démo en <span className='accent'>30 secondes</span>
        </Typography>
        <Typography className='section-subtitle'>Découvrez le rapport type que reçoivent nos utilisateurs.</Typography>
      </Stack>

      <Box className='demo-card'>
        <Box className='demo-player'>
          <ReactPlayer
            src={DEMO_VIDEO_URL}
            width='100%'
            height='100%'
            controls
            playing={false}
            light={DEMO_VIDEO_POSTER}
            playIcon={
              <Box className='demo-play-icon'>
                <PlayArrowRoundedIcon fontSize='inherit' />
              </Box>
            }
          />
        </Box>
        <Box className='demo-duration-badge'>Démo · 30 s</Box>
      </Box>
    </Stack>
  );
};
