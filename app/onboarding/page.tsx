"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useElectraStore } from "@/store/electra-store";
import { getElectionDate, getDaysUntilElection, STATE_OPTIONS } from "@/data/elections";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile, VotingState } from "@/lib/types";

export default function OnboardingPage() {
  const hydrated = useElectraStore((s) => s.hydrated);
  const onboardingCompleted = useElectraStore((s) => s.ui.onboardingCompleted);
  const completeOnboarding = useElectraStore((s) => s.completeOnboarding);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Omit<Profile, "electionDate" | "boothDetails" | "selectedDocuments">>({
    name: "",
    state: "West Bengal" as VotingState,
    phase: null,
    isFirstTimeVoter: true,
    hasPwD: null,
    language: "en",
  });

  if (!hydrated) return <div className="min-h-screen bg-[var(--background)]" />;
  if (onboardingCompleted) {
    router.replace("/");
    return null;
  }

  const electionDate = getElectionDate(draft.state, draft.phase);
  const daysLeft = getDaysUntilElection(electionDate);
  const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(electionDate));

  const handleComplete = () => {
    const fullProfile: Profile = {
      ...draft,
      electionDate,
      boothDetails: null,
      selectedDocuments: [],
    };
    completeOnboarding(fullProfile);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${
                s === step
                  ? "bg-[#1A56DB] text-white"
                  : s < step
                    ? "bg-[#057A55] text-white"
                    : "border border-[var(--border)] text-[var(--muted-foreground)]"
              }`}
            >
              {s < step ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Step 1 of 3</p>
                <h1 className="mt-2 text-3xl font-medium">Who are you?</h1>
                <p className="mt-2 text-[var(--muted-foreground)]">Tell us about yourself so Electra can personalise your journey.</p>
              </div>

              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-medium">Your name</span>
                  <Input
                    placeholder="Enter your name"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    className="h-12"
                    id="onboarding-name"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">State going to polls</span>
                  <select
                    className="h-12 rounded-xl border border-[var(--border)] bg-transparent px-3 text-sm"
                    value={draft.state}
                    onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value as VotingState, phase: e.target.value === "West Bengal" ? 1 : null }))}
                    id="onboarding-state"
                  >
                    {STATE_OPTIONS.map((s) => (
                      <option key={s} value={s} className="text-slate-950">{s}</option>
                    ))}
                  </select>
                </label>

                {draft.state === "West Bengal" && (
                  <div className="grid gap-2">
                    <span className="text-sm font-medium">Phase</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((p) => (
                        <Button
                          key={p}
                          type="button"
                          variant={draft.phase === p ? "default" : "secondary"}
                          className="h-12"
                          onClick={() => setDraft((d) => ({ ...d, phase: p as 1 | 2 }))}
                        >
                          Phase {p} — {p === 1 ? "23 Apr" : "29 Apr"}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  <span className="text-sm font-medium">First-time voter?</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button type="button" variant={draft.isFirstTimeVoter ? "default" : "secondary"} className="h-12" onClick={() => setDraft((d) => ({ ...d, isFirstTimeVoter: true }))}>Yes</Button>
                    <Button type="button" variant={!draft.isFirstTimeVoter ? "default" : "secondary"} className="h-12" onClick={() => setDraft((d) => ({ ...d, isFirstTimeVoter: false }))}>No</Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm font-medium">Do you have a disability?</span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button type="button" variant={draft.hasPwD === true ? "default" : "secondary"} className="h-12" onClick={() => setDraft((d) => ({ ...d, hasPwD: true }))}>Yes</Button>
                    <Button type="button" variant={draft.hasPwD === false ? "default" : "secondary"} className="h-12" onClick={() => setDraft((d) => ({ ...d, hasPwD: false }))}>No</Button>
                    <Button type="button" variant={draft.hasPwD === null ? "default" : "secondary"} className="h-12 text-xs" onClick={() => setDraft((d) => ({ ...d, hasPwD: null }))}>Prefer not to say</Button>
                  </div>
                </div>
              </div>

              <Button
                className="h-12 w-full"
                disabled={!draft.name.trim()}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-8"
            >
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Step 2 of 3</p>
                <h1 className="mt-2 text-3xl font-medium">Your election date</h1>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="surface-card p-8 text-center">
                  <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Your election</p>
                  <h2 className="mt-2 text-2xl font-medium">{draft.state}{draft.phase ? ` — Phase ${draft.phase}` : ""}</h2>
                  <p className="mt-1 text-lg text-[#1A56DB] dark:text-[#4c84ff]">{dateLabel}</p>
                </div>

                <ProgressRing
                  value={Math.max(0, Math.min(100, ((30 - daysLeft) / 30) * 100))}
                  size={180}
                  label="Countdown"
                  sublabel={daysLeft > 0 ? `${daysLeft} days away` : daysLeft === 0 ? "Today!" : `${Math.abs(daysLeft)} days ago`}
                />

                <p className="max-w-sm text-center text-sm text-[var(--muted-foreground)]">
                  This is your personal election mission. Let&apos;s get you ready.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="h-12" onClick={() => setStep(1)}>Back</Button>
                <Button className="h-12" onClick={() => setStep(3)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-8"
            >
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Step 3 of 3</p>
                <h1 className="mt-2 text-3xl font-medium">Choose your language</h1>
                <p className="mt-2 text-[var(--muted-foreground)]">Electra will speak to you in your preferred language.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDraft((d) => ({ ...d, language: "en" }))}
                  className={`surface-card flex flex-col items-center gap-3 p-8 transition ${
                    draft.language === "en" ? "ring-2 ring-[#1A56DB]" : ""
                  }`}
                >
                  <span className="text-3xl">🇬🇧</span>
                  <span className="text-lg font-medium">English</span>
                </button>
                <button
                  onClick={() => setDraft((d) => ({ ...d, language: "hi" }))}
                  className={`surface-card flex flex-col items-center gap-3 p-8 transition ${
                    draft.language === "hi" ? "ring-2 ring-[#1A56DB]" : ""
                  }`}
                >
                  <span className="text-3xl">🇮🇳</span>
                  <span className="text-lg font-medium">हिंदी</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="h-12" onClick={() => setStep(2)}>Back</Button>
                <Button className="h-12" onClick={handleComplete}>
                  Let&apos;s begin <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
