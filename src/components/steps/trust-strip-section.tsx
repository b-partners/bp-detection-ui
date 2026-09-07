import { Box, Typography } from '@mui/material';

export const TrustStripSection = () => {
  return (
    <Box className='landing-trust'>
      <Box className='trust-strip'>
        <Box className='trust-cell'>
          <Typography className='trust-val' component='div'>
            <span>&lt;</span>2 min
          </Typography>
          <Typography className='trust-label'>Pour votre pré-diagnostic</Typography>
        </Box>
        <Box className='trust-cell'>
          <Typography className='trust-val' component='div'>
            5<span>cm/px</span>
          </Typography>
          <Typography className='trust-label'>Précision image satellite</Typography>
        </Box>
        <Box className='trust-cell'>
          <Typography className='trust-val' component='div'>
            48h<span>⏱</span>
          </Typography>
          <Typography className='trust-label'>Recontact par votre couvreur</Typography>
        </Box>
        <Box className='trust-cell'>
          <Typography className='trust-val' component='div'>
            100<span>%</span>
          </Typography>
          <Typography className='trust-label'>Gratuit · Sans engagement</Typography>
        </Box>
      </Box>
    </Box>
  );
};
