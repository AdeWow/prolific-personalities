export interface ToolData {
  name: string;
  url: string;
  category: string;
  cost: string;
  platforms: string[];
  purpose?: string;
}

export const toolUrls: Record<string, string> = {
  "Notion": "https://www.notion.com",
  "Todoist": "https://todoist.com",
  "Trello": "https://trello.com",
  "Forest App": "https://www.forestapp.cc",
  "Freedom": "https://freedom.to",
  "RescueTime": "https://www.rescuetime.com",
  "Brain.fm": "https://www.brain.fm",
  "Sunsama": "https://www.sunsama.com",
  "Things 3": "https://culturedcode.com/things/",
  "Toggl": "https://toggl.com/track/",
  "Habitify": "https://www.habitify.me",
  "Fantastical": "https://flexibits.com/fantastical",
  "Google Calendar": "https://calendar.google.com",
  "Google Keep": "https://keep.google.com",
  "Voice Memos": "https://apps.apple.com/us/app/voice-memos/id1069512134",
  "Evernote": "https://evernote.com",
  "Obsidian": "https://obsidian.md",
  "Roam": "https://roamresearch.com",
  "Asana": "https://asana.com",
};

export const combinedToolUrls: Record<string, { first: { name: string; url: string }; second: { name: string; url: string } }> = {
  "Things 3 or Todoist": {
    first: { name: "Things 3", url: "https://culturedcode.com/things/" },
    second: { name: "Todoist", url: "https://todoist.com" }
  },
  "Fantastical or Google Calendar": {
    first: { name: "Fantastical", url: "https://flexibits.com/fantastical" },
    second: { name: "Google Calendar", url: "https://calendar.google.com" }
  },
  "Evernote or Google Keep": {
    first: { name: "Evernote", url: "https://evernote.com" },
    second: { name: "Google Keep", url: "https://keep.google.com" }
  },
  "Notion or Asana": {
    first: { name: "Notion", url: "https://www.notion.com" },
    second: { name: "Asana", url: "https://asana.com" }
  },
  "Obsidian or Roam": {
    first: { name: "Obsidian", url: "https://obsidian.md" },
    second: { name: "Roam", url: "https://roamresearch.com" }
  },
};

export const toolPlatforms: Record<string, string[]> = {
  "Notion": ["Web", "iOS", "Android", "Mac", "Windows"],
  "Todoist": ["Web", "iOS", "Android", "Mac", "Windows"],
  "Trello": ["Web", "iOS", "Android"],
  "Forest App": ["iOS", "Android"],
  "Freedom": ["Mac", "Windows", "iOS", "Android", "Chrome"],
  "RescueTime": ["Mac", "Windows", "Linux", "Android"],
  "Brain.fm": ["Web", "iOS", "Android"],
  "Sunsama": ["Web", "Mac", "Windows"],
  "Things 3": ["Mac", "iOS"],
  "Toggl": ["Web", "iOS", "Android", "Mac", "Windows"],
  "Habitify": ["Web", "iOS", "Android", "Mac"],
  "Fantastical": ["Mac", "iOS"],
  "Google Calendar": ["Web", "iOS", "Android"],
  "Google Keep": ["Web", "iOS", "Android"],
  "Voice Memos": ["iOS"],
  "Evernote": ["Web", "iOS", "Android", "Mac", "Windows"],
  "Obsidian": ["Web", "iOS", "Android", "Mac", "Windows", "Linux"],
  "Roam": ["Web"],
  "Asana": ["Web", "iOS", "Android"],
  "Things 3 or Todoist": ["Mac", "iOS", "Web", "Android", "Windows"],
  "Fantastical or Google Calendar": ["Mac", "iOS", "Web", "Android"],
  "Evernote or Google Keep": ["Web", "iOS", "Android", "Mac", "Windows"],
  "Notion or Asana": ["Web", "iOS", "Android", "Mac", "Windows"],
  "Obsidian or Roam": ["Web", "iOS", "Android", "Mac", "Windows", "Linux"],
};

export function getToolUrl(toolName: string): string | undefined {
  const exactMatch = toolUrls[toolName];
  if (exactMatch) return exactMatch;
  
  for (const [key, url] of Object.entries(toolUrls)) {
    if (toolName.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  return undefined;
}

export function getToolPlatforms(toolName: string): string[] {
  const exactMatch = toolPlatforms[toolName];
  if (exactMatch) return exactMatch;
  
  for (const [key, platforms] of Object.entries(toolPlatforms)) {
    if (toolName.toLowerCase().includes(key.toLowerCase())) {
      return platforms;
    }
  }
  return [];
}

export const archetypeSlugs: Record<string, string> = {
  "Chaotic Creative": "chaotic-creative",
  "Anxious Perfectionist": "anxious-perfectionist",
  "Structured Achiever": "structured-achiever",
  "Novelty Seeker": "novelty-seeker",
  "Strategic Planner": "strategic-planner",
  "Flexible Improviser": "flexible-improviser",
  "Adaptive Generalist": "adaptive-generalist",
};

export function getArchetypeSlug(archetypeName: string): string | undefined {
  return archetypeSlugs[archetypeName];
}

export const toolCategories = [
  "All",
  "Task Management",
  "Focus & Blocking",
  "Time Tracking",
  "Visual Organization",
  "Project Management",
  "Daily Planning",
  "Focus Music",
];

export function isFreeOrFreemium(cost: string): boolean {
  const lower = cost.toLowerCase();
  return lower.includes("free");
}
