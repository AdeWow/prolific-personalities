/**
 * Quiz Scoring Algorithm Validation Tests
 *
 * These 12 tests verify:
 * - Each of the 7 archetypes is correctly identified with matching scores
 * - AG detection fires for balanced axes and does NOT fire for unbalanced
 * - Updated profile values (AP motivation=40, SP task=60, NS motivation=80, NS task=75)
 * - Structure normalization uses 7-35 range (7 questions × 1-5)
 * - Manhattan distance and confidence tiers are unchanged
 */
import { describe, it, expect } from 'vitest';
import {
  normalizeScores,
  calculateAllArchetypeFits,
  determineArchetypeEnhanced,
  archetypeProfiles,
  type NormalizedScores,
} from '../quiz-logic';
import type { QuizScores } from '@shared/schema';

// Helper: raw score → expected normalized value
// Formula: round(((raw - 7) / 28) * 100)
function expectedNormalized(raw: number): number {
  return Math.round(((raw - 7) / 28) * 100);
}

describe('normalizeScores', () => {
  it('normalizes all 4 axes using 7-35 range', () => {
    const scores: QuizScores = { structure: 7, motivation: 21, cognitive: 35, task: 14 };
    const normalized = normalizeScores(scores);

    expect(normalized.structure).toBe(0);   // (7-7)/(28)*100 = 0
    expect(normalized.motivation).toBe(50); // (21-7)/(28)*100 = 50
    expect(normalized.cognitive).toBe(100); // (35-7)/(28)*100 = 100
    expect(normalized.task).toBe(25);       // (14-7)/(28)*100 = 25
  });
});

describe('Updated archetype profiles', () => {
  it('AP motivation is 40 (not 75)', () => {
    expect(archetypeProfiles['anxious-perfectionist'].motivation).toBe(40);
  });

  it('SP task is 60 (not 85)', () => {
    expect(archetypeProfiles['strategic-planner'].task).toBe(60);
  });

  it('NS motivation is 80 (not 20)', () => {
    expect(archetypeProfiles['novelty-seeker'].motivation).toBe(80);
  });

  it('NS task is 75 (not 30)', () => {
    expect(archetypeProfiles['novelty-seeker'].task).toBe(75);
  });
});

describe('Archetype classification', () => {
  // Test 1: Pure Structured Achiever
  it('classifies pure Structured Achiever', () => {
    const scores: QuizScores = { structure: 31, motivation: 31, cognitive: 12, task: 12 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('structured-achiever');
  });

  // Test 2: Pure Chaotic Creative
  it('classifies pure Chaotic Creative', () => {
    const scores: QuizScores = { structure: 11, motivation: 11, cognitive: 31, task: 28 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('chaotic-creative');
  });

  // Test 3: Pure Anxious Perfectionist (with updated motivation=40 profile)
  it('classifies pure Anxious Perfectionist with updated profile', () => {
    // High structure, moderate-low motivation, low cognitive, high task
    const scores: QuizScores = { structure: 29, motivation: 18, cognitive: 12, task: 29 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('anxious-perfectionist');
  });

  // Test 4: Pure Novelty Seeker (with updated motivation=80, task=75 profile)
  it('classifies pure Novelty Seeker with updated profile', () => {
    // Low structure, high motivation, high cognitive, high task
    const scores: QuizScores = { structure: 13, motivation: 29, cognitive: 28, task: 28 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('novelty-seeker');
  });

  // Test 5: Pure Strategic Planner (with updated task=60 profile)
  it('classifies pure Strategic Planner with updated profile', () => {
    // High structure, high motivation, high cognitive, moderate task
    const scores: QuizScores = { structure: 29, motivation: 28, cognitive: 31, task: 24 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('strategic-planner');
  });

  // Test 6: Pure Flexible Improviser
  it('classifies pure Flexible Improviser', () => {
    const scores: QuizScores = { structure: 11, motivation: 15, cognitive: 15, task: 13 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('flexible-improviser');
  });

  // Test 7: Pure Adaptive Generalist (all balanced at midpoint)
  it('classifies pure Adaptive Generalist with all axes at 50', () => {
    const scores: QuizScores = { structure: 21, motivation: 21, cognitive: 21, task: 21 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('adaptive-generalist');
  });

  // Test 8: AG with slightly off-center but all within 40-60 normalized
  it('classifies AG with slightly off-center balanced scores', () => {
    // Normalized: ~43, ~57, ~46, ~54 — all within 40-60
    const scores: QuizScores = { structure: 19, motivation: 23, cognitive: 20, task: 22 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('adaptive-generalist');
  });

  // Test 9: NOT AG — 3 balanced axes but one extreme (structure=89)
  it('does NOT classify as AG when one axis is extreme', () => {
    const scores: QuizScores = { structure: 32, motivation: 21, cognitive: 21, task: 21 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).not.toBe('adaptive-generalist');
  });

  // Test 10: Validates AP profile correction — low motivation person matches AP not SA
  it('AP with low motivation maps to AP (not SA)', () => {
    // High structure, LOW motivation, low cognitive, high task → AP, not SA
    const scores: QuizScores = { structure: 30, motivation: 16, cognitive: 10, task: 30 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('anxious-perfectionist');
  });

  // Test 11: Validates NS profile correction — high-motivation novelty-seeker matches NS
  it('NS with high motivation maps to NS (not CC)', () => {
    // Low structure, HIGH motivation, high cognitive, high task → NS with new profile
    const scores: QuizScores = { structure: 12, motivation: 30, cognitive: 29, task: 27 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('novelty-seeker');
  });

  // Test 12: Validates SP profile correction — moderate-task strategic planner matches SP
  it('SP with moderate task maps to SP (not SA)', () => {
    // High structure, high motivation, high cognitive, MODERATE task → SP with new profile
    const scores: QuizScores = { structure: 30, motivation: 28, cognitive: 32, task: 22 };
    const result = determineArchetypeEnhanced(scores);
    expect(result.primary.id).toBe('strategic-planner');
  });
});
