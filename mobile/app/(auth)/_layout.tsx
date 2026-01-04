import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()
    // Wait for auth to load before making routing decisions
  if (!isLoaded) {
    return null; // or a loading spinner
  }

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

// headerShown false to hide the header on auth screens
  return <Stack screenOptions={{headerShown:false}} />
}