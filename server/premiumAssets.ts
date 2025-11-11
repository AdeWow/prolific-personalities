export type ArchetypeSlug = 
  | "Adaptive Generalist"
  | "Anxious Perfectionist"
  | "Chaotic Creative"
  | "Flexible Improviser"
  | "Novelty Seeker"
  | "Strategic Planner"
  | "Structured Achiever";

export interface PremiumAsset {
  displayName: string;
  pdfFilename: string;
}

export const PREMIUM_ASSETS: Record<ArchetypeSlug, PremiumAsset> = {
  "Adaptive Generalist": {
    displayName: "Adaptive Generalist Complete Playbook",
    pdfFilename: "Adaptive Generalist Premium_1762886907832.pdf"
  },
  "Anxious Perfectionist": {
    displayName: "Anxious Perfectionist Complete Playbook",
    pdfFilename: "Anxious Perfectionist Premium_1762886907847.pdf"
  },
  "Chaotic Creative": {
    displayName: "Chaotic Creative Complete Playbook",
    pdfFilename: "Chaotic Creative Premium_1762886907848.pdf"
  },
  "Flexible Improviser": {
    displayName: "Flexible Improviser Complete Playbook",
    pdfFilename: "Flexible Improviser Premium_1762886907848.pdf"
  },
  "Novelty Seeker": {
    displayName: "Novelty Seeker Complete Playbook",
    pdfFilename: "Novelty Seeker Premium_1762886907848.pdf"
  },
  "Strategic Planner": {
    displayName: "Strategic Planner Complete Playbook",
    pdfFilename: "Strategic Planner Premium_1762886907849.pdf"
  },
  "Structured Achiever": {
    displayName: "Structured Achiever Complete Playbook",
    pdfFilename: "Structured Acheiver Premium_1762886907850.pdf" // Note: PDF has typo in filename
  }
};

export function getPremiumAssetForArchetype(archetype: string): PremiumAsset | null {
  return PREMIUM_ASSETS[archetype as ArchetypeSlug] || null;
}
