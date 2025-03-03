import { SxProps } from '@mui/material';

export const MainStyle: SxProps = {
  padding: 0,
  margin: 0,
  height: '100vh',
  alignItems: 'center',
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
};
