import { PALETTE_COLORS } from '@/utilities/theme';
import { SxProps, Theme } from '@mui/material';

export const HeaderStyle: SxProps<Theme> = {
  width: { xs: '92vw', md: '86vw', lg: '78vw' },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: { xs: 2, md: 3 },
  mt: { xs: 2, md: 4 },
  mb: { xs: 3, md: 5 },

  // --- Hero card ---------------------------------------------------------
  '& .hero-card': {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: { xs: 3, md: 6 },
    p: { xs: 2.5, md: 5 },
    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF6F2 100%)',
    boxShadow: '0 24px 60px -30px rgba(31, 39, 55, 0.25)',
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.4fr 1fr' },
    columnGap: { md: 5 },
    rowGap: { xs: 3, md: 0 },
    alignItems: 'start',
  },

  // Left column : logo + contact
  '& .hero-brand': {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  '& .hero-logo-card': {
    borderRadius: 3,
    border: '1px solid rgba(255, 82, 27, 0.15)',
    background: '#fff',
    p: 1.5,
    height: { xs: 110, md: 130 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 24px -16px rgba(31, 39, 55, 0.35)',
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
  },
  '& .hero-contact': {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    mt: 0.5,
    '& .company-name': {
      fontWeight: 800,
      fontSize: '0.85rem',
      color: PALETTE_COLORS.forest,
      mb: 0.25,
    },
    '& .contact-line': {
      fontSize: '0.72rem',
      color: '#5b6470',
      lineHeight: 1.5,
    },
    '& .contact-line.strong': {
      color: PALETTE_COLORS.forest,
      fontWeight: 700,
    },
    '& .contact-link': {
      color: 'inherit',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 150ms linear',
      '&:hover': {
        color: PALETTE_COLORS.neon_orange,
        textDecoration: 'underline',
      },
    },
  },

  // Center column : badge + title
  '& .hero-headline': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'flex-start', md: 'center' },
    textAlign: { xs: 'left', md: 'center' },
    gap: 2,
  },
  '& .hero-badge': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    px: 2,
    py: 0.75,
    borderRadius: 999,
    border: `1px solid ${PALETTE_COLORS.peach}`,
    background: 'rgba(255, 82, 27, 0.06)',
    color: PALETTE_COLORS.neon_orange,
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    '& .dot': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: PALETTE_COLORS.neon_orange,
    },
  },
  '& .hero-title': {
    fontWeight: 800,
    lineHeight: 1.05,
    textTransform: 'uppercase',
    color: PALETTE_COLORS.forest,
    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem', lg: '1.6rem' },
    '& .accent': {
      color: PALETTE_COLORS.neon_orange,
    },
  },

  // Right column : description
  '& .hero-aside': {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    '& .aside-title': {
      fontWeight: 800,
      fontSize: '1.05rem',
      color: PALETTE_COLORS.forest,
    },
    '& .aside-text': {
      fontSize: '0.95rem',
      color: '#5b6470',
      lineHeight: 1.6,
    },
  },

  // --- Stats bar ---------------------------------------------------------
  '& .hero-stats': {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: { xs: 3, md: 4 },
    background: 'linear-gradient(90deg, #14181F 0%, #20242C 100%)',
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
    px: { xs: 2, md: 4 },
    py: { xs: 3, md: 4 },
    color: '#fff',
    '& .stat': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 0.75,
      px: { xs: 1, md: 2 },
      py: { xs: 1.5, md: 0 },
      borderRight: { md: '1px solid rgba(255,255,255,0.08)' },
      '&:last-of-type': { borderRight: 'none' },
    },
    '& .stat-value': {
      fontWeight: 800,
      fontSize: { xs: '1.6rem', md: '2rem' },
      lineHeight: 1,
      color: '#fff',
      '& .unit': { color: PALETTE_COLORS.neon_orange },
    },
    '& .stat-label': {
      fontSize: { xs: '0.65rem', md: '0.75rem' },
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)',
    },
  },

  // --- Steps strip -------------------------------------------------------
  '& .hero-steps': {
    width: '100%',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
    gap: { xs: 2, md: 3 },
    mt: 1,
    '& .step-item': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 1,
      px: 1,
    },
    '& .step-index': {
      width: 44,
      height: 44,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '1rem',
      background: '#fff',
      border: '2px solid rgba(31, 39, 55, 0.12)',
      color: '#9aa2ad',
      transition: 'all 200ms linear',
      zIndex: 1,
    },
    '& .step-item.active .step-index': {
      background: PALETTE_COLORS.neon_orange,
      borderColor: PALETTE_COLORS.neon_orange,
      color: '#fff',
      boxShadow: '0 8px 20px -8px rgba(255, 82, 27, 0.6)',
    },
    '& .step-item.done .step-index': {
      borderColor: PALETTE_COLORS.neon_orange,
      color: PALETTE_COLORS.neon_orange,
    },
    '& .step-label': {
      fontWeight: 700,
      fontSize: '0.95rem',
      color: PALETTE_COLORS.forest,
      mt: 0.5,
    },
    '& .step-subtitle': {
      fontWeight: 700,
      fontSize: '0.85rem',
      color: PALETTE_COLORS.forest,
    },
    '& .step-desc': {
      fontSize: '0.8rem',
      color: '#5b6470',
      lineHeight: 1.5,
    },
  },
};
