import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { RouterProvider } from 'react-router-dom';
import { clearCached } from './utilities/cache';
import { routes } from './utilities/routes';
import { theme } from './utilities/theme';

const queryClient = new QueryClient();

const Main = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.RECAPTCHA_SITE_KEY || ''}>
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <RouterProvider router={routes} />
          </ThemeProvider>
        </QueryClientProvider>
      </StrictMode>
    </GoogleReCaptchaProvider>
  );
};

// One session per user: erase every cached data before anything renders, so no component can read a previous session's values.
clearCached.all().finally(() => createRoot(document.getElementById('root')!).render(<Main />));
