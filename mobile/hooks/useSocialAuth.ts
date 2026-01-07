import { useSSO, useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

type Provider = "oauth_google" | "oauth_apple";

function useSocialAuth() {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const { startSSOFlow } = useSSO();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const handleSocialAuth = async (strategy: Provider) => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/(tabs)");
      return;
    }

    setLoadingProvider(strategy);

    try {
      // Create the redirect URL using the app's deep link scheme
      // For Clerk Expo SSO, we need a full URL that the OAuth provider can redirect to
      const redirectUrl = Linking.createURL("sso-callback");

      console.log("Starting SSO flow with redirectUrl:", redirectUrl);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Social auth error:", error);
      console.error("Error details:", error.message);

      // Check if user is signed in after error (might have succeeded despite error)
      if (isSignedIn) {
        router.replace("/(tabs)");
        return;
      }

      Alert.alert(
        "Authentication Error",
        error.message || "Authentication failed. Please try again."
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return { loadingProvider, handleSocialAuth };
}

export default useSocialAuth;
