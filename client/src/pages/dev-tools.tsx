import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wrench, FlaskConical, CreditCard, BookOpen, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const archetypes = [
  { id: "structured-achiever", name: "Structured Achiever" },
  { id: "chaotic-creative", name: "Chaotic Creative" },
  { id: "anxious-perfectionist", name: "Anxious Perfectionist" },
  { id: "novelty-seeker", name: "Novelty Seeker" },
  { id: "strategic-planner", name: "Strategic Planner" },
  { id: "flexible-improviser", name: "Flexible Improviser" },
];

export default function DevTools() {
  const [, setLocation] = useLocation();
  const [selectedArchetype, setSelectedArchetype] = useState("flexible-improviser");

  const isDev = import.meta.env.DEV;

  const createTestResultMutation = useMutation({
    mutationFn: async (archetype: string) => {
      const testScores = getTestScoresForArchetype(archetype);
      const response = await apiRequest("POST", "/api/quiz/results", {
        finalArchetype: archetype,
        scores: testScores,
        answers: {},
      });
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/results/${data.sessionId}`);
    },
  });

  if (!isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Developer tools are only available in development mode.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">Developer Tools</h1>
            <p className="text-muted-foreground">Quick shortcuts for testing</p>
          </div>
          <Badge variant="outline" className="ml-auto">DEV MODE</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Quick Results Test
              </CardTitle>
              <CardDescription>
                Generate test quiz results for any archetype without taking the quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
                <SelectTrigger data-testid="select-archetype">
                  <SelectValue placeholder="Select archetype" />
                </SelectTrigger>
                <SelectContent>
                  {archetypes.map((arch) => (
                    <SelectItem key={arch.id} value={arch.id}>
                      {arch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                onClick={() => createTestResultMutation.mutate(selectedArchetype)}
                disabled={createTestResultMutation.isPending}
                data-testid="btn-create-test-result"
              >
                {createTestResultMutation.isPending ? "Creating..." : "Create Test Result & Go to Results Page"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Test Payment Flow
              </CardTitle>
              <CardDescription>
                Test Stripe checkout for any archetype's playbook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
                <p><strong>Expiry:</strong> Any future date</p>
                <p><strong>CVC:</strong> Any 3 digits</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Use "Quick Results Test" above to get to the results page, then click "Get Your Playbook" to test payment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Direct Playbook Access
              </CardTitle>
              <CardDescription>
                Jump directly to playbook pages (requires prior purchase)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {archetypes.map((arch) => (
                  <Button
                    key={arch.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/playbook/${arch.id}`)}
                    data-testid={`btn-playbook-${arch.id}`}
                  >
                    {arch.name.split(" ")[0]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Jump to key pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setLocation("/quiz")} data-testid="btn-quiz">
                  Quiz
                </Button>
                <Button variant="outline" size="sm" onClick={() => setLocation("/dashboard")} data-testid="btn-dashboard">
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={() => setLocation("/resources")} data-testid="btn-resources">
                  Resources
                </Button>
                <Button variant="outline" size="sm" onClick={() => setLocation("/about")} data-testid="btn-about">
                  About
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This page is only visible in development mode. 
              It will not appear on your published site.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getTestScoresForArchetype(archetype: string): Record<string, number> {
  const scoreProfiles: Record<string, Record<string, number>> = {
    "structured-achiever": {
      structureOrientation: 85,
      motivationStyle: 80,
      cognitiveFocus: 30,
      taskRelationship: 25,
    },
    "chaotic-creative": {
      structureOrientation: 25,
      motivationStyle: 50,
      cognitiveFocus: 80,
      taskRelationship: 85,
    },
    "anxious-perfectionist": {
      structureOrientation: 80,
      motivationStyle: 45,
      cognitiveFocus: 20,
      taskRelationship: 75,
    },
    "novelty-seeker": {
      structureOrientation: 20,
      motivationStyle: 85,
      cognitiveFocus: 80,
      taskRelationship: 80,
    },
    "strategic-planner": {
      structureOrientation: 85,
      motivationStyle: 80,
      cognitiveFocus: 85,
      taskRelationship: 55,
    },
    "flexible-improviser": {
      structureOrientation: 25,
      motivationStyle: 30,
      cognitiveFocus: 25,
      taskRelationship: 30,
    },
  };
  return scoreProfiles[archetype] || scoreProfiles["flexible-improviser"];
}
