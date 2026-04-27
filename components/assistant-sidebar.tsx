"use client";

import {
  Bot,
  CalendarDays,
  Compass,
  MessageSquareText,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { AssistantTurn, OrchestratorHint, VotingState } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AssistantSidebar({
  history,
  readiness,
  state,
  electionDateLabel,
  weakestTopic,
  currentMissionLabel,
  hint,
  onSubmit,
}: {
  history: AssistantTurn[];
  readiness: number;
  state: VotingState;
  electionDateLabel: string;
  weakestTopic: string;
  currentMissionLabel: string;
  hint: OrchestratorHint | null;
  onSubmit: (message: string) => void;
}) {
  const [draft, setDraft] = useState("");

  const suggestions = [
    state === "West Bengal" ? "When is West Bengal Phase 2?" : `When is polling in ${state}?`,
    "What documents should I carry?",
    "Can a PwD voter go alone?",
  ];

  return (
    <aside className="glass sticky top-6 grid max-h-[calc(100vh-3rem)] gap-4 rounded-2xl border border-white/10 p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Electra</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Context-aware assistant
            </p>
          </div>
        </div>
        <Badge variant="success">{readiness}% ready</Badge>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="grid gap-3 p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Compass className="h-4 w-4" />
            <span>{state}</span>
          </div>
          <div className="grid gap-1 text-sm">
            <span className="text-[var(--muted-foreground)]">Election date</span>
            <span className="flex items-center gap-2 font-medium">
              <CalendarDays className="h-4 w-4 text-[var(--primary)]" />
              {electionDateLabel}
            </span>
          </div>
          <div className="grid gap-1 text-sm">
            <span className="text-[var(--muted-foreground)]">Current mission</span>
            <span className="font-medium">{currentMissionLabel}</span>
          </div>
          <div className="grid gap-1 text-sm">
            <span className="text-[var(--muted-foreground)]">Weakest topic</span>
            <span className="font-medium capitalize">{weakestTopic}</span>
          </div>
        </CardContent>
      </Card>

      {hint ? (
        <Card className="border-white/10 bg-[var(--primary)]/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              {hint.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-[var(--muted-foreground)]">{hint.body}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageSquareText className="h-4 w-4 text-[var(--primary)]" />
            Ask with mission context
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-left text-xs text-[var(--muted-foreground)] transition hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]"
                key={suggestion}
                onClick={() => onSubmit(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <ScrollArea className="h-64 rounded-2xl border border-white/10 bg-slate-950/20 p-3">
            <div className="grid gap-3 pr-3">
              {history.length ? (
                history.map((turn, index) => (
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm",
                      turn.role === "assistant"
                        ? "bg-white/8 text-[var(--foreground)]"
                        : "ml-auto max-w-[88%] bg-[var(--primary)]/14 text-[var(--primary-foreground)]",
                    )}
                    key={`${turn.timestamp}-${index}`}
                  >
                    {turn.content}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-white/8 px-3 py-2 text-sm text-[var(--muted-foreground)]">
                  Ask about your state timeline, accepted documents, booth support, or myth rebuttals.
                </div>
              )}
            </div>
          </ScrollArea>

          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim()) {
                return;
              }

              onSubmit(draft);
              setDraft("");
            }}
          >
            <Input
              placeholder="Ask Electra something specific"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button size="icon" type="submit" aria-label="Send question to Electra">
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </aside>
  );
}
