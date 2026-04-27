"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, CheckCircle2, Zap, Accessibility, Users, AlertTriangle } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { useElectraStore } from "@/store/electra-store";
import { celebrate } from "@/lib/confetti";
import { speakText, stopSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";

const CANDIDATES = [
  { name: "Priya Sharma", symbol: "🪷", symbolLabel: "Lotus" },
  { name: "Rahul Verma", symbol: "✋", symbolLabel: "Hand" },
  { name: "Anita Devi", symbol: "🚲", symbolLabel: "Bicycle" },
  { name: "Suresh Kumar", symbol: "➡️", symbolLabel: "Arrow" },
  { name: "Fatima Begum", symbol: "⭐", symbolLabel: "Star" },
  { name: "NOTA", symbol: "✕", symbolLabel: "None of the Above" },
];

type SimScenario = "normal" | "pwd" | "queue" | "powercut";
type SimPhase = "ready" | "voted" | "vvpat" | "done" | "powercut";

export default function SimulatorPage() {
  const completeStep = useElectraStore((s) => s.completeStep);
  const language = useElectraStore((s) => s.profile.language);
  const hasPwD = useElectraStore((s) => s.profile.hasPwD);
  const [scenario, setScenario] = useState<SimScenario>("normal");
  const [phase, setPhase] = useState<SimPhase>("ready");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [vvpatCountdown, setVvpatCountdown] = useState(7);
  const [voiceOn, setVoiceOn] = useState(false);
  const [lightOn, setLightOn] = useState<number | null>(null);

  const isPwD = scenario === "pwd" || hasPwD;
  const buttonScale = isPwD ? "scale-[1.15]" : "";

  const reset = useCallback(() => {
    setPhase("ready");
    setSelectedCandidate(null);
    setVvpatCountdown(7);
    setLightOn(null);
    stopSpeech();
  }, []);

  const handleVote = (index: number) => {
    if (phase !== "ready") return;

    if (scenario === "powercut") {
      setPhase("powercut");
      return;
    }

    setSelectedCandidate(index);
    setLightOn(index);

    // Play beep sound
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch { /* audio not available */ }

    if (voiceOn) {
      speakText(`You voted for ${CANDIDATES[index].name}. Verifying on VVPAT.`, language);
    }

    setPhase("voted");
    setTimeout(() => setPhase("vvpat"), 800);
  };

  // VVPAT countdown
  useEffect(() => {
    if (phase !== "vvpat") return;
    if (vvpatCountdown <= 0) {
      setPhase("done");
      return;
    }
    const timer = setTimeout(() => setVvpatCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, vvpatCountdown]);

  const handleMarkDone = () => {
    completeStep(8);
    completeStep(9);
    celebrate();
  };

  const scenarios: { id: SimScenario; label: string; icon: React.ReactNode }[] = [
    { id: "normal", label: "Normal", icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: "pwd", label: "PwD Assist", icon: <Accessibility className="h-4 w-4" /> },
    { id: "queue", label: "Long Queue", icon: <Users className="h-4 w-4" /> },
    { id: "powercut", label: "Power Cut", icon: <Zap className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <h1 className="mb-2 text-2xl font-medium md:text-3xl">EVM + VVPAT Simulator</h1>
        <p className="mb-6 text-[var(--muted-foreground)]">Practice the real voting experience. Press a button, hear the beep, verify on VVPAT.</p>

        {/* Scenario tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => { setScenario(s.id); reset(); }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition",
                scenario === s.id
                  ? "bg-[#1A56DB] text-white"
                  : "border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {s.icon} {s.label}
            </button>
          ))}
          <button
            onClick={() => { setVoiceOn(!voiceOn); if (voiceOn) stopSpeech(); }}
            className={cn(
              "ml-auto flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition",
              voiceOn ? "bg-[#057A55] text-white" : "border border-[var(--border)] text-[var(--muted-foreground)]"
            )}
          >
            {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Voice {voiceOn ? "On" : "Off"}
          </button>
        </div>

        {scenario === "queue" && phase === "ready" && (
          <div className="mb-6 surface-card p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[#EA580C]" />
              <div>
                <p className="font-medium">120 voters ahead of you</p>
                <p className="text-sm text-[var(--muted-foreground)]">Expected wait: ~45 minutes. Stay calm, carry water, and keep your documents ready. The queue moves steadily. If booth closing time arrives while you&apos;re in line, you will still get to vote.</p>
              </div>
            </div>
          </div>
        )}

        {/* EVM + VVPAT layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* EVM Machine */}
          <AnimatePresence mode="wait">
            {phase === "powercut" ? (
              <motion.div
                key="powercut"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="surface-card flex min-h-[500px] flex-col items-center justify-center gap-4 bg-slate-950 p-8 text-center"
              >
                <AlertTriangle className="h-16 w-16 text-yellow-500" />
                <h2 className="text-2xl font-medium text-white">Power Cut Simulation</h2>
                <p className="max-w-md text-slate-300">
                  Don&apos;t panic! EVMs operate on internal battery power. They do not depend on mains electricity. If an interruption occurs, the presiding officer secures the unit and resumes polling under ECI procedure. No votes are lost.
                </p>
                <p className="text-xs text-slate-500">Source: ECI EVM operational protocol</p>
                <Button onClick={reset} variant="secondary">
                  <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </motion.div>
            ) : (
              <motion.div key="evm" className="surface-card overflow-hidden">
                {/* EVM Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-3 text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/80">Election Commission of India</p>
                  <p className="text-sm text-white/60">Ballot Unit</p>
                </div>

                {/* Instruction */}
                <div className="border-b border-[var(--border)] px-6 py-3 text-center text-sm">
                  {phase === "ready" && "Press any button to vote"}
                  {phase === "voted" && "Vote registered — checking VVPAT..."}
                  {phase === "vvpat" && "Verify your vote on the VVPAT window →"}
                  {phase === "done" && "✅ Vote recorded successfully"}
                </div>

                {/* Candidate buttons */}
                <div className="grid gap-0 divide-y divide-[var(--border)] p-4">
                  {CANDIDATES.map((candidate, i) => (
                    <button
                      key={candidate.name}
                      onClick={() => handleVote(i)}
                      disabled={phase !== "ready"}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 text-left transition",
                        buttonScale,
                        phase === "ready" && "hover:bg-[#1A56DB]/5 cursor-pointer",
                        selectedCandidate === i && "bg-[#1A56DB]/10"
                      )}
                    >
                      <span className="flex h-6 w-6 items-center justify-center text-lg">{candidate.symbol}</span>
                      <div className="flex-1">
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{candidate.symbolLabel}</p>
                      </div>
                      <div className={cn(
                        "h-4 w-4 rounded-full border-2 transition-colors",
                        lightOn === i ? "border-red-500 bg-red-500" : "border-[var(--border)]"
                      )} />
                      <div className={cn(
                        "flex h-11 w-16 items-center justify-center rounded-lg border-2 text-sm font-medium transition",
                        phase === "ready"
                          ? "border-[#1A56DB] bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
                          : "border-[var(--border)] bg-[var(--border)] text-[var(--muted-foreground)]"
                      )}>
                        VOTE
                      </div>
                    </button>
                  ))}
                </div>

                {/* Done state */}
                {phase === "done" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-[var(--border)] p-6 text-center"
                  >
                    <CheckCircle2 className="mx-auto h-12 w-12 text-[#057A55]" />
                    <p className="mt-2 text-lg font-medium text-[#057A55]">Vote Recorded Successfully</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      You voted for <strong>{selectedCandidate !== null ? CANDIDATES[selectedCandidate].name : "—"}</strong>
                    </p>
                    <div className="mt-4 flex justify-center gap-3">
                      <Button variant="secondary" onClick={reset}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                      </Button>
                      <Button onClick={handleMarkDone} className="bg-[#057A55] hover:bg-[#057A55]/90">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Steps 8 & 9 Done
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* VVPAT Unit */}
          <div className="surface-card overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 to-slate-500 px-4 py-2 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-white/80">VVPAT Unit</p>
            </div>
            <div className="p-4">
              {/* Paper roll */}
              <div className="mb-3 h-4 rounded-full bg-[var(--border)]" />

              {/* Glass window */}
              <div className="relative min-h-[200px] overflow-hidden rounded-lg border-2 border-[var(--border)] bg-[var(--background)]">
                <AnimatePresence>
                  {phase === "vvpat" && selectedCandidate !== null && (
                    <motion.div
                      key="slip"
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 200, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-x-2 top-4 rounded-lg border border-dashed border-[var(--border)] bg-white p-4 text-slate-900"
                    >
                      <p className="text-xs font-medium uppercase text-slate-500">VVPAT Slip</p>
                      <p className="mt-2 text-lg font-medium">{CANDIDATES[selectedCandidate].name}</p>
                      <p className="text-2xl">{CANDIDATES[selectedCandidate].symbol}</p>
                      <p className="mt-1 text-xs text-slate-500">S.No. {1000 + selectedCandidate}</p>
                      <div className="mt-3 rounded-full bg-amber-100 px-2 py-1 text-center text-xs font-medium text-amber-800">
                        Visible for {vvpatCountdown}s
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {phase === "ready" && (
                  <div className="flex h-[200px] items-center justify-center text-sm text-[var(--muted-foreground)]">
                    Waiting for vote...
                  </div>
                )}
                {phase === "done" && (
                  <div className="flex h-[200px] items-center justify-center text-sm text-[var(--muted-foreground)]">
                    Slip dropped into sealed box
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                The VVPAT slip is visible for exactly 7 seconds. It then automatically drops into a sealed compartment for potential audit.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
