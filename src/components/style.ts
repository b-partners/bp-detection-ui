import { degradationLevels } from '@/mappers';
import { FONT_SIZES, PALETTE_COLORS } from '@/utilities/theme';
import { SxProps } from '@mui/material';

export const DialogTutorialStyle: SxProps = {
  '& .MuiDialogContent-root': {},
};

/**
 * Shared "branded" dialog chrome: rounded paper, the eyebrow/title/subtitle
 * header block with an orange circular info badge, and consistent action
 * spacing. Reused by both the QCM step and the contact-info step so the two
 * modals share the same look.
 */
const brandedDialogChrome = {
  '& .MuiDialogTitle-root': {
    pt: 3,
    px: 3,
    '& .dialog-eyebrow': {
      color: PALETTE_COLORS.neon_orange,
      fontWeight: 800,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontSize: FONT_SIZES.xs,
    },
    '& .dialog-title': {
      fontWeight: 800,
      color: PALETTE_COLORS.black,
      fontSize: FONT_SIZES['2xl'],
      mt: 0.5,
    },
    '& .dialog-subtitle': {
      color: '#6B7280',
      fontSize: FONT_SIZES.sm,
      mt: 0.5,
    },
    '& .dialog-info': {
      flexShrink: 0,
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: PALETTE_COLORS.neon_orange,
      color: PALETTE_COLORS.white,
      cursor: 'help',
      '& svg': { fontSize: FONT_SIZES.lg },
    },
  },
  '& .MuiDialogActions-root': {
    px: 3,
    pb: 3,
    pt: 2,
  },
};

export const QcmDialogStyle: SxProps = {
  ...brandedDialogChrome,
  '& .MuiDialogContent-root': {
    minWidth: { md: 560 },
    px: 3,
  },
  '& .qcm-question': {
    mt: 2,
    mb: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    '& .qcm-badge': {
      flexShrink: 0,
      width: 26,
      height: 26,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: PALETTE_COLORS.neon_orange,
      color: PALETTE_COLORS.white,
      fontWeight: 800,
      fontSize: FONT_SIZES.sm,
    },
    '& .qcm-question-label': {
      fontWeight: 800,
      color: PALETTE_COLORS.black,
      fontSize: FONT_SIZES.lg,
    },
  },
  '& .qcm-options': {
    gap: 1.25,
    '& .qcm-option': {
      m: 0,
      px: 2,
      py: 0.5,
      borderRadius: 3,
      border: '1px solid #E3E1DC',
      transition: 'all 150ms ease',
      '&:hover': {
        borderColor: PALETTE_COLORS.neon_orange,
        background: 'rgba(255,82,27,0.04)',
      },
    },
    '& .qcm-option-selected': {
      borderColor: PALETTE_COLORS.neon_orange,
      background: 'rgba(255,82,27,0.06)',
    },
    '& .MuiRadio-root.Mui-checked': {
      color: PALETTE_COLORS.neon_orange,
    },
    '& .MuiFormControlLabel-label': {
      fontSize: FONT_SIZES.md,
      color: PALETTE_COLORS.black,
    },
  },
};

export const DetectionFormStyle: SxProps = {
  ...brandedDialogChrome,
  '& .MuiDialogContent-root': {
    minWidth: { md: 560 },
    px: 3,
  },
  '& .bp-field-row': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
  },
  '& .bp-field': {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
    '& .bp-field-label': {
      fontWeight: 700,
      color: PALETTE_COLORS.black,
      fontSize: FONT_SIZES.xs,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  '& .input-anime': {
    '& .MuiInputLabel-root.Mui-focused': {
      color: PALETTE_COLORS.neon_orange,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: PALETTE_COLORS.neon_orange,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: PALETTE_COLORS.neon_orange,
    },
  },
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
      fontSize: FONT_SIZES['5xl'],
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
