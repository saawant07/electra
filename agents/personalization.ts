import { MISSIONS, MISSION_MAP } from "@/data/missions";
import { average, clamp } from "@/lib/utils";
import type {
  ConfidenceJourneyPoint,
  ConfidenceModel,
  ElectraStoreState,
  MissionId,
  Profile,
  TopicKey,
} from "@/lib/types";

/**
 * Personalization Agent Contract
 *
 * Responsibility:
 * Builds Electra's confidence model and mission unlock logic so the product can
 * adapt to the voter's weak topics and completed work.
 *
 * Memory scope:
 * Reads only `profile`, `progress.activityLog`, `progress.completedMissions`,
 * `quizHistory`, and `mythDebates`.
 *
 * Tools / APIs:
 * Confidence Journey renderer data, mission unlock rules, carry-list generator.
 *
 * Handoff trigger:
 * Yields whenever the user enters a mission surface, completes an event, or the
 * Orchestrator asks for the weakest topic or next best action.
 */

const TOPICS: TopicKey[] = ["documents", "evm", "rights", "timelines", "myths"];

export function getBaseConfidence(profile: Profile) {
  const firstTimePenalty = profile.isFirstTimeVoter ? -6 : 0;
  const pwdRightsBoost = profile.hasPwD ? 8 : 0;
  const nriTimelineBoost = profile.isNri ? 6 : 0;

  return {
    documents: 20 + firstTimePenalty,
    evm: 14 + firstTimePenalty,
    rights: 18 + pwdRightsBoost,
    timelines: 18 + nriTimelineBoost,
    myths: 10,
  };
}

function replayJourney(state: Pick<
  ElectraStoreState,
  "profile" | "progress" | "ui"
>): ConfidenceJourneyPoint[] {
  const base = getBaseConfidence(state.profile);
  const points: ConfidenceJourneyPoint[] = [];
  const running = { ...base };

  points.push({
    label: state.ui.onboardingCompleted ? "Onboarding" : "Cold start",
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

export function getUnlockedMissions(
  completedMissions: MissionId[],
  readiness: number,
): MissionId[] {
  return MISSIONS.filter((mission) => {
    if (!mission.prerequisites?.length) {
      return true;
    }

    return mission.prerequisites.every((item) => completedMissions.includes(item));
  })
    .filter((mission) => {
      if (mission.id === "evm-simulator") {
        return readiness >= 28;
      }

      if (mission.id === "election-passport") {
        return readiness >= 65;
      }

      return true;
    })
    .map((mission) => mission.id);
}

export function computeConfidenceModel(
  state: Pick<
    ElectraStoreState,
    "profile" | "progress" | "quizHistory" | "mythDebates" | "ui"
  >,
): ConfidenceModel {
  const journey = replayJourney(state);
  const latest = journey.at(-1) ?? {
    ...getBaseConfidence(state.profile),
    readiness: 0,
    label: "Baseline",
  };

  const readiness = Math.round(
    average([
      latest.documents,
      latest.evm,
      latest.rights,
      latest.timelines,
      latest.myths,
    ]),
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
    unlockedMissions: getUnlockedMissions(
      state.progress.completedMissions,
      readiness,
    ),
  };
}

export function buildCarryChecklist(profile: Profile) {
  const items = ["Check your name on the roll", "Voter ID (EPIC)", "Aadhaar"];

  if (!profile.isFirstTimeVoter) {
    items.push("Any backup photo ID from the ECI list");
  }

  if (profile.isFirstTimeVoter) {
    items.push("A second accepted photo ID backup");
  }

  if (profile.hasPwD) {
    items.push("Accessibility request note or companion details if you choose assistance");
  }

  if (profile.isNri) {
    items.push("Passport and overseas elector enrollment details");
  }

  return Array.from(new Set(items));
}

export function getMissionImpactSummary(missionId: MissionId) {
  return MISSION_MAP[missionId];
}
