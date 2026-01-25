// Hook to automatically claim pending quiz results after login
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "./use-toast";

export function useClaimPendingQuiz() {
  const { isAuthenticated, isLoading, session } = useAuthContext();
  const { toast } = useToast();

  const claimMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      if (!session?.access_token) {
        throw new Error("No auth session");
      }
      const response = await fetch(`/api/quiz/claim/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate dashboard results to show the newly claimed quiz
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/results'] });
      // Invalidate playbook access queries in case orders were claimed
      queryClient.invalidateQueries({ queryKey: ['/api/playbook'] });
      // Clear the pending session from localStorage
      localStorage.removeItem('pendingQuizSessionId');
    },
    onError: (error: any) => {
      // Don't show error toast for 403/404 - these are expected in some cases
      const errorMessage = error?.message || "";
      if (!errorMessage.includes("403") && !errorMessage.includes("404")) {
        toast({
          title: "Note",
          description: "Could not link previous quiz result. You can retake the assessment.",
        });
      }
      // Clear the pending session anyway
      localStorage.removeItem('pendingQuizSessionId');
    },
  });

  useEffect(() => {
    // Only run when auth state is loaded, user is authenticated, and session is available
    if (isLoading || !isAuthenticated || !session?.access_token) {
      return;
    }

    // Check if there's a pending quiz to claim
    const pendingSessionId = localStorage.getItem('pendingQuizSessionId');
    if (pendingSessionId && !claimMutation.isPending) {
      // Automatically claim it
      claimMutation.mutate(pendingSessionId);
    }
  }, [isAuthenticated, isLoading, session]);

  return {
    isClaimingQuiz: claimMutation.isPending,
  };
}
