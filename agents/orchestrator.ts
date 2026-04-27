import { answerAssistantQuestion } from "@/agents/assistant";
import { computeConfidenceModel } from "@/agents/personalization";
import type {
  ElectraStoreState,
  MissionId,
  OrchestratorHint,
} from "@/lib/types";

/**
 * Orchestrator Agent Contract
 *
 * Responsibility:
 * Routes user intent across the app, watches for stalls or frustration, and
 * proactively requests help from the best sub-agent.
 *
 * Memory scope:
 * Full global state including `profile`, `progress`, `ui.currentMission`,
 * `quizHistory`, and the latest assistant turns.
 *
 * Tools / APIs:
 * Personalization Agent, Simulator Agent, Socratic Agent, Assistant Agent.
 *
 * Handoff trigger:
 * Yields whenever it has chosen the next mission, issued a proactive hint, or
 * delegated a question to a specialist agent.
 */

const FRUSTRATION_MARKERS = ["stuck", "confused", "annoyed", "what now", "don't get"];

export function routeMissionIntent(message: string): MissionId {
  const normalized = message.toLowerCase();

  if (normalized.includes("myth") || normalized.includes("nota")) {
    return "socratic-challenge";
  }

  if (normalized.includes("evm") || normalized.includes("vvpat") || normalized.includes("vote")) {
    return "evm-simulator";
  }

  if (normalized.includes("quiz") || normalized.includes("score")) {
    return "election-iq-quiz";
  }

  if (normalized.includes("booth") || normalized.includes("carry")) {
    return "booth-finder";
  }

  if (normalized.includes("passport") || normalized.includes("pdf")) {
    return "election-passport";
  }

  return "socratic-challenge";
}

export function getProactiveHint(input: {
  idleSeconds: number;
  latestMessage?: string;
  state: Pick<
    ElectraStoreState,
    "profile" | "progress" | "quizHistory" | "mythDebates" | "assistantHistory" | "ui"
  >;
}): OrchestratorHint | null {
  const confidence = computeConfidenceModel(input.state);
  const frustrated = input.latestMessage
    ? FRUSTRATION_MARKERS.some((token) =>
        input.latestMessage?.toLowerCase().includes(token),
      )
    : false;

  if (input.idleSeconds < 90 && !frustrated) {
    return null;
  }

  if (input.state.ui.currentMission === "socratic-challenge") {
    return {
      title: "Try a sharper myth argument",
      body: "Use a real voter shortcut like 'Aadhaar is enough' or 'NOTA changes nothing.' Electra gets better when you push hard.",
      mission: "socratic-challenge",
    };
  }

  if (input.state.ui.currentMission === "evm-simulator") {
    return {
      title: "Remember the legal reason",
      body: "Every booth step exists for a rule-backed reason. Open the why bubble if the mechanics feel dry.",
      mission: "evm-simulator",
    };
  }

  const reply = answerAssistantQuestion({
    message: input.latestMessage ?? confidence.weakestTopic,
    state: {
      profile: input.state.profile,
      ui: input.state.ui,
      assistantHistory: input.state.assistantHistory,
    },
    confidence,
  });

  return {
    title: "Electra has a nudge",
    body: `${reply.answer} ${reply.followUp}`,
    mission: reply.missionHint,
  };
}
