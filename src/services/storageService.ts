import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Quest, JournalEntry } from "@/types/quest";

interface TouchGrassDB extends DBSchema {
  quests: {
    key: string;
    value: Quest;
    indexes: { "by-date": string };
  };
  journal: {
    key: string;
    value: JournalEntry;
    indexes: { "by-date": string; "by-mood": string };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<TouchGrassDB>> | null = null;

export function getDB() {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB<TouchGrassDB>("touchgrass-vault", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("quests")) {
          const questStore = db.createObjectStore("quests", { keyPath: "id" });
          questStore.createIndex("by-date", "createdAt");
        }
        if (!db.objectStoreNames.contains("journal")) {
          const journalStore = db.createObjectStore("journal", { keyPath: "id" });
          journalStore.createIndex("by-date", "dateCompleted");
          journalStore.createIndex("by-mood", "moodAfter");
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
      },
    });
  }
  return dbPromise;
}

// Quest Storage
export async function saveActiveQuest(quest: Quest): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put("quests", quest);
  await db.put("settings", quest.id, "active_quest_id");
}

export async function getActiveQuest(): Promise<Quest | null> {
  const db = await getDB();
  if (!db) return null;
  const activeId = (await db.get("settings", "active_quest_id")) as string | undefined;
  if (!activeId) return null;
  return (await db.get("quests", activeId)) || null;
}

export async function clearActiveQuest(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete("settings", "active_quest_id");
}

export async function getAllQuests(): Promise<Quest[]> {
  const db = await getDB();
  if (!db) return [];
  return await db.getAllFromIndex("quests", "by-date");
}

// Journal Storage
export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put("journal", entry);
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const db = await getDB();
  if (!db) return [];
  const entries = await db.getAll("journal");
  return entries.sort((a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime());
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete("journal", id);
}

// Progress Metrics
export async function getProgressStats(): Promise<{
  totalQuests: number;
  totalMinutes: number;
  uniqueDiscoveriesCount: number;
  streakDays: number;
}> {
  const entries = await getAllJournalEntries();
  const totalQuests = entries.length;
  const totalMinutes = entries.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const uniqueDiscoveriesCount = entries.filter((e) => e.discoveries?.trim().length > 0).length;
  
  // Calculate consecutive days
  let streak = 0;
  if (entries.length > 0) {
    const dates = Array.from(new Set(entries.map(e => e.dateCompleted.split("T")[0])));
    streak = dates.length; // Organic non-punitive days count
  }

  return {
    totalQuests,
    totalMinutes,
    uniqueDiscoveriesCount,
    streakDays: streak,
  };
}
