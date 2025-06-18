import { questions, type Question } from '../data/questions';
import { archetypes, type Archetype } from '../data/archetypes';
import type { QuizAnswers, QuizScores } from '@shared/schema';

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

    if (question.type === 'multiple-choice') {
      const optionIndex = typeof answer === 'string' ? parseInt(answer) : answer;
      
      // Apply dimension scores based on the selected option
      Object.entries(question.dimensions).forEach(([dimension, values]) => {
        if (dimension in scores && Array.isArray(values)) {
          scores[dimension as keyof QuizScores] += values[optionIndex] || 0;
        } else if (dimension in scores && typeof values === 'number') {
          scores[dimension as keyof QuizScores] += values * (optionIndex + 1);
        }
      });
    } else if (question.type === 'scale') {
      const scaleValue = typeof answer === 'number' ? answer : parseInt(answer.toString());
      const normalizedValue = (scaleValue - 4) * 2; // Convert 1-7 scale to -6 to +6
      
      Object.entries(question.dimensions).forEach(([dimension, multiplier]) => {
        if (dimension in scores && typeof multiplier === 'number') {
          scores[dimension as keyof QuizScores] += normalizedValue * multiplier;
        }
      });
    }
  });

  return scores;
}

export function determineArchetype(scores: QuizScores): Archetype {
  // Find the archetype whose score ranges best match the calculated scores
  let bestMatch = archetypes[0];
  let bestScore = -Infinity;

  archetypes.forEach(archetype => {
    let matchScore = 0;
    
    // Calculate how well this archetype matches the scores
    Object.entries(scores).forEach(([dimension, score]) => {
      const range = archetype.scoreRanges[dimension as keyof QuizScores];
      
      if (score >= range.min && score <= range.max) {
        // Score is within range - give full points
        matchScore += 10;
      } else {
        // Score is outside range - penalize based on distance
        const distance = Math.min(
          Math.abs(score - range.min),
          Math.abs(score - range.max)
        );
        matchScore -= distance;
      }
    });

    if (matchScore > bestScore) {
      bestScore = matchScore;
      bestMatch = archetype;
    }
  });

  return bestMatch;
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getProgressPercentage(currentQuestion: number, totalQuestions: number): number {
  return Math.round((currentQuestion / totalQuestions) * 100);
}

export function validateAnswer(question: Question, answer: string | number): boolean {
  if (question.type === 'multiple-choice') {
    const optionIndex = typeof answer === 'string' ? parseInt(answer) : answer;
    return optionIndex >= 0 && optionIndex < (question.options?.length || 0);
  } else if (question.type === 'scale') {
    const scaleValue = typeof answer === 'number' ? answer : parseInt(answer.toString());
    const range = question.scaleRange;
    return range ? scaleValue >= range.min && scaleValue <= range.max : false;
  }
  return false;
}
