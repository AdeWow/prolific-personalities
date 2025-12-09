import { questions, type Question } from '../data/questions';
import { archetypes, type Archetype } from '../data/archetypes';
import type { QuizAnswers, QuizScores } from '@shared/schema';

// Score category types
export type ScoreCategory = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AxisCategorization {
  structure: ScoreCategory;
  motivation: ScoreCategory;
  cognitive: ScoreCategory;
  task: ScoreCategory;
}

export interface NormalizedScores {
  structure: number;
  motivation: number;
  cognitive: number;
  task: number;
}

export interface ArchetypeFitScore {
  archetype: Archetype;
  fitPercentage: number;
  distance: number;
}

export interface ArchetypeMatch {
  archetype: Archetype;
  confidence: number;
  matchScore: number;
  clearAxes: number;
  balancedAxes: number;
  fitPercentage?: number;
}

export interface ArchetypeResult {
  primary: Archetype;
  confidence: number;
  confidenceLevel: 'exact' | 'strong' | 'moderate' | 'weak';
  secondary?: Archetype[];
  categorization: AxisCategorization;
  notes: string[];
  allFitScores: ArchetypeFitScore[];
  normalizedScores: NormalizedScores;
}

// Ideal archetype profiles (0-100 scale for each dimension)
export const archetypeProfiles: Record<string, NormalizedScores> = {
  'structured-achiever': {
    structure: 85,    // HIGH structure
    motivation: 85,   // HIGH extrinsic (external accountability)
    cognitive: 25,    // LOW (detail-focused, present)
    task: 25,         // LOW (execution-focused, action)
  },
  'chaotic-creative': {
    structure: 15,    // LOW structure (flexible)
    motivation: 15,   // LOW (intrinsic)
    cognitive: 85,    // HIGH (big picture)
    task: 75,         // HIGH (planning, ideation)
  },
  'anxious-perfectionist': {
    structure: 80,    // HIGH structure
    motivation: 75,   // HIGH extrinsic (fear-driven)
    cognitive: 20,    // LOW (detail-focused)
    task: 80,         // HIGH (over-planning, procrastination)
  },
  'strategic-planner': {
    structure: 80,    // HIGH structure
    motivation: 75,   // HIGH extrinsic
    cognitive: 85,    // HIGH (big picture)
    task: 85,         // HIGH (planning)
  },
  'novelty-seeker': {
    structure: 20,    // LOW structure
    motivation: 20,   // LOW (intrinsic)
    cognitive: 75,    // HIGH (big picture)
    task: 30,         // LOW (execution)
  },
  'flexible-improviser': {
    structure: 15,    // LOW structure
    motivation: 30,   // LOW-MEDIUM (mostly intrinsic)
    cognitive: 30,    // LOW-MEDIUM (detail to action)
    task: 20,         // LOW (execution)
  },
  'adaptive-generalist': {
    structure: 50,    // MEDIUM (balanced)
    motivation: 50,   // MEDIUM (balanced)
    cognitive: 50,    // MEDIUM (balanced)
    task: 50,         // MEDIUM (balanced)
  },
};

// Normalize scores from 7-35 range to 0-100 range
export function normalizeScores(scores: QuizScores): NormalizedScores {
  const normalize = (score: number) => {
    // Map 7-35 to 0-100
    // Formula: ((score - min) / (max - min)) * 100
    const min = 7;
    const max = 35;
    return Math.round(((score - min) / (max - min)) * 100);
  };

  return {
    structure: normalize(scores.structure),
    motivation: normalize(scores.motivation),
    cognitive: normalize(scores.cognitive),
    task: normalize(scores.task),
  };
}

