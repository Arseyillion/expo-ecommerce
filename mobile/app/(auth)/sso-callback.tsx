import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator, Text } from "react-native";

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Wait a bit for Clerk to process the SSO callback
    const timer = setTimeout(() => {
      if (isSignedIn) {
        router.replace("/(tabs)");
      } else {
        // If not signed in after callback, redirect back to auth
        router.replace("/(auth)");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#1DB954" />
      <Text className="text-text-secondary mt-4">Completing sign in...</Text>
    </View>
  );
}
