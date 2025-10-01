import { degradationLevels } from '@/mappers';
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
  '& *': {
    fontFamily: "'Kumbh Sans', sans-serif !important",
  },
  '& h1': {
    mb: 5,
  },
  '& li': {
    mb: 2,
  },
  '& h3': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  },
  '& h1,h2,h3': {
    textAlign: 'center',
    '& .category-colored-round': {
      height: 20,
      width: 20,
      borderRadius: '50%',
    },
    '& .category-A': {
      background: degradationLevels[0].color,
    },
    '& .category-B': {
      background: degradationLevels[1].color,
    },
    '& .category-C': {
      background: degradationLevels[2].color,
    },
    '& .category-D': {
      background: degradationLevels[3].color,
    },
    '& .category-E': {
      background: degradationLevels[4].color,
    },
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
  '& .empty-llm-result': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    background: '#00000020',
    '& svg': {
      fontSize: '50px',
    },
    '& .MuiStack-root': {
      display: 'flex',
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
