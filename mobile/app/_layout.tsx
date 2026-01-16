import { Stack } from "expo-router";
import "../globals.css";
import { verifyInstallation } from "nativewind";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";
import { StripeProvider } from '@stripe/stripe-react-native'
 


Sentry.init({
  dsn: "https://4fa9f39586cdc7d07d95ab5fca8037a0@o1262417.ingest.us.sentry.io/4510666545496064",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Verify NativeWind installation
verifyInstallation();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      Sentry.captureException(error, {
        tags: {
          type: "react-query-error",
          queryKey: query.queryKey[0]?.toString() || "unknown",
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
          queryKey: query.queryKey,
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      // global error handler for all mutations
      Sentry.captureException(error, {
        tags: { type: "react-query-mutation-error" },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
        },
      });
    },
  }),
});

export default Sentry.wrap(function RootLayout() {
  // NAVIGATION BAR FIX: Configure Android navigation bar (home, back, tabs buttons)
  // This ensures the navigation bar buttons are visible on dark backgrounds
  useEffect(() => {
    if (Platform.OS === "android") {
      // Set navigation bar background to dark color
      NavigationBar.setBackgroundColorAsync("#000000");
      // Set navigation bar buttons to light color (white icons) so they're visible on dark background
      // This fixes the issue where home, back, and tabs buttons become invisible
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);
 

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      >
        <QueryClientProvider client={queryClient}>
          {/* SYSTEM UI FIX: StatusBar with light content style
              - style="light" makes status bar icons/text white (visible on dark background)
              - This fixes the issue where time/notifications become invisible on dark backgrounds
              - The StatusBar component handles both iOS and Android automatically */}
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
      </StripeProvider>
    </ClerkProvider>
  );
});
