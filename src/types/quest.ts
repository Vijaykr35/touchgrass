import { z } from "zod";

export const QuestStepSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  instruction: z.string().min(1),
  sensoryFocus: z.string().default("Visual"),
  phase: z.string().optional(),
});

export const QuestSchema = z.object({
  id: z.string(),
  protocolCode: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  estimatedRadius: z.string(),
  mood: z.string().default("Curious"),
  activity: z.string().default("Nature"),
  environment: z.string().default("Neighborhood"),
  difficulty: z.string().default("Gentle"),
  completionCriterion: z.string(),
  steps: z.array(QuestStepSchema).min(1),
  createdAt: z.string(),
  source: z.string().default("gemma2:2b"),
});

export type QuestStep = z.infer<typeof QuestStepSchema>;
export type Quest = z.infer<typeof QuestSchema>;

export const JournalEntrySchema = z.object({
  id: z.string(),
  questId: z.string(),
  questTitle: z.string(),
  dateCompleted: z.string(),
  durationMinutes: z.number(),
  moodBefore: z.string(),
  moodAfter: z.string(),
  discoveries: z.string(),
  reflection: z.string(),
  photoBase64: z.string().optional(),
  completedStepsCount: z.number(),
  totalStepsCount: z.number(),
  specimenFound: z.string().optional(),
  tags: z.array(z.string()),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export interface QuestGenerationParams {
  duration: number; // 10, 20, 30, 45
  mood: "Calm" | "Curious" | "Adventurous" | "Social";
  activity: "Walking" | "Nature" | "Photography" | "Observation" | "Mindfulness";
  environment: "Park" | "Neighborhood" | "Garden" | "Anywhere";
}
