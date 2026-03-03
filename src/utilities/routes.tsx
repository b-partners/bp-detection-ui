import App from '@/App';
import { GlobalLayout } from '@/layout';
import { ApiKeyPage } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <GlobalLayout />,
    children: [
      {
        path: '/',
        Component: App,
      },
      {
        path: '/api-key',
        Component: ApiKeyPage,
      },
    ],
  },
]);
