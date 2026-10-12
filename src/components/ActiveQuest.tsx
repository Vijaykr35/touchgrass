"use client";

import React, { useState, useEffect } from "react";
import { Quest } from "@/types/quest";
import { Check, Clock, Moon, Printer, ArrowRight, X, AlertTriangle } from "lucide-react";

interface ActiveQuestProps {
  quest: Quest;
  onFinishQuest: () => void;
  onCancelQuest: () => void;
}

export function ActiveQuest({ quest, onFinishQuest, onCancelQuest }: ActiveQuestProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(quest.durationMinutes * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [sleepMode, setSleepMode] = useState<boolean>(false);
  const [completedStepIds, setCompletedStepIds] = useState<number[]>([]);

  useEffect(() => {
    if (!timerRunning || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  const toggleStep = (id: number) => {
    setCompletedStepIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = Math.min(
    100,
    Math.round(((quest.durationMinutes * 60 - secondsRemaining) / (quest.durationMinutes * 60)) * 100)
  );

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Status Protocol Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDDCCF] pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-[#73786E]">
            <span className="w-2 h-2 rounded-full bg-[#D9E66F]"></span>
            <span>{quest.protocolCode}</span>
            <span>•</span>
            <span className="text-[#244B36] font-medium uppercase">{quest.mood} Protocol</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-[#EAE7DC] text-[#292E28] hover:bg-[#DDDCCF] text-xs font-mono flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A6 Slip</span>
            </button>
            <button
              onClick={onCancelQuest}
              className="px-2.5 py-1.5 rounded-lg text-[#73786E] hover:text-red-700 text-xs flex items-center gap-1"
              title="Abandon Quest"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Main Departure Card */}
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
          {/* Subtle Archival Stamp Watermark */}
          <div className="absolute right-4 top-4 opacity-10 pointer-events-none font-mono text-[9px] uppercase leading-tight text-right text-[#244B36]">
            TouchGrass Specimen Archive<br />
            Air-Gapped Naturalist Index
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A8B9A0] font-semibold">
              Passive Outdoor Window
            </span>
            <h1 className="text-3xl font-heading font-medium text-[#244B36] tracking-tight mt-0.5">
              {quest.title}
            </h1>
            <p className="text-sm text-[#73786E] mt-1.5 leading-relaxed">
              {quest.description}
            </p>
          </div>

          {/* Calming Timer Block */}
          <div className="bg-[#F5F2E8] border border-[#DDDCCF]/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#DDDCCF"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#244B36"
                    strokeWidth="4"
                    strokeDasharray="213.6"
                    strokeDashoffset={213.6 - (213.6 * progressPct) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-base font-bold text-[#244B36]">
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-[#73786E]">Horizon Remaining</span>
                <div className="text-sm font-semibold text-[#292E28]">
                  {quest.durationMinutes} Minutes Allotted
                </div>
                <div className="text-xs text-[#73786E] mt-0.5">
                  Target Radius: {quest.estimatedRadius}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-[#DDDCCF] text-xs font-mono text-[#292E28] hover:bg-[#EAE7DC]"
              >
                {timerRunning ? "Pause" : "Resume"}
              </button>
              <button
                onClick={() => setSleepMode(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#244B36] text-[#FFFEF9] text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm hover-lift"
              >
                <Moon className="w-3.5 h-3.5 text-[#D9E66F]" />
                <span>Sleep Screen</span>
              </button>
            </div>
          </div>

          {/* Pocket Mode Sanctuary Callout */}
          <div className="bg-[#EAE7DC]/60 border border-[#DDDCCF] rounded-2xl p-4 flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#244B36] shrink-0 mt-1.5"></span>
            <div className="text-xs text-[#73786E] leading-relaxed">
              <strong className="text-[#292E28] font-semibold">Pocket Mode Protocol:</strong> You do not need to keep this screen awake. Memorize these sensory invitations or slip your device into a pocket. The outdoor air is the core experience.
            </div>
          </div>

          {/* Step Invitations */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-[#73786E]">
              <span>Sensory Invitations</span>
              <span>{completedStepIds.length}/{quest.steps.length} Noted</span>
            </div>

            <div className="space-y-2.5">
              {quest.steps.map((step) => {
                const isChecked = completedStepIds.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? "bg-[#EAE7DC]/40 border-[#A8B9A0] opacity-80"
                        : "bg-[#FFFEF9] border-[#DDDCCF] hover:border-[#A8B9A0] shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? "bg-[#244B36] text-[#FFFEF9]"
                          : "border border-[#DDDCCF] bg-[#F5F2E8]"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            isChecked ? "line-through text-[#73786E]" : "text-[#244B36]"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F5F2E8] text-[#73786E]">
                          {step.sensoryFocus}
                        </span>
                      </div>
                      <p className="text-xs text-[#73786E] leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Return CTA */}
          <div className="pt-4 border-t border-[#DDDCCF]">
            <button
              onClick={onFinishQuest}
              className="w-full py-4 rounded-2xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover-lift"
            >
              <span>I Have Returned: Record Reflections</span>
              <ArrowRight className="w-4 h-4 text-[#D9E66F]" />
            </button>
          </div>
        </div>
      </div>

      {/* Screen Sleep Ambient Fullscreen Mode */}
      {sleepMode && (
        <div
          onClick={() => setSleepMode(false)}
          className="fixed inset-0 z-50 bg-[#16211A] text-[#F5F2E8] flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none animate-in fade-in duration-300"
        >
          <div className="max-w-md space-y-4">
            <span className="text-xs font-mono tracking-widest text-[#A8B9A0] uppercase">
              Screen Sleep Mode Engaged
            </span>
            <div className="font-mono text-7xl font-light text-[#FFFEF9] tracking-tight">
              {formatTimer(secondsRemaining)}
            </div>
            <p className="text-base text-[#A8B9A0] font-light leading-relaxed">
              Step away from the screen. Look up at the canopy. Notice the air around your collar.
            </p>
            <div className="pt-8">
              <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-mono text-[#A8B9A0]">
                Tap anywhere to awaken display
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
