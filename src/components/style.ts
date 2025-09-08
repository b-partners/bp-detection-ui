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
export const DialogTutorialStyle: SxProps = {
  '& .MuiDialogContent-root': {},
};

export const LegalFileDialogStyle: Record<'dialogContent' | 'dialogActions', SxProps> = {
  dialogContent: {
    minHeight: 500,
    minWidth: 500,
    '& .react-pdf__Page__textContent, & .react-pdf__Page__annotations': {
      display: 'none',
    },
  },
  dialogActions: {
    '& svg': {
      color: '#fff !important',
    },
  },
};

export const llmResultStyle: SxProps = {
  textAlign: 'justify',
  padding: 5,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  overflowY: 'scroll',
  overflowX: 'hidden',
  '& h1': {
    mb: 5,
  },
  '& li': {
    mb: 2,
  },
  '& strong': {
    display: 'block',
  },
};

export const llmButtonStyle: SxProps = {
  color: 'white',
  '& svg': {
    color: 'white',
  },
};
