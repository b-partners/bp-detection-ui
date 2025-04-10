import { SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';

export const DetectionResultStepStyle: SxProps = {
  position: 'relative',
  mb: 10,
  width: {
    xs: '90vw',
    md: '80vw',
    lg: '70vw',
  },
  minHeight: '600px',
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  '& .text-result': {
    flexGrow: 1,
    flexBasis: {
      md: '30%',
      xs: '100%',
    },
    maxHeight: '550px',
    overflowY: 'scroll',
  },
  '& > .MuiBox-root': {
    flexGrow: 1,
    flexBasis: {
      md: '68%',
      xs: '100%',
    },
  },
  '& .MuiPaper-root': {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    px: 2,
    py: 2,
    mb: 2,
    mr: 1,
    bgcolor: grey[300],
    justifyContent: 'space-between',
  },
  gap: 2,
};

export const GetAddressStepStyle: SxProps = {
  width: {
    xs: '90vw',
    md: '80vw',
    lg: '70vw',
  },
  '& .location-input': {
    width: {
      xs: '90vw',
      md: '70vw',
      lg: '50vw',
    },
    height: 50,
    marginTop: 10,
    marginBottom: 1,
    display: 'flex',
    px: 1,
    borderRadius: 5,
  },
  '& .location-list': {
    width: {
      xs: '90vw',
      md: '70vw',
      lg: '50vw',
    },
    maxHeight: '15rem',
    overflowY: 'auto',
    px: 1,
  },
  '& .location-input > .MuiInputBase-root': {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    px: 2,
    flexGrow: 1,
  },
  '& .location-input > .MuiStack-root': {
    justifyContent: 'center',
  },
};
