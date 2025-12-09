import { useEffect, useState, useRef } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { playbookContentMap } from "@shared/playbookContent";
import { PDFPreview } from "@/components/pdf-preview";
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
  const { toast } = useToast();
  const archetype = params?.archetype || "";

  // Get playbook content - must be before any hooks that depend on it
  const playbook = playbookContentMap[archetype];

  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noteSaveStatus, setNoteSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
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

  // Check if user has premium access
  const { data: accessData, isLoading: isAccessLoading, isError: isAccessError } = useQuery<{ hasAccess: boolean }>({
    queryKey: [`/api/playbook/${archetype}/access`],
    enabled: !!user && !!archetype,
    retry: 1,
  });

  // Fetch progress data - always call these hooks but they'll only fetch when enabled
  const { data: progressData } = useQuery<{ chapterId: string; completed: number; completedAt: string | null }[]>({
    queryKey: [`/api/playbook/${archetype}/progress`],
    enabled: !!user && !!archetype && !!accessData?.hasAccess,
  });

  const { data: actionPlanData } = useQuery<{ dayNumber: number; taskId: string; completedAt: string }[]>({
    queryKey: [`/api/playbook/${archetype}/action-plan`],
    enabled: !!user && !!archetype && !!accessData?.hasAccess,
  });

  const { data: toolsData } = useQuery<{ toolId: string; status: string; notes: string }[]>({
    queryKey: [`/api/playbook/${archetype}/tools`],
    enabled: !!user && !!archetype && !!accessData?.hasAccess,
  });

  const { data: notesData } = useQuery<{ id: number; sectionId: string; content: string }[]>({
    queryKey: [`/api/playbook/${archetype}/notes`],
    enabled: !!user && !!archetype && !!accessData?.hasAccess,
  });

  // Mutations - always declare these
  const toggleChapterMutation = useMutation({
    mutationFn: ({ chapterId, completed }: { chapterId: string; completed: boolean }) => 
      apiRequest('POST', `/api/playbook/${archetype}/progress/chapter`, { chapterId, completed }),
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
      apiRequest('POST', `/api/playbook/${archetype}/action-plan/task`, { dayNumber, taskId, completed }),
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
      apiRequest('POST', `/api/playbook/${archetype}/tools/update`, { toolId, status: status.toLowerCase().replace(' ', '_'), notes }),
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
      apiRequest('POST', `/api/playbook/${archetype}/notes`, { sectionId, content }),
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

  // CONDITIONAL RENDERING SECTION

  // Loading state
  if (isAuthLoading || (user && isAccessLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading playbook...</p>
        </div>
      </div>
    );
  }

  // Error checking access
  if (user && isAccessError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
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

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <LogIn className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
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
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="w-full"
                  data-testid="button-login"
                >
                  Log In
                </Button>
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

  // No premium access
  if (!accessData?.hasAccess) {
    const archetypeName = archetype
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
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
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
              <span className="font-semibold text-gray-900 dark:text-white">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'block' : 'hidden'} lg:block
          fixed lg:sticky top-[140px] left-0 h-[calc(100vh-140px)]
          w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          overflow-y-auto z-30 lg:z-0
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
                      ${isActive ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Tabs defaultValue="content" className="space-y-6">
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
              {selectedSection && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl">{selectedSection.title}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {selectedChapter?.title}
                        </p>
                      </div>
                      <Checkbox
                        checked={isChapterComplete(selectedChapterId)}
                        onCheckedChange={(checked) => {
                          toggleChapterMutation.mutate({ 
                            chapterId: selectedChapterId, 
                            completed: !!checked 
                          });
                        }}
                        disabled={toggleChapterMutation.isPending}
                        data-testid="checkbox-complete-chapter"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    {selectedSection.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="action-plan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>30-Day Action Plan</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track your daily progress and build momentum
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {playbook?.actionPlan.map(task => {
                    const isComplete = isTaskComplete(task.day, task.id);
                    return (
                      <div
                        key={task.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        data-testid={`task-day-${task.day}`}
                      >
                        <Checkbox
                          checked={isComplete}
                          onCheckedChange={(checked) => {
                            toggleActionPlanMutation.mutate({ 
                              dayNumber: task.day, 
                              taskId: task.id, 
                              completed: !!checked 
                            });
                          }}
                          disabled={toggleActionPlanMutation.isPending}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Day {task.day}</Badge>
                            <span className={`font-medium ${isComplete ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {task.task}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Tools</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track which productivity tools you're implementing
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {playbook?.recommendedTools.map(toolId => {
                    const status = getToolStatus(toolId);
                    const toolNotes = toolsData?.find(t => t.toolId === toolId)?.notes || "";
                    return (
                      <div key={toolId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                            {toolId.replace(/-/g, ' ')}
                          </h3>
                          <Select
                            value={status}
                            onValueChange={(value) => updateToolMutation.mutate({ toolId, status: value, notes: toolNotes })}
                            disabled={updateToolMutation.isPending}
                          >
                            <SelectTrigger className="w-40" data-testid={`select-tool-${toolId}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="Testing">Testing</SelectItem>
                              <SelectItem value="Using Daily">Using Daily</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          placeholder="Add notes about this tool..."
                          defaultValue={toolNotes}
                          onBlur={(e) => {
                            if (e.target.value !== toolNotes) {
                              updateToolMutation.mutate({ toolId, status, notes: e.target.value });
                            }
                          }}
                          disabled={updateToolMutation.isPending}
                          className="mt-2"
                          data-testid={`textarea-tool-notes-${toolId}`}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Notes</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add your reflections and insights for: {selectedSection?.title}
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your notes here..."
                    defaultValue={getSectionNote(selectedSectionId)?.content || ""}
                    onChange={(e) => {
                      handleNoteSave(selectedSectionId, e.target.value);
                    }}
                    disabled={saveNoteMutation.isPending}
                    className="min-h-[200px]"
                    data-testid="textarea-section-notes"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {noteSaveStatus === 'saving' && 'Saving...'}
                      {noteSaveStatus === 'saved' && '✓ Saved'}
                      {noteSaveStatus === 'error' && '✗ Error saving'}
                      {noteSaveStatus === 'idle' && 'Your notes are automatically saved'}
                    </p>
                  </div>
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
