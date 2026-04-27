import { buildCarryChecklist } from "@/agents/personalization";
import { COUNTING_DAY, ELECTION_TIMELINE } from "@/data/timelines";
import type {
  AssistantReply,
  ConfidenceModel,
  ElectraStoreState,
  MissionId,
} from "@/lib/types";
import { formatDateLong } from "@/lib/utils";

/**
 * Assistant Agent Contract
 *
 * Responsibility:
 * Keeps the sidebar chat useful, specific, and state-aware by answering with
 * the current mission, weakest topics, and election timeline in view.
 *
 * Memory scope:
 * Reads `profile`, `assistantHistory`, `ui.currentMission`, and the derived
 * confidence model passed in by the Orchestrator.
 *
 * Tools / APIs:
 * Booth finder data, timeline calculator, dynamic document checklist generator.
 *
 * Handoff trigger:
 * Yields after answering a user question or when it detects the user would be
 * better served by jumping to a mission surface such as the simulator or booth
 * finder.
 */

const MISSION_LABELS: Record<MissionId, string> = {
  "socratic-challenge": "Socratic Challenge",
  "document-briefing": "Document Briefing",
  "election-iq-quiz": "Election IQ Quiz",
  "evm-simulator": "EVM Simulator",
  "rights-and-accessibility": "Rights and Accessibility",
  "booth-finder": "Booth Finder",
  "timeline-tracker": "Timeline Tracker",
  "election-passport": "Election Passport",
};

export function answerAssistantQuestion(input: {
  message: string;
  state: Pick<ElectraStoreState, "profile" | "ui" | "assistantHistory">;
  confidence: ConfidenceModel;
}): AssistantReply {
  const normalized = input.message.toLowerCase();
  const { profile } = input.state;
  const stateTimeline = ELECTION_TIMELINE.filter((item) => item.state === profile.state);
  const recentTurns = input.state.assistantHistory.slice(-4);
  const recentTranscript = recentTurns.map((turn) => turn.content.toLowerCase()).join(" ");
  const missionContext = `You are currently in ${MISSION_LABELS[input.state.ui.currentMission]}, so Electra is steering you toward the fastest next move from here.`;

  if (
    normalized.includes("phase 2") ||
    normalized.includes("when") ||
    normalized.includes("counting")
  ) {
    const phaseTwo = stateTimeline.find((item) => item.phaseLabel === "Phase 2");
    const primary = phaseTwo ?? stateTimeline[0];

    return {
      answer: phaseTwo
        ? `${profile.state} ${phaseTwo.phaseLabel} polling is on ${formatDateLong(phaseTwo.date)}. Counting for all listed states is on ${formatDateLong(COUNTING_DAY)}.`
        : `${profile.state} ${primary.phaseLabel.toLowerCase()} polling is on ${formatDateLong(primary.date)}. Counting is on ${formatDateLong(COUNTING_DAY)}.`,
      followUp: `Use the Timeline Tracker to lock the correct date into your mission progress. ${missionContext}`,
      missionHint: "timeline-tracker",
    };
  }

  if (
    normalized.includes("document") ||
    normalized.includes("carry") ||
    normalized.includes("id")
  ) {
    return {
      answer: `For ${profile.name || "this voter"}, the high-confidence carry list is: ${buildCarryChecklist(profile).join(", ")}.`,
      followUp: `Open the Document Briefing card to compare your carry list against the official accepted-photo-ID list. ${missionContext}`,
      missionHint: "document-briefing",
    };
  }

  if (normalized.includes("booth") || normalized.includes("queue")) {
    return {
      answer: `${profile.state} booth planning is strongest when you avoid the peak window and choose the accessible sample booth with the shortest queue heatmap band.`,
      followUp: `Jump into Booth Finder to inspect the live-looking queue map and accessibility support. ${missionContext}`,
      missionHint: "booth-finder",
    };
  }

  if (normalized.includes("pwd") || normalized.includes("companion")) {
    return {
      answer:
        "PwD voters can request support, but companion use is not mandatory for everyone. Electra recommends checking the Rights and Accessibility mission next.",
      followUp: `That mission is especially valuable because your current weak spot is rights confidence. ${missionContext}`,
      missionHint: "rights-and-accessibility",
    };
  }

  if (normalized.includes("myth") || normalized.includes("nota")) {
    return {
      answer:
        "The fastest way to break a myth is to argue for it and force the evidence to fight back. That is why Socratic Myth Buster sits at the top of your mission board.",
      followUp: `Start a debate round and let Electra escalate with rule-backed rebuttals. ${missionContext}`,
      missionHint: "socratic-challenge",
    };
  }

  if (
    recentTranscript.includes("phase 2") &&
    (normalized.includes("remind") || normalized.includes("again"))
  ) {
    const phaseTwo = stateTimeline.find((item) => item.phaseLabel === "Phase 2");

    return {
      answer: phaseTwo
        ? `Reminder locked: ${profile.state} Phase 2 is on ${formatDateLong(phaseTwo.date)}.`
        : `Reminder locked: ${profile.state} votes on ${formatDateLong(stateTimeline[0]?.date ?? COUNTING_DAY)}.`,
      followUp: `Electra can now move you back to mission work. ${missionContext}`,
      missionHint: "timeline-tracker",
    };
  }

  const missionByWeakTopic: Record<string, MissionId> = {
    documents: "document-briefing",
    evm: "evm-simulator",
    rights: "rights-and-accessibility",
    timelines: "timeline-tracker",
    myths: "socratic-challenge",
  };

  return {
    answer: `Right now your weakest topic is ${input.confidence.weakestTopic}. Electra would send you to ${MISSION_LABELS[missionByWeakTopic[input.confidence.weakestTopic]]} next.`,
    followUp: recentTurns.length
      ? `${missionContext} Your last few questions suggest you are optimizing for clarity, so this is the shortest path to a visible readiness jump.`
      : `${missionContext} Switch if you want the fastest readiness gain.`,
    missionHint: missionByWeakTopic[input.confidence.weakestTopic],
  };
}
