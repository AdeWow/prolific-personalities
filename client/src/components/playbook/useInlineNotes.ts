import { useState, useCallback, useEffect, useRef } from "react";

// ─── Types ───

interface NoteEntry {
  content: string;
  updatedAt: number;
  dbNoteId: number | null;
  dirty: boolean;
}

type NotesStore = Record<string, NoteEntry>;
type SaveStatusMap = Record<string, "idle" | "saving" | "saved" | "error">;

interface DbNote {
  id: number;
  sectionId: string;
  content: string;
}

interface Session {
  access_token?: string;
}

interface UseInlineNotesProps {
  archetype: string;
  session: Session | null | undefined;
  dbNotes: DbNote[] | undefined;
}

interface UseInlineNotesReturn {
  getNoteForSection: (sectionId: string) => string;
  updateNote: (sectionId: string, content: string) => void;
  flushNote: (sectionId: string) => void;
  getAllNotes: () => Array<{ sectionId: string; content: string; updatedAt: number }>;
  saveStatus: SaveStatusMap;
}

// ─── localStorage helpers ───

const STORAGE_KEY_PREFIX = "playbook-inline-notes-";

function getStorageKey(archetype: string): string {
  return `${STORAGE_KEY_PREFIX}${archetype}`;
}

function loadNotesFromStorage(archetype: string): NotesStore {
  if (!archetype) return {};
  try {
    const stored = localStorage.getItem(getStorageKey(archetype));
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as NotesStore;
      }
    }
  } catch {
    // Corrupted — start fresh
  }
  return {};
}

