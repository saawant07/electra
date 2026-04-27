"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Share2, CheckCircle2, Lock } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ProgressRing";
import { useConfidence } from "@/hooks/useConfidence";
import { useElectraStore } from "@/store/electra-store";
import { useElectionDate } from "@/hooks/useElectionDate";
import { celebrateFull } from "@/lib/confetti";
import { getWhatsAppShareUrl } from "@/lib/share";

export default function PassportPage() {
  const confidence = useConfidence();
  const { dateLabel, state } = useElectionDate();
  const progress = useElectraStore((s) => s.progress);
  const profile = useElectraStore((s) => s.profile);
  const quizHistory = useElectraStore((s) => s.quizHistory);
  const mythDebates = useElectraStore((s) => s.mythDebates);
  const [celebrated, setCelebrated] = useState(false);

  const stepsDone = progress.completedSteps.length;
  const isReady = confidence.readiness >= 65;

  const handleCelebrate = () => {
    celebrateFull();
    setCelebrated(true);
  };

  const shareUrl = getWhatsAppShareUrl(state, dateLabel);

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-6 md:py-8">
        {!isReady ? (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <Lock className="h-16 w-16 text-[var(--muted-foreground)]" />
            <h1 className="text-2xl font-medium">VoteReady Passport</h1>
            <p className="max-w-md text-[var(--muted-foreground)]">
              Reach 65% readiness to unlock your VoteReady Passport. You&apos;re currently at {confidence.readiness}%.
            </p>
            <ProgressRing value={confidence.readiness} size={160} label="Readiness" sublabel={`Need 65%`} />
            <p className="text-sm text-[var(--muted-foreground)]">
              {stepsDone}/10 steps completed · Complete more missions to grow
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-medium md:text-3xl">🏆 VoteReady Passport</h1>
              <p className="mt-1 text-[var(--muted-foreground)]">You&apos;re election-ready. Share it.</p>
            </div>

            {/* Passport card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border-2 border-[#057A55]/30 bg-gradient-to-br from-[#1A56DB]/5 to-[#057A55]/5"
            >
              <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1" />
              <div className="p-8 text-center">
                <Award className="mx-auto h-16 w-16 text-[#057A55]" />
                <h2 className="mt-4 text-2xl font-medium">{profile.name}</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{state} · {dateLabel}</p>
                <div className="mt-6">
                  <ProgressRing value={confidence.readiness} size={120} label="Ready" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-medium tabular-nums">{stepsDone}/10</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Steps</p>
                  </div>
                  <div>
                    <p className="text-xl font-medium tabular-nums">{quizHistory.bestScore}/10</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Quiz</p>
                  </div>
                  <div>
                    <p className="text-xl font-medium tabular-nums">{mythDebates.won.length}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Myths Busted</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-2">
                  {mythDebates.badges.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {mythDebates.badges.map((b) => (
                        <span key={b} className="rounded-full bg-[#1A56DB]/10 px-3 py-1 text-xs font-medium text-[#1A56DB]">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1" />
            </motion.div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              {!celebrated && (
                <Button onClick={handleCelebrate} className="h-12 bg-[#057A55] hover:bg-[#057A55]/90">
                  🎉 Celebrate!
                </Button>
              )}
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="h-12">
                  <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
                </Button>
              </a>
            </div>

            {celebrated && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#057A55]" />
                <p className="mt-2 text-lg font-medium text-[#057A55]">You&apos;re VoteReady!</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Share your achievement and encourage others to get ready too.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
