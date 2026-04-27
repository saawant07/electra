"use client";

import { useElectraStore } from "@/store/electra-store";
import { LandingPage } from "@/components/pages/LandingPage";
import { DashboardPage } from "@/components/pages/DashboardPage";

export default function Home() {
  const hydrated = useElectraStore((s) => s.hydrated);
  const onboardingCompleted = useElectraStore((s) => s.ui.onboardingCompleted);

  if (!hydrated) {
    return <div className="min-h-screen bg-[var(--background)]" />;
  }

  if (!onboardingCompleted) {
    return <LandingPage />;
  }

  return <DashboardPage />;
}
