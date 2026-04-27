import type { Profile } from "@/lib/types";

/**
 * Simulator Agent
 *
 * Runs the EVM + VVPAT rehearsal, validates each micro-step, and adapts booth
 * guidance for language, accessibility needs, and disruption scenarios.
 */

export const SIMULATOR_STEPS = [
  {
    id: "enter-booth",
    title: "Enter booth",
    detail: "Join the marked lane, confirm your queue token, and move toward the first polling officer.",
    why: "Queue discipline preserves order and ensures those present at closing time are handled fairly.",
  },
  {
    id: "show-id",
    title: "Show accepted ID",
    detail: "Present an accepted photo ID only after the officer confirms your name on the roll.",
    why: "Roll verification and identity verification are separate checks under ECI procedure.",
  },
  {
    id: "ink-mark",
    title: "Receive indelible ink",
    detail: "Your finger is marked after identification so duplicate voting is visibly prevented.",
    why: "The ink mark is a physical anti-duplication safeguard that works across the polling day.",
  },
  {
    id: "cast-vote",
    title: "Use the ballot unit",
    detail: "Press the candidate button once, wait for the beep, and keep your eyes on the VVPAT window.",
    why: "The control unit and ballot unit coordinate one recorded vote at a time.",
  },
  {
    id: "verify-vvpat",
    title: "Check the VVPAT slip",
    detail: "Verify the candidate name and symbol for a few seconds before the slip drops into the sealed box.",
    why: "VVPAT gives immediate visual confirmation without breaking ballot secrecy.",
  },
  {
    id: "exit",
    title: "Exit the booth",
    detail: "Leave through the exit path once the vote is complete and the slip is no longer visible.",
    why: "A clean exit keeps the booth private and ready for the next voter.",
  },
] as const;

export function getStepHint(stepId: string, profile: Profile) {
  if (profile.hasPwD && stepId === "enter-booth") {
    return "PwD mode is live: ask for the ramp lane, seating support, or companion assistance only if you want it.";
  }

  if (stepId === "cast-vote") {
    return "Press only one button and wait for the beep. If the process stops, the presiding officer secures the machine before voting resumes.";
  }

  return "Electra is watching for the legal reason behind each step.";
}

export function validateSimulatorAction(stepId: string, action: string) {
  const expectedAction: Record<string, string[]> = {
    "enter-booth": ["enter", "queue"],
    "show-id": ["show-id", "id", "verify"],
    "ink-mark": ["ink", "mark"],
    "cast-vote": ["vote", "candidate", "press"],
    "verify-vvpat": ["vvpat", "verify", "slip"],
    exit: ["exit", "complete"],
  };

  return expectedAction[stepId]?.includes(action) ?? false;
}
