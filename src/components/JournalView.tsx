"use client";

import React, { useState } from "react";
import { JournalEntry } from "@/types/quest";
import { Calendar, Clock, Smile, Trash2, Download, Search, Leaf } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface JournalListProps {
  entries: JournalEntry[];
  onDeleteEntry: (id: string) => void;
}

export function JournalView({ entries, onDeleteEntry }: JournalListProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState("all");

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.questTitle.toLowerCase().includes(search.toLowerCase()) ||
      e.discoveries.toLowerCase().includes(search.toLowerCase()) ||
      e.reflection.toLowerCase().includes(search.toLowerCase());
    const matchesMood = selectedMood === "all" || e.moodAfter.toLowerCase() === selectedMood.toLowerCase();
    return matchesSearch && matchesMood;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `touchgrass-journal-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast("Journal exported to local JSON file.", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DDDCCF] pb-4">
        <div>
          <span className="text-xs font-mono text-[#A8B9A0] uppercase font-semibold">
            On-Device Ledger // Private Folio
          </span>
          <h1 className="text-3xl font-heading font-medium text-[#244B36] tracking-tight mt-1">
            Personal Field Journal
          </h1>
          <p className="text-sm text-[#73786E] mt-1">
            A Record of steps taken, senses reawakened, and wild corners uncovered.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-3.5 py-2 rounded-xl border border-[#DDDCCF] bg-[#FFFEF9] text-xs font-mono text-[#244B36] flex items-center gap-2 hover:bg-[#EAE7DC] shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Folio (JSON)</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#73786E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search discoveries or flora..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDDCCF] bg-[#FFFEF9] text-[#292E28]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {["all", "grounded", "calm", "curious", "adventurous"].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors shrink-0 ${selectedMood === m
                  ? "bg-[#244B36] text-[#FFFEF9] font-semibold"
                  : "bg-[#EAE7DC] text-[#73786E] hover:text-[#292E28]"
                }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl text-xs text-[#73786E] space-y-2">
            <Leaf className="w-6 h-6 mx-auto text-[#A8B9A0]" />
            <p>No journal entries found. Embark on a new quest and return to log discoveries.</p>
          </div>
        ) : (
          filtered.map((entry) => (
            <article
              key={entry.id}
              className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-6 space-y-4 shadow-sm hover-lift"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#73786E]">
                    <span className="text-[#244B36] font-semibold">
                      {new Date(entry.dateCompleted).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>•</span>
                    <span>{entry.durationMinutes}m Horizon</span>
                    <span>•</span>
                    <span className="capitalize text-[#244B36] bg-[#D9E66F]/40 px-2 py-0.5 rounded font-mono">
                      {entry.moodAfter}
                    </span>
                  </div>
                  <h2 className="text-xl font-heading font-medium text-[#244B36]">
                    {entry.questTitle}
                  </h2>
                </div>

                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1.5 text-[#73786E] hover:text-red-700 rounded-lg hover:bg-[#F5F2E8]"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {entry.reflection && (
                <blockquote className="text-sm italic font-heading text-[#73786E] border-l-2 border-[#A8B9A0] pl-3 py-0.5">
                  {entry.reflection}
                </blockquote>
              )}

              <p className="text-xs text-[#292E28] leading-relaxed">
                {entry.discoveries}
              </p>

              {entry.specimenFound && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#73786E] bg-[#F5F2E8] p-2.5 rounded-xl border border-[#DDDCCF]/60">
                  <span className="text-[#244B36] font-semibold">Artifact / Token:</span>
                  <span>{entry.specimenFound}</span>
                </div>
              )}

              {entry.photoBase64 && (
                <div className="w-full max-h-60 rounded-xl overflow-hidden border border-[#DDDCCF]">
                  <img src={entry.photoBase64} alt="Specimen" className="w-full h-full object-cover" />
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
