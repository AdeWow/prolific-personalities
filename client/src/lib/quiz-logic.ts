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

export interface ArchetypeMatch {
  archetype: Archetype;
  confidence: number;
  matchScore: number;
  clearAxes: number;
  balancedAxes: number;
}

export interface ArchetypeResult {
  primary: Archetype;
  confidence: number;
  confidenceLevel: 'exact' | 'strong' | 'moderate' | 'weak';
  secondary?: Archetype[];
  categorization: AxisCategorization;
  notes: string[];
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

// Enhanced archetype determination with confidence levels
export function determineArchetypeEnhanced(scores: QuizScores): ArchetypeResult {
  const categorization = categorizeScores(scores);
  
  // Calculate matches for all archetypes
  const matches: ArchetypeMatch[] = archetypes.map(archetype => 
    calculateArchetypeMatch(archetype, scores, categorization)
  );

  // Sort by confidence then match score
  matches.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return b.matchScore - a.matchScore;
  });

  const topMatch = matches[0];
  const notes: string[] = [];

  // Determine confidence level
  let confidenceLevel: 'exact' | 'strong' | 'moderate' | 'weak';
  if (topMatch.confidence >= 90) {
    confidenceLevel = 'exact';
  } else if (topMatch.confidence >= 70) {
    confidenceLevel = 'strong';
    if (topMatch.balancedAxes > 0) {
      notes.push(`You showed balanced tendencies in ${topMatch.balancedAxes} area${topMatch.balancedAxes > 1 ? 's' : ''}, making you adaptable.`);
    }
  } else if (topMatch.confidence >= 50) {
    confidenceLevel = 'moderate';
    notes.push(`Your results show flexibility across multiple dimensions, suggesting you adapt your approach based on context.`);
  } else {
    confidenceLevel = 'weak';
    notes.push(`You have a very balanced profile across multiple areas. This means you're highly adaptive and can switch between different working styles.`);
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

  // For weak matches, include top 2-3 archetypes
  const secondary: Archetype[] = [];
  if (confidenceLevel === 'weak' || confidenceLevel === 'moderate') {
    // Include top 2-3 matches (excluding the primary)
    const secondaryMatches = matches.slice(1, 3).filter(m => m.confidence >= 40);
    secondary.push(...secondaryMatches.map(m => m.archetype));
    
    if (secondaryMatches.length > 0) {
      notes.push(`You also share characteristics with ${secondaryMatches.map(m => m.archetype.name).join(' and ')}.`);
    }
  }

  return {
    primary: topMatch.archetype,
    confidence: topMatch.confidence,
    confidenceLevel,
    secondary: secondary.length > 0 ? secondary : undefined,
    categorization,
    notes,
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
