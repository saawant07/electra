"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, LineChart, Globe } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-[2px]">
            <div className="h-full w-full rounded-md bg-[var(--background)]" />
          </div>
          <span className="text-xl font-bold tracking-tight">VoteReady</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/5 px-4 py-1.5 text-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#FF9933]" />
            <span className="text-[var(--muted-foreground)]">Your personal AI Election Co-Pilot</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-balance">
            Don&apos;t just vote.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#1A56DB] to-[#138808]">
              Be VoteReady.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-[var(--muted-foreground)] text-balance">
            Demystify the election process, debate myths with AI, practice on an EVM simulator, and build your confidence before you hit the booth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/onboarding"
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-[#1A56DB] px-8 font-medium text-white transition-all hover:bg-[#1A56DB]/90 hover:scale-105 active:scale-95"
            >
              <span className="mr-2">Start Your Journey</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 mt-24 mb-16 sm:grid-cols-3 max-w-5xl w-full"
        >
          {[
            {
              icon: ShieldCheck,
              title: "Socratic Myth Buster",
              description: "Debate voting myths with an AI agent trained on official ECI guidelines.",
              color: "#C81E1E"
            },
            {
              icon: LineChart,
              title: "Confidence Journey",
              description: "Track your readiness with an adaptive algorithm that measures real learning.",
              color: "#1A56DB"
            },
            {
              icon: Globe,
              title: "EVM Simulator",
              description: "Rehearse the voting process with authentic VVPAT flows and voice coaching.",
              color: "#057A55"
            }
          ].map((feature, i) => (
            <div key={i} className="surface-card p-6 text-left transition hover:border-[#1A56DB]/30 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${feature.color}15` }}>
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
