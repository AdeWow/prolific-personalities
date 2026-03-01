// Scans parsed content blocks for tool name mentions and determines
// where to insert inline tool cards. Used by ContentRenderer.

import { TOOL_NAME_ALIASES, toolInfo } from "./toolData";

export interface ParsedBlock {
  type: string;
  content: string;
  metadata?: Record<string, any>;
}

/** Extracts all searchable text from a parsed block. */
function getBlockText(block: ParsedBlock): string {
  let text = block.content || "";
  if (block.metadata?.items) {
    text += " " + (block.metadata.items as string[]).join(" ");
  }
  if (block.metadata?.steps) {
    text += " " + (block.metadata.steps as string[]).join(" ");
  }
  if (block.metadata?.traits) {
    text +=
      " " +
      (block.metadata.traits as Array<{ raw: string }>)
        .map((t) => t.raw)
        .join(" ");
  }
  return text;
}

/** Checks if a character is a word boundary (not a letter or digit). */
function isWordBoundary(ch: string): boolean {
  return !/[a-zA-Z0-9]/.test(ch);
}

/**
 * Scans a single block's text for tool name mentions.
 * Returns an array of unique toolIds found in this block.
 */
export function findToolMentionsInBlock(block: ParsedBlock): string[] {
  const rawText = getBlockText(block);
  if (!rawText) return [];

  const lowerText = rawText.toLowerCase();
  const found: string[] = [];
  const seen = new Set<string>();

  for (const alias of TOOL_NAME_ALIASES) {
    if (seen.has(alias.toolId)) continue;

    const searchText = alias.caseSensitive ? rawText : lowerText;
    const searchPattern = alias.caseSensitive
      ? alias.pattern
      : alias.pattern.toLowerCase();

    const idx = searchText.indexOf(searchPattern);
    if (idx === -1) continue;

    // Word-boundary check: char before and after must be non-alphanumeric
    const charBefore = idx > 0 ? searchText[idx - 1] : " ";
    const charAfter =
      idx + searchPattern.length < searchText.length
        ? searchText[idx + searchPattern.length]
        : " ";

    if (isWordBoundary(charBefore) && isWordBoundary(charAfter)) {
      found.push(alias.toolId);
      seen.add(alias.toolId);
    }
  }

  return found;
}

/**
 * Scans all blocks in a section and returns a map of
 * blockIndex -> toolIds[] for first-mention-only insertion.
 *
 * Each toolId appears at most once across the entire section (first mention wins).
 * Only tools in the archetype's `recommendedTools` list produce cards.
 */
export function findToolInsertionPoints(
  blocks: ParsedBlock[],
  recommendedTools: string[] = []
): Map<number, string[]> {
  const insertionMap = new Map<number, string[]>();
  const sectionSeen = new Set<string>();

  for (let i = 0; i < blocks.length; i++) {
    const mentions = findToolMentionsInBlock(blocks[i]);
    const newMentions = mentions.filter((id) => {
      if (sectionSeen.has(id)) return false;
      if (!toolInfo[id]) return false;
      // Only show cards for tools in this archetype's recommended list
      if (recommendedTools.length > 0 && !recommendedTools.includes(id))
        return false;
      sectionSeen.add(id);
      return true;
    });

    if (newMentions.length > 0) {
      insertionMap.set(i, newMentions);
    }
  }

  return insertionMap;
}
