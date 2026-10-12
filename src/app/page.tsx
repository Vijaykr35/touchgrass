"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ToastProvider, useToast } from "@/components/ToastProvider";
import { Leaf, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { Quest, JournalEntry } from "@/types/quest";
import {
  saveActiveQuest,
  getActiveQuest,
  clearActiveQuest,
  saveJournalEntry,
  getAllJournalEntries,
} from "@/services/storageService";
import { soundService } from "@/services/soundService";
import { useTimer } from "@/hooks/useTimer";
import { PrepareStage } from "@/components/PrepareStage";
import { OutsideStage } from "@/components/OutsideStage";
import { ReflectStage } from "@/components/ReflectStage";
import { PastWalksList } from "@/components/PastWalksList";
import { SleepScreenOverlay } from "@/components/SleepScreenOverlay";

type AppStage = "prepare" | "outside" | "reflect";

function SimpleTouchGrassApp() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState<boolean>(false);
  const [stage, setStage] = useState<AppStage>("prepare");
  const [duration, setDuration] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active walk state
  const [sleepMode, setSleepMode] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // When timer expires, play singing bowl/gong chime
  const handleTimerExpire = useCallback(() => {
    soundService.playWalkFinished();
    toast("Time is up! Head back home whenever you are ready.", "info");
  }, [toast]);

  const { secondsLeft, formatTime, setSecondsLeft } = useTimer(
    duration * 60,
    stage === "outside",
    handleTimerExpire
  );

  // Reflection inputs
  const [notedDetail, setNotedDetail] = useState<string>("");
  const [reflection, setReflection] = useState<string>("");

  // History log
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  // Initialize from local IndexedDB and Sound settings
  useEffect(() => {
    setMounted(true);
    setIsMuted(soundService.getMuted());
    async function init() {
      const active = await getActiveQuest();
      if (active) {
        setQuest(active);
        setSecondsLeft(active.durationMinutes * 60);
        setStage("outside");
      }
      const entries = await getAllJournalEntries();
      setJournal(entries);
    }
    init();
  }, [setSecondsLeft]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundService.setMuted(next);
    if (!next) {
      soundService.playClick();
    }
  };

  // Generate Quest
  const handleStartQuest = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          mood: "Curious",
          activity: "Nature",
          environment: "Neighborhood",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `Server responded with ${res.status}`);
      }

      if (data.quest) {
        soundService.playStartChime();
        await saveActiveQuest(data.quest);
        setQuest(data.quest);
        setSecondsLeft(data.quest.durationMinutes * 60);
        setCompletedSteps([]);
        setStage("outside");
        toast(`Walk ready for ${duration} minutes.`, "success");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not connect to local AI model";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [duration, setSecondsLeft, toast]);

  // Step toggle
  const handleToggleStep = useCallback((id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // Save reflection to IndexedDB
  const handleSaveReflection = useCallback(async () => {
    if (!quest) return;
    soundService.playStepComplete();
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      questId: quest.id,
      questTitle: quest.title,
      dateCompleted: new Date().toISOString(),
      durationMinutes: quest.durationMinutes,
      moodBefore: quest.mood,
      moodAfter: "Grounded",
      discoveries: notedDetail || "Observed urban micro-flora and ambient sounds.",
      reflection: reflection || "“The air felt calm once the feeds were put away.”",
      completedStepsCount: completedSteps.length,
      totalStepsCount: quest.steps.length,
      tags: ["Walk", `${quest.durationMinutes}m`],
    };

    await saveJournalEntry(newEntry);
    await clearActiveQuest();
    setQuest(null);
    setNotedDetail("");
    setReflection("");
    setStage("prepare");

    const entries = await getAllJournalEntries();
    setJournal(entries);
    toast("Walk saved to your notes.", "success");
  }, [quest, notedDetail, reflection, completedSteps.length, toast]);

  // Abandon quest
  const handleAbandon = useCallback(async () => {
    await clearActiveQuest();
    setQuest(null);
    setStage("prepare");
    toast("Walk ended. Step out whenever you are ready.", "info");
  }, [toast]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F2E8] flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-xs font-mono text-[#73786E]">
          <Leaf className="w-4 h-4 text-[#244B36] animate-pulse" />
          <span>Opening TouchGrass field canvas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2E8] text-[#292E28] flex flex-col justify-between p-4 sm:p-8 selection:bg-[#D9E66F] selection:text-[#244B36]">
      {/* Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#DDDCCF]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#244B36] flex items-center justify-center text-[#D9E66F]">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <span className="font-heading font-bold text-lg text-[#244B36]">TouchGrass</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="flex items-center gap-1.5 font-mono text-[11px] text-[#73786E] hover:text-[#244B36] bg-[#EAE7DC] hover:bg-[#DDDCCF] px-2.5 py-1 rounded-full transition-colors active:scale-95"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#244B36]" />
                <span className="hidden sm:inline">Sound On</span>
              </>
            )}
          </button>

          {/* Local LLM indicator */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#73786E] bg-[#EAE7DC] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#244B36]" />
            <span>Local LLM</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        {stage === "prepare" && (
          <PrepareStage
            duration={duration}
            setDuration={setDuration}
            loading={loading}
            onStartQuest={handleStartQuest}
          />
        )}

        {stage === "outside" && quest && (
          <OutsideStage
            quest={quest}
            formattedTime={formatTime()}
            completedSteps={completedSteps}
            onToggleStep={handleToggleStep}
            onOpenSleepMode={() => setSleepMode(true)}
            onAbandon={handleAbandon}
            onProceedToReflect={() => setStage("reflect")}
          />
        )}

        {stage === "reflect" && (
          <ReflectStage
            notedDetail={notedDetail}
            setNotedDetail={setNotedDetail}
            reflection={reflection}
            setReflection={setReflection}
            onBack={() => setStage("outside")}
            onSave={handleSaveReflection}
          />
        )}

        {/* History Log */}
        <PastWalksList journal={journal} />
      </main>

      {/* Sleep Screen Fullscreen Overlay */}
      <SleepScreenOverlay
        isOpen={sleepMode}
        formattedTime={formatTime()}
        onClose={() => setSleepMode(false)}
      />

      {/* Footer */}
      <footer className="max-w-xl mx-auto w-full text-center text-[11px] text-[#73786E] pt-6 border-t border-[#DDDCCF]/60">
        Spend less time on screens, more time outside.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SimpleTouchGrassApp />
    </ToastProvider>
  );
}
