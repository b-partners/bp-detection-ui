import { FONT_SIZES } from '@/utilities/theme';
import { SxProps, Theme } from '@mui/material';

/**
 * Reference palette shared with the landing hero (styles.ts) so the inner-page
 * header matches the first page. Kept local to the header styles.
 */
const REF = {
  card: '#FFFFFF',
  orange: '#E96B33',
  text: '#17181B',
  textMuted: '#6B6B6B',
  textSoft: '#4A4A4A',
  border: '#E8DFC9',
  borderStrong: '#D5CBB2',
  shadowSm: '0 2px 8px rgba(31, 24, 12, 0.04)',
  shadow: '0 10px 32px rgba(31, 24, 12, 0.08)',
  radius: '20px',
  radiusSm: '12px',
};

export const HeaderStyle: SxProps<Theme> = {
  width: { xs: '97vw', md: '94vw', lg: '92vw' },
  maxWidth: 1140,
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 2.5, md: 3 },
  mt: { xs: 2, md: 3 },
  mb: { xs: 2.5, md: 4 },

  '& .accent': { color: REF.orange },

  // ---- hero split (compact version of the landing hero, no input) ----
  '& .hero-split': {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
    gap: { xs: 2.5, md: 5 },
    alignItems: 'center',
  },

  // Left column : partner card
  '& .partner-card': {
    background: REF.card,
    border: `1px solid ${REF.border}`,
    borderRadius: REF.radius,
    boxShadow: REF.shadow,
    maxWidth: { xs: 340, md: 'none' },
    mx: { xs: 'auto', md: 0 },
    width: '100%',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1.75,
    '& .partner-card-logo': {
      flexShrink: 0,
      width: 84,
      height: 64,
      borderRadius: REF.radiusSm,
      background: '#fff',
      border: `1px solid ${REF.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      '& img': { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    },
    '& .partner-body': { minWidth: 0, flex: 1 },
    '& .partner-name': { fontSize: FONT_SIZES.sm, fontWeight: 800, color: REF.text, mb: 0.25, lineHeight: 1.2 },
    '& .partner-addr': { fontSize: FONT_SIZES.xs, fontWeight: 600, color: REF.textSoft, lineHeight: 1.4, mb: 0.5 },
    '& .partner-contact': {
      fontSize: FONT_SIZES.xs,
      color: REF.textMuted,
      lineHeight: 1.5,
      '& a': { color: 'inherit', textDecoration: 'none' },
      '& a:hover': { color: REF.orange },
      '& strong': { color: REF.text, fontWeight: 600 },
    },
  },

  // Right column : badge + title + lead (no address input)
  '& .hero-content': {
    textAlign: { xs: 'center', md: 'left' },
    alignItems: { xs: 'center', md: 'flex-start' },
    '& .hero-title': {
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
      color: REF.text,
      maxWidth: 640,
      mb: 1.25,
      fontSize: { xs: '1.625rem', md: '2.25rem' },
    },
    '& .hero-lead': {
      fontSize: FONT_SIZES.sm,
      color: REF.textMuted,
      maxWidth: 620,
      lineHeight: 1.5,
    },
  },

  // ---- FR badge ----
  '& .fr-badge': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    py: '6px',
    px: '12px',
    pl: 1,
    background: '#fff',
    border: `1.5px solid ${REF.border}`,
    borderRadius: 999,
    fontSize: FONT_SIZES.xs,
    fontWeight: 600,
    color: REF.text,
    boxShadow: REF.shadowSm,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    mb: 1.5,
    '& em': { fontStyle: 'normal', fontWeight: 500, color: REF.textMuted },
  },
  '& .fr-flag': {
    display: 'inline-flex',
    alignItems: 'center',
    width: 22,
    height: 16,
    borderRadius: '3px',
    overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
    flexShrink: 0,
    '& span': { display: 'block', height: '100%', flex: 1 },
    '& .fr-blue': { background: '#002395' },
    '& .fr-white': { background: '#FFFFFF' },
    '& .fr-red': { background: '#ED2939' },
  },

  // ---- Steps strip (wired to wizard progress) ----
  '& .hero-steps': {
    width: '100%',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' },
    gap: { xs: 1.5, md: 2.5 },
    '& .step-item': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 0.5,
      px: 1,
    },
    '& .step-index': {
      width: 36,
      height: 36,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: FONT_SIZES.sm,
      background: '#fff',
      border: `2px solid ${REF.borderStrong}`,
      color: '#9aa2ad',
      transition: 'all 200ms linear',
      zIndex: 1,
    },
    '& .step-item.active .step-index': {
      background: REF.orange,
      borderColor: REF.orange,
      color: '#fff',
      boxShadow: '0 8px 20px -8px rgba(233, 107, 51, 0.6)',
    },
    '& .step-item.done .step-index': {
      borderColor: REF.orange,
      color: REF.orange,
    },
    '& .step-label': {
      fontWeight: 700,
      fontSize: FONT_SIZES.sm,
      color: REF.text,
      mt: 0.25,
    },
    '& .step-subtitle': {
      fontWeight: 700,
      fontSize: FONT_SIZES.xs,
      color: REF.text,
    },
    '& .step-desc': {
      fontSize: FONT_SIZES.xs,
      color: REF.textMuted,
      lineHeight: 1.4,
      display: { xs: 'none', md: 'block' },
    },
  },
};
