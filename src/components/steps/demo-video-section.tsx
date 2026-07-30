import { Box, Stack } from '@mui/material';
import ReactPlayer from 'react-player';
import { DemoVideoStyle as style } from './styles';

const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=B2qkOKyKkp0';

export const DemoVideoSection = () => {
  return (
    <Stack sx={style}>
      <Box className='demo-player'>
        <ReactPlayer src={DEMO_VIDEO_URL} width='100%' height='100%' controls />
      </Box>
    </Stack>
  );
};
