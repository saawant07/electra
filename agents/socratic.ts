import { MYTH_MAP } from "@/data/myths";
import type { SocraticRoundResult } from "@/lib/types";

/**
 * Socratic Agent Contract
 *
 * Responsibility:
 * Runs the Myth Buster debate by forcing the user to defend misinformation and
 * then rebutting it with escalating, source-backed election rules.
 *
 * Memory scope:
 * Reads `mythDebates.debated`, `mythDebates.badges`, and
 * `mythDebates.argumentativenessScore`. It also receives the active myth and
 * live debate transcript from the hook that owns the current session.
 *
 * Tools / APIs:
 * Hardcoded ECI knowledge base, concession detector, badge generator.
 *
 * Handoff trigger:
 * Yields after each rebuttal, or once concession / round-three lockout awards a
 * completion badge and returns control to the Orchestrator.
 */

const CONCESSION_PATTERNS = [
  "i concede",
  "you are right",
  "fair point",
  "okay i get it",
  "i was wrong",
  "you win",
  "that makes sense",
  "i see your point",
  "fine, i get it",
];

const ARGUMENT_FRAMES = [
  {
    keywords: ["pointless", "waste", "useless", "nothing changes", "no effect"],
    heard:
      "Electra hears a consequence claim: if the action does not flip the final result, you are treating it as meaningless.",
    question:
      "If a vote only matters when it overturns the winner, what would you call every losing vote that still registers a real choice?",
  },
  {
    keywords: ["must", "mandatory", "have to", "cannot alone", "need someone"],
    heard:
      "Electra hears a dependency claim: you are assuming the voter must adapt to the system instead of the system adapting to the voter.",
    question:
      "Why would ECI publish accessibility and facilitation rules if the voter had no right to attempt the process independently?",
  },
  {
    keywords: ["aadhaar", "id", "document", "epic", "passport", "pan"],
    heard:
      "Electra hears an identity shortcut: one document is being stretched into a full voting entitlement.",
    question:
      "Can identity alone create a lawful vote if the electoral roll entry is missing or the procedure says multiple checks apply?",
  },
  {
    keywords: ["power cut", "machine fail", "disappear", "lost"],
    heard:
      "Electra hears a system-trust claim: you are equating disruption with illegitimacy.",
    question:
      "Is the stronger argument really 'failure happened,' or is it 'failure happened and no recovery procedure exists'?",
  },
  {
    keywords: ["first time", "alone", "parent", "elder", "woman", "male relative"],
    heard:
      "Electra hears a permission claim: the voter is being treated as though legal capacity comes from another person.",
    question:
      "What part of the booth procedure actually requires a family witness rather than institutional verification by polling staff?",
  },
];

const ROUND_LABELS = {
  1: "Probe the shortcut",
  2: "Escalate with procedure",
  3: "Force the concession",
} as const;

export function getOpeningChallenge(mythId: string) {
  const myth = MYTH_MAP[mythId];

  return {
    prompt: myth.prompt,
    truth: myth.truth,
  };
}

export function detectConcession(argument: string) {
  const normalized = argument.toLowerCase();
  return CONCESSION_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function getPersonalizedHook(mythId: string, argument: string) {
  const myth = MYTH_MAP[mythId];
  const normalized = argument.toLowerCase();

  return (
    myth.hooks.find((hook) =>
      hook.keywords.some((keyword) => normalized.includes(keyword)),
    ) ?? {
      acknowledgement:
        "That argument sounds plausible because it compresses a messy election rule into a simple shortcut.",
      pivot:
        "Electra's job here is to reopen the shortcut and make the actual rule visible again.",
    }
  );
}

function analyzeArgument(argument: string) {
  const normalized = argument.toLowerCase();

  return (
    ARGUMENT_FRAMES.find((frame) =>
      frame.keywords.some((keyword) => normalized.includes(keyword)),
    ) ?? {
      heard:
        "Electra hears a plausible shortcut: a messy election rule is being compressed into a cleaner story than the law actually allows.",
      question:
        "What is the exact ECI step that proves this shortcut is lawful rather than just emotionally intuitive?",
    }
  );
}

export function runSocraticRound(input: {
  mythId: string;
  argument: string;
  round: number;
}): SocraticRoundResult {
  const myth = MYTH_MAP[input.mythId];
  const hook = getPersonalizedHook(input.mythId, input.argument);
  const analysis = analyzeArgument(input.argument);
  const conceded = detectConcession(input.argument);
  const moveLabel =
    ROUND_LABELS[
      Math.min(input.round, 3) as keyof typeof ROUND_LABELS
    ];

  if (conceded) {
    return {
      conceded: true,
      finished: true,
      badgeAwarded: "Fact Shield",
      rebuttal: [
        "Concession accepted.",
        myth.truth,
        "You did the hard part: you let the rule beat the shortcut before the shortcut hardened into certainty.",
      ].join(" "),
      verdict: myth.verdictLabel,
      citation: myth.sourceLabel,
      moveLabel: "Concession logged",
      heard:
        "Electra hears the myth giving way to the actual rule, which is the entire point of this mission.",
      counterQuestion:
        "Now that the shortcut broke, what is the precise rule you would repeat to another voter?",
      pressure: 100,
    };
  }

  const stage = myth.rebuttals[Math.min(input.round - 1, myth.rebuttals.length - 1)];
  const rebuttal = [
    analysis.heard,
    "",
    hook.acknowledgement,
    hook.pivot,
    "",
    stage.evidence,
    stage.escalation,
    "",
    `Counter: ${analysis.question}`,
  ].join("\n");

  const finished = input.round >= 3;

  return {
    conceded: false,
    finished,
    badgeAwarded: finished ? "Stubborn Voter" : null,
    rebuttal,
    verdict: finished
      ? "Electra held the rule for three rounds. You held the myth and earned the Stubborn Voter badge."
      : myth.verdictLabel,
    citation: `${myth.sourceLabel} - ${stage.citation}`,
    moveLabel,
    heard: analysis.heard,
    counterQuestion: analysis.question,
    pressure: Math.min(100, input.round * 34),
  };
}
