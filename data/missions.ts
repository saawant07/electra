import type { MissionDefinition } from "@/lib/types";

export const MISSIONS: MissionDefinition[] = [
  {
    id: "socratic-challenge",
    title: "Socratic Challenge",
    shortTitle: "Debate",
    description:
      "Argue for a voter myth and let Electra push back with escalating ECI-backed evidence.",
    cta: "Argue now",
    impact: { myths: 24, rights: 10 },
    xp: 140,
    prominent: true,
  },
  {
    id: "document-briefing",
    title: "Document Briefing",
    shortTitle: "Documents",
    description:
      "Build a tailored checklist so you know exactly what to carry and what never counts alone.",
    cta: "Check carry list",
    impact: { documents: 18 },
    xp: 80,
  },
  {
    id: "election-iq-quiz",
    title: "Adaptive Election IQ Quiz",
    shortTitle: "Quiz",
    description:
      "Measure your confidence before and after a targeted rules quiz across documents, EVM, rights, and timelines.",
    cta: "Take quiz",
    impact: { documents: 8, evm: 8, rights: 8, timelines: 8 },
    xp: 120,
  },
  {
    id: "evm-simulator",
    title: "EVM + VVPAT Simulator",
    shortTitle: "Simulator",
    description:
      "Practice every booth step, trigger the power-cut scenario, and hear each rule in your language.",
    cta: "Enter booth",
    impact: { evm: 26, rights: 6 },
    xp: 140,
    prerequisites: ["socratic-challenge"],
  },
  {
    id: "rights-and-accessibility",
    title: "Rights and Accessibility Briefing",
    shortTitle: "Rights",
    description:
      "Learn queue rights, companion rules, PwD support, and what poll officers must provide.",
    cta: "Know my rights",
    impact: { rights: 20 },
    xp: 90,
  },
  {
    id: "booth-finder",
    title: "Booth Finder",
    shortTitle: "Booth",
    description:
      "Find the closest sample booth, see accessibility support, and avoid queue spikes with a live-feeling heatmap.",
    cta: "Find booth",
    impact: { documents: 8, timelines: 10 },
    xp: 90,
  },
  {
    id: "timeline-tracker",
    title: "Timeline Tracker",
    shortTitle: "Timeline",
    description:
      "Lock in your state's polling phase and counting day so you never miss the correct voting window.",
    cta: "Lock timeline",
    impact: { timelines: 20 },
    xp: 70,
  },
  {
    id: "election-passport",
    title: "Election Passport",
    shortTitle: "Passport",
    description:
      "Export your readiness proof with the confidence graph, earned badges, and a direct ECI QR link.",
    cta: "Export PDF",
    impact: { documents: 4, evm: 4, rights: 4, timelines: 4, myths: 4 },
    xp: 110,
    prerequisites: [
      "socratic-challenge",
      "document-briefing",
      "election-iq-quiz",
      "evm-simulator",
      "rights-and-accessibility",
      "booth-finder",
      "timeline-tracker",
    ],
  },
];

export const MISSION_MAP = Object.fromEntries(
  MISSIONS.map((mission) => [mission.id, mission]),
) as Record<MissionDefinition["id"], MissionDefinition>;
