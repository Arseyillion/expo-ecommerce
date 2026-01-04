import { Stack } from "expo-router";
import "../globals.css";
import { verifyInstallation } from "nativewind";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

// Verify NativeWind installation
verifyInstallation();

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <Stack />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
