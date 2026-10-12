import React from "react";
import { Quest } from "@/types/quest";
import { Check, Moon, Printer, RotateCcw, ArrowRight } from "lucide-react";
import { soundService } from "@/services/soundService";

interface OutsideStageProps {
  quest: Quest;
  formattedTime: string;
  completedSteps: number[];
  onToggleStep: (id: number) => void;
  onOpenSleepMode: () => void;
  onAbandon: () => void;
  onProceedToReflect: () => void;
}

export const OutsideStage: React.FC<OutsideStageProps> = React.memo(
  ({
    quest,
    formattedTime,
    completedSteps,
    onToggleStep,
    onOpenSleepMode,
    onAbandon,
    onProceedToReflect,
  }) => {
    const handleStepClick = (id: number) => {
      const isAlreadyDone = completedSteps.includes(id);
      if (!isAlreadyDone) {
        soundService.playStepComplete();
      } else {
        soundService.playClick();
      }
      onToggleStep(id);
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between text-xs font-mono text-[#73786E]">
          <span className="text-[#244B36] font-semibold">{quest.protocolCode}</span>
          <button
            onClick={() => {
              soundService.playClick();
              onAbandon();
            }}
            className="hover:text-red-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Stop Walk</span>
          </button>
        </div>

        {/* Outdoor Card */}
        <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[#244B36]">
              {quest.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#73786E] mt-1 leading-relaxed">
              {quest.description}
            </p>
          </div>

          {/* Passive Countdown & Sleep Screen */}
          <div className="bg-[#F5F2E8] border border-[#DDDCCF]/60 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#73786E]">
                Time Remaining
              </span>
              <div className="font-mono text-2xl font-bold text-[#244B36]">
                {formattedTime}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundService.playClick();
                  onOpenSleepMode();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#244B36] text-[#FFFEF9] text-xs font-medium flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <Moon className="w-3.5 h-3.5 text-[#D9E66F]" />
                <span>Black Screen</span>
              </button>
              <button
                onClick={() => {
                  soundService.playClick();
                  window.print();
                }}
                className="p-2 rounded-xl border border-[#DDDCCF] text-[#73786E] hover:text-[#292E28] active:scale-95 transition-transform"
                title="Print Paper Card"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pocket protocol tip */}
          <div className="text-xs text-[#73786E] bg-[#EAE7DC]/60 p-3.5 rounded-xl leading-relaxed">
            <strong className="text-[#244B36]">Tip:</strong> Put your phone in your pocket. Try to remember these 3 tasks while you walk:
          </div>

          {/* Step Checklist */}
          <div className="space-y-2.5">
            {quest.steps.map((step) => {
              const done = completedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99] ${
                    done
                      ? "bg-[#EAE7DC]/40 border-[#A8B9A0] opacity-75"
                      : "bg-[#FFFEF9] border-[#DDDCCF] hover:border-[#A8B9A0]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                      done ? "bg-[#244B36] text-[#FFFEF9]" : "border border-[#DDDCCF]"
                    }`}
                  >
                    {done && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div
                      className={`text-xs font-semibold ${
                        done ? "line-through text-[#73786E]" : "text-[#244B36]"
                      }`}
                    >
                      {step.title}
                    </div>
                    <p className="text-[11px] text-[#73786E] leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Return Button */}
          <button
            onClick={() => {
              soundService.playClick();
              onProceedToReflect();
            }}
            className="w-full py-4 rounded-2xl bg-[#244B36] hover:bg-[#1b3a2a] text-[#FFFEF9] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover-lift active:scale-[0.99]"
          >
            <span>I Am Back: Write Down Notes</span>
            <ArrowRight className="w-4 h-4 text-[#D9E66F]" />
          </button>
        </div>
      </div>
    );
  }
);

OutsideStage.displayName = "OutsideStage";
