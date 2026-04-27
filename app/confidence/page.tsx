"use client";

import { useRef } from "react";
import { AppNav } from "@/components/AppNav";
import { useConfidence } from "@/hooks/useConfidence";
import { useElectraStore } from "@/store/electra-store";
import { ConfidenceChartCard } from "@/components/confidence-chart-card";
import { ProgressRing } from "@/components/ProgressRing";

const TOPIC_META: Record<string, { label: string; color: string }> = {
  documents: { label: "Documents", color: "#1A56DB" },
  evm: { label: "EVM & VVPAT", color: "#057A55" },
  rights: { label: "Rights", color: "#9333EA" },
  timelines: { label: "Timelines", color: "#EA580C" },
  myths: { label: "Myth Resistance", color: "#C81E1E" },
};

export default function ConfidencePage() {
  const confidence = useConfidence();
  const progress = useElectraStore((s) => s.progress);
  const quizHistory = useElectraStore((s) => s.quizHistory);
  const mythDebates = useElectraStore((s) => s.mythDebates);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const topics = Object.entries(TOPIC_META).map(([key, meta]) => ({
    key,
    ...meta,
    value: confidence[key as keyof typeof confidence] as number,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <div className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <ProgressRing value={confidence.readiness} size={140} label="Overall" />
          <div>
            <h1 className="text-2xl font-medium md:text-3xl">Confidence Journey</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Proof of impact — every quiz, step, and debate contributes to your readiness score.
            </p>
            <p className="mt-1 text-sm">
              Weakest topic: <span className="capitalize font-medium text-[#C81E1E]">{confidence.weakestTopic}</span>
            </p>
          </div>
        </div>

        {/* Topic bars */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {topics.map((topic) => (
            <div key={topic.key} className="surface-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{topic.label}</span>
                <span className="text-sm font-medium tabular-nums" style={{ color: topic.color }}>{Math.round(topic.value)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--border)]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(topic.value, 100)}%`, backgroundColor: topic.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <ConfidenceChartCard chartRef={chartRef} journey={confidence.journey} readiness={confidence.readiness} />

        {/* Stats grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="surface-card p-4 text-center">
            <p className="text-3xl font-medium tabular-nums">{progress.completedSteps.length}/10</p>
            <p className="text-sm text-[var(--muted-foreground)]">Steps completed</p>
          </div>
          <div className="surface-card p-4 text-center">
            <p className="text-3xl font-medium tabular-nums">{quizHistory.bestScore}/10</p>
            <p className="text-sm text-[var(--muted-foreground)]">Best quiz score</p>
          </div>
          <div className="surface-card p-4 text-center">
            <p className="text-3xl font-medium tabular-nums">{mythDebates.won.length}</p>
            <p className="text-sm text-[var(--muted-foreground)]">Myths busted</p>
          </div>
        </div>
      </main>
    </div>
  );
}
