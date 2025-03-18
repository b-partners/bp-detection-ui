import { SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';

export const MainStyle: SxProps = {
  padding: 0,
  margin: 0,
  minHeight: '100vh',
  flexDirection: 'column',
  alignItems: 'center',
  '& #annotator-section': {
    width: {
      xs: '90vw',
      md: '70vw',
      lg: '50vw',
    },
    height: '600px',
    mb: 20,
    position: 'relative',
    '& > .MuiButton-root': {
      my: 2,
    },
    '& .MuiPaper-root': {
      height: 60,
      display: 'flex',
      alignItems: 'center',
      px: 2,
      mb: 2,
      bgcolor: grey[300],
      justifyContent: 'space-between',
    },
  },
  '& .location-input': {
    width: {
      xs: '90vw',
      md: '70vw',
      lg: '50vw',
    },
    height: 50,
    marginY: 10,
    display: 'flex',
    px: 1,
    borderRadius: 5,
  },
  '& > .location-input > .MuiInputBase-root': {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    px: 2,
    flexGrow: 1,
  },
  '& > .location-input > .MuiStack-root': {
    justifyContent: 'center',
  },
  '& > img': {
    objectFit: 'contain',
    width: {
      xs: '70vw',
      md: '50vw',
      lg: '35vw',
    },
    mt: 10,
  },
  '& .progress-bar-detection': {
    pt: 20,
    height: '90vh',
  },
};
