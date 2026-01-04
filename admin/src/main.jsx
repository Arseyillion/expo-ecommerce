import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'

// added after tanstack installaton
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'

import * as Sentry from "@sentry/react";

if (!import.meta.env.VITE_SENTRY_DSN) {
  console.warn('VITE_SENTRY_DSN not configured, Sentry will not be initialized');
} else {
 Sentry.init({
   dsn: import.meta.env.VITE_SENTRY_DSN,
   sendDefaultPii: true, 
   enableLogs: true, 
   integrations: [
      Sentry.replayIntegration(),
    ],
    replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1, // 100% in dev, 10% in prod
    replaysOnErrorSampleRate: 1.0, // Always capture sessions with errors
 });
  }

// import your publishable key 
const PUBLISHABLE_KEY= import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY){
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
)
