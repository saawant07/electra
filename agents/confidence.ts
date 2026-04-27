import type {
  ConfidenceJourneyPoint,
  ConfidenceModel,
  ElectraStoreState,
  TopicKey,
} from "@/lib/types";
import { clamp, average } from "@/lib/utils";

/**
 * Confidence Agent
 *
 * Computes confidence scores from all state data. Never stored —
 * always computed. Makes the app feel intelligent.
 *
 * Memory: All progress events, quiz scores, myth debates, steps done
 * Output: 5 topic confidence scores + overall readiness %
 */

const TOPICS: TopicKey[] = ["documents", "evm", "rights", "timelines", "myths"];

function replayJourney(state: Pick<ElectraStoreState, "profile" | "progress" | "ui">): ConfidenceJourneyPoint[] {
  const base = { documents: 15, evm: 10, rights: 15, timelines: 15, myths: 5 };
  if (state.profile.isFirstTimeVoter) {
    base.documents -= 5;
    base.evm -= 5;
  }
  if (state.profile.hasPwD) {
    base.rights += 5;
  }

  const points: ConfidenceJourneyPoint[] = [];
  const running = { ...base };

  points.push({
    label: state.ui.onboardingCompleted ? "Onboarding" : "Start",
    readiness: Math.round(average(Object.values(running))),
    ...running,
  });

  for (const event of state.progress.activityLog) {
    for (const topic of TOPICS) {
      running[topic] = clamp(running[topic] + (event.impact[topic] ?? 0));
    }
    points.push({
      label: event.label,
      readiness: Math.round(average(Object.values(running))),
      ...running,
    });
  }

  return points;
}

export function computeConfidenceModel(
  state: Pick<ElectraStoreState, "profile" | "progress" | "quizHistory" | "mythDebates" | "ui">,
): ConfidenceModel {
  const journey = replayJourney(state);
  const latest = journey.at(-1) ?? {
    documents: 15, evm: 10, rights: 15, timelines: 15, myths: 5,
    readiness: 12, label: "Baseline",
  };

  const readiness = Math.round(
    average([latest.documents, latest.evm, latest.rights, latest.timelines, latest.myths]),
  );

  const topics = {
    documents: latest.documents,
    evm: latest.evm,
    rights: latest.rights,
    timelines: latest.timelines,
    myths: latest.myths,
  };

  const weakestTopic = (
    Object.entries(topics).sort((a, b) => a[1] - b[1])[0] ?? ["documents", 0]
  )[0] as TopicKey;

  return {
    ...topics,
    readiness,
    weakestTopic,
    journey,
  };
}
