import App from '@/App';
import { GlobalLayout, RouteError } from '@/layout';
import { ApiKeyPage } from '@/pages';
import * as Sentry from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV7(createBrowserRouter);

export const routes = sentryCreateBrowserRouter([
  {
    path: '/',
    element: <GlobalLayout />,
    errorElement: <RouteError />,
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
