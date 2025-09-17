import { PALETTE_COLORS } from '@/utilities';
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
  position: 'relative',
  '& h1': {
    mb: 5,
  },
  '& li': {
    mb: 2,
  },
  '& h1,h2,h3': {
    textAlign: 'center',
  },
  '& section:first-child > h2': {
    color: PALETTE_COLORS.neon_orange,
  },
  '& section:nth-child(2) > h2': {
    color: PALETTE_COLORS.neon_orange,
  },
  '& strong': {
    display: 'block',
  },
  '& .loading-container': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    '& .loading-element-container': {
      alignItems: 'center',
    },
  },
};

export const llmButtonStyle: SxProps = {
  color: 'white',
  '& svg': {
    color: 'white',
  },
};
export const llmIconButtonStyle: SxProps = {
  color: t => (t as any).palette.primary.main,
  position: 'absolute',
  top: 0,
};

export const annotatorCustomButtonStyle: SxProps = {
  mb: 1,
  '& svg': {
    color: 'white',
  },
  '& .MuiIconButton-root': {
    background: t => (t as any).palette.primary.main,
    mx: 0.2,
    borderRadius: 2,
  },
  '& .annotator-info': {
    '& .MuiStack-root > .MuiBox-root': {
      '& p': {
        m: 0,
      },
      color: '#fff',
      px: 1,
      py: 1.4,
      borderRadius: 2,
      minWidth: 50,
      fontWeight: 'semi-bold',
      background: PALETTE_COLORS.neon_orange,
    },
  },
  '& .image-info': {
    background: PALETTE_COLORS.pine,
    borderRadius: 2,
    width: '100%',
    py: 1,
    display: 'flex',
    justifyContent: 'center',
    '& .MuiTypography-root': {
      color: '#fff',
    },
  },
};

export const addressStyle: SxProps = {
  '& .MuiTypography-root': {
    color: t => (t as any).palette.primary.main,
    border: t => `2px solid ${(t as any).palette.primary.main}`,
    fontWeight: 'bold',
    width: 'fit-content',
    height: 'fit-content',
    marginBottom: 2,
    px: 1,
    borderRadius: 3,
    py: 0.5,
  },
};
