import type { QuizQuestion } from "@/lib/types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "docs-roll",
    topic: "documents",
    prompt: "Can you vote if your Aadhaar is in hand but your name is missing from the voter roll?",
    options: [
      {
        id: "a",
        label: "Yes, Aadhaar by itself is enough.",
        correct: false,
        explanation: "You must be on the electoral roll. An accepted photo ID does not replace enrolment.",
      },
      {
        id: "b",
        label: "No, your name must be on the roll and you need an accepted photo ID.",
        correct: true,
        explanation: "ECI rules require both an enrolled name and acceptable identification.",
      },
      {
        id: "c",
        label: "Only first-time voters need the roll.",
        correct: false,
        explanation: "Every voter must appear on the roll.",
      },
    ],
  },
  {
    id: "evm-vvpat",
    topic: "evm",
    prompt: "What does the VVPAT slip do after you verify it?",
    options: [
      {
        id: "a",
        label: "It drops into a sealed box automatically.",
        correct: true,
        explanation: "The slip is visible briefly and then falls into the sealed VVPAT compartment.",
      },
      {
        id: "b",
        label: "You collect it as your voting receipt.",
        correct: false,
        explanation: "Voters never take the VVPAT slip home.",
      },
      {
        id: "c",
        label: "The poll officer keeps it by hand.",
        correct: false,
        explanation: "The slip stays sealed inside the machine.",
      },
    ],
  },
  {
    id: "rights-queue",
    topic: "rights",
    prompt: "If you are already in the queue when the booth closing time arrives, what happens?",
    options: [
      {
        id: "a",
        label: "You still get to vote after queue marking.",
        correct: true,
        explanation: "Eligible voters already in queue at closing time are marked and allowed to vote.",
      },
      {
        id: "b",
        label: "The gates close immediately and everyone leaves.",
        correct: false,
        explanation: "Closing time stops new entries, not the marked queue.",
      },
      {
        id: "c",
        label: "Only senior citizens remain.",
        correct: false,
        explanation: "Marked voters in the queue continue, regardless of age.",
      },
    ],
  },
  {
    id: "timeline-west-bengal",
    topic: "timelines",
    prompt: "When is West Bengal Phase 2 polling scheduled in 2026?",
    options: [
      {
        id: "a",
        label: "23 April 2026",
        correct: false,
        explanation: "23 April 2026 is Phase 1.",
      },
      {
        id: "b",
        label: "29 April 2026",
        correct: true,
        explanation: "West Bengal Phase 2 is on 29 April 2026.",
      },
      {
        id: "c",
        label: "4 May 2026",
        correct: false,
        explanation: "4 May 2026 is the counting day for all listed states.",
      },
    ],
  },
  {
    id: "rights-pwd",
    topic: "rights",
    prompt: "Does a PwD voter always have to bring a companion to cast a vote?",
    options: [
      {
        id: "a",
        label: "Yes, a companion is mandatory for every PwD voter.",
        correct: false,
        explanation: "PwD voters may use assistance, but it is not mandatory for everyone.",
      },
      {
        id: "b",
        label: "No, assistance is available and companion use depends on the voter's choice and need.",
        correct: true,
        explanation: "ECI rules center the voter's autonomy and provide optional support.",
      },
      {
        id: "c",
        label: "Only visually impaired voters can enter the booth.",
        correct: false,
        explanation: "PwD voters across categories are entitled to accessible voting support.",
      },
    ],
  },
];