// Calculate how well user scores match an archetype profile
// Returns percentage match (0-100)
export function calculateArchetypeFit(
  normalizedScores: NormalizedScores,
  archetypeProfile: NormalizedScores
): number {
  let totalDistance = 0;
  
  // Calculate Manhattan distance across all 4 axes
  (Object.keys(normalizedScores) as Array<keyof NormalizedScores>).forEach(axis => {
    const distance = Math.abs(normalizedScores[axis] - archetypeProfile[axis]);
    totalDistance += distance;
  });
  
  // Max possible distance = 400 (100 per axis × 4)
  // Convert to similarity percentage
  const similarity = Math.max(0, 100 - (totalDistance / 4));
  
  return Math.round(similarity);
}

// Calculate fit scores for all archetypes
export function calculateAllArchetypeFits(normalizedScores: NormalizedScores): ArchetypeFitScore[] {
  const fitScores: ArchetypeFitScore[] = [];
  
  archetypes.forEach(archetype => {
    const profile = archetypeProfiles[archetype.id];
    if (!profile) return; // Skip if profile not defined
    
    const fitPercentage = calculateArchetypeFit(normalizedScores, profile);
    
    // Calculate total distance for sorting
    let distance = 0;
    (Object.keys(normalizedScores) as Array<keyof NormalizedScores>).forEach(axis => {
      distance += Math.abs(normalizedScores[axis] - profile[axis]);
    });
    
    fitScores.push({
      archetype,
      fitPercentage,
      distance,
    });
  });
  
  // Sort by fit percentage (highest first)
  fitScores.sort((a, b) => b.fitPercentage - a.fitPercentage);
  
  return fitScores;
}

// Categorize a score into LOW/MEDIUM/HIGH based on defined ranges
// Quiz scores range from 7 (minimum: 7 questions × 1 point) to 35 (maximum: 7 questions × 5 points)
export function categorizeScore(score: number, axis: keyof QuizScores): ScoreCategory {
  // Define ranges for 7-35 scale:
  // LOW: 7-14 (lower third)
  // MEDIUM: 15-28 (middle third) 
  // HIGH: 29-35 (upper third)
  if (score < 15) return 'LOW';
  if (score < 29) return 'MEDIUM';
  return 'HIGH';
}

// Categorize all axis scores
export function categorizeScores(scores: QuizScores): AxisCategorization {
  return {
    structure: categorizeScore(scores.structure, 'structure'),
    motivation: categorizeScore(scores.motivation, 'motivation'),
    cognitive: categorizeScore(scores.cognitive, 'cognitive'),
    task: categorizeScore(scores.task, 'task'),
  };
}

export function calculateScores(answers: QuizAnswers): QuizScores {
  const scores: QuizScores = {
    structure: 0,
    motivation: 0,
    cognitive: 0,
    task: 0
  };

  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Get the answer key (for scoring lookup)
    const answerKey = typeof answer === 'number' ? answer.toString() : answer;
    
    // Get the score for this answer
    const score = question.scoring[answerKey] || 0;
    
    // Add score to the appropriate axis
    scores[question.axis] += score;
  });

  return scores;
}

// Calculate match quality for a single archetype
function calculateArchetypeMatch(archetype: Archetype, scores: QuizScores, categorization: AxisCategorization): ArchetypeMatch {
  let matchScore = 0;
  let clearAxes = 0;
  let balancedAxes = 0;

  Object.entries(scores).forEach(([dimension, score]) => {
    const range = archetype.scoreRanges[dimension as keyof QuizScores];
    const category = categorization[dimension as keyof AxisCategorization];
    
    // Count clear vs balanced axes
    if (category === 'MEDIUM') {
      balancedAxes++;
    } else {
      clearAxes++;
    }
    
    if (score >= range.min && score <= range.max) {
      // Score is within range - give full points
      // Bonus points for clear (non-MEDIUM) matches
      matchScore += category === 'MEDIUM' ? 8 : 10;
    } else {
      // Score is outside range - penalize based on distance
      const distance = Math.min(
        Math.abs(score - range.min),
        Math.abs(score - range.max)
      );
      matchScore -= distance;
    }
  });

  // Calculate confidence based on clear axes and match quality
  // Always clamp between 0 and 100 to prevent negative or invalid values
  let confidence = 0;
  
  if (clearAxes === 4) {
    // All axes clear - Exact match (90-100%)
    confidence = Math.max(0, Math.min(100, 90 + (matchScore / 40) * 10));
  } else if (clearAxes === 3) {
    // 3 clear, 1 balanced - Strong match (70-89%)
    confidence = Math.max(0, Math.min(89, 70 + (matchScore / 40) * 19));
  } else if (clearAxes === 2) {
    // 2 clear, 2 balanced - Moderate match (50-69%)
    confidence = Math.max(0, Math.min(69, 50 + (matchScore / 40) * 19));
  } else {
    // 0-1 clear axes - Weak match (<50%)
    confidence = Math.max(0, Math.min(49, (matchScore / 40) * 49));
  }

  return {
    archetype,
    confidence: Math.round(confidence),
    matchScore,
    clearAxes,
    balancedAxes,
  };
}

