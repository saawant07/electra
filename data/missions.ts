import type { MissionDefinition } from "@/lib/types";

/** 8 Mission cards for the Mission Control dashboard */
export const MISSIONS: MissionDefinition[] = [
  {
    id: "complete-profile",
    title: "Complete Your Profile",
    icon: "👤",
    description: "Set up your voter profile so Electra can personalise your entire journey.",
    xp: 50,
    href: "/onboarding",
  },
  {
    id: "check-voter-list",
    title: "Check Your Voter List Name",
    icon: "📋",
    description: "Verify your name appears on the Electoral Roll — the first and most critical step.",
    xp: 80,
    href: "/timeline",
  },
  {
    id: "verify-documents",
    title: "Verify Your Documents",
    icon: "📄",
    description: "Confirm you have at least one of the 10 ECI-accepted photo identity documents.",
    xp: 80,
    href: "/documents",
  },
  {
    id: "find-booth",
    title: "Find Your Polling Booth",
    icon: "📍",
    description: "Locate your assigned polling booth and save the details to your profile.",
    xp: 70,
    href: "/booth",
  },
  {
    id: "evm-simulator",
    title: "Master the EVM Simulator",
    icon: "🖥️",
    description: "Practice every step of the voting process on a hyper-realistic EVM + VVPAT simulator.",
    xp: 140,
    href: "/simulator",
  },
  {
    id: "election-iq-quiz",
    title: "Ace the Election IQ Quiz",
    icon: "🧠",
    description: "Test your election knowledge with 10 adaptive questions and measure confidence growth.",
    xp: 120,
    href: "/quiz",
  },
  {
    id: "debate-myths",
    title: "Debate the Myths",
    icon: "⚔️",
    description: "Argue for voter myths and let Electra push back with ECI evidence. The Socratic way.",
    xp: 140,
    href: "/myths",
  },
  {
    id: "become-voteready",
    title: "Become VoteReady",
    icon: "🏆",
    description: "Complete all missions to unlock your VoteReady Passport and celebration.",
    xp: 200,
    href: "/passport",
    prerequisites: [
      "complete-profile",
      "check-voter-list",
      "verify-documents",
      "find-booth",
      "evm-simulator",
      "election-iq-quiz",
      "debate-myths",
    ],
  },
];

export const MISSION_MAP = Object.fromEntries(
  MISSIONS.map((m) => [m.id, m]),
) as Record<MissionDefinition["id"], MissionDefinition>;
