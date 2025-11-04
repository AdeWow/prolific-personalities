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

    // Get the answer key (for scoring lookup)
    const answerKey = typeof answer === 'number' ? answer.toString() : answer;
    
    // Get the score for this answer
    const score = question.scoring[answerKey] || 0;
    
    // Add score to the appropriate axis
    scores[question.axis] += score;
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
  const answerKey = typeof answer === 'number' ? answer.toString() : answer;
  return question.scoring.hasOwnProperty(answerKey);
}
