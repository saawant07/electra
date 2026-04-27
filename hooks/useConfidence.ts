"use client";

import { useShallow } from "zustand/react/shallow";
import { computeConfidenceModel } from "@/agents/personalization";
import { useElectraStore } from "@/store/electra-store";

export function useConfidence() {
  const slice = useElectraStore(
    useShallow((state) => ({
      profile: state.profile,
      progress: state.progress,
      quizHistory: state.quizHistory,
      mythDebates: state.mythDebates,
      ui: state.ui,
    })),
  );

  return computeConfidenceModel(slice);
}
