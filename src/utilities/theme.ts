import { createTheme, PaletteOptions } from '@mui/material';

const palette: PaletteOptions = {
  primary: {
    light: '#ab0056',
    main: '#FF521B',
    dark: '#660033',
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
  },
});
