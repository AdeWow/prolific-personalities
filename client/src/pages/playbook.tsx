import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { playbookContentMap } from "@shared/playbookContent";
import { PDFPreview } from "@/components/pdf-preview";
import { ProgressMilestones } from "@/components/playbook/ProgressMilestones";
import { ActionPlanGame } from "@/components/playbook/ActionPlanGame";
import { ToolsFocused } from "@/components/playbook/ToolsFocused";
import { GuidedNotes } from "@/components/playbook/GuidedNotes";
import { MobileAppBanner } from "@/components/playbook/MobileAppBanner";
import { FirstTimeOverlay, useFirstTimeOverlay } from "@/components/playbook/FirstTimeOverlay";
import { ContentRenderer } from "@/components/playbook/ContentParser";
import { 
  Loader2, 
  Lock, 
  LogIn, 
  AlertCircle, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Download, 
  ChevronRight,
  Calendar,
  Wrench,
  FileText,
  Menu,
  X
} from "lucide-react";

export default function Playbook() {
  const [, params] = useRoute("/playbook/:archetype");
  const [, setLocation] = useLocation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { session } = useAuthContext();
  const { toast } = useToast();
  const archetype = params?.archetype || "";

  // Create authenticated fetch function for GET requests
  const authFetch = useCallback(async (url: string) => {
    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
  }, [session?.access_token]);

  // Create authenticated POST function for mutations
  const authPost = useCallback(async (url: string, data: any) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
  }, [session?.access_token]);

  // Get sessionId from URL query param or localStorage for access verification (promo code orders)
  const [sessionId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('sessionId');
    const storedSessionId = localStorage.getItem('pendingQuizSessionId') || '';
    const finalSessionId = urlSessionId || storedSessionId;
    console.log('[Playbook Debug] URL sessionId:', urlSessionId, '| localStorage:', storedSessionId, '| Using:', finalSessionId);
    return finalSessionId;
  });

  // Get playbook content - must be before any hooks that depend on it
  const playbook = playbookContentMap[archetype];

  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noteSaveStatus, setNoteSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<string>('content');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set page title
  useEffect(() => {
    if (archetype) {
      const archetypeName = archetype
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = `${archetypeName} Playbook - Prolific Personalities`;
    }
  }, [archetype]);

  // Redirect if no archetype
  useEffect(() => {
    if (!archetype) {
      setLocation('/');
    }
  }, [archetype, setLocation]);

  // Initialize selected chapter/section when playbook loads
  useEffect(() => {
    if (playbook?.chapters?.[0]) {
      setSelectedChapterId(playbook.chapters[0].id);
      if (playbook.chapters[0].sections?.[0]) {
        setSelectedSectionId(playbook.chapters[0].sections[0].id);
      }
    }
  }, [playbook]);

  // Check if user has premium access (include sessionId for promo code orders)
  const accessQueryUrl = sessionId 
    ? `/api/playbook/${archetype}/access?sessionId=${sessionId}` 
    : `/api/playbook/${archetype}/access`;
  console.log('[Playbook Debug] Access query URL:', accessQueryUrl, '| user:', !!user, '| archetype:', archetype, '| token:', !!session?.access_token);
  const { data: accessData, isLoading: isAccessLoading, isError: isAccessError, error: accessError } = useQuery<{ hasAccess: boolean }>({
    queryKey: [accessQueryUrl, session?.access_token],
    queryFn: async () => {
      console.log('[Playbook Debug] Fetching access...');
      try {
        const result = await authFetch(accessQueryUrl);
        console.log('[Playbook Debug] Access result:', result);
        return result;
      } catch (err) {
        console.error('[Playbook Debug] Access error:', err);
        throw err;
      }
    },
    enabled: !!user && !!archetype && !!session?.access_token,
    retry: 1,
  });

  // Check session-based access for unauthenticated users (prepaid flow)
  const sessionAccessUrl = sessionId ? `/api/playbook/${archetype}/session-access?sessionId=${sessionId}` : null;
  const { data: sessionAccessData, isLoading: isSessionAccessLoading } = useQuery<{ hasAccess: boolean; orderEmail?: string }>({
    queryKey: ['session-access', sessionAccessUrl],
    queryFn: async () => {
      if (!sessionAccessUrl) return { hasAccess: false };
      const res = await fetch(sessionAccessUrl);
      if (!res.ok) throw new Error('Failed to check session access');
      return res.json();
    },
    enabled: !user && !!sessionId && !!archetype && !isAuthLoading,
    retry: 1,
  });

  // Combined access check: user is authenticated with access OR has session-based access
  const hasAnyAccess = accessData?.hasAccess === true || sessionAccessData?.hasAccess === true;
  const isAnyAccessLoading = (user ? isAccessLoading : isSessionAccessLoading);

  // Fetch progress data - always call these hooks but they'll only fetch when enabled
  const { data: progressData } = useQuery<{ chapterId: string; completed: number; completedAt: string | null }[]>({
    queryKey: [`/api/playbook/${archetype}/progress`, session?.access_token],
    queryFn: () => authFetch(`/api/playbook/${archetype}/progress`),
    enabled: !!user && !!archetype && !!accessData?.hasAccess && !!session?.access_token,
  });

  const { data: actionPlanData } = useQuery<{ dayNumber: number; taskId: string; completedAt: string }[]>({
    queryKey: [`/api/playbook/${archetype}/action-plan`, session?.access_token],
    queryFn: () => authFetch(`/api/playbook/${archetype}/action-plan`),
    enabled: !!user && !!archetype && !!accessData?.hasAccess && !!session?.access_token,
  });

  const { data: toolsData } = useQuery<{ toolId: string; status: string; notes: string }[]>({
    queryKey: [`/api/playbook/${archetype}/tools`, session?.access_token],
    queryFn: () => authFetch(`/api/playbook/${archetype}/tools`),
    enabled: !!user && !!archetype && !!accessData?.hasAccess && !!session?.access_token,
  });

  const { data: notesData } = useQuery<{ id: number; sectionId: string; content: string }[]>({
    queryKey: [`/api/playbook/${archetype}/notes`, session?.access_token],
    queryFn: () => authFetch(`/api/playbook/${archetype}/notes`),
    enabled: !!user && !!archetype && !!accessData?.hasAccess && !!session?.access_token,
  });

  // Mutations - always declare these
  const toggleChapterMutation = useMutation({
    mutationFn: ({ chapterId, completed }: { chapterId: string; completed: boolean }) => 
      authPost(`/api/playbook/${archetype}/progress/chapter`, { chapterId, completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/playbook/${archetype}/progress`] });
      toast({ description: "Progress updated!" });
    },
    onError: () => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to update progress. Please try again." 
      });
    },
  });

  const toggleActionPlanMutation = useMutation({
    mutationFn: ({ dayNumber, taskId, completed }: { dayNumber: number; taskId: string; completed: boolean }) => 
      authPost(`/api/playbook/${archetype}/action-plan/task`, { dayNumber, taskId, completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/playbook/${archetype}/action-plan`] });
    },
    onError: () => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to update task. Please try again." 
      });
    },
  });

  const updateToolMutation = useMutation({
    mutationFn: ({ toolId, status, notes }: { toolId: string; status: string; notes?: string }) => 
      authPost(`/api/playbook/${archetype}/tools/update`, { toolId, status: status.toLowerCase().replace(' ', '_'), notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/playbook/${archetype}/tools`] });
      toast({ description: "Tool status updated!" });
    },
    onError: () => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to update tool. Please try again." 
      });
    },
  });

  // Debounced note save
  const saveNoteMutation = useMutation({
    mutationFn: ({ sectionId, content }: { sectionId: string; content: string }) => 
      authPost(`/api/playbook/${archetype}/notes`, { sectionId, content }),
    onMutate: () => {
      setNoteSaveStatus('saving');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/playbook/${archetype}/notes`] });
      setNoteSaveStatus('saved');
      setTimeout(() => setNoteSaveStatus('idle'), 2000);
    },
    onError: () => {
      setNoteSaveStatus('error');
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to save note. Please try again." 
      });
    },
  });

  // Calculated values
  const selectedChapter = playbook?.chapters.find(c => c.id === selectedChapterId);
  const selectedSection = selectedChapter?.sections.find(s => s.id === selectedSectionId);
  // Only count chapters that are actually marked as completed (completed === true or 1)
  const completedChapters = (progressData ?? []).filter(p => p.completed).length;
  const totalChapters = playbook?.chapters.length || 1;
  const progressPercentage = Math.round((completedChapters / totalChapters) * 100);

  const handleNoteSave = (sectionId: string, content: string) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Reset status to idle while user is typing
    setNoteSaveStatus('idle');
    
    // Set new timer
    const timer = setTimeout(() => {
      if (content.trim()) {
        saveNoteMutation.mutate({ sectionId, content });
      }
    }, 1000);
    
    // Store timer reference
    debounceTimerRef.current = timer;
  };

  const isChapterComplete = (chapterId: string) => {
    return progressData?.some(p => p.chapterId === chapterId);
  };

  const isTaskComplete = (dayNumber: number, taskId: string) => {
    return actionPlanData?.some(t => t.dayNumber === dayNumber && t.taskId === taskId);
  };

  const getToolStatus = (toolId: string) => {
    const status = toolsData?.find(t => t.toolId === toolId)?.status || "not_started";
    // Convert backend format (not_started) to UI format (Not Started)
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getSectionNote = (sectionId: string) => {
    return notesData?.find(n => n.sectionId === sectionId);
  };

  const handleDownloadPDF = () => {
    window.open(`/api/playbook/${archetype}/pdf`, '_blank');
  };

  // First-time user onboarding
  const { showOverlay, dismissOverlay } = useFirstTimeOverlay(archetype);

  // CONDITIONAL RENDERING SECTION

  // Loading state
  if (isAuthLoading || (user && isAccessLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading playbook...</p>
        </div>
      </div>
    );
  }

  // Error checking access
  if (user && isAccessError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Error Loading Playbook
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We couldn't verify your access to this playbook. Please try again later or contact support if the problem persists.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                  data-testid="button-retry"
                >
                  Try Again
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full" data-testid="button-dashboard">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking session-based access for unauthenticated users
  if (!user && !isAuthLoading && sessionId && isSessionAccessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // Not logged in and no session-based access
  if (!user && !sessionAccessData?.hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Login Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Please log in to access your premium playbook.
                </p>
              </div>
              <div className="space-y-3">
                <Link href="/login">
                  <Button 
                    className="w-full"
                    data-testid="button-login"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full" data-testid="button-back-home">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No premium access (logged in but no access, or unauthenticated without session access)
  if (!hasAnyAccess) {
    const archetypeName = archetype
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Premium Access Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You don't have access to the {archetypeName} Playbook yet.
                </p>
                <Alert variant="default" className="text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>How to get access</AlertTitle>
                  <AlertDescription>
                    Take the quiz to discover your productivity archetype, then purchase the premium playbook from your results page.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="space-y-3">
                <Link href="/quiz">
                  <Button className="w-full" data-testid="button-take-quiz">
                    Take the Quiz
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full" data-testid="button-dashboard">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access - render the actual playbook
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-testid="button-menu"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {playbook?.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  {playbook?.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                data-testid="button-download-pdf"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-dashboard">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <ProgressMilestones 
              completedChapters={completedChapters}
              totalChapters={totalChapters}
            />
          </div>
        </div>
      </div>

      {/* First-time user overlay */}
      {showOverlay && (
        <FirstTimeOverlay 
          archetype={archetype}
          onDismiss={dismissOverlay}
        />
      )}

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Only visible on Content tab */}
        <aside className={`
          ${sidebarOpen ? 'block' : 'hidden'} 
          ${activeTab === 'content' ? 'lg:block' : 'lg:hidden'}
          fixed lg:sticky top-[140px] left-0 h-[calc(100vh-140px)]
          w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          overflow-y-auto z-30 lg:z-0
          transition-all duration-200 ease-out
        `}>
          <div className="p-4 space-y-2">
            {playbook?.chapters.map((chapter, idx) => {
              const isComplete = isChapterComplete(chapter.id);
              const isActive = chapter.id === selectedChapterId;
              return (
                <div key={chapter.id}>
                  <button
                    onClick={() => {
                      setSelectedChapterId(chapter.id);
                      setSelectedSectionId(chapter.sections[0]?.id || "");
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg flex items-center justify-between
                      ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                    `}
                    data-testid={`chapter-${chapter.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                      <span className="font-medium">{idx + 1}. {chapter.title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isActive ? '' : 'opacity-0'}`} />
                  </button>
                  {isActive && (
                    <div className="ml-7 mt-1 space-y-1">
                      {chapter.sections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => setSelectedSectionId(section.id)}
                          className={`
                            w-full text-left px-3 py-1.5 rounded text-sm
                            ${selectedSectionId === section.id ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                          `}
                          data-testid={`section-${section.id}`}
                        >
                          {section.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" role="main" className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-200 ${activeTab !== 'content' ? 'lg:max-w-none' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl">
              <TabsTrigger value="content" data-testid="tab-content">
                <BookOpen className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="action-plan" data-testid="tab-action-plan">
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">30-Day Plan</span>
              </TabsTrigger>
              <TabsTrigger value="tools" data-testid="tab-tools">
                <Wrench className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" data-testid="tab-pdf">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">PDF</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Mobile App Banner */}
              <MobileAppBanner className="lg:hidden" />
              
              {selectedSection && (
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle className="text-2xl">{selectedSection.title}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selectedChapter?.title}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ContentRenderer 
                      content={selectedSection.content}
                      sectionId={selectedSectionId}
                      archetype={archetype}
                    />
                    
                    {/* Mark Complete Button - More prominent at bottom of content */}
                    <div className="pt-6 border-t border-muted">
                      <Button
                        variant={isChapterComplete(selectedChapterId) ? "outline" : "default"}
                        className={`w-full h-12 text-base font-medium transition-all ${
                          isChapterComplete(selectedChapterId) 
                            ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900" 
                            : "bg-primary hover:bg-primary/90"
                        }`}
                        onClick={() => {
                          toggleChapterMutation.mutate({ 
                            chapterId: selectedChapterId, 
                            completed: !isChapterComplete(selectedChapterId) 
                          });
                        }}
                        disabled={toggleChapterMutation.isPending}
                        data-testid="button-complete-chapter"
                      >
                        {toggleChapterMutation.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : isChapterComplete(selectedChapterId) ? (
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                        ) : (
                          <Circle className="h-5 w-5 mr-2" />
                        )}
                        {isChapterComplete(selectedChapterId) 
                          ? "Completed! Click to undo" 
                          : "Mark this section complete"}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Track your progress through the playbook
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Desktop Mobile App Banner */}
              <div className="hidden lg:block">
                <MobileAppBanner />
              </div>
            </TabsContent>

            <TabsContent value="action-plan" className="space-y-4">
              <ActionPlanGame
                tasks={playbook?.actionPlan || []}
                completedTasks={(actionPlanData || []).map(t => ({ 
                  dayNumber: t.dayNumber, 
                  taskId: t.taskId 
                }))}
                onToggleTask={(dayNumber, taskId, completed) => {
                  toggleActionPlanMutation.mutate({ dayNumber, taskId, completed });
                }}
                isPending={toggleActionPlanMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <ToolsFocused
                recommendedTools={playbook?.recommendedTools || []}
                toolsData={(toolsData || []).map(t => ({
                  toolId: t.toolId,
                  status: t.status,
                  notes: t.notes || ""
                }))}
                onUpdateTool={(toolId, status, notes) => {
                  updateToolMutation.mutate({ toolId, status, notes });
                }}
                isPending={updateToolMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <GuidedNotes
                    sectionId={selectedSectionId}
                    sectionTitle={selectedSection?.title || ""}
                    existingNote={getSectionNote(selectedSectionId)?.content}
                    onSave={handleNoteSave}
                    saveStatus={noteSaveStatus}
                    disabled={saveNoteMutation.isPending}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-4">
              <PDFPreview
                src={`/api/playbook/${archetype}/pdf`}
                title={playbook?.title || "Premium Playbook"}
                downloadFilename={`${playbook?.title || 'Playbook'}.pdf`}
                height="700px"
                showDownloadButton={true}
                collapsible={false}
                authToken={session?.access_token}
              />
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Tip: Use the interactive Content tab for the best reading experience with progress tracking, 
                    or download the PDF for offline access.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
