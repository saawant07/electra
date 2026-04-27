"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useElectraStore } from "@/store/electra-store";
import { QUIZ_QUESTIONS } from "@/data/quiz";
import { celebrate } from "@/lib/confetti";
import { cn } from "@/lib/utils";

type QuizPhase = "pre-confidence" | "question" | "post-confidence" | "results";

export default function QuizPage() {
  const recordQuizAttempt = useElectraStore((s) => s.recordQuizAttempt);
  const completeStep = useElectraStore((s) => s.completeStep);
  const profileState = useElectraStore((s) => s.profile.state);
  const [phase, setPhase] = useState<QuizPhase>("pre-confidence");
  const [preConf, setPreConf] = useState([5]);
  const [postConf, setPostConf] = useState([5]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  // Adaptive ordering: if state is WB, ensure Q10 is last
  const questions = [...QUIZ_QUESTIONS];
  if (profileState === "West Bengal") {
    const wbQ = questions.find((q) => q.id === "q10-wb-phases");
    if (wbQ) {
      const filtered = questions.filter((q) => q.id !== "q10-wb-phases");
      filtered.push(wbQ);
      questions.splice(0, questions.length, ...filtered);
    }
  }

  const currentQ = questions[qIndex];
  const selectedAnswer = currentQ ? answers[currentQ.id] : undefined;
  const selectedOption = currentQ?.options.find((o) => o.id === selectedAnswer);
  const isCorrect = selectedOption?.correct ?? false;

  const handleAnswer = (optionId: string) => {
    if (showExplanation) return;
    setAnswers((a) => ({ ...a, [currentQ.id]: optionId }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      // Calculate score
      let s = 0;
      const topicBreakdown: Record<string, number> = {};
      questions.forEach((q) => {
        const ans = q.options.find((o) => o.id === answers[q.id]);
        if (ans?.correct) {
          s++;
          topicBreakdown[q.topic] = (topicBreakdown[q.topic] || 0) + 10;
        } else {
          topicBreakdown[q.topic] = (topicBreakdown[q.topic] || 0) + 3;
        }
      });
      setScore(s);
      setPhase("post-confidence");
    }
  };

  const handleSubmitPostConf = () => {
    const topicBreakdown: Record<string, number> = {};
    questions.forEach((q) => {
      const ans = q.options.find((o) => o.id === answers[q.id]);
      if (ans?.correct) {
        topicBreakdown[q.topic] = (topicBreakdown[q.topic] || 0) + 10;
      } else {
        topicBreakdown[q.topic] = (topicBreakdown[q.topic] || 0) + 3;
      }
    });

    recordQuizAttempt({
      id: `quiz-${Date.now()}`,
      score,
      total: questions.length,
      date: new Date().toISOString(),
      confidenceBefore: preConf[0],
      confidenceAfter: postConf[0],
      topicBreakdown,
    });
    completeStep(4);
    celebrate();
    setPhase("results");
  };

  const confDelta = postConf[0] - preConf[0];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <AppNav />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-8">
        <AnimatePresence mode="wait">
          {phase === "pre-confidence" && (
            <motion.div key="pre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8 text-center">
              <div>
                <h1 className="text-2xl font-medium md:text-3xl">Election IQ Quiz</h1>
                <p className="mt-2 text-[var(--muted-foreground)]">10 questions. Adaptive difficulty. Measure your growth.</p>
              </div>
              <div className="surface-card p-8">
                <p className="mb-4 font-medium">Rate your confidence about elections right now</p>
                <div className="mx-auto max-w-xs">
                  <Slider value={preConf} onValueChange={setPreConf} min={1} max={10} step={1} />
                  <div className="mt-2 flex justify-between text-xs text-[var(--muted-foreground)]">
                    <span>1 — Not confident</span>
                    <span className="text-lg font-medium text-[var(--foreground)]">{preConf[0]}</span>
                    <span>10 — Very confident</span>
                  </div>
                </div>
              </div>
              <Button className="h-12" onClick={() => setPhase("question")}>
                Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {phase === "question" && currentQ && (
            <motion.div key={`q-${qIndex}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Question {qIndex + 1} of {questions.length}</span>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  currentQ.difficulty === "easy" ? "bg-green-500/15 text-green-600" :
                  currentQ.difficulty === "medium" ? "bg-amber-500/15 text-amber-600" :
                  currentQ.difficulty === "hard" ? "bg-red-500/15 text-red-600" :
                  "bg-purple-500/15 text-purple-600"
                )}>
                  {currentQ.difficulty}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-[var(--border)]">
                <motion.div
                  className="h-full rounded-full bg-[#1A56DB]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <h2 className="text-xl font-medium">{currentQ.prompt}</h2>
              <div className="grid gap-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  const showResult = showExplanation && isSelected;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(opt.id)}
                      disabled={showExplanation}
                      className={cn(
                        "surface-card flex items-center gap-3 p-4 text-left transition",
                        !showExplanation && "hover:border-[#1A56DB]/40 cursor-pointer",
                        showResult && opt.correct && "border-[#057A55] bg-[#057A55]/5",
                        showResult && !opt.correct && "border-[#C81E1E] bg-[#C81E1E]/5",
                        showExplanation && opt.correct && !isSelected && "border-[#057A55]/30"
                      )}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-sm font-medium">
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="flex-1">{opt.label}</span>
                      {showExplanation && opt.correct && <CheckCircle2 className="h-5 w-5 text-[#057A55]" />}
                      {showResult && !opt.correct && <XCircle className="h-5 w-5 text-[#C81E1E]" />}
                    </button>
                  );
                })}
              </div>
              {showExplanation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-4">
                  <p className={cn("font-medium", isCorrect ? "text-[#057A55]" : "text-[#C81E1E]")}>
                    {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{selectedOption?.explanation}</p>
                  <Button className="mt-3" size="sm" onClick={handleNext}>
                    {qIndex < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === "post-confidence" && (
            <motion.div key="post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 text-center">
              <div>
                <h2 className="text-2xl font-medium">Quiz Complete!</h2>
                <p className="mt-2 text-4xl font-medium text-[#1A56DB]">{score}/{questions.length}</p>
              </div>
              <div className="surface-card p-8">
                <p className="mb-4 font-medium">Rate your confidence now</p>
                <div className="mx-auto max-w-xs">
                  <Slider value={postConf} onValueChange={setPostConf} min={1} max={10} step={1} />
                  <div className="mt-2 flex justify-between text-xs text-[var(--muted-foreground)]">
                    <span>1 — Not confident</span>
                    <span className="text-lg font-medium text-[var(--foreground)]">{postConf[0]}</span>
                    <span>10 — Very confident</span>
                  </div>
                </div>
              </div>
              <Button className="h-12" onClick={handleSubmitPostConf}>
                Submit & See Growth <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {phase === "results" && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid gap-6 text-center">
              <h2 className="text-2xl font-medium">Your Growth</h2>
              <div className="surface-card p-8">
                <p className="text-5xl font-medium text-[#1A56DB]">{score}/{questions.length}</p>
                <p className="mt-2 text-[var(--muted-foreground)]">
                  {score >= 8 ? "Outstanding! You're election-ready." : score >= 5 ? "Good work! Review the topics you missed." : "Keep learning — every question makes you stronger."}
                </p>
                <div className="mx-auto mt-6 max-w-xs surface-card p-4">
                  <p className="text-sm text-[var(--muted-foreground)]">Confidence growth</p>
                  <p className="text-3xl font-medium">
                    {preConf[0]} → {postConf[0]}
                    <span className={cn("ml-2 text-lg", confDelta > 0 ? "text-[#057A55]" : confDelta < 0 ? "text-[#C81E1E]" : "text-[var(--muted-foreground)]")}>
                      {confDelta > 0 ? `+${confDelta}` : confDelta} points
                    </span>
                  </p>
                </div>
              </div>
              <Button onClick={() => { setPhase("pre-confidence"); setQIndex(0); setAnswers({}); setShowExplanation(false); }}>
                Retake Quiz
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
