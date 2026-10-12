"use client";

import React from "react";
import { Trees, Compass, Clock, Award, Sparkles, ShieldCheck } from "lucide-react";

interface ProgressProps {
  stats: {
    totalQuests: number;
    totalMinutes: number;
    uniqueDiscoveriesCount: number;
    streakDays: number;
  };
}

export function ProgressView({ stats }: ProgressProps) {
  const hours = Math.floor(stats.totalMinutes / 60);
  const remainingMins = stats.totalMinutes % 60;

  const achievements = [
    {
      title: "First Grounding",
      desc: "Complete your first screen-free outdoor quest.",
      unlocked: stats.totalQuests >= 1,
      badge: "🌿",
    },
    {
      title: "Hour in the Canopy",
      desc: "Spend at least 60 mindful minutes outdoors.",
      unlocked: stats.totalMinutes >= 60,
      badge: "🌳",
    },
    {
      title: "Botanical Eye",
      desc: "Record at least 3 distinct flora or physical discoveries.",
      unlocked: stats.uniqueDiscoveriesCount >= 3,
      badge: "🔍",
    },
    {
      title: "Naturalist Wanderer",
      desc: "Complete 5 or more micro-expeditions.",
      unlocked: stats.totalQuests >= 5,
      badge: "🧭",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#DDDCCF] pb-4">
        <span className="text-xs font-mono text-[#A8B9A0] uppercase font-semibold">
          Attention &amp; Biophilia Index
        </span>
        <h1 className="text-3xl font-heading font-medium text-[#244B36] tracking-tight mt-1">
          Outdoor Progress
        </h1>
        <p className="text-sm text-[#73786E] mt-1">
          Pure tracking of restored attention without toxic streaks or gamified pressure.
        </p>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#73786E]">
            <span>Screen-Free</span>
            <Clock className="w-4 h-4 text-[#A8B9A0]" />
          </div>
          <div className="text-2xl font-heading font-semibold text-[#244B36]">
            {hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`}
          </div>
          <p className="text-[10px] text-[#73786E]">Total restored offline</p>
        </div>

        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#73786E]">
            <span>Journeys</span>
            <Compass className="w-4 h-4 text-[#A8B9A0]" />
          </div>
          <div className="text-2xl font-heading font-semibold text-[#244B36]">
            {stats.totalQuests}
          </div>
          <p className="text-[10px] text-[#73786E]">Quests completed</p>
        </div>

        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#73786E]">
            <span>Discoveries</span>
            <Trees className="w-4 h-4 text-[#A8B9A0]" />
          </div>
          <div className="text-2xl font-heading font-semibold text-[#244B36]">
            {stats.uniqueDiscoveriesCount}
          </div>
          <p className="text-[10px] text-[#73786E]">Items cataloged</p>
        </div>

        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#73786E]">
            <span>Active Days</span>
            <Sparkles className="w-4 h-4 text-[#A8B9A0]" />
          </div>
          <div className="text-2xl font-heading font-semibold text-[#244B36]">
            {stats.streakDays}
          </div>
          <p className="text-[10px] text-[#73786E]">Gentle consistency</p>
        </div>
      </div>

      {/* Meaningful Achievements */}
      <div className="space-y-4">
        <h2 className="text-base font-heading font-medium text-[#244B36]">
          Grounded Milestones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                a.unlocked
                  ? "bg-[#FFFEF9] border-[#A8B9A0] shadow-sm"
                  : "bg-[#EAE7DC]/30 border-[#DDDCCF] opacity-50"
              }`}
            >
              <span className="text-2xl select-none">{a.badge}</span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#244B36]">{a.title}</span>
                  {a.unlocked && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#D9E66F]/60 text-[#244B36] font-semibold uppercase">
                      Earned
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#73786E]">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
