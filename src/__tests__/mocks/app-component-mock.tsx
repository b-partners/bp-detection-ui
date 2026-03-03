import App from '@/App';
import { useRestStore } from '@/hooks';
import { GlobalLayout } from '@/layout';
import { ApiKeyPage } from '@/pages';
import { theme } from '@/utilities';
import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient();

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <GlobalLayout />,
    children: [
      {
        path: '/',
        Component: App,
        index: true,
      },
      {
        path: '/api-key',
        Component: ApiKeyPage,
      },
    ],
  },
]);

export const AppComponent_Mock = () => {
  const reset = useRestStore();

  useLayoutEffect(() => {
    reset();
    queryClient.clear();
  }, []);

  return (
    <QueryClientProvider key={1} client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={routes} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
