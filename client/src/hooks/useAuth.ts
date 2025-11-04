// Hook for Replit Auth - provides user authentication state
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Treat 401 as a normal state (not authenticated), not an error
    throwOnError: (error) => {
      const errorMessage = error?.message || "";
      // Don't throw on 401 (unauthorized) - just means user is not logged in
      return !errorMessage.includes("401");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
