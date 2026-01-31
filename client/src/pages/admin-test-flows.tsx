import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, RefreshCw, Trash2, User, Database, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const ALLOWED_EMAIL = "adeola1994@gmail.com";

export default function AdminTestFlows() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { session } = useAuthContext();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const authFetch = async (url: string, options?: RequestInit) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
  };

  const { data: adminData, isLoading: isDataLoading, refetch } = useQuery({
    queryKey: ["/api/admin/test-state", session?.access_token],
    queryFn: () => authFetch("/api/admin/test-state"),
    enabled: !!user && !!session?.access_token && user.email?.toLowerCase() === ALLOWED_EMAIL,
  });

  const resetMutation = useMutation({
    mutationFn: async (resetType: string) => {
      return authFetch("/api/admin/reset-state", {
        method: "POST",
        body: JSON.stringify({ resetType }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Reset Complete",
        description: data.message || "Your test state has been reset.",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReset = async (resetType: string) => {
    setIsResetting(true);
    try {
      await resetMutation.mutateAsync(resetType);
    } finally {
      setIsResetting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please log in to access this page.</p>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.email?.toLowerCase() !== ALLOWED_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">This page is restricted to authorized administrators only.</p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Test Flows</h1>
            <p className="text-muted-foreground mt-1">Debug and reset your test user state</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
              <CardDescription>Your current user identifiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : adminData ? (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-mono text-sm">{adminData.user?.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Supabase ID</span>
                    <span className="font-mono text-xs">{adminData.supabaseId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Local User ID</span>
                    <span className="font-mono text-sm">{adminData.localUserId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Premium Status</span>
                    <span className={`font-semibold ${adminData.isPremium ? "text-green-600" : "text-muted-foreground"}`}>
                      {adminData.isPremium ? "Premium" : "Free"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Failed to load user data</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Reset Actions
              </CardTitle>
              <CardDescription>Clear your test data for fresh testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => handleReset("orders")}
                disabled={isResetting}
              >
                {isResetting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Clear My Orders
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => handleReset("quiz_results")}
                disabled={isResetting}
              >
                {isResetting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Clear My Quiz Results
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => handleReset("all")}
                disabled={isResetting}
              >
                {isResetting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Reset Everything
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Quiz Results
              </CardTitle>
              <CardDescription>Your quiz history</CardDescription>
            </CardHeader>
            <CardContent>
              {isDataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : adminData?.quizResults?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">ID</th>
                        <th className="text-left py-2 px-2">Session ID</th>
                        <th className="text-left py-2 px-2">Archetype</th>
                        <th className="text-left py-2 px-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.quizResults.map((result: any) => (
                        <tr key={result.id} className="border-b">
                          <td className="py-2 px-2 font-mono">{result.id}</td>
                          <td className="py-2 px-2 font-mono text-xs">{result.sessionId}</td>
                          <td className="py-2 px-2">{result.archetype}</td>
                          <td className="py-2 px-2 text-muted-foreground">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No quiz results found</p>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Orders
              </CardTitle>
              <CardDescription>Your order history</CardDescription>
            </CardHeader>
            <CardContent>
              {isDataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : adminData?.orders?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">ID</th>
                        <th className="text-left py-2 px-2">Session ID</th>
                        <th className="text-left py-2 px-2">Archetype</th>
                        <th className="text-left py-2 px-2">Amount</th>
                        <th className="text-left py-2 px-2">Status</th>
                        <th className="text-left py-2 px-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.orders.map((order: any) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-2 px-2 font-mono">{order.id}</td>
                          <td className="py-2 px-2 font-mono text-xs">{order.sessionId}</td>
                          <td className="py-2 px-2">{order.archetype}</td>
                          <td className="py-2 px-2">${(order.amount / 100).toFixed(2)}</td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === "completed" ? "bg-green-100 text-green-800" :
                              order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No orders found</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => refetch()} disabled={isDataLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isDataLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}
