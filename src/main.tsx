import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import App from './App.tsx';
import { theme } from './utilities';

const queryClient = new QueryClient();

const Main = () => {
  useEffect(() => {
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.RECAPTCHA_SITE_KEY || ''}>
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </StrictMode>
    </GoogleReCaptchaProvider>
  );
};

createRoot(document.getElementById('root')!).render(<Main />);
