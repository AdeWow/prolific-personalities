import { useState, useCallback, useEffect, useRef } from "react";
import type { PlaybookContent } from "@shared/playbookContent";
import { getDoThisNowAction } from "./ContentParser";

export interface FlatSection {
  chapterId: string;
  chapterTitle: string;
  chapterIndex: number;
  sectionId: string;
  sectionTitle: string;
  sectionIndex: number;
  globalIndex: number;
  isFirstInChapter: boolean;
  isLastInChapter: boolean;
  content: string;
}

/**
 * Flattens the chapter/section hierarchy into an ordered array
 * for sequential navigation through the entire playbook.
 */
export function buildFlatSectionList(playbook: PlaybookContent): FlatSection[] {
  const flat: FlatSection[] = [];
  let globalIndex = 0;

  playbook.chapters.forEach((chapter, chapterIndex) => {
    chapter.sections.forEach((section, sectionIndex) => {
      flat.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterIndex,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionIndex,
        globalIndex,
        isFirstInChapter: sectionIndex === 0,
        isLastInChapter: sectionIndex === chapter.sections.length - 1,
        content: section.content,
      });
      globalIndex++;
    });
  });

  return flat;
}

/**
 * Estimates reading time for a section.
 * Based on 200 wpm average + bonus time for "Do This Now" activities.
 */
export function calculateReadingTime(content: string, sectionId?: string): string {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.ceil(wordCount / 200);

  const doThisNow = sectionId ? getDoThisNowAction(sectionId) : null;
  if (doThisNow) {
    const timeMatch = doThisNow.time.match(/(\d+)/);
    const activityMinutes = timeMatch ? parseInt(timeMatch[1], 10) : 0;
    const total = readingMinutes + activityMinutes;
    return `${total} min`;
  }

  return `${readingMinutes} min`;
}

const STORAGE_KEY_PREFIX = "playbook-subsection-progress-";

function getStorageKey(archetype: string): string {
  return `${STORAGE_KEY_PREFIX}${archetype}`;
}

function loadCompletedSections(archetype: string): Set<string> {
  if (!archetype) return new Set(); // Guard against empty archetype key
  try {
    const stored = localStorage.getItem(getStorageKey(archetype));
    if (stored) {
      const arr = JSON.parse(stored);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch {
    // Corrupted data — start fresh
  }
  return new Set();
}

function saveCompletedSections(archetype: string, sections: Set<string>): void {
  if (!archetype) return; // Guard against empty archetype key
  try {
    localStorage.setItem(getStorageKey(archetype), JSON.stringify([...sections]));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

/**
 * Hook for managing subsection-level progress in localStorage.
 * Provides mark-complete, is-complete, and chapter-level aggregation.
 */
export function useSubsectionProgress(archetype: string) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    () => loadCompletedSections(archetype)
  );

  // Track initial archetype to avoid redundant re-reads on mount.
  // Only re-load from localStorage when archetype actually CHANGES (e.g., user navigates
  // to a different playbook), not on the initial mount (useState already handled that).
  const mountedArchetypeRef = useRef(archetype);
  useEffect(() => {
    if (archetype && archetype !== mountedArchetypeRef.current) {
      mountedArchetypeRef.current = archetype;
      setCompletedSections(loadCompletedSections(archetype));
    }
  }, [archetype]);

  const markComplete = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      if (prev.has(sectionId)) return prev;
      const next = new Set(prev);
      next.add(sectionId);
      saveCompletedSections(archetype, next);
      return next;
    });
  }, [archetype]);

  const isComplete = useCallback((sectionId: string): boolean => {
    return completedSections.has(sectionId);
  }, [completedSections]);

  const getChapterProgress = useCallback((chapterId: string, sectionIds: string[]): { completed: number; total: number } => {
    const completed = sectionIds.filter(id => completedSections.has(id)).length;
    return { completed, total: sectionIds.length };
  }, [completedSections]);

  return {
    completedSections,
    markComplete,
    isComplete,
    completedCount: completedSections.size,
    getChapterProgress,
  };
}
