declare module '@clerk/clerk-expo' {
  export function useAuth(): {
    isSignedIn: boolean;
    userId: string | null;
    sessionId: string | null;
    getToken: (opts?: { template?: string }) => Promise<string>;
    isLoaded: boolean;
    isError: boolean;
    error: Error | null;
  };

  // Add other exports as needed:
  export const ClerkProvider: any;
  export const SignIn: any;
  export const SignUp: any;
  
}

// TYPE FIX: Declare module for Clerk token cache to resolve TypeScript error
// This allows importing tokenCache from '@clerk/clerk-expo/token-cache' without type errors
declare module '@clerk/clerk-expo/token-cache' {
  export const tokenCache: any;
}