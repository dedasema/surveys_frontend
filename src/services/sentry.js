import * as Sentry from '@sentry/react';

export function initSentry() {
  const dsn =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) ||
    (typeof process !== 'undefined' && process.env?.REACT_APP_SENTRY_DSN);

  if (!dsn || dsn.trim() === '' || dsn.includes('examplePublicKey')) {
    // Sentry inactivo si no hay DSN configurado
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'production',
  });
}
