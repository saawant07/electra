"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp, Volume2, VolumeX, ExternalLink, Bot } from "lucide-react";
import { useElectraStore } from "@/store/electra-store";
import { useElectionDate } from "@/hooks/useElectionDate";
import { useConfidence } from "@/hooks/useConfidence";
import { TIMELINE_STEPS } from "@/data/steps";
import { AppNav } from "@/components/AppNav";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { celebrate } from "@/lib/confetti";
import { speakText, stopSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TimelinePage() {
  const completedSteps = useElectraStore((s) => s.progress.completedSteps);
  const currentStep = useElectraStore((s) => s.progress.currentStep);
  const completeStep = useElectraStore((s) => s.completeStep);
  const language = useElectraStore((s) => s.profile.language);
  const { dateLabel, daysLeft, state, phase } = useElectionDate();
  const confidence = useConfidence();
  const [expandedStep, setExpandedStep] = useState<number | null>(currentStep);
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);

  const handleMarkDone = (step: number) => {
    if (!completedSteps.includes(step)) {
      completeStep(step);
      celebrate(0.5, 0.4);
    }
  };

  const handleSpeak = (step: number, text: string) => {
    if (speakingStep === step) {
      stopSpeech();
      setSpeakingStep(null);
    } else {
      stopSpeech();
      speakText(text, language);
      setSpeakingStep(step);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <ProgressRing value={(completedSteps.length / 10) * 100} size={120} label="Steps" sublabel={`${completedSteps.length}/10`} />
          <div>
            <h1 className="text-2xl font-medium md:text-3xl">Your Voting Journey</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              {state}{phase ? ` Phase ${phase}` : ""} — {dateLabel}
              {daysLeft > 0 && <span className="ml-2 text-[#1A56DB] dark:text-[#4c84ff]">({daysLeft} days away)</span>}
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Overall readiness: <span className="font-medium text-[var(--foreground)]">{confidence.readiness}%</span>
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border)] md:left-8" />

          <div className="grid gap-3">
            {TIMELINE_STEPS.map((step, i) => {
              const isDone = completedSteps.includes(step.step);
              const isCurrent = step.step === currentStep && !isDone;
              const isFuture = step.step > currentStep && !isDone;
              const isExpanded = expandedStep === step.step;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isFuture ? 0.6 : 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative"
                >
                  {/* Step indicator */}
                  <div className="absolute left-0 top-5 z-10 md:left-2">
                    {isDone ? (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#057A55] text-white"
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-medium",
                        isCurrent ? "border-[#1A56DB] bg-[#1A56DB]/10 text-[#1A56DB]" : "border-[var(--border)] text-[var(--muted-foreground)]"
                      )}>
                        {step.step}
                      </div>
                    )}
                  </div>

                  {/* Step card */}
                  <div className={cn(
                    "ml-16 md:ml-20 surface-card overflow-hidden transition",
                    isCurrent && "ring-2 ring-[#1A56DB]/40",
                    isDone && "border-[#057A55]/30"
                  )}>
                    <button
                      className="flex w-full items-center justify-between p-4 text-left"
                      onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={cn("font-medium", isDone && "text-[#057A55]")}>{step.title}</h3>
                          {isDone && <span className="rounded-full bg-[#057A55]/15 px-2 py-0.5 text-xs text-[#057A55]">Done</span>}
                          {isCurrent && <span className="rounded-full bg-[#1A56DB]/15 px-2 py-0.5 text-xs text-[#1A56DB]">Current</span>}
                        </div>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{step.aiContext}</p>
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[var(--border)] p-4">
                            <div className="grid gap-4">
                              <div>
                                <p className="text-sm font-medium text-[var(--muted-foreground)]">How</p>
                                <p className="mt-1 text-sm">{step.how}</p>
                              </div>
                              <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Why does this exist?</p>
                                <p className="mt-1 text-sm">{step.why}</p>
                                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Source: Election Commission of India</p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {step.actionLabel && step.actionHref && (
                                  step.actionHref.startsWith("http") ? (
                                    <a href={step.actionHref} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="secondary">
                                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                        {step.actionLabel}
                                      </Button>
                                    </a>
                                  ) : (
                                    <Link href={step.actionHref}>
                                      <Button size="sm" variant="secondary">{step.actionLabel}</Button>
                                    </Link>
                                  )
                                )}
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleSpeak(step.step, `${step.title}. ${step.how}. ${step.why}`)}
                                >
                                  {speakingStep === step.step ? <VolumeX className="mr-1.5 h-3.5 w-3.5" /> : <Volume2 className="mr-1.5 h-3.5 w-3.5" />}
                                  {speakingStep === step.step ? "Stop" : "Listen"}
                                </Button>
                                <Link href="/myths">
                                  <Button size="sm" variant="secondary">
                                    <Bot className="mr-1.5 h-3.5 w-3.5" />
                                    Ask Electra
                                  </Button>
                                </Link>
                                {!isDone && (
                                  <Button size="sm" onClick={() => handleMarkDone(step.step)} className="bg-[#057A55] hover:bg-[#057A55]/90">
                                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                    Mark as Done
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
