"use client";

import { useElectraStore } from "@/store/electra-store";

/** Detects returning users and provides welcome-back context */
export function useWelcomeBack() {
  const name = useElectraStore((s) => s.profile.name);
  const onboardingCompleted = useElectraStore((s) => s.ui.onboardingCompleted);
  const currentStep = useElectraStore((s) => s.progress.currentStep);
  const completedSteps = useElectraStore((s) => s.progress.completedSteps);
  const hydrated = useElectraStore((s) => s.hydrated);

  const isReturningUser = hydrated && onboardingCompleted && !!name;
  const isNewUser = hydrated && !onboardingCompleted;

  const welcomeMessage = isReturningUser
    ? `Welcome back, ${name} — you left off at Step ${currentStep}. Ready to continue?`
    : name
      ? `Ready to begin, ${name}?`
      : "Welcome to VoteReady";

  return {
    isReturningUser,
    isNewUser,
    name,
    currentStep,
    completedSteps,
    welcomeMessage,
    hydrated,
  };
}
