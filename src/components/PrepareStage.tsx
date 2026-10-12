import React, { useState } from "react";
import { Compass, ArrowRight, SlidersHorizontal, Plus, Minus } from "lucide-react";
import { soundService } from "@/services/soundService";

interface PrepareStageProps {
  duration: number;
  setDuration: (d: number) => void;
  loading: boolean;
  onStartQuest: () => void;
}

export const PrepareStage: React.FC<PrepareStageProps> = React.memo(
  ({ duration, setDuration, loading, onStartQuest }) => {
    const [isCustom, setIsCustom] = useState<boolean>(![10, 20, 45].includes(duration));

    const handleSelectPreset = (mins: number) => {
      soundService.playClick();
      setIsCustom(false);
      setDuration(mins);
    };

    const handleAdjustCustom = (delta: number) => {
      soundService.playClick();
      setDuration(Math.max(1, Math.min(180, duration + delta)));
    };

    const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        setDuration(Math.max(1, Math.min(180, val)));
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="space-y-2 text-center sm:text-left">
          <span className="font-mono text-xs uppercase tracking-wider text-[#A8B9A0] font-semibold">
            Outdoor Walk Helper
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[#244B36] tracking-tight">
            Put your phone away.
          </h1>
          <p className="text-sm text-[#73786E] leading-relaxed" suppressHydrationWarning>
            Pick how much time you have. We give you 3 simple things to look for outside.
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#73786E] uppercase">
            <span>Walk Time</span>
            <span>Around ~{duration * 40} meters</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[10, 20, 45].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSelectPreset(mins)}
                className={`py-3.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
                  !isCustom && duration === mins
                    ? "bg-[#244B36] text-[#FFFEF9] border-[#244B36] shadow-sm font-semibold"
                    : "bg-[#F5F2E8] border-transparent text-[#73786E] hover:text-[#292E28]"
                }`}
              >
                <span className="text-xl sm:text-2xl font-mono">{mins}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
                  Mins
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setIsCustom(true);
              }}
              className={`py-3.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
                isCustom
                  ? "bg-[#244B36] text-[#FFFEF9] border-[#244B36] shadow-sm font-semibold"
                  : "bg-[#F5F2E8] border-transparent text-[#73786E] hover:text-[#292E28]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mb-1" />
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
                Custom
              </span>
            </button>
          </div>

          {/* Custom Timer Stepper & Slider */}
          {isCustom && (
            <div className="pt-2 pb-1 border-t border-[#DDDCCF]/60 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#73786E]">Set custom minutes:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdjustCustom(-5)}
                    className="p-1.5 rounded-lg bg-[#F5F2E8] border border-[#DDDCCF] text-[#244B36] hover:bg-[#EAE7DC] active:scale-95"
                    title="-5 minutes"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={duration}
                    onChange={handleCustomInputChange}
                    className="w-16 text-center font-mono text-lg font-semibold bg-[#F5F2E8] border border-[#DDDCCF] rounded-lg py-1 text-[#244B36] focus:outline-none focus:ring-1 focus:ring-[#244B36]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdjustCustom(5)}
                    className="p-1.5 rounded-lg bg-[#F5F2E8] border border-[#DDDCCF] text-[#244B36] hover:bg-[#EAE7DC] active:scale-95"
                    title="+5 minutes"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="3"
                max="90"
                step="1"
                value={duration}
                onChange={(e) => {
                  setDuration(parseInt(e.target.value, 10));
                }}
                className="w-full accent-[#244B36] cursor-pointer"
              />
            </div>
          )}

          <div className="text-xs text-[#73786E] text-center italic pt-1" suppressHydrationWarning>
            <span key={duration}>
              {duration <= 10
                ? "A short walk around the block."
                : duration <= 25
                ? "A peaceful walk along nearby streets."
                : "A longer walk to explore your neighborhood."}
            </span>
          </div>
        </div>

        {/* Launch CTA */}
        <button
          onClick={onStartQuest}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover-lift disabled:opacity-60"
        >
          {loading ? (
            <span>Finding your walk ideas...</span>
          ) : (
            <>
              <Compass className="w-4 h-4 text-[#D9E66F]" />
              <span>Start {duration}-Minute Walk</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    );
  }
);

PrepareStage.displayName = "PrepareStage";