// Enhanced archetype determination with fit-based confidence levels
export function determineArchetypeEnhanced(scores: QuizScores): ArchetypeResult {
  const categorization = categorizeScores(scores);
  const normalizedScores = normalizeScores(scores);
  const allFitScores = calculateAllArchetypeFits(normalizedScores);
  
  const topFit = allFitScores[0];
  const secondFit = allFitScores[1];
  const thirdFit = allFitScores[2];
  
  const notes: string[] = [];
  let confidenceLevel: 'exact' | 'strong' | 'moderate' | 'weak';
  let confidence = topFit.fitPercentage;
  const secondary: Archetype[] = [];
  
  // Determine confidence level and handle edge cases
  
  // Scenario 1: Two archetypes within 10% of each other (co-primary blend)
  if (secondFit && Math.abs(topFit.fitPercentage - secondFit.fitPercentage) <= 10) {
    confidenceLevel = 'moderate';
    confidence = topFit.fitPercentage;
    secondary.push(secondFit.archetype);
    notes.push(`You blend characteristics of both ${topFit.archetype.name} and ${secondFit.archetype.name} (${topFit.fitPercentage}% vs ${secondFit.fitPercentage}% match).`);
    notes.push(`This close match suggests you can draw from both productivity styles depending on the context.`);
    
  // Scenario 2: Three or more archetypes within 15% (multiple moderate matches)
  } else if (thirdFit && Math.abs(topFit.fitPercentage - thirdFit.fitPercentage) <= 15) {
    confidenceLevel = 'weak';
    confidence = topFit.fitPercentage;
    secondary.push(secondFit.archetype, thirdFit.archetype);
    notes.push(`You show moderate matches across multiple archetypes. This suggests you're in transition or highly adaptive.`);
    notes.push(`Try ${topFit.archetype.name} frameworks first (${topFit.fitPercentage}% match), then explore ${secondFit.archetype.name} if needed.`);
    
  // Scenario 3: All axes in balanced range (adaptive generalist)
  // Actually return adaptive-generalist as the primary archetype
  } else if (Object.values(categorization).filter(cat => cat === 'MEDIUM').length >= 3) {
    const adaptiveGeneralist = archetypes.find(a => a.id === 'adaptive-generalist');
    if (adaptiveGeneralist) {
      // Calculate fit for adaptive-generalist
      const generalistProfile = archetypeProfiles['adaptive-generalist'];
      const generalistFit = calculateArchetypeFit(normalizedScores, generalistProfile);
      
      confidenceLevel = 'strong';
      confidence = generalistFit;
      
      // Add top fits as secondary options for context-specific use
      if (topFit) secondary.push(topFit.archetype);
      if (secondFit) secondary.push(secondFit.archetype);
      
      notes.push(`You scored in the balanced range on ${Object.values(categorization).filter(cat => cat === 'MEDIUM').length} of 4 axes.`);
      notes.push(`This makes you an Adaptive Generalist - someone who can match their approach to context.`);
      notes.push(`You can borrow strategies from ${topFit.archetype.name} and ${secondFit?.archetype.name || 'other archetypes'} depending on the situation.`);
      
      return {
        primary: adaptiveGeneralist,
        confidence,
        confidenceLevel,
        secondary: secondary.length > 0 ? secondary : undefined,
        categorization,
        notes,
        allFitScores,
        normalizedScores,
      };
    }
    // Fallback if adaptive-generalist not found (shouldn't happen)
    confidenceLevel = 'weak';
    confidence = topFit.fitPercentage;
    if (secondFit) secondary.push(secondFit.archetype);
    if (thirdFit) secondary.push(thirdFit.archetype);
    notes.push(`You scored in the balanced range on multiple axes. This indicates high adaptability.`);
    
  // Standard scenarios based on top fit percentage
  } else if (topFit.fitPercentage >= 80) {
    // Strong exact match
    confidenceLevel = 'exact';
    confidence = topFit.fitPercentage;
    notes.push(`Strong match! You clearly identify with ${topFit.archetype.name} patterns.`);
    
    // Show secondary influence if > 60%
    if (secondFit && secondFit.fitPercentage > 60) {
      secondary.push(secondFit.archetype);
      notes.push(`You also show some ${secondFit.archetype.name} traits (${secondFit.fitPercentage}% match).`);
    }
    
  } else if (topFit.fitPercentage >= 65) {
    // Good match with some variance
    confidenceLevel = 'strong';
    confidence = topFit.fitPercentage;
    
    if (secondFit && secondFit.fitPercentage > 60) {
      secondary.push(secondFit.archetype);
      notes.push(`You primarily align with ${topFit.archetype.name}, with influences from ${secondFit.archetype.name}.`);
    }
    
  } else if (topFit.fitPercentage >= 50) {
    // Moderate match
    confidenceLevel = 'moderate';
    confidence = topFit.fitPercentage;
    
    if (secondFit) secondary.push(secondFit.archetype);
    if (thirdFit && thirdFit.fitPercentage > 45) secondary.push(thirdFit.archetype);
    
    notes.push(`You show moderate alignment with ${topFit.archetype.name}. Your productivity style may be still developing or context-dependent.`);
    
  } else {
    // Weak match
    confidenceLevel = 'weak';
    confidence = topFit.fitPercentage;
    
    if (secondFit) secondary.push(secondFit.archetype);
    if (thirdFit) secondary.push(thirdFit.archetype);
    
    notes.push(`No strong archetype match found. You may be highly adaptive or exploring different productivity approaches.`);
  }
  
  // Add specific notes based on balanced axes
  if (categorization.structure === 'MEDIUM') {
    notes.push('You balance structure and flexibility depending on the situation.');
  }
  if (categorization.motivation === 'MEDIUM') {
    notes.push('You draw motivation from both internal drive and external rewards.');
  }
  if (categorization.cognitive === 'MEDIUM') {
    notes.push('You can zoom between big-picture thinking and detail-focus as needed.');
  }
  if (categorization.task === 'MEDIUM') {
    notes.push('You blend planning and execution effectively.');
  }

  return {
    primary: topFit.archetype,
    confidence,
    confidenceLevel,
    secondary: secondary.length > 0 ? secondary : undefined,
    categorization,
    notes,
    allFitScores,
    normalizedScores,
  };
}

// Backward compatibility: keep the old function but use the new logic
export function determineArchetype(scores: QuizScores): Archetype {
  const result = determineArchetypeEnhanced(scores);
  return result.primary;
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getProgressPercentage(currentQuestion: number, totalQuestions: number): number {
  return Math.round((currentQuestion / totalQuestions) * 100);
}

export function validateAnswer(question: Question, answer: string | number): boolean {
  const answerKey = typeof answer === 'number' ? answer.toString() : answer;
  return question.scoring.hasOwnProperty(answerKey);
}
