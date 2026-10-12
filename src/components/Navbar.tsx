"use client";

import React from "react";
import { Compass, BookOpen, BarChart3, Settings, Sparkles } from "lucide-react";

export type NavTab = "home" | "create" | "active" | "journal" | "progress" | "settings";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveQuest?: boolean;
}

export function Navbar({ currentTab, onSelectTab, hasActiveQuest }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F2E8]/90 backdrop-blur-md border-b border-[#DDDCCF] px-4 sm:px-8 py-3.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onSelectTab("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#244B36] flex items-center justify-center text-[#D9E66F] shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg text-[#244B36] tracking-tight">TouchGrass</span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#EAE7DC] text-[#73786E]">
                Offline-First AI
              </span>
            </div>
            <p className="text-[11px] text-[#73786E] -mt-0.5 hidden sm:block">Ambient Field Guide &amp; Outdoor Quests</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#EAE7DC]/70 p-1 rounded-xl">
          <button
            onClick={() => onSelectTab("home")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === "home"
                ? "bg-[#244B36] text-[#FFFEF9] shadow-sm"
                : "text-[#73786E] hover:text-[#292E28]"
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => onSelectTab("create")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === "create"
                ? "bg-[#244B36] text-[#FFFEF9] shadow-sm"
                : "text-[#73786E] hover:text-[#292E28]"
            }`}
          >
            New Quest
          </button>

          {hasActiveQuest && (
            <button
              onClick={() => onSelectTab("active")}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === "active"
                  ? "bg-[#244B36] text-[#FFFEF9] shadow-sm"
                  : "text-[#244B36] font-semibold bg-[#D9E66F]/40"
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#244B36] animate-pulse"></span>
                Active
              </span>
            </button>
          )}

          <button
            onClick={() => onSelectTab("journal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === "journal"
                ? "bg-[#244B36] text-[#FFFEF9] shadow-sm"
                : "text-[#73786E] hover:text-[#292E28]"
            }`}
          >
            Journal
          </button>

          <button
            onClick={() => onSelectTab("progress")}
            className={`hidden sm:block px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === "progress"
                ? "bg-[#244B36] text-[#FFFEF9] shadow-sm"
                : "text-[#73786E] hover:text-[#292E28]"
            }`}
          >
            Progress
          </button>

          <button
            onClick={() => onSelectTab("settings")}
            className={`px-2 py-1.5 rounded-lg text-xs transition-all ${
              currentTab === "settings"
                ? "bg-[#244B36] text-[#FFFEF9] shadow-sm"
                : "text-[#73786E] hover:text-[#292E28]"
            }`}
            title="Settings & Ollama Status"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
