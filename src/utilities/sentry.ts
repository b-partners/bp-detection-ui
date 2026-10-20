import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

const dsn = process.env.SENTRY_DSN;

// Without a DSN (CI, Cypress, local runs without the key) Sentry stays off, so no event leaves the test runs.
export const initSentry = () => {
  Sentry.init({
    dsn,
    enabled: !!dsn,
    environment: process.env.SENTRY_ENVIRONMENT || 'local',
    integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({ useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    // No trace headers on outgoing requests: the backends' CORS rules do not allow sentry-trace / baggage.
    tracePropagationTargets: [],
    // Replays mask every text and input by default, so addresses and phone numbers are not recorded.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

export const captureError = (error: unknown, context?: Record<string, unknown>) => Sentry.captureException(error, context ? { extra: context } : undefined);
