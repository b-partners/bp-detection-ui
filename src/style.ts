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
      md: '80vw',
      lg: '70vw',
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
