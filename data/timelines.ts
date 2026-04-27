/**
 * Legacy timelines data — kept for backward compatibility.
 * New code should use data/elections.ts and data/steps.ts instead.
 */

import type { SupportedLanguage, VotingState } from "@/lib/types";

export const LANGUAGE_META: Record<
  SupportedLanguage,
  { label: string; speech: string }
> = {
  en: { label: "English", speech: "en-IN" },
  hi: { label: "Hindi", speech: "hi-IN" },
};

export const STATE_OPTIONS: VotingState[] = [
  "Assam",
  "Kerala",
  "Puducherry",
  "Tamil Nadu",
  "West Bengal",
  "Other",
];
