import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router'
import { Toaster } from 'sonner'

// added after tanstack installation
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import * as Sentry from "@sentry/react";

if (!import.meta.env.VITE_SENTRY_DSN) {
  console.warn('VITE_SENTRY_DSN not configured, Sentry will not be initialized');
} else {
 Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  sendDefaultPii: true,
  enableLogs: true,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
});
}

// import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()

// Wrap BrowserRouter with Sentry for React Router v7
const SentryBrowserRouter = Sentry.withSentryRouting(BrowserRouter);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SentryBrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </ClerkProvider>
    </SentryBrowserRouter>
  </StrictMode>
)
