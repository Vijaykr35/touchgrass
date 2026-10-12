"use client";

import React, { useState } from "react";
import { Quest, QuestGenerationParams } from "@/types/quest";
import { Sparkles, Compass, Clock, MapPin, Smile, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface CreateQuestProps {
  onQuestGenerated: (quest: Quest) => void;
  ollamaAvailable: boolean;
}

export function CreateQuest({ onQuestGenerated, ollamaAvailable }: CreateQuestProps) {
  const { toast } = useToast();
  const [duration, setDuration] = useState<number>(20);
  const [mood, setMood] = useState<QuestGenerationParams["mood"]>("Curious");
  const [activity, setActivity] = useState<QuestGenerationParams["activity"]>("Nature");
  const [environment, setEnvironment] = useState<QuestGenerationParams["environment"]>("Neighborhood");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration, mood, activity, environment }),
      });

      if (!res.ok) {
        throw new Error("Generation request failed");
      }

      const data = await res.json();
      if (data.quest) {
        if (data.source === "ollama-qwen2.5") {
          toast(`Quest synthesized via local Qwen2.5:3b!`, "success");
        } else {
          toast(`Offline procedural quest prepared.`, "info");
        }
        onQuestGenerated(data.quest);
      }
    } catch (err) {
      toast("Error generating quest. Check Ollama or offline fallback.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="border-b border-[#DDDCCF] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#73786E] uppercase tracking-wider mb-1">
          <span>01 // Field Synthesizer</span>
          <span>•</span>
          <span className="text-[#244B36] font-semibold">
            {ollamaAvailable ? "Local Qwen2.5 Engine Ready" : "Offline Rule Engine Active"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[#244B36] tracking-tight">
          Synthesize Your Departure
        </h1>
        <p className="text-sm sm:text-base text-[#73786E] mt-1.5 max-w-xl">
          Calibrate your outdoor horizon. Once crafted, leave your device behind and step onto earth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Time Horizon */}
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-5 space-y-3 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#244B36]">
            <Clock className="w-4 h-4 text-[#A8B9A0]" />
            1. Available Horizon
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 30, 45].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`py-2.5 rounded-xl text-center text-xs font-mono transition-all ${
                  duration === mins
                    ? "bg-[#244B36] text-[#FFFEF9] shadow-sm font-semibold"
                    : "bg-[#F5F2E8] text-[#73786E] hover:text-[#292E28]"
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#73786E] italic">
            Estimated radius: ~{duration * 40}m perimeter. No GPS required.
          </p>
        </div>

        {/* Mood & Energy */}
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-5 space-y-3 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#244B36]">
            <Smile className="w-4 h-4 text-[#A8B9A0]" />
            2. Current Disposition
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["Calm", "Curious", "Adventurous", "Social"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`py-2 px-3 rounded-xl text-left text-xs transition-all ${
                  mood === m
                    ? "bg-[#244B36] text-[#FFFEF9] shadow-sm font-semibold"
                    : "bg-[#F5F2E8] text-[#73786E] hover:text-[#292E28]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#73786E] italic">
            Guides the sensory frequency and contemplative pace of tasks.
          </p>
        </div>

        {/* Activity Preference */}
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-5 space-y-3 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#244B36]">
            <Compass className="w-4 h-4 text-[#A8B9A0]" />
            3. Activity Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(["Walking", "Nature", "Photography", "Observation", "Mindfulness"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setActivity(a)}
                className={`py-2 px-2.5 rounded-xl text-center text-xs transition-all ${
                  activity === a
                    ? "bg-[#244B36] text-[#FFFEF9] shadow-sm font-semibold"
                    : "bg-[#F5F2E8] text-[#73786E] hover:text-[#292E28]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Immediate Surroundings */}
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-5 space-y-3 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#244B36]">
            <MapPin className="w-4 h-4 text-[#A8B9A0]" />
            4. Surroundings
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["Park", "Neighborhood", "Garden", "Anywhere"] as const).map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => setEnvironment(env)}
                className={`py-2 px-3 rounded-xl text-center text-xs transition-all ${
                  environment === env
                    ? "bg-[#244B36] text-[#FFFEF9] shadow-sm font-semibold"
                    : "bg-[#F5F2E8] text-[#73786E] hover:text-[#292E28]"
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synthesis Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#73786E]">
          <ShieldCheck className="w-4 h-4 text-[#244B36]" />
          <span>100% on-device AI. Zero telemetry, zero subscriptions.</span>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover-lift disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#D9E66F]" />
              <span>Synthesizing Micro-Quest...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#D9E66F]" />
              <span>Generate Outdoor Quest</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
