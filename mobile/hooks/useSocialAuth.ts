import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

type Provider = "oauth_google" | "oauth_apple";

function useSocialAuth() {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: Provider) => {
    setLoadingProvider(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("Error in social auth", error);

      const provider =
        strategy === "oauth_google" ? "Google" : "Apple";

      Alert.alert(
        "Error",
        `Failed to authenticate with ${provider}. Please try again`
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    loadingProvider,
    handleSocialAuth,
  };
}

export default useSocialAuth;
