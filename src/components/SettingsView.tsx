"use client";

import React, { useState } from "react";
import { Server, ShieldCheck, Database, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface SettingsProps {
  ollamaStatus: {
    available: boolean;
    model: string;
    error?: string;
  };
  onRefreshHealth: () => void;
  onClearData: () => void;
}

export function SettingsView({ ollamaStatus, onRefreshHealth, onClearData }: SettingsProps) {
  const { toast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#DDDCCF] pb-4">
        <span className="text-xs font-mono text-[#A8B9A0] uppercase font-semibold">
          System State &amp; Privacy
        </span>
        <h1 className="text-3xl font-heading font-medium text-[#244B36] tracking-tight mt-1">
          Settings &amp; Model Architecture
        </h1>
        <p className="text-sm text-[#73786E] mt-1">
          Manage local model endpoints, verify offline air-gap status, and control client data.
        </p>
      </div>

      {/* Ollama Local Service Status */}
      <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#244B36]" />
            <h2 className="text-base font-heading font-medium text-[#244B36]">
              Local Ollama Inference Engine
            </h2>
          </div>

          <button
            onClick={onRefreshHealth}
            className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#73786E] hover:text-[#244B36] hover:bg-[#F5F2E8]"
            title="Refresh Ollama Connection"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#F5F2E8] border border-[#DDDCCF]/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#73786E]">Service URL:</span>
            <span className="text-[#292E28] font-semibold">http://localhost:11434</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#73786E]">Configured Model:</span>
            <span className="text-[#244B36] font-semibold">{ollamaStatus.model}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-[#DDDCCF]/50">
            <span className="text-[#73786E]">Status:</span>
            {ollamaStatus.available ? (
              <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Online &amp; Model Loaded</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Offline / Procedural Fallback Active</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-[#73786E] leading-relaxed">
          When Ollama is online, prompts are synthesized strictly on your GPU/CPU via <code className="font-mono bg-[#EAE7DC] px-1 py-0.5 rounded text-[#244B36]">qwen2.5:3b</code>. When offline, TouchGrass automatically shifts to rule-based procedural generation without crashing.
        </p>
      </div>

      {/* Privacy & Air-Gap Assurance */}
      <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2.5 text-[#244B36]">
          <ShieldCheck className="w-5 h-5 text-[#244B36]" />
          <h2 className="text-base font-heading font-medium text-[#244B36]">
            Privacy &amp; Data Sovereignty
          </h2>
        </div>
        <p className="text-xs text-[#73786E] leading-relaxed">
          TouchGrass sends <strong>zero user prompts or coordinates to external cloud APIs</strong>. No Google Analytics, no telemetry beacons, no cloud sync requirements. Your field journals reside in your browser's local IndexedDB vault.
        </p>
      </div>

      {/* Local Storage & Wipe */}
      <div className="bg-[#FFFEF9] border border-[#DDDCCF] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 text-[#244B36]">
          <Database className="w-5 h-5 text-[#244B36]" />
          <h2 className="text-base font-heading font-medium text-[#244B36]">
            Local Data Storage (IndexedDB)
          </h2>
        </div>
        <p className="text-xs text-[#73786E]">
          Resetting will clear cached quests and field journal folios from this browser.
        </p>

        {confirmClear ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClearData();
                setConfirmClear(false);
              }}
              className="px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-semibold hover:bg-red-800"
            >
              Confirm Wipe All Data
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-2 rounded-xl border border-[#DDDCCF] text-xs text-[#73786E]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-mono"
          >
            Clear Local IndexedDB Database
          </button>
        )}
      </div>
    </div>
  );
}
