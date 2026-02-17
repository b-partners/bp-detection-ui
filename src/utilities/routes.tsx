import App from '@/App';
import { GlobalLayout } from '@/layout';
import { logoLoader } from '@/loader';
import { ApiKeyPage, EndPage } from '@/pages';
import { createBrowserRouter } from 'react-router';

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
        path: '/acknowledgements',
        Component: EndPage,
        loader: logoLoader,
      },
      {
        path: '/api-key',
        Component: ApiKeyPage,
      },
    ],
  },
]);
