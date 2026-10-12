"use client";

import React, { useState } from "react";
import { Quest, JournalEntry } from "@/types/quest";
import { useToast } from "@/components/ToastProvider";
import { Camera, Save, ArrowLeft, Leaf, Sparkles } from "lucide-react";

interface FieldJournalProps {
  quest?: Quest | null;
  onSaved: (entry: JournalEntry) => void;
  onCancel: () => void;
}

export function DebriefJournal({ quest, onSaved, onCancel }: FieldJournalProps) {
  const { toast } = useToast();
  const [moodBefore, setMoodBefore] = useState<string>(quest?.mood || "Curious");
  const [moodAfter, setMoodAfter] = useState<string>("Grounded");
  const [reflection, setReflection] = useState<string>("“Noticed how quiet the neighborhood gets when you stop refreshing feeds.”");
  const [discoveries, setDiscoveries] = useState<string>("Located three distinct lichen colonies on a limestone retaining wall seam. Air was cool and earthy.");
  const [specimenFound, setSpecimenFound] = useState<string>("Speckled River Stone");
  const [photoBase64, setPhotoBase64] = useState<string>("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoBase64(reader.result as string);
        toast("Specimen photo attached locally.", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      questId: quest?.id || `quest-${Date.now()}`,
      questTitle: quest?.title || "Neighborhood Free Walk",
      dateCompleted: new Date().toISOString(),
      durationMinutes: quest?.durationMinutes || 20,
      moodBefore,
      moodAfter,
      discoveries,
      reflection,
      photoBase64: photoBase64 || undefined,
      completedStepsCount: quest?.steps.length || 3,
      totalStepsCount: quest?.steps.length || 3,
      specimenFound,
      tags: ["Tactile", "Lichen", "Air-Gapped"],
    };

    onSaved(newEntry);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#DDDCCF] pb-4">
        <button
          onClick={onCancel}
          className="text-xs font-mono text-[#73786E] hover:text-[#244B36] flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Quest</span>
        </button>
        <span className="text-xs font-mono text-[#A8B9A0] uppercase font-semibold">
          Expedition Debrief // Folio Entry
        </span>
        <h1 className="text-3xl font-heading font-medium text-[#244B36] tracking-tight mt-1">
          Welcome Back. How Was the Air?
        </h1>
        <p className="text-sm text-[#73786E] mt-1">
          Record sensory impressions and observations while they are cool and clear in mind.
        </p>
      </div>

      {/* Main Journal Slate */}
      <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Mood Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#73786E] uppercase">Mood Before Departure</label>
            <input
              type="text"
              value={moodBefore}
              onChange={(e) => setMoodBefore(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-[#292E28]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#73786E] uppercase">Mood Upon Return</label>
            <input
              type="text"
              value={moodAfter}
              onChange={(e) => setMoodAfter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-[#292E28] font-semibold"
            />
          </div>
        </div>

        {/* Poetic Reflection */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[#73786E] uppercase">
            1. Core Sensory Reflection (Quote / Impression)
          </label>
          <input
            type="text"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full px-3 py-2 text-sm italic rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-[#292E28]"
          />
        </div>

        {/* Detailed Discoveries */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[#73786E] uppercase">
            2. Real-World Discoveries &amp; Flora
          </label>
          <textarea
            rows={4}
            value={discoveries}
            onChange={(e) => setDiscoveries(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-[#292E28] leading-relaxed"
          />
        </div>

        {/* Specimen Token / Artifact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#73786E] uppercase">
              Pocket Specimen / Windfall Token
            </label>
            <input
              type="text"
              value={specimenFound}
              onChange={(e) => setSpecimenFound(e.target.value)}
              placeholder="e.g. River Pebble, Dry Seed Pod"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-[#292E28]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#73786E] uppercase">Optional Photo Attachment</label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-xs text-[#73786E] cursor-pointer hover:bg-[#EAE7DC]">
              <Camera className="w-4 h-4 text-[#244B36]" />
              <span className="truncate">{photoBase64 ? "Photo Loaded ✓" : "Capture / Select Specimen"}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Save Action */}
        <div className="pt-4 border-t border-[#DDDCCF]">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover-lift"
          >
            <Save className="w-4 h-4 text-[#D9E66F]" />
            <span>Commit to Local Herbarium Journal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
