"use client";

import React, { useState } from "react";
import { JournalEntry } from "@/types/quest";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

interface PastWalksListProps {
  journal: JournalEntry[];
}

export const PastWalksList: React.FC<PastWalksListProps> = React.memo(({ journal }) => {
  const [showLog, setShowLog] = useState<boolean>(false);

  return (
    <div className="mt-12 pt-6 border-t border-[#DDDCCF]/60">
      <button
        onClick={() => setShowLog(!showLog)}
        className="w-full flex items-center justify-between text-xs font-mono text-[#73786E] hover:text-[#244B36] py-1"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#A8B9A0]" />
          <span>Past Walks ({journal.length} saved)</span>
        </div>
        {showLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showLog && (
        <div className="mt-4 space-y-3 animate-in fade-in duration-150">
          {journal.length === 0 ? (
            <p className="text-xs text-[#73786E] text-center py-4 italic">
              No past walks saved yet.
            </p>
          ) : (
            journal.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFFEF9] border border-[#DDDCCF] p-4 rounded-2xl space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#73786E]">
                  <span className="text-[#244B36] font-semibold">{item.questTitle}</span>
                  <span>{new Date(item.dateCompleted).toLocaleDateString()} • {item.durationMinutes}m</span>
                </div>
                {item.reflection && (
                  <p className="italic text-[#73786E]">{item.reflection}</p>
                )}
                <p className="text-[#292E28]">{item.discoveries}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});

PastWalksList.displayName = "PastWalksList";
