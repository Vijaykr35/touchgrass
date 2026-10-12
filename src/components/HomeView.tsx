"use client";

import React from "react";
import { Compass, Sparkles, Shield, Clock, BookOpen, ArrowRight } from "lucide-react";
import { Quest } from "@/types/quest";

interface HomeViewProps {
  onStartNewQuest: () => void;
  activeQuest: Quest | null;
  onResumeActive: () => void;
  totalQuests: number;
  totalMinutes: number;
}

export function HomeView({
  onStartNewQuest,
  activeQuest,
  onResumeActive,
  totalQuests,
  totalMinutes,
}: HomeViewProps) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-200">
      {/* Hero Narrative Section */}
      <div className="space-y-4 pt-4 sm:pt-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE7DC] text-[#244B36] font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#244B36]"></span>
          <span>100% On-Device AI • Anti-Distraction Companion</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-medium text-[#244B36] tracking-tight leading-[1.1] max-w-2xl">
          Leave the glass behind. Let curiosity guide your steps.
        </h1>

        <p className="text-base sm:text-lg text-[#73786E] max-w-xl leading-relaxed">
          TouchGrass generates personalized outdoor micro-quests on your local machine. Once your departure card is sealed, put your phone away and step into the physical world.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
          {activeQuest ? (
            <button
              onClick={onResumeActive}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-sm flex items-center justify-center gap-2.5 shadow-md hover-lift"
            >
              <Compass className="w-4 h-4 text-[#D9E66F]" />
              <span>Resume Active Journey ({activeQuest.title})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onStartNewQuest}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-sm flex items-center justify-center gap-2.5 shadow-md hover-lift"
            >
              <Sparkles className="w-4 h-4 text-[#D9E66F]" />
              <span>Synthesize New Departure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="text-xs font-mono text-[#73786E] flex items-center gap-1.5 px-3 py-2">
            <Shield className="w-3.5 h-3.5 text-[#244B36]" />
            <span>Air-gapped &amp; private</span>
          </div>
        </div>
      </div>

      {/* Quick Field Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-5 space-y-1 shadow-sm">
          <div className="text-xs font-mono uppercase text-[#73786E] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#A8B9A0]" />
            <span>Screen-Free Outdoors</span>
          </div>
          <div className="text-2xl font-heading font-semibold text-[#244B36]">
            {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
          </div>
          <p className="text-[11px] text-[#73786E]">Quiet attention restored</p>
        </div>

        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-5 space-y-1 shadow-sm">
          <div className="text-xs font-mono uppercase text-[#73786E] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#A8B9A0]" />
            <span>Quests Completed</span>
          </div>
          <div className="text-2xl font-heading font-semibold text-[#244B36]">
            {totalQuests} Journeys
          </div>
          <p className="text-[11px] text-[#73786E]">Recorded in field journal</p>
        </div>

        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-5 space-y-1 shadow-sm">
          <div className="text-xs font-mono uppercase text-[#73786E] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#A8B9A0]" />
            <span>Data Sovereignty</span>
          </div>
          <div className="text-2xl font-heading font-semibold text-[#244B36]">
            100% Local
          </div>
          <p className="text-[11px] text-[#73786E]">Zero mandatory telemetry</p>
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="bg-[#EAE7DC]/60 border border-[#DDDCCF] rounded-3xl p-6 sm:p-8 space-y-3">
        <span className="text-xs font-mono uppercase text-[#244B36] font-semibold tracking-wider">
          The TouchGrass Tenet
        </span>
        <blockquote className="text-xl sm:text-2xl font-heading italic text-[#244B36] max-w-2xl leading-snug">
          “The screen should always be the shortest part of the experience.”
        </blockquote>
        <p className="text-xs text-[#73786E] max-w-xl leading-relaxed">
          Modern feeds consume hours through infinite scrolling. TouchGrass gives you four simple, unhurried sensory invitations, then asks you to turn the screen off and look up at the trees.
        </p>
      </div>
    </div>
  );
}
