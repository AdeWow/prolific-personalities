export type ArchetypeSlug = 
  | "adaptive-generalist"
  | "anxious-perfectionist"
  | "chaotic-creative"
  | "flexible-improviser"
  | "novelty-seeker"
  | "strategic-planner"
  | "structured-achiever";

export interface PremiumAsset {
  displayName: string;
  pdfFilename: string;
}

export const PREMIUM_ASSETS: Record<ArchetypeSlug, PremiumAsset> = {
  "adaptive-generalist": {
    displayName: "Adaptive Generalist Complete Playbook",
    pdfFilename: "Adaptive-Generalist-Core-Playbook.pdf"
  },
  "anxious-perfectionist": {
    displayName: "Anxious Perfectionist Complete Playbook",
    pdfFilename: "Anxious-Perfectionist-Core-Playbook.pdf"
  },
  "chaotic-creative": {
    displayName: "Chaotic Creative Complete Playbook",
    pdfFilename: "Chaotic-Creative-Core-Playbook.pdf"
  },
  "flexible-improviser": {
    displayName: "Flexible Improviser Complete Playbook",
    pdfFilename: "Flexible-Improviser-Core-Playbook.pdf"
  },
  "novelty-seeker": {
    displayName: "Novelty Seeker Complete Playbook",
    pdfFilename: "Novelty-Seeker-Core-Playbook.pdf"
  },
  "strategic-planner": {
    displayName: "Strategic Planner Complete Playbook",
    pdfFilename: "Strategic-Planner-Core-Playbook.pdf"
  },
  "structured-achiever": {
    displayName: "Structured Achiever Complete Playbook",
    pdfFilename: "Structured-Achiever-Core-Playbook.pdf"
  }
};

export function getPremiumAssetForArchetype(archetype: string): PremiumAsset | null {
  return PREMIUM_ASSETS[archetype as ArchetypeSlug] || null;
}
