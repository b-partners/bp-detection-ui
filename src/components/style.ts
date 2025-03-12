import { SxProps } from '@mui/material';

export const DialogFormStyle: SxProps = {
  '& .MuiDialogContent-root': {
    minWidth: 500,
  },
  '& .MuiStack-root': {
    gap: 2,
    py: 1,
  },
  '& .MuiDialogTitle-root': {
    display: 'flex',
    justifyContent: 'space-between',
  },
};
