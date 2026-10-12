"use client";

import React from "react";

interface ReflectStageProps {
  notedDetail: string;
  setNotedDetail: (v: string) => void;
  reflection: string;
  setReflection: (v: string) => void;
  onBack: () => void;
  onSave: () => void;
}

export const ReflectStage: React.FC<ReflectStageProps> = React.memo(
  ({
    notedDetail,
    setNotedDetail,
    reflection,
    setReflection,
    onBack,
    onSave,
  }) => {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase text-[#A8B9A0] font-semibold">
            After Your Walk
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[#244B36]">
            Welcome back. How was your walk?
          </h1>
          <p className="text-xs text-[#73786E]">
            Write down what you saw while you still remember.
          </p>
        </div>

        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[#73786E]">
              1. One thing you noticed outside
            </label>
            <input
              type="text"
              placeholder="e.g. Green moss on an old red brick wall..."
              value={notedDetail}
              onChange={(e) => setNotedDetail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-[#292E28] focus:outline-none focus:border-[#244B36]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[#73786E]">
              2. A short thought or feeling (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. It was peaceful to get fresh air."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs italic rounded-xl border border-[#DDDCCF] bg-[#F5F2E8] text-[#292E28] focus:outline-none focus:border-[#244B36]"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-3 rounded-2xl border border-[#DDDCCF] text-xs text-[#73786E] hover:text-[#292E28]"
            >
              Back
            </button>
            <button
              onClick={onSave}
              className="flex-1 py-3.5 rounded-2xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-xs flex items-center justify-center gap-2 shadow-md hover-lift"
            >
              <span>Save to My Notes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ReflectStage.displayName = "ReflectStage";
