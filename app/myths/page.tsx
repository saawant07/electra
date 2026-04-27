"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Award, Shield, MessageSquare } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useElectraStore } from "@/store/electra-store";
import { useSocratic } from "@/hooks/useSocratic";
import { MYTHS, MYTH_STARTERS } from "@/data/myths";
import { cn } from "@/lib/utils";

export default function MythsPage() {
  const mythDebates = useElectraStore((s) => s.mythDebates);
  const selectedMythId = useElectraStore((s) => s.ui.selectedMythId);
  const selectMyth = useElectraStore((s) => s.selectMyth);
  const debate = useSocratic(selectedMythId);
  const [argumentDraft, setArgumentDraft] = useState("");

  const selectedMyth = MYTHS.find((m) => m.id === selectedMythId) ?? MYTHS[0];
  const starters = MYTH_STARTERS[selectedMythId] ?? [];

  const handleSubmitArgument = () => {
    if (!argumentDraft.trim()) return;
    debate.submitArgument(argumentDraft);
    setArgumentDraft("");
  };

  const handleConcede = () => {
    debate.submitArgument("I concede — you're right");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <h1 className="mb-2 text-2xl font-medium md:text-3xl">Socratic Myth Buster</h1>
        <p className="mb-6 text-[var(--muted-foreground)]">
          Argue FOR the myth. Electra argues back with ECI evidence over 3 rounds.
        </p>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="grid gap-1.5 content-start">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">Myths</p>
            {MYTHS.map((myth) => {
              const won = mythDebates.won.includes(myth.id);
              const debated = mythDebates.debated.includes(myth.id);
              return (
                <button
                  key={myth.id}
                  onClick={() => { selectMyth(myth.id); debate.startDebate(); setArgumentDraft(""); }}
                  className={cn(
                    "surface-card p-3 text-left text-sm transition",
                    selectedMythId === myth.id && "ring-2 ring-[#1A56DB]",
                    won && "border-[#057A55]/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {won ? <Award className="h-4 w-4 shrink-0 text-[#057A55]" /> : <Shield className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />}
                    <span className="line-clamp-2">{myth.statement}</span>
                  </div>
                  {debated && <span className="mt-1 block text-xs text-[var(--muted-foreground)]">{won ? "Myth busted" : "Debated"}</span>}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 content-start">
            <div className="surface-card border-[#C81E1E]/25 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-[#C81E1E]">Active Myth</p>
              <h2 className="mt-2 text-xl font-medium">&ldquo;{selectedMyth.statement}&rdquo;</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{selectedMyth.prompt}</p>
            </div>

            <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              Round {debate.round}/3
              <div className="flex gap-1">
                {[1, 2, 3].map((r) => (
                  <div key={r} className={cn("h-2 w-8 rounded-full", debate.round >= r ? "bg-[#C81E1E]" : "bg-[var(--border)]")} />
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <AnimatePresence>
                {debate.turns.map((turn, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("surface-card p-4", turn.role === "user" ? "ml-8 border-[#1A56DB]/20" : "mr-8 border-[#C81E1E]/20")}>
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
                      {turn.role === "user" ? "Your argument" : "Electra"}{turn.moveLabel && ` · ${turn.moveLabel}`}
                    </p>
                    <p className="whitespace-pre-line text-sm">{turn.content}</p>
                    {turn.citation && <p className="mt-2 text-xs text-[var(--muted-foreground)]">📚 {turn.citation}</p>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {debate.outcome && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card border-[#057A55]/30 p-6 text-center">
                <Award className="mx-auto h-12 w-12 text-[#057A55]" />
                <p className="mt-2 text-lg font-medium">{debate.outcome.badge}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{debate.outcome.verdict}</p>
              </motion.div>
            )}

            {debate.status === "active" && (
              <div className="grid gap-3">
                {starters.length > 0 && debate.round === 0 && (
                  <div className="flex flex-wrap gap-2">
                    {starters.slice(0, 2).map((s, i) => (
                      <button key={i} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]" onClick={() => setArgumentDraft(s)}>
                        {s.slice(0, 60)}...
                      </button>
                    ))}
                  </div>
                )}
                <Textarea placeholder="Defend the myth..." value={argumentDraft} onChange={(e) => setArgumentDraft(e.target.value)} rows={3} />
                <div className="flex gap-2">
                  <Button onClick={handleSubmitArgument} disabled={!argumentDraft.trim()} className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" /> Argue This!
                  </Button>
                  <Button variant="secondary" onClick={handleConcede}>I concede</Button>
                </div>
              </div>
            )}

            {debate.status === "complete" && (
              <Button onClick={() => { debate.startDebate(); setArgumentDraft(""); }}>
                Debate Another <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