function saveNotesToStorage(archetype: string, store: NotesStore): void {
  if (!archetype) return;
  try {
    localStorage.setItem(getStorageKey(archetype), JSON.stringify(store));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

// ─── Hook ───

export function useInlineNotes({
  archetype,
  session,
  dbNotes,
}: UseInlineNotesProps): UseInlineNotesReturn {
  const [notesStore, setNotesStore] = useState<NotesStore>(() =>
    loadNotesFromStorage(archetype)
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatusMap>({});

  // Per-section debounce timers
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Per-section "saved" auto-reset timers
  const savedTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Track archetype changes
  const mountedArchetypeRef = useRef(archetype);

  // Reload from localStorage when archetype changes
  useEffect(() => {
    if (archetype && archetype !== mountedArchetypeRef.current) {
      mountedArchetypeRef.current = archetype;
      setNotesStore(loadNotesFromStorage(archetype));
      setSaveStatus({});
    }
  }, [archetype]);

  // Merge DB notes into local store when they arrive/change
  useEffect(() => {
    if (!dbNotes || dbNotes.length === 0) return;

    setNotesStore((prev) => {
      const next = { ...prev };
      let changed = false;

      // Deduplicate DB notes: if multiple rows for same sectionId, take highest id
      const dbNoteMap = new Map<string, DbNote>();
      for (const note of dbNotes) {
        const existing = dbNoteMap.get(note.sectionId);
        if (!existing || note.id > existing.id) {
          dbNoteMap.set(note.sectionId, note);
        }
      }

      for (const [sectionId, dbNote] of dbNoteMap) {
        const local = next[sectionId];
        if (!local) {
          // DB has note we don't have locally — add it
          next[sectionId] = {
            content: dbNote.content,
            updatedAt: Date.now(),
            dbNoteId: dbNote.id,
            dirty: false,
          };
          changed = true;
        } else if (local.dbNoteId === null) {
          // First time mapping local to DB — store the ID, keep local content
          next[sectionId] = { ...local, dbNoteId: dbNote.id };
          changed = true;
        } else if (!local.dirty) {
          // Not dirty — DB might be newer (another device). Use DB content.
          if (local.content !== dbNote.content || local.dbNoteId !== dbNote.id) {
            next[sectionId] = {
              ...local,
              content: dbNote.content,
              dbNoteId: dbNote.id,
            };
            changed = true;
          }
        }
        // If dirty, local wins — hasn't been synced yet
      }

      if (!changed) return prev;
      saveNotesToStorage(archetype, next);
      return next;
    });
  }, [dbNotes, archetype]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
      Object.values(savedTimers.current).forEach(clearTimeout);
    };
  }, []);

  // ─── API helpers ───

  const makeAuthRequest = useCallback(
    async (url: string, method: string, data: any) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
    [session?.access_token]
  );

  // ─── Sync to DB ───

  const syncToDb = useCallback(
    async (sectionId: string) => {
      // Read current state
      const currentStore = loadNotesFromStorage(archetype);
      const entry = currentStore[sectionId];
      if (!entry || !entry.dirty) return;

      // Skip API calls if no auth token
      if (!session?.access_token) return;

      // Don't sync empty notes
      if (!entry.content.trim()) return;

      setSaveStatus((prev) => ({ ...prev, [sectionId]: "saving" }));

      try {
        if (entry.dbNoteId !== null) {
          // Update existing DB record
          await makeAuthRequest(
            `/api/playbook/notes/${entry.dbNoteId}`,
            "PUT",
            { content: entry.content }
          );
        } else {
          // Create new DB record
          const result = await makeAuthRequest(
            `/api/playbook/${archetype}/notes`,
            "POST",
            { sectionId, content: entry.content }
          );
          // Store the returned ID
          setNotesStore((prev) => {
            const next = {
              ...prev,
              [sectionId]: { ...prev[sectionId], dbNoteId: result.id },
            };
            saveNotesToStorage(archetype, next);
            return next;
          });
        }

        // Mark as clean
        setNotesStore((prev) => {
          const next = {
            ...prev,
            [sectionId]: { ...prev[sectionId], dirty: false },
          };
          saveNotesToStorage(archetype, next);
          return next;
        });

        setSaveStatus((prev) => ({ ...prev, [sectionId]: "saved" }));

        // Auto-reset saved status after 2s
        if (savedTimers.current[sectionId]) {
          clearTimeout(savedTimers.current[sectionId]);
        }
        savedTimers.current[sectionId] = setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [sectionId]: "idle" }));
        }, 2000);
      } catch (err) {
        console.warn("[InlineNotes] Background sync failed:", err);
        setSaveStatus((prev) => ({ ...prev, [sectionId]: "error" }));
        // Note remains in localStorage with dirty: true
      }
    },
    [archetype, session?.access_token, makeAuthRequest]
  );

  // ─── Public methods ───

  const getNoteForSection = useCallback(
    (sectionId: string): string => {
      return notesStore[sectionId]?.content || "";
    },
    [notesStore]
  );

  const updateNote = useCallback(
    (sectionId: string, content: string) => {
      setNotesStore((prev) => {
        const existing = prev[sectionId];
        const next = {
          ...prev,
          [sectionId]: {
            content,
            updatedAt: Date.now(),
            dbNoteId: existing?.dbNoteId ?? null,
            dirty: true,
          },
        };
        saveNotesToStorage(archetype, next);
        return next;
      });

      // Clear existing debounce timer for this section
      if (debounceTimers.current[sectionId]) {
        clearTimeout(debounceTimers.current[sectionId]);
      }

      // Start new 2s debounce timer
      debounceTimers.current[sectionId] = setTimeout(() => {
        syncToDb(sectionId);
      }, 2000);
    },
    [archetype, syncToDb]
  );

  const flushNote = useCallback(
    (sectionId: string) => {
      // Cancel debounce timer and sync immediately
      if (debounceTimers.current[sectionId]) {
        clearTimeout(debounceTimers.current[sectionId]);
        delete debounceTimers.current[sectionId];
      }
      syncToDb(sectionId);
    },
    [syncToDb]
  );

  const getAllNotes = useCallback((): Array<{
    sectionId: string;
    content: string;
    updatedAt: number;
  }> => {
    return Object.entries(notesStore)
      .filter(([, entry]) => entry.content.trim().length > 0)
      .map(([sectionId, entry]) => ({
        sectionId,
        content: entry.content,
        updatedAt: entry.updatedAt,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notesStore]);

  return {
    getNoteForSection,
    updateNote,
    flushNote,
    getAllNotes,
    saveStatus,
  };
}
