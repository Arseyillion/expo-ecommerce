import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import useSociallAuth from "@/hooks/useSociallAuth";
import { useState } from "react";

export default function AuthScreen() {
  const { loadingProvider, handleSocialAuth } = useSociallAuth();
  
  const isGoogleLoading = loadingProvider === "oauth_google";
  const isAppleLoading = loadingProvider === "oauth_apple" ;
  const isAnyLoading = loadingProvider !== null;

  return (
    <View className="flex-1 justify-center items-center bg-white px-8">
      {/* DEMO IMAGE */}
      <Image
        source={require("../../assets/images/auth-image.png")}
        className="size-96"
        resizeMode="contain"
      />

      {/* GOOGLE SIGN IN */}
      <View className="gap-2 mb-3">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isAnyLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          {isGoogleLoading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="#4285f4" className="mr-3"/>
              <Text className="text-black text-base font-medium">
                Continue with Google
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black text-base font-medium">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* APPLE SIGN IN */}
      <View className="gap-2">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isAnyLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          {isAppleLoading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="#4285f4" className="mr-3"/>
              <Text className="text-black text-base font-medium">
                Continue with Apple
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/apple.png")}
                className="size-8 mr-5"
                resizeMode="contain"
              />
              <Text className="text-black text-base font-medium">
                Continue with Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
        By signing up, you agree to our{" "}
        <Text className="text-blue-500">Terms</Text>,{" "}
        <Text className="text-blue-500">Privacy Policy</Text>, and{" "}
        <Text className="text-blue-500">Cookie Use</Text>.
      </Text>
    </View>
  );
}
