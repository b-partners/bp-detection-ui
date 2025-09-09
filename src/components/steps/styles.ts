import { SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';

export const DetectionResultStepStyle: SxProps = {
  position: 'relative',
  mb: 10,
  p: 1,
  width: {
    xs: '95vw',
    sm: '90vw',
    md: '85vw',
    lg: '70vw',
  },
  minHeight: '600px',
  height: 'fit-content',
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  '& .MuiGrid2-root > .title': {
    fontSize: {
      xs: '1rem',
      sm: '1.125rem',
      md: '1.25rem',
      lg: '1.5rem',
    },
  },
  '& .MuiGrid2-root > .MuiPaper-root > .MuiTypography-root.label': {
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1.125rem',
      lg: '1.25rem',
    },
    textTransform: 'lowercase',
  },
  '& .MuiGrid2-root > .MuiPaper-root > .MuiTypography-root.result': {
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1.125rem',
      lg: '1.25rem',
    },
    textTransform: 'capitalize',
  },
  '& .MuiPaper-root': {
    p: 1,
    my: 1,
    display: 'flex',
    alignItems: 'center',
    bgcolor: grey[300],
    justifyContent: 'space-between',
  },
  gap: 1,
  '& .color-legend': {
    height: 20,
    width: 20,
  },
  '& .degratation-rate-title': {
    py: 2,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    '& .MuiTypography-root': {
      textAlign: 'center',
      width: 'fit-content',
      textTransform: 'uppercase',
      border: '2px solid black',
      py: 1,
      px: 2,
      borderRadius: 3,
    },
  },
  '& .degratation-levels': {
    '& .degratation-levels-box': {
      width: 40,
      height: 40,
      borderRadius: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'all 500ms',
    },
    '&:hover': {
      '& .degratation-levels-box:not(.degratation-levels-box-selected)': {
        background: '#D9D9D9',
      },
      '& .degratation-levels-box-selected': {
        width: 50,
        height: 50,
      },
    },
  },
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
