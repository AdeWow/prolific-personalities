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
    pdfFilename: "Adaptive Generalist Premium_1762886907832.pdf"
  },
  "anxious-perfectionist": {
    displayName: "Anxious Perfectionist Complete Playbook",
    pdfFilename: "Anxious Perfectionist Premium_1762886907847.pdf"
  },
  "chaotic-creative": {
    displayName: "Chaotic Creative Complete Playbook",
    pdfFilename: "Chaotic Creative Premium_1762886907848.pdf"
  },
  "flexible-improviser": {
    displayName: "Flexible Improviser Complete Playbook",
    pdfFilename: "Flexible Improviser Premium_1762886907848.pdf"
  },
  "novelty-seeker": {
    displayName: "Novelty Seeker Complete Playbook",
    pdfFilename: "Novelty Seeker Premium_1762886907848.pdf"
  },
  "strategic-planner": {
    displayName: "Strategic Planner Complete Playbook",
    pdfFilename: "Strategic Planner Premium_1762886907849.pdf"
  },
  "structured-achiever": {
    displayName: "Structured Achiever Complete Playbook",
    pdfFilename: "Structured Acheiver Premium_1762886907850.pdf" // Note: PDF has typo in filename
  }
};

export function getPremiumAssetForArchetype(archetype: string): PremiumAsset | null {
  return PREMIUM_ASSETS[archetype as ArchetypeSlug] || null;
}
