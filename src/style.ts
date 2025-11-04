import { SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { PALETTE_COLORS } from './utilities';

export const MainStyle: SxProps = {
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  minHeight: '100vh',
  '& .info-section': {
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
    px: 2,
    mb: 2,
    py: 2,
    bgcolor: grey[300],
    justifyContent: 'space-between',
  },
  '& .MuiStepper-root': {
    mb: 4,
  },
  '& #annotator-section': {
    width: {
      xs: '90vw',
      md: '80vw',
      lg: '70vw',
    },
    height: '600px',
    mb: 20,
    position: 'relative',
    '& > .MuiButton-root': {
      my: 2,
    },
    '& .help-button': {
      animation: 'ping 1s linear infinite',
      '@keyframes ping': {
        '0%': {
          transform: 'scale(1)',
          opacity: 1,
        },
        '50%': {
          transform: 'scale(1.2)',
          opacity: 0.8,
        },
        '100%': {
          transform: 'scale(1)',
          opacity: 1,
        },
      },
    },
    '& .image-info-mobile': {
      background: PALETTE_COLORS.pine,
      borderRadius: 2,
      width: '100%',
      py: 1,
      display: 'flex',
      justifyContent: 'center',
      '& .MuiTypography-root': {
        color: '#fff',
        mx: 1,
      },
    },
    '& .address-info-mobile': {
      background: PALETTE_COLORS.neon_orange,
      borderRadius: 2,
      width: '100%',
      py: 1,
      display: 'flex',
      justifyContent: 'center',
      '& .MuiTypography-root': {
        color: '#fff',
        mx: 1,
      },
    },
    '& .annotator-action-button-container': {
      flexDirection: { xs: 'column', md: 'row' },
      width: { xs: '100%', md: 'auto' },
      '& .MuiButton-root': {
        width: { xs: '100%', md: 'auto' },
      },
      pl: { xs: 0, md: 2 },
    },
  },
  '& > .img-container > img': {
    transition: 'all 200ms linear',
    margin: 2,
  },
  '& > .img-container.img-full': {
    alignSelf: 'center',
  },
  '& > .img-container.img-min': {
    alignSelf: 'flex-start',
  },
  '& > .img-container.img-full > img': {
    objectFit: 'contain',
    width: {
      xs: '70vw',
      md: '50vw',
      lg: '35vw',
    },
    mt: 10,
    alignSelf: 'center',
  },
  '& > .img-container.img-min > img': {
    objectFit: 'contain',
    width: '10rem',
    mt: 2,
    alignSelf: 'flex-start',
  },
  '& .progress-bar-detection': {
    width: {
      xs: '90vw',
      md: '80vw',
      lg: '70vw',
    },
    py: 10,
    '& .MuiPaper-root:first-child': {
      height: 60,
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      mb: 2,
      bgcolor: grey[300],
      justifyContent: 'center',
      gap: 1,
    },
  },
};
