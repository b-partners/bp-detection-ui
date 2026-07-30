import { createTheme, PaletteOptions } from '@mui/material';

export const PALETTE_COLORS = {
  pine: '#4A644E',
  peach: '#FFB179',
  linen: '#BEB4A4',
  white: '#FFFFFF',
  black: '#1F1F1F',
  cream: '#F0ECE1',
  forest: '#112717',
  neon_orange: '#FF521B',
};

/**
 * Harmonic type scale - the single source of truth for every font size in the app.
 * A minimalist 1.125–1.25 modular scale (aligned with the values already used by
 * the detection-result step). Always reference these tokens instead of raw rem/px
 * so the typography stays coherent across every component.
 */
export const FONT_SIZES = {
  xs: '0.75rem', //   12px - captions, tags, eyebrows, uppercase labels
  sm: '0.875rem', //  14px - secondary text, descriptions
  md: '1rem', //      16px - body, inputs
  lg: '1.125rem', //  18px - emphasized body, small titles
  xl: '1.25rem', //   20px - subsection titles
  '2xl': '1.5rem', // 24px - section titles
  '3xl': '1.875rem', //30px - hero stat values, hero title (lg screens)
  '4xl': '2.25rem', // 36px - large section titles
  '5xl': '3rem', //    48px - display / empty-state icon
} as const;

const palette: PaletteOptions = {
  primary: {
    light: '#FF9575',
    main: '#FF521B',
    dark: '#893923',
    contrastText: '#fcfcfc',
  },
  secondary: {
    light: '#F8EDE3',
    main: '#DFD3C3',
    dark: '#D0B8A8',
    contrastText: '#2f2f2f',
  },
  background: {
    default: '#F0ECE1',
    paper: '#fff',
  },
};

export const theme = createTheme({
  palette,
  typography: {
    allVariants: {
      color: '#2f2f2f',
      fontFamily: `"Kumbh Sans", sans-serif;`,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: `0.4px 0.4px 2.2px -8px rgba(0, 0, 0, 0.02), 1px 1px 5.3px -8px rgba(0, 0, 0, 0.028), 1.9px 1.9px 10px -8px rgba(0, 0, 0, 0.035), 3.4px 3.4px 17.9px -8px rgba(0, 0, 0, 0.042), 6.3px 6.3px 33.4px -8px rgba(0, 0, 0, 0.05), 15px 15px 80px -8px rgba(0, 0, 0, 0.07)`,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: (palette.primary as unknown as { main: string }).main,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
  },
});
