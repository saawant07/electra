# Electra 2026

![Built with Google Antigravity](https://img.shields.io/badge/Built%20with-Google%20Antigravity-4285F4?style=for-the-badge)
![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-111827?style=for-the-badge)

## What is Electra 2026?

Electra 2026 is an offline-first election-readiness web app built for Hack2Skill PromptWars. Its hero experience is **Socratic Myth Buster**:

- Electra shows a real voter myth.
- The voter must **argue for the myth**.
- Electra argues back with escalating Election Commission of India rule logic.
- The session ends only when the user concedes or survives all three rounds and earns the **Stubborn Voter** badge.

That changes voter education from passive reading into active confrontation with misinformation.

The rest of the product exists to support that core moment:

- a computed **Confidence Journey** proving readiness gains
- a **vernacular EVM + VVPAT simulator** with per-step voice coaching
- an always-on **Electra assistant** that stays grounded in the user’s state, timeline, and weak topics
- a final **Election Passport PDF** that packages readiness, badges, and timelines into a shareable artifact

## How Google Antigravity powers Electra

Electra is designed as a five-agent, contract-first system. Each agent has one job, a bounded memory scope, explicit tools, and a clean handoff trigger. That is the Antigravity story: not a single giant assistant, but coordinated specialists whose outputs compound into one adaptive product.

### Agent 1: Orchestrator Agent

- Responsibility: routes user intent, detects stalls after 90 seconds, and pushes the next best hint.
- Memory scope: full app state including profile, progress, current mission, quiz history, and myth history.
- Tools: Confidence Agent, Simulator Agent, Socratic Agent, Assistant Agent.
- Handoff trigger: once it has chosen the next mission, delivered a proactive hint, or delegated a question.

### Agent 2: Confidence Agent

- Responsibility: computes the voter confidence model across documents, EVM, rights, timelines, and myths.
- Memory scope: profile, activity log, completed missions, quiz history, myth debate results.
- Tools: confidence journey builder, mission unlock logic, carry-checklist generator.
- Handoff trigger: when confidence has been recomputed for the dashboard, assistant, or mission routing.

### Agent 3: Simulator Agent

- Responsibility: powers the EVM + VVPAT walkthrough, validates each booth step, and adapts help for PwD and NRI context.
- Memory scope: state, disability status, language preference, and the current simulator session.
- Tools: Web Speech API voice coaching, step validator, step-specific hints.
- Handoff trigger: after each validated booth step or when the power-cut scenario interrupts the flow.

### Agent 4: Socratic Agent

- Responsibility: runs the Myth Buster debate, interprets the user’s argument shape, and escalates the rebuttal with ECI-backed rule logic.
- Memory scope: myths seen, badges earned, argumentativeness score, and the live debate transcript.
- Tools: hardcoded ECI myth knowledge base, concession detector, badge system.
- Handoff trigger: after each rebuttal or when the debate resolves through concession or round-three lockout.

### Agent 5: Assistant Agent

- Responsibility: powers the always-visible Electra sidebar and answers in mission context.
- Memory scope: profile, computed confidence model, current mission, and the last 10 chat turns.
- Tools: booth finder, timeline reasoning, document checklist generation.
- Handoff trigger: after answering or when the user should be pushed into a mission surface.

### Why the confidence model feels intelligent

Electra never stores confidence as raw state. Confidence is **computed**, not hardcoded:

1. Onboarding creates the baseline.
2. Missions, quizzes, debates, and exports log structured impact events.
3. The Personalization Agent replays those events into a confidence journey.
4. The Orchestrator and Assistant both use that derived model to decide what the voter should do next.

That makes the product feel adaptive instead of checklist-driven.

## Architecture

```text
                             +----------------------+
                             |   Orchestrator       |
                             | route + nudge + handoff
                             +----------+-----------+
                                        |
                  +---------------------+----------------------+
                  |                     |                      |
                  v                     v                      v
        +----------------+   +---------------------+  +------------------+
        | Confidence     |   | Socratic Agent      |  | Simulator Agent  |
        | Agent          |   | myth debate engine  |  | EVM + VVPAT flow |
        +--------+-------+   +----------+----------+  +---------+--------+
                 |                      |                       |
                 |                      |                       |
                 v                      v                       v
        +----------------------------------------------------------------+
        | Zustand store + persisted activity log + derived confidence     |
        +----------------------------------------------------------------+
                 |                      |                       |
                 +----------------------+-----------------------+
                                        |
                                        v
                              +--------------------+
                              | Assistant Agent    |
                              | sidebar copilot    |
                              +--------------------+
```

## Why this matters

Electra is built for a real ECI problem space, not a fictional one.

- ECI explicitly identified **“youth disconnect”** and the need to remove **“information gap”** as part of SVEEP, its national voter education programme.
  Source: https://www.eci.gov.in/voicenet/ArticleDECUS.htm
- ECI says National Voters’ Day reaches newly eligible voters across **over 0.7 million polling station locations**, which shows the scale of first-time voter onboarding.
  Source: https://www.eci.gov.in/voicenet/ArticleDECUS.htm
- In the 2024 Lok Sabha Phase 1 press note, ECI reported **35.67 lakh first-time voters** and **3.51 crore voters aged 20-29** in that phase alone.
  Source: https://elections24.eci.gov.in/docs/Iy4WJ2RxE9.pdf
- ECI also warned voters to guard against misinformation and pointed them to its official **Myth vs Reality** register.
  Source: https://elections24.eci.gov.in/docs/Iy4WJ2RxE9.pdf
- In April 2024, ECI’s **Turning 18** campaign specifically targeted young and first-time voters because youth and urban apathy remained a concern.
  Source: https://elections24.eci.gov.in/docs/lJgySjIG5t.pdf

Electra turns that context into product behavior:

- myths become arguments, not static FAQ tiles
- confusion becomes a measurable confidence graph
- accessibility becomes part of the main simulator, not an afterthought
- official dates and accepted IDs stay available offline

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo script

### 0:00 to 0:08

Open Electra. Let the judges see the Election Readiness ring at 0% and the Mission Control board anchored around the Socratic Challenge.

### 0:08 to 0:16

Complete onboarding as a first-time voter from West Bengal. Choose the language, mark first-time voter, and optionally enable PwD context.

### 0:16 to 0:28

Open Myth Buster. Pick **“NOTA is a wasted vote.”** Use one of the demo-lane arguments. Let Electra interpret the logic, rebut it, escalate in round two, then concede and trigger the badge + confetti.

### 0:28 to 0:38

Jump into the EVM Simulator. Toggle Tamil voice coaching for the current step. Select a candidate, show the VVPAT slip animation, then resume through the power-cut scenario.

### 0:38 to 0:50

Return to the Confidence Journey. Show the before/after lift. Download the proof card PNG, then export the Election Passport PDF with the embedded graph and debate badges.

### 0:50 to 1:00

Use the Electra sidebar and ask: **“When is West Bengal Phase 2?”** Let the assistant answer with the exact date, current mission context, and next best action.

## Stack

- Next.js 15 App Router
- TypeScript strict mode
- Tailwind CSS + shadcn/ui primitives
- Framer Motion
- Zustand with localStorage persistence
- Recharts
- jsPDF
- canvas-confetti
- Web Speech API
- i18next with English, Hindi, Bengali, and Tamil
- PWA manifest + service worker + offline shell

## Key implementation notes

- Confidence is derived in `agents/confidence.ts`, not stored directly.
- The Myth Buster debate engine lives in `agents/socratic.ts` and `hooks/useSocratic.ts`.
- The app is offline-first: myths, timelines, checklists, quiz content, and booth data are hardcoded so every main screen works without an AI call.
- The Election Passport PDF embeds the readiness graph, debate badges, and a QR link to `https://voters.eci.gov.in`.

## Vercel deploy note

This app is ready for Vercel deployment as a static Next.js App Router build. The PWA assets live under `app/manifest.ts` and `public/sw.js`, with the offline shell in `public/offline.html`.
# electra
