// Shared tool metadata used by ToolsFocused (tracking) and InlineToolCard (inline mentions).
// This is the single source of truth for tool display names, taglines, and URLs.

export interface ToolInfoEntry {
  name: string;
  tagline: string;
  why: string;
  url?: string;
}

export const toolInfo: Record<string, ToolInfoEntry> = {
  todoist: {
    name: "Todoist",
    tagline: "Smart task management for structured minds",
    why: "Perfect for breaking down projects into actionable steps with deadlines",
    url: "https://todoist.com",
  },
  notion: {
    name: "Notion",
    tagline: "All-in-one workspace for organized thinking",
    why: "Ideal for creating interconnected systems and knowledge bases",
    url: "https://www.notion.so",
  },
  "google-calendar": {
    name: "Google Calendar",
    tagline: "Time blocking made simple",
    why: "Essential for protecting focus time and creating daily structure",
    url: "https://calendar.google.com",
  },
  "toggl-track": {
    name: "Toggl Track",
    tagline: "Understand where your time really goes",
    why: "Reveals patterns in how you spend your productive hours",
    url: "https://toggl.com/track",
  },
  forest: {
    name: "Forest",
    tagline: "Gamified focus sessions",
    why: "Adds fun to focus blocks - grow trees by staying on task",
    url: "https://www.forestapp.cc",
  },
  rescuetime: {
    name: "RescueTime",
    tagline: "Automatic time tracking",
    why: "Runs in background to show your true productivity patterns",
    url: "https://www.rescuetime.com",
  },
  focusmate: {
    name: "Focusmate",
    tagline: "Virtual coworking sessions",
    why: "Body doubling accountability that gets you started on hard tasks",
    url: "https://www.focusmate.com",
  },
  freedom: {
    name: "Freedom",
    tagline: "Block distracting sites",
    why: "Creates boundaries when willpower alone isn't enough",
    url: "https://freedom.to",
  },
  "cold-turkey": {
    name: "Cold Turkey",
    tagline: "Unbreakable website blocker",
    why: "The nuclear option when you need serious focus protection",
    url: "https://getcoldturkey.com",
  },
  sunsama: {
    name: "Sunsama",
    tagline: "Calm daily planning",
    why: "Brings mindfulness to your daily task review",
    url: "https://www.sunsama.com",
  },
  "apple-notes": {
    name: "Apple Notes",
    tagline: "Quick, frictionless note capture",
    why: "Zero-friction capture when ideas strike — already on your phone",
    url: "https://apps.apple.com/app/notes/id1110145109",
  },
  pomofocus: {
    name: "Pomofocus",
    tagline: "Simple Pomodoro timer",
    why: "Free, browser-based, no setup — just start the timer",
    url: "https://pomofocus.io",
  },
  momentum: {
    name: "Momentum",
    tagline: "New tab dashboard for focus",
    why: "Replaces distracting new-tab page with your daily focus",
    url: "https://momentumdash.com",
  },
  trello: {
    name: "Trello",
    tagline: "Visual project boards",
    why: "Drag-and-drop simplicity for managing tasks and projects",
    url: "https://trello.com",
  },
  beeminder: {
    name: "Beeminder",
    tagline: "Put money on your goals",
    why: "Financial stakes turn good intentions into consistent action",
    url: "https://www.beeminder.com",
  },
  obsidian: {
    name: "Obsidian",
    tagline: "Local-first knowledge base",
    why: "Markdown-based notes with powerful linking for deep thinkers",
    url: "https://obsidian.md",
  },
};

// Maps text patterns found in playbook content to toolIds.
// Ordered longest/most-specific first to avoid partial matches.
// Excluded: "momentum" (too common as regular English word),
//           "notion" lowercase (too generic — matched case-sensitively below).
export const TOOL_NAME_ALIASES: Array<{
  pattern: string;
  toolId: string;
  caseSensitive?: boolean;
}> = [
  // URL-style mentions (most specific)
  { pattern: "focusmate.com", toolId: "focusmate" },
  { pattern: "pomofocus.io", toolId: "pomofocus" },
  // Multi-word tool names
  { pattern: "forest app", toolId: "forest" },
  { pattern: "cold turkey", toolId: "cold-turkey" },
  { pattern: "google calendar", toolId: "google-calendar" },
  { pattern: "toggl track", toolId: "toggl-track" },
  { pattern: "apple notes", toolId: "apple-notes" },
  // Single-word (case-insensitive)
  { pattern: "focusmate", toolId: "focusmate" },
  { pattern: "pomofocus", toolId: "pomofocus" },
  { pattern: "rescuetime", toolId: "rescuetime" },
  { pattern: "todoist", toolId: "todoist" },
  { pattern: "freedom", toolId: "freedom" },
  { pattern: "sunsama", toolId: "sunsama" },
  { pattern: "beeminder", toolId: "beeminder" },
  { pattern: "obsidian", toolId: "obsidian" },
  { pattern: "trello", toolId: "trello" },
  { pattern: "forest", toolId: "forest" },
  { pattern: "toggl", toolId: "toggl-track" },
  // Case-sensitive to avoid matching "the notion that..."
  { pattern: "Notion", toolId: "notion", caseSensitive: true },
];
