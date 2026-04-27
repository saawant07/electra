import { COUNTING_DAY } from "@/data/elections";
import type {
  AssistantReply,
  ConfidenceModel,
  ElectraStoreState,
} from "@/lib/types";
import { formatDateLong } from "@/lib/utils";

/**
 * Assistant Agent
 *
 * Keeps the sidebar chat useful, specific, and state-aware by answering with
 * the current context, weakest topics, and election timeline in view.
 */

export function answerAssistantQuestion(input: {
  message: string;
  state: Pick<ElectraStoreState, "profile" | "ui" | "assistantHistory">;
  confidence: ConfidenceModel;
}): AssistantReply {
  const normalized = input.message.toLowerCase();
  const { profile } = input.state;

  if (
    normalized.includes("phase 2") ||
    normalized.includes("when") ||
    normalized.includes("counting") ||
    normalized.includes("date")
  ) {
    return {
      answer: profile.electionDate
        ? `${profile.state} polling is on ${formatDateLong(profile.electionDate)}. Counting for all states is on ${formatDateLong(COUNTING_DAY)}.`
        : `Check the Timeline page to see your state's election date.`,
      followUp: "Use the Timeline to lock the correct date into your mission progress.",
    };
  }

  if (
    normalized.includes("document") ||
    normalized.includes("carry") ||
    normalized.includes("id") ||
    normalized.includes("aadhaar")
  ) {
    return {
      answer: `ECI accepts 10 photo identity documents. Visit the Documents page to check which ones you have and save your carry list.`,
      followUp: profile.isFirstTimeVoter
        ? "As a first-time voter, carry EPIC + one backup photo ID for extra safety."
        : "Keep your Voter ID (EPIC) ready as the primary document.",
    };
  }

  if (normalized.includes("booth") || normalized.includes("queue")) {
    return {
      answer: `You must vote at your assigned booth. Visit the Booth Finder to look up and save your booth details.`,
      followUp: "Arrive early — queues grow significantly by 10 AM.",
    };
  }

  if (normalized.includes("pwd") || normalized.includes("companion") || normalized.includes("disab")) {
    return {
      answer: "PwD voters can request support but a companion is not mandatory. ECI ensures ramp access, seating, and optional companion assistance at every booth.",
      followUp: "Check the Myths page to debate common misconceptions about PwD voting rights.",
    };
  }

  if (normalized.includes("myth") || normalized.includes("nota") || normalized.includes("fake")) {
    return {
      answer: "The fastest way to break a myth is to argue for it and force the evidence to fight back. That is the Socratic Myth Buster approach.",
      followUp: "Start a debate round and let Electra escalate with rule-backed rebuttals.",
    };
  }

  if (normalized.includes("evm") || normalized.includes("vvpat") || normalized.includes("vote")) {
    return {
      answer: "The EVM Simulator lets you practice the full voting flow — press a button, hear the beep, verify on VVPAT. Try all 4 scenarios.",
      followUp: "The VVPAT slip is visible for exactly 7 seconds. That is your visual proof.",
    };
  }

  if (normalized.includes("quiz") || normalized.includes("score") || normalized.includes("iq")) {
    return {
      answer: "The Election IQ Quiz has 10 questions from Easy to Expert. It measures your confidence before and after to show growth.",
      followUp: "Your best score so far drives your readiness percentage.",
    };
  }

  // Default: route by weakest topic
  return {
    answer: `Your weakest topic is ${input.confidence.weakestTopic}. Focus on that next for the fastest readiness jump.`,
    followUp: `Current readiness: ${input.confidence.readiness}%. Every mission you complete pushes this higher.`,
  };
}
