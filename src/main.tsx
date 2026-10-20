import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import { ThemeProvider } from '@mui/material';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { RouterProvider } from 'react-router-dom';
import { clearCached } from './utilities/cache';
import { isCaptchaEnabled } from './utilities/captcha';
import { routes } from './utilities/routes';
import { captureError, initSentry } from './utilities/sentry';
import { theme } from './utilities/theme';

initSentry();

// Queries and mutations handle their errors locally (dialogs, snackbars), so they never reach Sentry on their own.
const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error, query) => captureError(error, { queryKey: query.queryKey }) }),
  mutationCache: new MutationCache({ onError: (error, _variables, _context, mutation) => captureError(error, { mutationKey: mutation.options.mutationKey }) }),
});

const Main = () => {
  const app = (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={routes} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );

  // Off the Birdia domains the captcha is not checked, so Google's script is not loaded at all.
  return isCaptchaEnabled() ? <GoogleReCaptchaProvider reCaptchaKey={process.env.RECAPTCHA_SITE_KEY || ''}>{app}</GoogleReCaptchaProvider> : app;
};

// One session per user: erase every cached data before anything renders, so no component can read a previous session's values.
clearCached.all().finally(() => createRoot(document.getElementById('root')!).render(<Main />));
