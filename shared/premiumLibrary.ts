/**
 * Premium PDF Library catalog
 * All files hosted on Cloudflare R2 at R2_BASE
 */

export const R2_BASE = "https://files.prolificpersonalities.com";

export type PdfCategory =
  | "Framework"
  | "Tools"
  | "30-Day Plan"
  | "Failure Modes"
  | "Case Studies"
  | "Research"
  | "Templates"
  | "Strategy";

export interface PdfItem {
  filename: string;
  title: string;
  description: string;
  category: PdfCategory;
}

export interface ArchetypeLibrary {
  prefix: string;
  deepDives: PdfItem[];
  templates: PdfItem[];
}

/** Map archetype slug → two-letter prefix */
export const archetypePrefix: Record<string, string> = {
  "adaptive-generalist": "AG",
  "anxious-perfectionist": "AP",
  "chaotic-creative": "CC",
  "flexible-improviser": "FI",
  "novelty-seeker": "NS",
  "structured-achiever": "SA",
  "strategic-planner": "SP",
};

const libraries: Record<string, ArchetypeLibrary> = {
  "adaptive-generalist": {
    prefix: "AG",
    deepDives: [
      { filename: "AG_DeepDive_1_Advanced_Context_Diagnosis.pdf", title: "Advanced Context Diagnosis", description: "Learn to read your environment and adapt your approach in real-time", category: "Framework" },
      { filename: "AG_DeepDive_2_Cross_Archetype_Integration.pdf", title: "Cross-Archetype Integration", description: "Borrow strategies from all 6 other archetypes strategically", category: "Framework" },
      { filename: "AG_DeepDive_3_Modular_Toolkit.pdf", title: "Modular Toolkit", description: "Build a flexible system you can reconfigure for any context", category: "Framework" },
      { filename: "AG_DeepDive_4_30_Day_Plan.pdf", title: "30-Day Implementation Plan", description: "Day-by-day guide to building your adaptive system", category: "30-Day Plan" },
      { filename: "AG_DeepDive_5_Failure_Modes.pdf", title: "Failure Modes", description: "Recognize and recover from your most common productivity traps", category: "Failure Modes" },
      { filename: "AG_DeepDive_6_Case_Studies.pdf", title: "Case Studies", description: "Real stories from Adaptive Generalists who found their rhythm", category: "Case Studies" },
      { filename: "AG_DeepDive_7_Research_Foundation.pdf", title: "Research Foundation", description: "The science behind adaptive productivity", category: "Research" },
      { filename: "AG_DeepDive_8_Advanced_Tools.pdf", title: "Advanced Tools", description: "Tools specifically chosen for context-switching brains", category: "Tools" },
      { filename: "AG_DeepDive_9_Templates.pdf", title: "Templates Pack", description: "Printable worksheets and tracking templates", category: "Templates" },
    ],
    templates: [],
  },

  "anxious-perfectionist": {
    prefix: "AP",
    deepDives: [
      { filename: "AP_DeepDive_1_Time_Boxing.pdf", title: "Time-Boxing Deep Dive", description: "Master the art of working within time limits, not quality limits", category: "Framework" },
      { filename: "AP_DeepDive_2_WOOP_Mental_Contrasting.pdf", title: "WOOP & Mental Contrasting", description: "A research-backed method to bridge the gap between planning and doing", category: "Framework" },
      { filename: "AP_DeepDive_3_Exposure_Therapy.pdf", title: "Exposure Therapy for Imperfection", description: "Gradually build tolerance for shipping imperfect work", category: "Framework" },
      { filename: "AP_DeepDive_4_Tools_Database.pdf", title: "Tools Database", description: "Tools specifically chosen for perfectionist brains", category: "Tools" },
      { filename: "AP_DeepDive_5_30_Day_Plan.pdf", title: "30-Day Implementation Plan", description: "Day-by-day guide from paralysis to imperfect progress", category: "30-Day Plan" },
      { filename: "AP_DeepDive_6_Failure_Modes.pdf", title: "Failure Modes", description: "Recognize the Revision Spiral and other perfectionist traps", category: "Failure Modes" },
      { filename: "AP_DeepDive_7_Case_Studies.pdf", title: "Case Studies", description: "Real stories from Anxious Perfectionists who learned to ship", category: "Case Studies" },
      { filename: "AP_DeepDive_8_Research.pdf", title: "Research Foundation", description: "The science of perfectionism and productivity", category: "Research" },
      { filename: "AP_DeepDive_9_Templates_Pack.pdf", title: "Templates Pack", description: "All worksheets and trackers in one download", category: "Templates" },
    ],
    templates: [
      { filename: "AP_Template_1_Done_When_Criteria.pdf", title: "Done-When Criteria Worksheet", description: "Define exactly when a task is complete — before you start", category: "Templates" },
      { filename: "AP_Template_2_Time_Boxing_Tracker.pdf", title: "Time-Boxing Tracker", description: "Log your time-boxed sessions and track improvement", category: "Templates" },
      { filename: "AP_Template_3_WOOP_Worksheet.pdf", title: "WOOP Worksheet", description: "Wish, Outcome, Obstacle, Plan — structured goal-setting", category: "Templates" },
      { filename: "AP_Template_4_Exposure_Ladder.pdf", title: "Exposure Ladder", description: "Gradually increase your comfort with imperfection", category: "Templates" },
      { filename: "AP_Template_5_Evidence_Log.pdf", title: "Evidence Log", description: "Track proof that good enough actually works", category: "Templates" },
      { filename: "AP_Template_6_Self_Compassion_Scripts.pdf", title: "Self-Compassion Scripts", description: "Ready-to-use scripts for when self-criticism hits", category: "Templates" },
      { filename: "AP_Template_7_Weekly_Review.pdf", title: "Weekly Review Template", description: "Structured reflection on progress over perfection", category: "Templates" },
    ],
  },

  "chaotic-creative": {
    prefix: "CC",
    deepDives: [
      { filename: "CC_DeepDive_1_Pomodoro_Body_Doubling.pdf", title: "Pomodoro & Body Doubling", description: "External structure for brains that resist internal structure", category: "Framework" },
      { filename: "CC_DeepDive_1b_Single_Project_Lockdown.pdf", title: "Single Project Lockdown", description: "How to finish one thing when your brain wants to start ten", category: "Framework" },
      { filename: "CC_DeepDive_2_Capture_Triage_Archive.pdf", title: "Capture, Triage, Archive", description: "A system for managing the flood of ideas without losing them", category: "Framework" },
      { filename: "CC_DeepDive_2b_Implementation_Intentions.pdf", title: "Implementation Intentions", description: "Pre-decide your actions so you don't have to think in the moment", category: "Framework" },
      { filename: "CC_DeepDive_3_Boredom_Bridge.pdf", title: "The Boredom Bridge", description: "How to push through the boring middle of every project", category: "Framework" },
      { filename: "CC_DeepDive_3b_Energy_Management.pdf", title: "Energy Management", description: "Work with your energy cycles, not against them", category: "Framework" },
      { filename: "CC_DeepDive_4_Tools_Database.pdf", title: "Tools Database", description: "Tools for creative, non-linear brains", category: "Tools" },
      { filename: "CC_DeepDive_5_30_Day_Plan.pdf", title: "30-Day Implementation Plan", description: "Day-by-day guide to building structure without killing creativity", category: "30-Day Plan" },
      { filename: "CC_DeepDive_6_Failure_Modes.pdf", title: "Failure Modes", description: "Recognize Shiny Object Syndrome and other creative traps", category: "Failure Modes" },
      { filename: "CC_DeepDive_7_Case_Studies.pdf", title: "Case Studies", description: "Real stories from Chaotic Creatives who learned to finish", category: "Case Studies" },
      { filename: "CC_DeepDive_8_Research.pdf", title: "Research Foundation", description: "The neuroscience of creativity and executive function", category: "Research" },
      { filename: "CC_DeepDive_9_Templates_Pack.pdf", title: "Templates Pack", description: "All worksheets and trackers in one download", category: "Templates" },
    ],
    templates: [
      { filename: "CC_CC_TEMPLATES_1_to_4.pdf", title: "Templates 1-4", description: "Core worksheets for daily structure and capture", category: "Templates" },
      { filename: "CC_CC_TEMPLATES_5_to_7.pdf", title: "Templates 5-7", description: "Advanced templates for project tracking and review", category: "Templates" },
    ],
  },

  "flexible-improviser": {
    prefix: "FI",
    deepDives: [
      { filename: "FI_DeepDive_1_Anti_System_Success.pdf", title: "Anti-System Success", description: "Why traditional systems fail you and what works instead", category: "Framework" },
      { filename: "FI_DeepDive_2_Working_With_Structured_People.pdf", title: "Working With Structured People", description: "Navigate teams and relationships that expect rigid planning", category: "Framework" },
      { filename: "FI_DeepDive_3_Chaos_Tolerance.pdf", title: "Chaos Tolerance", description: "Build your capacity to thrive in unpredictable environments", category: "Framework" },
      { filename: "FI_DeepDive_4_Role_Selection.pdf", title: "Role Selection", description: "Choose roles and projects that match your adaptive style", category: "Framework" },
      { filename: "FI_DeepDive_5_30_Day_Plan.pdf", title: "30-Day Implementation Plan", description: "A flexible plan for people who hate rigid plans", category: "30-Day Plan" },
      { filename: "FI_DeepDive_6_Failure_Modes.pdf", title: "Failure Modes", description: "Recognize Perpetual Reaction Mode and other traps", category: "Failure Modes" },
      { filename: "FI_DeepDive_7_Case_Studies.pdf", title: "Case Studies", description: "Real stories from Flexible Improvisers who found balance", category: "Case Studies" },
      { filename: "FI_DeepDive_8_Research_Foundation.pdf", title: "Research Foundation", description: "The science behind adaptive and reactive work styles", category: "Research" },
      { filename: "FI_DeepDive_9_Tools_Templates.pdf", title: "Tools & Templates", description: "Tools and worksheets for improvisational productivity", category: "Tools" },
    ],
    templates: [],
  },

  "novelty-seeker": {
    prefix: "NS",
    deepDives: [
      { filename: "NS_DeepDive_1_90_Percent_Threshold.pdf", title: "The 90% Threshold", description: "Why you abandon projects at 90% and how to push through", category: "Framework" },
      { filename: "NS_DeepDive_2_Interest_Rotation_System.pdf", title: "Interest Rotation System", description: "Strategically rotate between projects to stay engaged", category: "Framework" },
      { filename: "NS_DeepDive_3_Tools_Database.pdf", title: "Tools Database", description: "Tools that keep things fresh for novelty-seeking brains", category: "Tools" },
      { filename: "NS_DeepDive_4_30_Day_Plan.pdf", title: "30-Day Implementation Plan", description: "Day-by-day guide to finishing what you start", category: "30-Day Plan" },
      { filename: "NS_DeepDive_5_Failure_Modes.pdf", title: "Failure Modes", description: "Recognize Shiny Object Syndrome and project-hopping patterns", category: "Failure Modes" },
      { filename: "NS_DeepDive_6_Case_Studies.pdf", title: "Case Studies", description: "Real stories from Novelty Seekers who learned to finish", category: "Case Studies" },
      { filename: "NS_DeepDive_7_Research_Foundation.pdf", title: "Research Foundation", description: "The dopamine science behind novelty-seeking", category: "Research" },
      { filename: "NS_DeepDive_8_Monetization_Strategies.pdf", title: "Monetization Strategies", description: "Turn your multi-interest nature into a business advantage", category: "Strategy" },
      { filename: "NS_DeepDive_9_Templates_Pack.pdf", title: "Templates Pack", description: "All worksheets and trackers in one download", category: "Templates" },
    ],
    templates: [],
  },

  "structured-achiever": {
    prefix: "SA",
    deepDives: [
      { filename: "SA_DeepDive_1_The_80_Percent_Rule.pdf", title: "The 80% Rule", description: "How to ship at 80% instead of chasing 100%", category: "Framework" },
      { filename: "SA_DeepDive_2_Sustainable_Intensity.pdf", title: "Sustainable Intensity", description: "High performance without burning out", category: "Framework" },
      { filename: "SA_DeepDive_3_Strategic_Neglect.pdf", title: "Strategic Neglect", description: "Deliberately ignore low-value tasks to protect high-value work", category: "Framework" },
      { filename: "SA_DeepDive_4_System_Simplification.pdf", title: "System Simplification", description: "Strip your productivity system to its essential core", category: "Framework" },
      { filename: "SA_DeepDive_5_Delegation_Protocol.pdf", title: "Delegation Protocol", description: "Let go of tasks that don't need your personal touch", category: "Framework" },
      { filename: "SA_DeepDive_6_Tools_Database.pdf", title: "Tools Database", description: "Tools for structured, high-output brains", category: "Tools" },
      { filename: "SA_DeepDive_7_30_Day_Plan.pdf", title: "30-Day Implementation Plan", description: "Day-by-day guide to sustainable high performance", category: "30-Day Plan" },
      { filename: "SA_DeepDive_8_Failure_Modes.pdf", title: "Failure Modes", description: "Recognize Productivity Porn and other achiever traps", category: "Failure Modes" },
      { filename: "SA_DeepDive_9_Case_Studies.pdf", title: "Case Studies", description: "Real stories from Structured Achievers who found balance", category: "Case Studies" },
    ],
    templates: [],
  },

  "strategic-planner": {
    prefix: "SP",
    deepDives: [
      { filename: "SP_DeepDive_1_80_20_Action_Bias.pdf", title: "80/20 Action Bias", description: "Stop over-planning: the 80/20 rule for execution", category: "Framework" },
      { filename: "SP_DeepDive_2_Just_Good_Enough_Planning.pdf", title: "Just Good Enough Planning", description: "How much planning is enough before you start doing", category: "Framework" },
      { filename: "SP_DeepDive_3_Weekly_Sprint_Rhythm.pdf", title: "Weekly Sprint Rhythm", description: "A structured weekly cadence that balances planning and shipping", category: "Framework" },
      { filename: "SP_DeepDive_4_Tools_Database.pdf", title: "Tools Database", description: "Tools for strategic minds that need action guardrails", category: "Tools" },
      { filename: "SP_DeepDive_5_30_Day_Plan.pdf", title: "30-Day Implementation Plan", description: "Day-by-day guide from analysis paralysis to action", category: "30-Day Plan" },
      { filename: "SP_DeepDive_6_Failure_Modes.pdf", title: "Failure Modes", description: "Recognize Analysis Paralysis and other planning traps", category: "Failure Modes" },
      { filename: "SP_DeepDive_7_Case_Studies.pdf", title: "Case Studies", description: "Real stories from Strategic Planners who learned to ship", category: "Case Studies" },
      { filename: "SP_DeepDive_8_Research.pdf", title: "Research Foundation", description: "The science of planning, decision fatigue, and action bias", category: "Research" },
    ],
    templates: [
      { filename: "SP_Template_1_Planning_Budget_Tracker.pdf", title: "Planning Budget Tracker", description: "Track how much time you spend planning vs doing", category: "Templates" },
      { filename: "SP_Template_2_Just_Good_Enough_Planning.pdf", title: "Good Enough Planning Worksheet", description: "Define your minimum viable plan for any project", category: "Templates" },
      { filename: "SP_Template_3_Weekly_Sprint_Planner.pdf", title: "Weekly Sprint Planner", description: "Plan your week in 15 minutes, not 2 hours", category: "Templates" },
      { filename: "SP_Template_4_Action_First_Morning.pdf", title: "Action-First Morning Template", description: "Start executing before your planning brain wakes up", category: "Templates" },
      { filename: "SP_Template_5_Failure_Mode_Audit.pdf", title: "Failure Mode Audit", description: "Identify which planning traps you fall into most", category: "Templates" },
      { filename: "SP_Template_6_Planning_Execution_Log.pdf", title: "Planning vs Execution Log", description: "Track the real ratio of planning to doing each day", category: "Templates" },
      { filename: "SP_Template_7_Weekly_Retrospective.pdf", title: "Weekly Retrospective", description: "Review what shipped, what didn't, and why", category: "Templates" },
    ],
  },
};

/** Get the library for an archetype slug. Returns undefined for unknown archetypes. */
export function getLibrary(archetypeSlug: string): ArchetypeLibrary | undefined {
  return libraries[archetypeSlug];
}

/** Build the full download URL for a PDF item */
export function getPdfUrl(filename: string): string {
  return `${R2_BASE}/${filename}`;
}
