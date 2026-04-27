"use client";

import { useElectraStore } from "@/store/electra-store";
import { getDaysUntilElection } from "@/data/elections";

/** Returns the days until election computed from the user's profile */
export function useElectionDate() {
  const electionDate = useElectraStore((s) => s.profile.electionDate);
  const state = useElectraStore((s) => s.profile.state);
  const phase = useElectraStore((s) => s.profile.phase);

  const daysLeft = electionDate ? getDaysUntilElection(electionDate) : 0;

  return {
    electionDate,
    daysLeft,
    state,
    phase,
    dateLabel: electionDate
      ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(electionDate))
      : "Not set",
  };
}
