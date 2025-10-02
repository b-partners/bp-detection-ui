import App from '@/App';
import { useRestStore } from '@/hooks';
import { theme } from '@/utilities';
import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';

const queryClient = new QueryClient();

export const AppComponent_Mock = () => {
  const reset = useRestStore();

  useLayoutEffect(() => {
    reset();
    queryClient.clear();
  }, []);

  return (
    <QueryClientProvider key={1} client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
