import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  CircleDot,
  Download,
  ChevronRight,
  ChevronLeft,
  Clock,
  Calendar,
  Wrench,
  FileText,
  Menu,
  X
} from "lucide-react";
import { buildFlatSectionList, calculateReadingTime, useSubsectionProgress } from "@/components/playbook/usePlaybookNavigation";

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
  const contentTopRef = useRef<HTMLDivElement>(null);

  // Build flat section list for sequential navigation
  const flatSections = useMemo(
    () => playbook ? buildFlatSectionList(playbook) : [],
    [playbook]
  );

  // Subsection-level progress tracking (localStorage)
  const { completedSections, markComplete, isComplete: isSectionComplete, completedCount } = useSubsectionProgress(archetype);

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

  // Navigation: flat section index and neighbors
  const currentFlatIndex = flatSections.findIndex(s => s.sectionId === selectedSectionId);
  const currentFlat = flatSections[currentFlatIndex];
  const prevFlat = currentFlatIndex > 0 ? flatSections[currentFlatIndex - 1] : null;
  const nextFlat = currentFlatIndex < flatSections.length - 1 ? flatSections[currentFlatIndex + 1] : null;
  const currentReadingTime = currentFlat ? calculateReadingTime(currentFlat.content, currentFlat.sectionId) : null;

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

  // Silent background sync: write chapter completion to DB without showing error toasts.
  // localStorage is the source of truth for the UI; DB sync is for cross-device persistence.
  const syncChapterToDb = useCallback(async (chapterId: string) => {
    try {
      await authPost(`/api/playbook/${archetype}/progress/chapter`, { chapterId, completed: true });
      queryClient.invalidateQueries({ queryKey: [`/api/playbook/${archetype}/progress`] });
    } catch (err) {
      // Silent failure — localStorage already has the progress
      console.warn('[Playbook] Background chapter sync failed:', err);
    }
  }, [authPost, archetype]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!nextFlat) return;
    // Auto-mark current section complete
    if (currentFlat) {
      markComplete(currentFlat.sectionId);
    }
    // If moving to a new chapter, update chapterId
    if (nextFlat.chapterId !== selectedChapterId) {
      setSelectedChapterId(nextFlat.chapterId);
    }
    setSelectedSectionId(nextFlat.sectionId);
    setSidebarOpen(false);
    // Scroll to top of content
    contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Check if all sections in the CURRENT chapter are now complete → silently sync to DB
    if (currentFlat && user) {
      const chapterSections = flatSections.filter(s => s.chapterId === currentFlat.chapterId);
      const allSectionIds = chapterSections.map(s => s.sectionId);
      const allComplete = allSectionIds.every(id => id === currentFlat.sectionId || completedSections.has(id));
      if (allComplete && !progressData?.some(p => p.chapterId === currentFlat.chapterId && p.completed)) {
        syncChapterToDb(currentFlat.chapterId);
      }
    }
  }, [nextFlat, currentFlat, selectedChapterId, markComplete, flatSections, completedSections, user, syncChapterToDb, progressData]);

  const handlePrevious = useCallback(() => {
    if (!prevFlat) return;
    if (prevFlat.chapterId !== selectedChapterId) {
      setSelectedChapterId(prevFlat.chapterId);
    }
    setSelectedSectionId(prevFlat.sectionId);
    setSidebarOpen(false);
    contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [prevFlat, selectedChapterId]);

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

  // First-time user onboarding
  const { showOverlay, dismissOverlay } = useFirstTimeOverlay(archetype);

  // Hydrate localStorage subsection progress from DB chapter progress (backward compat)
  useEffect(() => {
    if (progressData && flatSections.length > 0) {
      const completedChapterIds = progressData.filter(p => p.completed).map(p => p.chapterId);
      completedChapterIds.forEach(chapterId => {
        const chapterSections = flatSections.filter(s => s.chapterId === chapterId);
        chapterSections.forEach(s => markComplete(s.sectionId));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData, flatSections]);

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
                <Link href={user ? "/dashboard" : `/login?redirect=${encodeURIComponent(`/playbook/${archetype}`)}`}>
                  <Button variant="outline" className="w-full" data-testid="button-dashboard">
                    {user ? "Back to Dashboard" : "Log in to save / view dashboard"}
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
    const loginUrl = `/login?redirect=${encodeURIComponent(`/playbook/${archetype}`)}`;
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
                  Please log in to view your playbook
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Log in to access your premium playbook. You'll be redirected back here after signing in.
                </p>
              </div>
              <div className="space-y-3">
                <Link href={loginUrl}>
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
                <Link href={user ? "/dashboard" : `/login?redirect=${encodeURIComponent(`/playbook/${archetype}`)}`}>
                  <Button variant="outline" className="w-full" data-testid="button-dashboard">
                    {user ? "View Dashboard" : "Log in to save / view dashboard"}
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
              <Link href={user ? "/dashboard" : `/login?redirect=${encodeURIComponent(`/playbook/${archetype}`)}`}>
                <Button variant="ghost" size="sm" data-testid="button-dashboard">
                  {user ? "Dashboard" : "Log in to save / view dashboard"}
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <ProgressMilestones
              completedSections={completedCount}
              totalSections={flatSections.length}
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
              const chapterSectionIds = chapter.sections.map(s => s.id);
              const chapterCompletedCount = chapterSectionIds.filter(id => isSectionComplete(id)).length;
              const chapterAllComplete = chapterCompletedCount === chapterSectionIds.length;
              const chapterPartial = chapterCompletedCount > 0 && !chapterAllComplete;
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
                      w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all duration-150
                      ${isActive
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold'
                        : chapterAllComplete
                          ? 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                    `}
                    data-testid={`chapter-${chapter.id}`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {chapterAllComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      ) : chapterPartial ? (
                        <CircleDot className="h-5 w-5 text-amber-500 shrink-0" />
                      ) : isActive ? (
                        <CircleDot className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 shrink-0" />
                      )}
                      <span className={chapterAllComplete && !isActive ? 'line-through decoration-1' : ''}>{chapter.title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                  {isActive && (
                    <div className="ml-7 mt-1 space-y-0.5 pb-1">
                      {chapter.sections.map(section => {
                        const sectionDone = isSectionComplete(section.id);
                        const sectionActive = selectedSectionId === section.id;
                        return (
                          <button
                            key={section.id}
                            onClick={() => { setSelectedSectionId(section.id); setSidebarOpen(false); }}
                            className={`
                              w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-all duration-150
                              ${sectionActive
                                ? 'bg-primary/8 dark:bg-primary/15 text-foreground font-medium'
                                : sectionDone
                                  ? 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                            `}
                            data-testid={`section-${section.id}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {sectionDone ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                              ) : sectionActive ? (
                                <CircleDot className="h-3.5 w-3.5 text-primary shrink-0" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
                              )}
                              <span className={`truncate ${sectionDone && !sectionActive ? 'line-through decoration-1' : ''}`}>{section.title}</span>
                            </div>
                            <span className="text-[10px] text-gray-300 dark:text-gray-600 ml-2 shrink-0 tabular-nums">
                              {calculateReadingTime(section.content, section.id)}
                            </span>
                          </button>
                        );
                      })}
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
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <div ref={contentTopRef}>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                        {selectedChapter?.title}
                      </p>
                      <CardTitle className="text-2xl sm:text-[1.7rem] leading-tight">{selectedSection.title}</CardTitle>
                      {currentReadingTime && (
                        <div className="flex items-center gap-1.5 mt-3">
                          <Badge variant="secondary" className="text-xs gap-1 font-normal text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {currentReadingTime}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-0">
                    <ContentRenderer 
                      content={selectedSection.content}
                      sectionId={selectedSectionId}
                      archetype={archetype}
                      session={session}
                    />
                    
                    {/* Navigation */}
                    <div className="pt-6 border-t border-muted space-y-4">
                      {/* Completion indicator */}
                      {currentFlat && isSectionComplete(currentFlat.sectionId) && (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Section complete</span>
                        </div>
                      )}

                      {/* Nav buttons */}
                      <div className="flex gap-3">
                        {prevFlat && (
                          <Button
                            variant="outline"
                            className="flex-1 h-12"
                            onClick={handlePrevious}
                          >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span className="truncate">Previous</span>
                          </Button>
                        )}
                        {nextFlat ? (
                          <Button
                            className="flex-1 h-12"
                            onClick={handleNext}
                          >
                            <span className="truncate">
                              {nextFlat.chapterId !== selectedChapterId
                                ? `Start: ${nextFlat.chapterTitle}`
                                : "Next"}
                            </span>
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              if (currentFlat) markComplete(currentFlat.sectionId);
                              // Silently sync final chapter to DB
                              if (currentFlat && user) {
                                const chapterSections = flatSections.filter(s => s.chapterId === currentFlat.chapterId);
                                const allSectionIds = chapterSections.map(s => s.sectionId);
                                const allComplete = allSectionIds.every(id => id === currentFlat.sectionId || completedSections.has(id));
                                if (allComplete && !isChapterComplete(currentFlat.chapterId)) {
                                  syncChapterToDb(currentFlat.chapterId);
                                }
                              }
                              toast({ description: "Congratulations! You've completed the playbook!" });
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Complete Playbook
                          </Button>
                        )}
                      </div>

                      {/* Progress counter */}
                      <p className="text-xs text-center text-muted-foreground">
                        Section {currentFlatIndex + 1} of {flatSections.length}
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
