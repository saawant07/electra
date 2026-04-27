"use client";

import { useEffect, useState } from "react";
import { runSocraticRound } from "@/agents/socratic";
import { MYTH_MAP } from "@/data/myths";
import { celebrate } from "@/lib/confetti";
import type { MythDebateRecord, SocraticRoundResult } from "@/lib/types";
import { useElectraStore } from "@/store/electra-store";

interface DebateTurn {
  role: "user" | "agent";
  content: string;
  citation?: string;
  round: number;
  moveLabel?: string;
  heard?: string;
  counterQuestion?: string;
}

export function useSocratic(mythId: string) {
  const recordDebate = useElectraStore((state) => state.recordDebate);
  const completeMission = useElectraStore((state) => state.completeMission);
  const myth = MYTH_MAP[mythId];
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState<"idle" | "active" | "complete">("idle");
  const [turns, setTurns] = useState<DebateTurn[]>([]);
  const [lastRound, setLastRound] = useState<SocraticRoundResult | null>(null);
  const [outcome, setOutcome] = useState<{
    badge: string;
    verdict: string;
  } | null>(null);

  useEffect(() => {
    setRound(0);
    setStatus("active");
    setOutcome(null);
    setLastRound(null);
    setTurns([
      {
        role: "agent",
        content: myth.prompt,
        citation: myth.sourceLabel,
        round: 0,
      },
    ]);
  }, [myth.prompt, myth.sourceLabel]);

  const startDebate = () => {
    setRound(0);
    setStatus("active");
    setOutcome(null);
    setLastRound(null);
    setTurns([
      {
        role: "agent",
        content: myth.prompt,
        citation: myth.sourceLabel,
        round: 0,
      },
    ]);
  };

  const submitArgument = (argument: string) => {
    if (!argument.trim()) {
      return;
    }

    const nextRound = round + 1;
    const result = runSocraticRound({
      mythId,
      argument,
      round: nextRound,
    });

    const nextTurns: DebateTurn[] = [
      ...turns,
      { role: "user", content: argument, round: nextRound },
      {
        role: "agent",
        content: result.rebuttal,
        citation: result.citation,
        round: nextRound,
        moveLabel: result.moveLabel,
        heard: result.heard,
        counterQuestion: result.counterQuestion,
      },
    ];

    setTurns(nextTurns);
    setRound(nextRound);
    setLastRound(result);

    if (result.finished) {
      const record: MythDebateRecord = {
        mythId,
        mythTitle: myth.statement,
        roundsUsed: nextRound,
        conceded: result.conceded,
        finalVerdict: result.verdict,
        badgeAwarded: result.badgeAwarded ?? "Stubborn Voter",
        arguments: nextTurns.filter((turn) => turn.role === "user").map((turn) => turn.content),
        rebuttals: nextTurns.filter((turn) => turn.role === "agent").map((turn) => turn.content),
        completedAt: new Date().toISOString(),
      };

      recordDebate(record);
      completeMission("socratic-challenge");
      celebrate();
      setOutcome({
        badge: record.badgeAwarded,
        verdict: result.verdict,
      });
      setStatus("complete");
    }
  };

  const resetDebate = () => {
    setRound(0);
    setStatus("idle");
    setTurns([]);
    setLastRound(null);
    setOutcome(null);
  };

  return {
    round,
    status,
    turns,
    lastRound,
    remainingRounds: Math.max(0, 3 - round),
    outcome,
    startDebate,
    submitArgument,
    resetDebate,
  };
}
