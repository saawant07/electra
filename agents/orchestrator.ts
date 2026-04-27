import { answerAssistantQuestion } from "@/agents/assistant";
import { computeConfidenceModel } from "@/agents/confidence";
import type { ElectraStoreState } from "@/lib/types";

/**
 * Orchestrator Agent
 *
 * Routes user intent across the app, watches for stalls, and
 * proactively requests help from the best sub-agent.
 */

export function getProactiveHint(input: {
  latestMessage?: string;
  state: Pick<
    ElectraStoreState,
    "profile" | "progress" | "quizHistory" | "mythDebates" | "assistantHistory" | "ui"
  >;
}): { title: string; body: string } | null {
  const confidence = computeConfidenceModel(input.state);

  if (confidence.readiness >= 80) {
    return {
      title: "You're almost VoteReady!",
      body: "Head to the Passport page to see if you've unlocked your VoteReady Passport.",
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
  };
}
