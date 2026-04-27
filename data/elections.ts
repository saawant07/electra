import type { TimelineEntry, VotingState } from "@/lib/types";

/** 2026 State Assembly Election dates — hardcoded from ECI notifications */
export const ELECTION_DATES: Record<string, string> = {
  Assam: "2026-04-09",
  Kerala: "2026-04-09",
  Puducherry: "2026-04-09",
  "Tamil Nadu": "2026-04-23",
  "West Bengal Phase 1": "2026-04-23",
  "West Bengal Phase 2": "2026-04-29",
  Other: "2026-04-09",
};

export const COUNTING_DAY = "2026-05-04";

export const ELECTION_TIMELINE: TimelineEntry[] = [
  { state: "Assam", phaseLabel: "Single phase", date: "2026-04-09" },
  { state: "Kerala", phaseLabel: "Single phase", date: "2026-04-09" },
  { state: "Puducherry", phaseLabel: "Single phase", date: "2026-04-09" },
  { state: "Tamil Nadu", phaseLabel: "Single phase", date: "2026-04-23" },
  { state: "West Bengal", phaseLabel: "Phase 1", date: "2026-04-23" },
  { state: "West Bengal", phaseLabel: "Phase 2", date: "2026-04-29" },
];

export const STATE_OPTIONS: VotingState[] = [
  "Assam",
  "Kerala",
  "Puducherry",
  "Tamil Nadu",
  "West Bengal",
  "Other",
];

/** Returns the election date for a given state + phase combination */
export function getElectionDate(state: VotingState, phase: 1 | 2 | null): string {
  if (state === "West Bengal") {
    return phase === 2 ? ELECTION_DATES["West Bengal Phase 2"] : ELECTION_DATES["West Bengal Phase 1"];
  }
  return ELECTION_DATES[state] || ELECTION_DATES["Other"];
}

/** Returns days until election from today */
export function getDaysUntilElection(electionDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const election = new Date(electionDate);
  election.setHours(0, 0, 0, 0);
  const diff = election.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const VOTER_HELPLINE = "1950";
export const VOTER_PORTAL = "https://voters.eci.gov.in";
