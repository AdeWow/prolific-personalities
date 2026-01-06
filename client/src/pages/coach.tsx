import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, Sparkles, Plus, Trash2, MessageCircle, ThumbsUp, ThumbsDown, Crown, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import type { ChatConversation, ChatMessage } from "@shared/schema";

interface UsageInfo {
  remaining: number;
  limit: number;
  isPremium: boolean;
}

const SUGGESTED_PROMPTS = [
  "I'm feeling stuck on a project",
  "Help me plan my day",
  "Why do I keep procrastinating?",
  "What's my archetype's biggest strength?",
  "How can I maintain focus better?",
  "I'm overwhelmed with too many tasks",
];

export default function CoachPage() {
  const [, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [sessionId] = useState(() => localStorage.getItem("quizSessionId") || "");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: user } = useQuery<{ id: string; firstName?: string } | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: quizResult } = useQuery({
    queryKey: ["/api/quiz/results", sessionId],
    enabled: !!sessionId,
  });

  const { data: usage, refetch: refetchUsage } = useQuery<UsageInfo>({
    queryKey: ["/api/ai-coach/usage", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/ai-coach/usage?sessionId=${sessionId}`);
      return res.json();
    },
  });

  const { data: conversations = [], refetch: refetchConversations } = useQuery<ChatConversation[]>({
    queryKey: ["/api/chat/conversations", sessionId, user?.id],
    queryFn: async () => {
      if (!user?.id && !sessionId) return [];
      const params = user?.id ? "" : `?sessionId=${sessionId}`;
      const res = await fetch(`/api/chat/conversations${params}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!(user?.id || sessionId),
  });

  const archetype = (quizResult as any)?.archetype || null;
  const scores = (quizResult as any)?.scores || null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentResponse]);

  useEffect(() => {
    trackEvent("coach_page_view", "Navigation", "AI Coach Page");
  }, []);

  const loadConversation = async (conversationId: number) => {
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`);
      const msgs: ChatMessage[] = await res.json();
      setMessages(msgs.map(m => ({ role: m.role as "user" | "assistant", content: m.content })));
      setSelectedConversation(conversationId);
    } catch (e) {
      console.error("Failed to load conversation:", e);
    }
  };

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("/api/chat/conversations", "POST", {
        sessionId,
        archetype,
        title: "New Conversation"
      });
      return res.json();
    },
    onSuccess: (data) => {
      setSelectedConversation(data.id);
      setMessages([]);
      refetchConversations();
    }
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/chat/conversations/${id}`, "DELETE");
    },
    onSuccess: () => {
      if (selectedConversation) {
        setSelectedConversation(null);
        setMessages([]);
      }
      refetchConversations();
    }
  });

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isStreaming) return;

    const userMessage = messageText.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsStreaming(true);
    setCurrentResponse("");

    trackEvent("ai_coach_message_sent", "AI Coach", archetype || "no_archetype");

    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          archetype,
          scores,
          history: messages,
          conversationId: selectedConversation,
          sessionId,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.limitReached) {
                setMessages(prev => [...prev, { 
                  role: "assistant", 
                  content: data.message 
                }]);
                setIsStreaming(false);
                return;
              }

              if (data.content) {
                fullResponse += data.content;
                setCurrentResponse(fullResponse);
              }
              
              if (data.done) {
                setMessages(prev => [...prev, { role: "assistant", content: fullResponse }]);
                setCurrentResponse("");
                refetchUsage();
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50 flex flex-col">
      <SEOHead
        title="AI Productivity Coach | Prolific Personalities"
        description="Get personalized productivity advice from your AI coach based on your unique archetype. Overcome procrastination, improve focus, and work more effectively."
        keywords="AI productivity coach, personalized productivity advice, archetype coaching, productivity tips"
      />
      <Header />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <div className="w-64 border-r border-neutral-200 bg-white/50 p-4 hidden md:flex flex-col">
          <Button 
            onClick={() => createConversationMutation.mutate()}
            className="w-full mb-4 gradient-primary"
            disabled={createConversationMutation.isPending}
            data-testid="button-new-conversation"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations?.map((conv) => (
              <div 
                key={conv.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conv.id 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-neutral-100"
                }`}
                onClick={() => loadConversation(conv.id)}
                data-testid={`conversation-item-${conv.id}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm">{conv.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversationMutation.mutate(conv.id);
                  }}
                  data-testid={`delete-conversation-${conv.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Usage Counter */}
          <Separator className="my-4" />
          <div className="text-center">
            {usage?.isPremium ? (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Unlimited Coaching
              </Badge>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-neutral-600">
                  {usage?.remaining ?? 10}/{usage?.limit ?? 10} messages today
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLocation("/pricing")}
                  className="w-full text-xs"
                  data-testid="button-upgrade"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade for Unlimited
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-200 bg-white/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-neutral-800">AI Productivity Coach</h1>
                <p className="text-sm text-neutral-500">
                  {archetype ? `Personalized for your ${archetype.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} archetype` : "Take the quiz for personalized coaching"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 && !currentResponse ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-2">
                  Welcome to AI Coaching
                </h2>
                <p className="text-neutral-600 mb-6 max-w-md">
                  {archetype 
                    ? `I'm here to help you work more effectively as a ${archetype.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}. What would you like help with?`
                    : "I can provide general productivity advice. Take the quiz for personalized coaching based on your archetype!"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="justify-start text-left h-auto py-3 px-4"
                      onClick={() => handleSuggestedPrompt(prompt)}
                      data-testid={`suggested-prompt-${i}`}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary text-white"
                          : "bg-white shadow-sm border border-neutral-100"
                      }`}
                      data-testid={`message-${msg.role}-${i}`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-neutral-400 hover:text-green-500"
                            data-testid={`feedback-helpful-${i}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-neutral-400 hover:text-red-500"
                            data-testid={`feedback-not-helpful-${i}`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {currentResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white shadow-sm border border-neutral-100">
                      <p className="whitespace-pre-wrap">{currentResponse}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                {isStreaming && !currentResponse && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-4 py-3 bg-white shadow-sm border border-neutral-100">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI Coach is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-neutral-200 bg-white/50">
            {/* Mobile Usage Counter */}
            <div className="md:hidden mb-3 text-center">
              {usage?.isPremium ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium - Unlimited
                </Badge>
              ) : (
                <p className="text-sm text-neutral-600">
                  {usage?.remaining ?? 10}/{usage?.limit ?? 10} messages remaining today
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI coach anything..."
                className="flex-1"
                disabled={isStreaming || (usage?.remaining === 0 && !usage?.isPremium)}
                data-testid="input-chat-message"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isStreaming || (usage?.remaining === 0 && !usage?.isPremium)}
                className="gradient-primary"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {usage?.remaining === 0 && !usage?.isPremium && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <p className="text-sm text-amber-800 mb-2">
                  You've used all your free messages for today.
                </p>
                <Button 
                  size="sm" 
                  onClick={() => setLocation("/pricing")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                  data-testid="button-upgrade-cta"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Productivity Partner
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
