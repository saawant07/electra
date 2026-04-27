"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, Calendar, Lock, CheckCircle2, Clock } from "lucide-react";
import { useWelcomeBack } from "@/hooks/useWelcomeBack";
import { useElectionDate } from "@/hooks/useElectionDate";
import { useConfidence } from "@/hooks/useConfidence";
import { useElectraStore } from "@/store/electra-store";
import { MISSIONS } from "@/data/missions";
import { ProgressRing } from "@/components/ProgressRing";
import { AppNav } from "@/components/AppNav";
import { cn } from "@/lib/utils";

export function DashboardPage() {
  const { welcomeMessage } = useWelcomeBack();
  const { dateLabel, daysLeft, state, phase } = useElectionDate();
  const confidence = useConfidence();
  const progress = useElectraStore((s) => s.progress);

  const completedStepCount = progress.completedSteps.length;
  const missionStatuses = MISSIONS.map((m) => {
    if (m.id === "complete-profile") return "complete";
    if (m.id === "become-voteready") {
      const allPrereqs = m.prerequisites?.every((p) => {
        if (p === "complete-profile") return true;
        if (p === "check-voter-list") return progress.completedSteps.includes(1);
        if (p === "verify-documents") return progress.completedSteps.includes(2);
        if (p === "find-booth") return progress.completedSteps.includes(3);
        return false;
      });
      return allPrereqs ? "unlocked" : "locked";
    }
    return "unlocked";
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        {/* Personalised header */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-3">
            <h1 className="text-2xl font-medium md:text-3xl">{welcomeMessage}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 text-[#1A56DB]" />
                {state}{phase ? ` Phase ${phase}` : ""} — {dateLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm">
                <Clock className="h-3.5 w-3.5 text-[#057A55]" />
                {daysLeft > 0 ? `${daysLeft} days until polling day` : daysLeft === 0 ? "Polling day is today!" : "Polling day has passed"}
              </span>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <ProgressRing value={confidence.readiness} size={160} label="Readiness" sublabel={`${completedStepCount}/10 steps`} />
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Steps Done", value: `${completedStepCount}/10`, icon: CheckCircle2, color: "#057A55" },
            { label: "XP Earned", value: `${progress.xp}`, icon: Sparkles, color: "#1A56DB" },
            { label: "Day Streak", value: `${progress.streak}`, icon: Flame, color: "#EA580C" },
            { label: "Confidence", value: `${confidence.readiness}%`, icon: ArrowRight, color: "#9333EA" },
          ].map((stat) => (
            <div key={stat.label} className="surface-card flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
                <p className="text-lg font-medium tabular-nums">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission cards — 2×4 grid */}
        <h2 className="mb-4 text-lg font-medium">Mission Control</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {MISSIONS.map((mission, i) => {
            const status = missionStatuses[i];
            const isLocked = status === "locked";
            const isComplete = status === "complete";

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: isLocked ? 0.5 : 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={isLocked ? "#" : mission.href}
                  className={cn(
                    "surface-card grid min-h-[200px] gap-3 p-5 transition hover:border-[#1A56DB]/30",
                    isComplete && "border-[#057A55]/40",
                    isLocked && "pointer-events-none"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{mission.icon}</span>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      isComplete ? "bg-[#057A55]/15 text-[#057A55]" : isLocked ? "bg-[var(--border)] text-[var(--muted-foreground)]" : "bg-[#1A56DB]/15 text-[#1A56DB]"
                    )}>
                      {isComplete ? "Complete" : isLocked ? "Locked" : `+${mission.xp} XP`}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{mission.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{mission.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-sm">
                    {isLocked ? (
                      <><Lock className="h-3.5 w-3.5" /> Complete other missions first</>
                    ) : isComplete ? (
                      <><CheckCircle2 className="h-3.5 w-3.5 text-[#057A55]" /> Completed</>
                    ) : (
                      <><ArrowRight className="h-3.5 w-3.5" /> Start</>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
