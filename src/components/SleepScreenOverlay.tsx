"use client";

import React from "react";

interface SleepScreenOverlayProps {
  isOpen: boolean;
  formattedTime: string;
  onClose: () => void;
}

export const SleepScreenOverlay: React.FC<SleepScreenOverlayProps> = React.memo(
  ({ isOpen, formattedTime, onClose }) => {
    if (!isOpen) return null;

    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#16211A] text-[#F5F2E8] flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none animate-in fade-in duration-300"
      >
        <div className="max-w-md space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#A8B9A0] uppercase">
            Screen Turned Off
          </span>
          <div className="font-mono text-7xl font-light text-[#FFFEF9] tracking-tight">
            {formattedTime}
          </div>
          <p className="text-base text-[#A8B9A0] font-light leading-relaxed">
            Look up at the trees and sky. Enjoy the fresh air.
          </p>
          <div className="pt-8">
            <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-mono text-[#A8B9A0]">
              Tap anywhere to turn screen back on
            </span>
          </div>
        </div>
      </div>
    );
  }
);

SleepScreenOverlay.displayName = "SleepScreenOverlay";
