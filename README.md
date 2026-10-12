# TouchGrass 🌱

> **Leave the screen behind. Let curiosity guide your steps.**  
> Built for the **[Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)**.

---

## 🌿 Overview

**TouchGrass** is a screen-minimizing outdoor companion that uses open-weight local AI (Ollama with **Gemma 2 2B** / **Qwen2.5 3B** / **Llama 3.2 1B**) to generate personalized, ambient outdoor micro-quests.

In an age of endless feeds, screen fatigue, and algorithmic doomscrolling, TouchGrass inverts the paradigm: **the screen is designed to be the shortest part of the experience.**

Once your departure card is generated:
1. 📖 **Memorize 3 gentle sensory prompts** (e.g., *“Find moss growing in pavement cracks”*, *“Listen for bird calls or wind for 30 seconds”*).
2. 🖨️ **Print an A6 pocket slip** or tap **Screen Sleep / Black Screen Mode**.
3. 🚶 **Step outside with zero tracking, zero mandatory GPS, and 100% data privacy.**
4. 📝 **Return and log your observations** in an air-gapped local IndexedDB field journal with soothing Web Audio synthesis chimes.

---

## ✨ Features

- 🧠 **100% On-Device Open AI Inference**: Generates creative sensory micro-quests using **Gemma 2 2B** (or Qwen2.5 / Llama 3.2) via local Ollama. Zero external API calls, zero telemetry.
- 🌙 **Screen Sleep / Pocket Mode**: Fullscreen dim black screen with a gentle countdown timer that keeps battery usage minimal and encourages you to slip the phone into your pocket.
- 🖨️ **Printable Field Slip (A6)**: One-click print stylesheet lets you take a physical paper index card outdoors and leave your device completely at home.
- 🔔 **Offline Web Audio Soundscapes**: Pure synthetic Web Audio API bells and singing bowl harmonies (start chime, step completed chime, time-up bowl chime)—no external audio files needed.
- 📓 **Local Naturalist Field Journal**: Complete with mood tracking (Before vs. After), sensory reflection, flora/discoveries log, and specimen notes stored entirely in the browser's IndexedDB.
- ⏱️ **Flexible Time Horizons**: Select 10m, 20m, 45m presets or dial in a custom timer (3–90 mins) to fit any work break or evening stroll.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Tailored earthy naturalist palette)
- **Local AI Engine**: [Ollama](https://ollama.ai/) running `gemma2:2b` (fallback support for `qwen2.5:3b`, `llama3.2:1b`, `deepseek-r1:1.5b`)
- **Validation**: Zod schema validation for strict JSON output parsing
- **Persistence**: IndexedDB (`idb`) for completely private, client-side data storage
- **Audio**: Web Audio API (real-time harmonic synthesis)

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18 or newer)
2. **Ollama** installed and running locally:
   ```bash
   # Pull Gemma 2 2B (recommended)
   ollama pull gemma2:2b

   # Or alternatively:
   ollama pull qwen2.5:3b
   ```

### Installation

```bash
# Clone the repository
git clone https://github.com/Vijaykr35/touchgrass.git
cd touchgrass

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
touchgrass/
├── src/
│   ├── app/
│   │   ├── api/quests/generate/route.ts  # Next.js API route connecting to Ollama
│   │   ├── layout.tsx                    # Root layout & typography
│   │   └── page.tsx                      # Main app controller & stage flow
│   ├── components/
│   │   ├── PrepareStage.tsx              # Duration selection & timer customization
│   │   ├── OutsideStage.tsx              # Active walk view, step checklist & sleep mode trigger
│   │   ├── ReflectStage.tsx              # Post-walk debriefing & notes
│   │   ├── SleepScreenOverlay.tsx        # Screen-dimming pocket overlay
│   │   ├── PastWalksList.tsx             # Archival history of past expeditions
│   │   └── ToastProvider.tsx             # Notification system
│   ├── services/
│   │   ├── aiService.ts                  # Ollama health check, prompt engineering & JSON recovery
│   │   ├── soundService.ts               # Web Audio API procedural synthesis
│   │   └── storageService.ts             # IndexedDB vault for quests & journal entries
│   └── types/
│       └── quest.ts                      # Zod schemas for quests, steps & entries
└── README.md
```

---

## 🛡️ Privacy & Philosophy

- **Zero Cloud Tracking**: All prompt synthesis and data storage remain exclusively on your computer or local network.
- **Mindful Technology**: Technology that respects human attention by intentionally minimizing screen interaction.

---

## 📄 License

MIT License. Crafted with curiosity for Hacktoberfest 2026.
