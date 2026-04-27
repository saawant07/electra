"use client";

import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useTranslation } from "react-i18next";
import { startTransition, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bot,
  Download,
  Fingerprint,
  Flame,
  Globe2,
  MapPinned,
  MoonStar,
  ScrollText,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Volume2,
} from "lucide-react";
import { answerAssistantQuestion } from "@/agents/assistant";
import { getProactiveHint, routeMissionIntent } from "@/agents/orchestrator";
import { buildCarryChecklist } from "@/agents/personalization";
import {
  getStepHint,
  getStepNarration,
  SIMULATOR_STEPS,
  validateSimulatorAction,
} from "@/agents/simulator";
import { MISSION_MAP, MISSIONS } from "@/data/missions";
import { MYTHS, MYTH_STARTERS } from "@/data/myths";
import { QUIZ_QUESTIONS } from "@/data/quiz";
import {
  ACCEPTED_DOCUMENTS,
  BOOTH_LOCATIONS,
  COUNTING_DAY,
  ELECTION_TIMELINE,
  LANGUAGE_META,
} from "@/data/timelines";
import { useConfidence } from "@/hooks/useConfidence";
import { useSocratic } from "@/hooks/useSocratic";
import { useVoiceCoach } from "@/hooks/useVoiceCoach";
import { celebrate } from "@/lib/confetti";
import { exportElectionPassport } from "@/lib/pdf";
import type { MissionId, Profile } from "@/lib/types";
import { average, cn, formatDateLong, slugify } from "@/lib/utils";
import { useElectraStore } from "@/store/electra-store";
import { AssistantSidebar } from "@/components/assistant-sidebar";
import { ConfidenceChartCard } from "@/components/confidence-chart-card";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ViewId = "dashboard" | "myths" | "simulator" | "quiz" | "rights" | "booth" | "passport";

const VIEW_BY_MISSION: Record<MissionId, ViewId> = {
  "socratic-challenge": "myths",
  "document-briefing": "booth",
  "election-iq-quiz": "quiz",
  "evm-simulator": "simulator",
  "rights-and-accessibility": "rights",
  "booth-finder": "booth",
  "timeline-tracker": "booth",
  "election-passport": "passport",
};

const DEFAULT_MISSION_BY_VIEW: Record<ViewId, MissionId> = {
  dashboard: "socratic-challenge",
  myths: "socratic-challenge",
  simulator: "evm-simulator",
  quiz: "election-iq-quiz",
  rights: "rights-and-accessibility",
  booth: "booth-finder",
  passport: "election-passport",
};

const CANDIDATES = ["Candidate A", "Candidate B", "Candidate C", "NOTA"];

function getElectionDateLabel(stateTimeline: typeof ELECTION_TIMELINE) {
  if (stateTimeline.length > 1) {
    return stateTimeline
      .map((item) => `${item.phaseLabel}: ${formatDateLong(item.date)}`)
      .join(" | ");
  }

  const primary = stateTimeline[0];
  return primary ? formatDateLong(primary.date) : formatDateLong(COUNTING_DAY);
}

export function ElectraApp() {
  const {
    hydrated,
    profile,
    progress,
    mythDebates,
    quizHistory,
    passport,
    simulator,
    assistantHistory,
    ui,
    completeOnboarding,
    updateProfile,
    setCurrentMission,
    selectMyth,
    selectBooth,
    completeMission,
    recordQuizAttempt,
    recordSimulatorStep,
    toggleVoiceStep,
    setPowerCutSeen,
    setSelectedCandidate,
    addAssistantTurn,
    setPassportDownload,
    touchSession,
  } = useElectraStore(
    useShallow((state) => ({
      hydrated: state.hydrated,
      profile: state.profile,
      progress: state.progress,
      mythDebates: state.mythDebates,
      quizHistory: state.quizHistory,
      passport: state.passport,
      simulator: state.simulator,
      assistantHistory: state.assistantHistory,
      ui: state.ui,
      completeOnboarding: state.completeOnboarding,
      updateProfile: state.updateProfile,
      setCurrentMission: state.setCurrentMission,
      selectMyth: state.selectMyth,
      selectBooth: state.selectBooth,
      completeMission: state.completeMission,
      recordQuizAttempt: state.recordQuizAttempt,
      recordSimulatorStep: state.recordSimulatorStep,
      toggleVoiceStep: state.toggleVoiceStep,
      setPowerCutSeen: state.setPowerCutSeen,
      setSelectedCandidate: state.setSelectedCandidate,
      addAssistantTurn: state.addAssistantTurn,
      setPassportDownload: state.setPassportDownload,
      touchSession: state.touchSession,
    })),
  );

  const confidence = useConfidence();
  const { t, i18n } = useTranslation();
  const graphRef = useRef<HTMLDivElement>(null);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [assistantHint, setAssistantHint] = useState<ReturnType<typeof getProactiveHint>>(null);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [offline, setOffline] = useState(false);
  const [argumentDraft, setArgumentDraft] = useState("");
  const [simulatorIndex, setSimulatorIndex] = useState(0);
  const [showPowerCut, setShowPowerCut] = useState(false);
  const [preConfidence, setPreConfidence] = useState([4]);
  const [postConfidence, setPostConfidence] = useState([7]);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [passportBusy, setPassportBusy] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const debate = useSocratic(ui.selectedMythId);
  const selectedBooth =
    BOOTH_LOCATIONS.find((booth) => booth.id === ui.selectedBoothId) ??
    BOOTH_LOCATIONS.find((booth) => booth.state === profile.state) ??
    BOOTH_LOCATIONS[0];
  const stateTimeline = ELECTION_TIMELINE.filter((item) => item.state === profile.state);
  const selectedMyth = MYTHS.find((myth) => myth.id === ui.selectedMythId) ?? MYTHS[0];
  const selectedMythRecord = mythDebates.records.find(
    (record) => record.mythId === ui.selectedMythId,
  );
  const currentStep = SIMULATOR_STEPS[simulatorIndex] ?? SIMULATOR_STEPS[0];
  const voiceEnabled = simulator.voiceEnabledSteps.includes(currentStep.id);
  const narration = getStepNarration(currentStep.id, profile);
  const currentQuestion = QUIZ_QUESTIONS[quizStep];
  const carryChecklist = buildCarryChecklist(profile);
  const debateStarters = MYTH_STARTERS[ui.selectedMythId] ?? [];
  const passportUnlocked =
    MISSION_MAP["election-passport"].prerequisites?.every((mission) =>
      progress.completedMissions.includes(mission),
    ) ?? false;
  const electionDateLabel = getElectionDateLabel(stateTimeline);

  useVoiceCoach(voiceEnabled, narration.text, profile.language);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void i18n.changeLanguage(profile.language);
  }, [hydrated, i18n, profile.language]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("electra-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("electra-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    touchSession();
  }, [hydrated, touchSession]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleOffline = () => setOffline(!navigator.onLine);
    setOffline(!navigator.onLine);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }

    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleInstall as EventListener);
    window.addEventListener("online", handleOffline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstall as EventListener);
      window.removeEventListener("online", handleOffline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const idleSeconds = Math.floor((Date.now() - lastInteraction) / 1000);
      const latestMessage = assistantHistory.at(-1)?.content;
      setAssistantHint(
        getProactiveHint({
          idleSeconds,
          latestMessage,
          state: {
            profile,
            progress,
            quizHistory,
            mythDebates,
            assistantHistory,
            ui,
          },
        }),
      );
    }, 15000);

    return () => window.clearInterval(interval);
  }, [assistantHistory, lastInteraction, mythDebates, profile, progress, quizHistory, ui]);

  const ringOffset = 282 - (282 * confidence.readiness) / 100;
  const completedCount = progress.completedMissions.length;
  const averageQuizScore = quizHistory.attempts.length
    ? Math.round(
        average(quizHistory.attempts.map((attempt) => (attempt.score / attempt.total) * 100)),
      )
    : 0;
  const readinessLift = confidence.readiness - (confidence.journey[0]?.readiness ?? 0);
  const missionBoard = [...MISSIONS].sort((left, right) => {
    const leftCompleted = progress.completedMissions.includes(left.id);
    const rightCompleted = progress.completedMissions.includes(right.id);
    const leftUnlocked = confidence.unlockedMissions.includes(left.id);
    const rightUnlocked = confidence.unlockedMissions.includes(right.id);

    if (left.prominent !== right.prominent) {
      return left.prominent ? -1 : 1;
    }

    if (leftCompleted !== rightCompleted) {
      return leftCompleted ? 1 : -1;
    }

    if (leftUnlocked !== rightUnlocked) {
      return leftUnlocked ? -1 : 1;
    }

    return right.xp - left.xp;
  });

  const touch = () => {
    setLastInteraction(Date.now());
    touchSession();
  };

  const openMission = (mission: MissionId) => {
    touch();

    const unlocked =
      confidence.unlockedMissions.includes(mission) ||
      progress.completedMissions.includes(mission);

    if (!unlocked) {
      const prerequisiteTitles =
        MISSION_MAP[mission].prerequisites?.map((item) => MISSION_MAP[item].shortTitle) ?? [];

      setAssistantHint({
        title: "Mission locked for a reason",
        body: prerequisiteTitles.length
          ? `Finish ${prerequisiteTitles.join(", ")} before opening ${MISSION_MAP[mission].title}. Electra is keeping the readiness path in sequence.`
          : `${MISSION_MAP[mission].title} unlocks once your readiness rises a little more.`,
        mission:
          MISSION_MAP[mission].prerequisites?.[0] ??
          confidence.unlockedMissions[0] ??
          "socratic-challenge",
      });
      return;
    }

    startTransition(() => {
      setCurrentMission(mission);
      setActiveView(VIEW_BY_MISSION[mission]);
    });
  };

  const installApp = async () => {
    if (!installPrompt || !("prompt" in installPrompt)) {
      return;
    }

    const promptEvent = installPrompt as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
    };
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setInstallPrompt(null);
  };

  const submitAssistant = (message: string) => {
    touch();
    const missionIntent = routeMissionIntent(message);
    const reply = answerAssistantQuestion({
      message,
      state: { profile, ui, assistantHistory },
      confidence,
    });

    addAssistantTurn({
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    });
    addAssistantTurn({
      role: "assistant",
      content: `${reply.answer} ${reply.followUp}`,
      timestamp: new Date().toISOString(),
    });
    const mission = reply.missionHint ?? missionIntent;
    setCurrentMission(mission);
    setActiveView(VIEW_BY_MISSION[mission]);
  };

  const actOnSimulator = (action: string, candidate?: string) => {
    touch();
    if (!validateSimulatorAction(currentStep.id, action)) {
      return;
    }

    if (candidate) {
      setSelectedCandidate(candidate);
    }

    if (currentStep.id === "cast-vote" && !simulator.powerCutSeen) {
      recordSimulatorStep(currentStep.id);
      setPowerCutSeen();
      setShowPowerCut(true);
      return;
    }

    recordSimulatorStep(currentStep.id);
    const nextIndex = simulatorIndex + 1;
    setSimulatorIndex(nextIndex);

    if (currentStep.id === "exit") {
      completeMission("evm-simulator");
      celebrate(0.55, 0.4);
      setSimulatorIndex(SIMULATOR_STEPS.length - 1);
    }
  };

  const submitQuiz = () => {
    touch();
    if (Object.keys(quizAnswers).length !== QUIZ_QUESTIONS.length) {
      return;
    }

    let score = 0;
    const topicBreakdown: Record<string, number> = {
      documents: 0,
      evm: 0,
      rights: 0,
      timelines: 0,
      myths: 0,
    };

    QUIZ_QUESTIONS.forEach((question) => {
      const selected = question.options.find((option) => option.id === quizAnswers[question.id]);
      if (selected?.correct) {
        score += 1;
        topicBreakdown[question.topic] += 10;
      } else {
        topicBreakdown[question.topic] += 4;
      }
    });

    recordQuizAttempt({
      id: `quiz-${Date.now()}`,
      score,
      total: QUIZ_QUESTIONS.length,
      preConfidence: preConfidence[0],
      postConfidence: postConfidence[0],
      confidenceDelta: postConfidence[0] - preConfidence[0],
      topicBreakdown,
      completedAt: new Date().toISOString(),
    });
    completeMission("election-iq-quiz");
    celebrate(0.52, 0.38);
  };

  const downloadPassport = async () => {
    touch();
    if (!passportUnlocked) {
      return;
    }

    setPassportBusy(true);

    try {
      const graphImage = graphRef.current
        ? await toPng(graphRef.current, { cacheBust: true, pixelRatio: 2 })
        : undefined;
      const dataUri = await exportElectionPassport({
        profile,
        confidence,
        mythDebates,
        graphImage,
      });
      setPassportDownload(dataUri);
      completeMission("election-passport");
      celebrate(0.6, 0.35);

      const link = document.createElement("a");
      link.href = dataUri;
      link.download = `electra-passport-${slugify(profile.name || profile.state)}.pdf`;
      link.click();
    } finally {
      setPassportBusy(false);
    }
  };

  if (!hydrated) {
    return <div className="min-h-screen bg-[var(--background)]" />;
  }

  return (
    <div className="min-h-screen px-4 py-4 md:px-6">
      <OnboardingDialog
        open={!ui.onboardingCompleted}
        initialProfile={profile}
        onComplete={(nextProfile) => {
          touch();
          completeOnboarding(nextProfile);
          void i18n.changeLanguage(nextProfile.language);
          setActiveView("dashboard");
        }}
      />

      <div className="mx-auto grid max-w-[1480px] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="success">{t("offlineReady")}</Badge>
                    <Badge variant="outline">
                      {profile.state} timeline live
                    </Badge>
                    {offline ? <Badge variant="myth">Offline mode</Badge> : null}
                  </div>
                  <div className="grid gap-2">
                    <h1 className="text-3xl font-semibold tracking-normal text-balance md:text-4xl">
                      {t("appName")} <span className="text-[var(--primary)]">{t("coPilot")}</span>
                    </h1>
                    <p className="max-w-3xl text-pretty text-sm text-[var(--muted-foreground)] md:text-base">
                      A production-ready civic coach built to confront misinformation in public, not just explain rules in private.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm">
                      <Flame className="h-4 w-4 text-[var(--accent)]" />
                      <span>{progress.streak} day streak</span>
                    </div>
                    <div className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm">
                      <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                      <span>{progress.xp} XP</span>
                    </div>
                    <div className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm">
                      <Globe2 className="h-4 w-4 text-[var(--primary)]" />
                      <span>{LANGUAGE_META[profile.language].label}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <select
                    className="h-11 rounded-xl border bg-transparent px-3 text-sm"
                    value={profile.language}
                    onChange={(event) => {
                      const language = event.target.value as Profile["language"];
                      updateProfile({ language });
                      void i18n.changeLanguage(language);
                    }}
                  >
                    {Object.entries(LANGUAGE_META).map(([key, meta]) => (
                      <option className="text-slate-950" key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
                  >
                    {theme === "dark" ? (
                      <SunMedium className="h-4 w-4" />
                    ) : (
                      <MoonStar className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => void installApp()}
                    disabled={!installPrompt}
                  >
                    <Download className="h-4 w-4" />
                    {t("install")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
            <Card className="civic-grid overflow-hidden">
              <CardContent className="grid gap-5 p-6">
                <div className="grid place-items-center">
                  <div className="ring-sheen relative grid h-52 w-52 place-items-center rounded-full">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(148,163,184,0.18)"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#readinessGradient)"
                        strokeLinecap="round"
                        strokeWidth="8"
                        strokeDasharray="282"
                        initial={{ strokeDashoffset: 282 }}
                        animate={{ strokeDashoffset: ringOffset }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="relative grid gap-1 text-center">
                      <span className="text-5xl font-semibold">{confidence.readiness}%</span>
                      <span className="text-sm text-[var(--muted-foreground)]">{t("readiness")}</span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Mission progress</span>
                    <span className="font-medium">{completedCount}/8 complete</span>
                  </div>
                  <Progress value={(completedCount / 8) * 100} />
                </div>
                <div className="grid gap-3">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    The next fastest gain is on <span className="font-medium capitalize text-[var(--foreground)]">{confidence.weakestTopic}</span>. Electra will keep steering you there.
                  </p>
                  <div className="rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/8 px-4 py-3 text-sm">
                    Readiness lift since onboarding:{" "}
                    <span className="font-semibold text-[var(--accent)]">
                      +{Math.max(readinessLift, 0)} points
                    </span>
                  </div>
                  <Button className="w-full" onClick={() => openMission("socratic-challenge")}>
                    Start the Socratic challenge
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ConfidenceChartCard chartRef={graphRef} journey={confidence.journey} readiness={confidence.readiness} />
          </div>

          <Tabs
            value={activeView}
            onValueChange={(view) => {
              touch();
              if (view === "dashboard") {
                setActiveView("dashboard");
                return;
              }

              openMission(DEFAULT_MISSION_BY_VIEW[view as ViewId]);
            }}
          >
            <TabsList>
              <TabsTrigger value="dashboard">Mission Control</TabsTrigger>
              <TabsTrigger value="myths">Myth Buster</TabsTrigger>
              <TabsTrigger value="simulator">Simulator</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="rights">Rights</TabsTrigger>
              <TabsTrigger value="booth">Booth + Carry</TabsTrigger>
              <TabsTrigger value="passport">Passport</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <TabsContent value="dashboard" forceMount>
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <Badge className="w-fit" variant="default">
                          Premium mission board
                        </Badge>
                        <CardTitle>Mission Control Dashboard</CardTitle>
                        <CardDescription>
                          Eight missions, one readiness score, and a single star feature that forces misinformation into the open.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {missionBoard.map((mission) => {
                          const unlocked = confidence.unlockedMissions.includes(mission.id);
                          const completed = progress.completedMissions.includes(mission.id);

                          return (
                            <motion.button
                              animate={{ scale: unlocked ? 1 : 0.98, opacity: unlocked ? 1 : 0.52 }}
                              aria-disabled={!unlocked && !completed}
                              className={cn(
                                "surface-card grid min-h-56 gap-4 p-5 text-left transition",
                                completed && "mission-unlocked",
                                mission.prominent && "border-[var(--primary)]/40",
                              )}
                              key={mission.id}
                              onClick={() => openMission(mission.id)}
                              type="button"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <Badge variant={completed ? "success" : mission.prominent ? "default" : "outline"}>
                                  {completed ? "Complete" : unlocked ? "Unlocked" : "Locked"}
                                </Badge>
                                <span className="text-sm font-medium text-[var(--muted-foreground)]">
                                  +{mission.xp} XP
                                </span>
                              </div>
                              <div className="grid gap-2">
                                <h3 className="text-lg font-semibold">{mission.title}</h3>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {mission.description}
                                </p>
                              </div>
                              <div className="mt-auto flex items-center justify-between text-sm">
                                <span>{mission.cta}</span>
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </motion.button>
                          );
                        })}
                      </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                      <Card>
                        <CardHeader>
                          <CardTitle>Socratic Challenge in one sentence</CardTitle>
                          <CardDescription>
                            Instead of telling the voter the rule, Electra makes them defend the myth until the rule has to win in public.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <div className="rounded-2xl border border-[var(--myth)]/35 bg-[var(--myth)]/8 p-4">
                            <p className="text-sm uppercase tracking-[0.18em] text-[var(--myth)]">
                              Live myth
                            </p>
                            <p className="mt-2 text-lg font-semibold">
                              {selectedMyth.statement}
                            </p>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {selectedMyth.prompt}
                            </p>
                          </div>
                          <Button onClick={() => openMission("socratic-challenge")}>
                            Enter debate
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Impact snapshot</CardTitle>
                          <CardDescription>
                            A judge can see the confidence model move as missions land.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <Metric label="Average quiz score" value={`${averageQuizScore}%`} />
                          <Metric label="Badges earned" value={`${mythDebates.badges.length}`} />
                          <Metric label="Myths debated" value={`${mythDebates.debated.length}/10`} />
                          <Metric label="Readiness lift" value={`+${Math.max(readinessLift, 0)} pts`} />
                          <Metric label="Weakest topic" value={confidence.weakestTopic} capitalize />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="myths" forceMount>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    <div className="grid gap-6">
                      <Card className="border-[var(--myth)]/25">
                        <CardHeader>
                          <Badge className="w-fit" variant="myth">
                            North star feature
                          </Badge>
                          <CardTitle>{selectedMyth.statement}</CardTitle>
                          <CardDescription>{selectedMyth.sourceDetail}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <div className="rounded-xl border border-[var(--myth)]/30 bg-[var(--myth)]/8 p-4">
                            <p className="text-sm uppercase tracking-[0.18em] text-[var(--myth)]">
                              Socratic stance
                            </p>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              The voter must defend the myth out loud. Electra then acknowledges the logic, exposes the shortcut inside it, and escalates with rule-backed evidence until the myth breaks or the user earns the Stubborn Voter badge.
                            </p>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            {MYTHS.map((myth) => {
                              const debated = mythDebates.debated.includes(myth.id);
                              const won = mythDebates.won.includes(myth.id);
                              const latestRecord = mythDebates.records.find(
                                (record) => record.mythId === myth.id,
                              );

                              return (
                                <button
                                  className={cn(
                                    "rounded-xl border p-4 text-left transition",
                                    ui.selectedMythId === myth.id
                                      ? "border-[var(--primary)] bg-[var(--primary)]/8"
                                      : "border-[var(--border)] hover:border-[var(--primary)]/28",
                                  )}
                                  key={myth.id}
                                  onClick={() => {
                                    touch();
                                    selectMyth(myth.id);
                                  }}
                                  type="button"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <Badge variant={won ? "success" : debated ? "default" : "outline"}>
                                      {won ? "Beaten" : debated ? "Debated" : "Argue this?"}
                                    </Badge>
                                    <span className="text-xs text-[var(--muted-foreground)]">
                                      {myth.sourceLabel}
                                    </span>
                                  </div>
                                  <p className="mt-3 text-sm font-medium">{myth.statement}</p>
                                  <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                                    {latestRecord
                                      ? latestRecord.finalVerdict
                                      : "Challenge this myth to unlock the verdict and source trail."}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Demo lane</CardTitle>
                          <CardDescription>
                            Fast prompts for judges, plus the selected myth&apos;s last outcome and source.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <div className="flex flex-wrap gap-2">
                            {debateStarters.map((starter) => (
                              <Button
                                className="h-auto min-h-11 flex-1 whitespace-normal text-left md:flex-none"
                                key={starter}
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  touch();
                                  setArgumentDraft(starter);
                                }}
                              >
                                {starter}
                              </Button>
                            ))}
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <Metric
                              label="Argumentativeness"
                              value={`${mythDebates.argumentativenessScore}/100`}
                            />
                            <Metric label="Myths beaten" value={`${mythDebates.won.length}/10`} />
                          </div>
                          <div className="rounded-xl border p-4">
                            <p className="text-sm font-medium">Latest selected myth verdict</p>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {selectedMythRecord
                                ? `${selectedMythRecord.finalVerdict} Badge: ${selectedMythRecord.badgeAwarded}.`
                                : "No verdict logged yet. Pick a starter, argue hard, and make Electra work for the concession."}
                            </p>
                            <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                              Source trail: {selectedMyth.sourceLabel}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="myth">Round {Math.max(debate.round, 1)} of 3</Badge>
                          <Badge variant="outline">
                            Pressure {debate.lastRound?.pressure ?? 0}%
                          </Badge>
                        </div>
                        <CardTitle>Debate console</CardTitle>
                        <CardDescription>
                          Electra engages your logic first, then tightens the rule until the shortcut breaks.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid gap-3 rounded-xl border p-4">
                          <div className="flex items-center gap-2">
                            {[1, 2, 3].map((step) => (
                              <div className="grid flex-1 gap-2" key={step}>
                                <div
                                  className={cn(
                                    "h-2 rounded-full transition-colors",
                                    step <= Math.max(1, debate.round)
                                      ? "bg-[var(--myth)]"
                                      : "bg-[var(--surface-muted)]",
                                  )}
                                />
                                <span className="text-xs text-[var(--muted-foreground)]">
                                  {step === 1
                                    ? "Probe"
                                    : step === 2
                                      ? "Escalate"
                                      : "Final push"}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {selectedMyth.prompt}
                          </p>
                          {debate.lastRound ? (
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/8 p-4">
                                <p className="text-sm font-medium">Electra heard</p>
                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                  {debate.lastRound.heard}
                                </p>
                              </div>
                              <div className="rounded-xl border border-[var(--myth)]/20 bg-[var(--myth)]/6 p-4">
                                <p className="text-sm font-medium">Counter question</p>
                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                  {debate.lastRound.counterQuestion}
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="grid max-h-[520px] gap-3 overflow-y-auto rounded-xl border border-[var(--border)] p-4">
                          {debate.turns.map((turn, index) => (
                            <div
                              className={cn(
                                "rounded-xl px-4 py-3 text-sm",
                                turn.role === "agent"
                                  ? "bg-[var(--surface-muted)]"
                                  : "ml-auto max-w-[90%] bg-[var(--myth)]/12",
                              )}
                              key={`${turn.role}-${index}`}
                            >
                              {turn.moveLabel ? (
                                <Badge className="mb-3" variant="outline">
                                  {turn.moveLabel}
                                </Badge>
                              ) : null}
                              <p className="whitespace-pre-line">{turn.content}</p>
                              {turn.citation ? (
                                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                                  Source: {turn.citation}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>

                        {debate.outcome ? (
                          <div className="rounded-xl border border-[var(--accent)]/35 bg-[var(--accent)]/10 p-4">
                            <div className="flex items-center gap-2 text-[var(--accent)]">
                              <BadgeCheck className="h-5 w-5" />
                              <span className="font-semibold">{debate.outcome.badge}</span>
                            </div>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {debate.outcome.verdict}
                            </p>
                          </div>
                        ) : null}

                        <Textarea
                          placeholder="Defend the myth as strongly as you can. Electra is listening for the shortcut in your reasoning."
                          value={argumentDraft}
                          onChange={(event) => setArgumentDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                              event.preventDefault();
                              debate.submitArgument(argumentDraft);
                              setArgumentDraft("");
                              touch();
                            }
                          }}
                        />
                        <div className="flex flex-col gap-3 md:flex-row">
                          <Button
                            className="md:flex-1"
                            onClick={() => {
                              debate.submitArgument(argumentDraft);
                              setArgumentDraft("");
                              touch();
                            }}
                            disabled={debate.status === "complete"}
                          >
                            {t("submitArgument")}
                          </Button>
                          <Button
                            className="md:flex-1"
                            variant="destructive"
                            onClick={() => {
                              debate.submitArgument("I concede. You are right.");
                              setArgumentDraft("");
                              touch();
                            }}
                            disabled={debate.status === "complete"}
                          >
                            {t("concede")}
                          </Button>
                          <Button
                            className="md:flex-1"
                            variant="secondary"
                            onClick={() => {
                              touch();
                              debate.startDebate();
                              setArgumentDraft("");
                            }}
                          >
                            Restart debate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="simulator" forceMount>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                    <Card>
                      <CardHeader>
                        <Badge className="w-fit" variant="default">
                          Vernacular voice coach
                        </Badge>
                        <CardTitle>Hyper-realistic EVM + VVPAT simulator</CardTitle>
                        <CardDescription>
                          Practice each booth step, flip voice coaching per step, and inspect why each action exists in the rulebook.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        {SIMULATOR_STEPS.map((step, index) => (
                          <button
                            className={cn(
                              "rounded-2xl border p-4 text-left transition",
                              simulatorIndex === index
                                ? "border-[var(--primary)] bg-[var(--primary)]/8"
                                : "border-[var(--border)]",
                            )}
                            key={step.id}
                            onClick={() => {
                              touch();
                              setSimulatorIndex(index);
                            }}
                            type="button"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium">{step.title}</p>
                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                  {step.detail}
                                </p>
                              </div>
                              {simulator.completedSteps.includes(step.id) ? (
                                <Badge variant="success">Done</Badge>
                              ) : (
                                <Badge variant="outline">Step {index + 1}</Badge>
                              )}
                            </div>
                            <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                              Why this exists: {step.why}
                            </p>
                          </button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="default">{currentStep.title}</Badge>
                          {profile.hasPwD ? <Badge variant="success">PwD mode</Badge> : null}
                        </div>
                        <CardTitle>Practice booth</CardTitle>
                        <CardDescription>
                          {getStepHint(currentStep.id, profile)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-5">
                        <div className="flex items-center justify-between rounded-2xl border p-4">
                          <div className="grid gap-1">
                            <span className="text-sm font-medium">{t("voiceCoach")}</span>
                            <span className="text-sm text-[var(--muted-foreground)]">
                              {LANGUAGE_META[profile.language].label} narration for this step
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Volume2 className="h-4 w-4 text-[var(--primary)]" />
                            <Switch
                              checked={voiceEnabled}
                              onCheckedChange={() => {
                                touch();
                                toggleVoiceStep(currentStep.id);
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className={cn(
                            "grid gap-4 rounded-3xl border bg-[var(--surface-muted)] p-5",
                            profile.hasPwD && "[&_button]:min-h-14 [&_button]:text-base",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Polling station flow</p>
                              <p className="text-sm text-[var(--muted-foreground)]">
                                {currentStep.detail}
                              </p>
                            </div>
                            <Badge variant="outline">{simulatorIndex + 1}/6</Badge>
                          </div>

                          {currentStep.id === "cast-vote" ? (
                            <div className="grid gap-3">
                              {CANDIDATES.map((candidate) => (
                                <Button
                                  key={candidate}
                                  size="lg"
                                  variant={
                                    simulator.selectedCandidate === candidate
                                      ? "accent"
                                      : "secondary"
                                  }
                                  onClick={() => actOnSimulator("vote", candidate)}
                                >
                                  <Fingerprint className="h-4 w-4" />
                                  {candidate}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <Button
                              className="w-full"
                              onClick={() =>
                                actOnSimulator(
                                  currentStep.id === "enter-booth"
                                    ? "enter"
                                    : currentStep.id === "show-id"
                                      ? "show-id"
                                      : currentStep.id === "ink-mark"
                                        ? "ink"
                                        : currentStep.id === "verify-vvpat"
                                          ? "vvpat"
                                          : "exit",
                                )
                              }
                            >
                              {t("nextStep")}
                            </Button>
                          )}

                          {simulator.selectedCandidate ? (
                            <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/8 p-4">
                              <p className="text-sm font-medium">VVPAT preview</p>
                              <div className="mt-3 overflow-hidden rounded-xl border bg-[var(--surface)] p-3">
                                <motion.div
                                  animate={{
                                    opacity: [0.35, 1, 1, 0.75],
                                    y:
                                      currentStep.id === "verify-vvpat"
                                        ? [10, 0, 0, 18]
                                        : [10, 0, 0],
                                  }}
                                  transition={{ duration: 1.6, ease: "easeInOut" }}
                                  className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-slate-950"
                                >
                                  <p className="text-xs font-medium tracking-[0.14em] text-slate-500">
                                    VVPAT SLIP
                                  </p>
                                  <p className="mt-1 text-sm font-semibold">
                                    {simulator.selectedCandidate}
                                  </p>
                                </motion.div>
                              </div>
                              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                {simulator.selectedCandidate} appears in the viewing window before the slip drops into the sealed box.
                              </p>
                            </div>
                          ) : null}

                          {profile.hasPwD ? (
                            <div className="rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary)]/8 p-4">
                              <p className="text-sm font-medium">Companion assist flow</p>
                              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                Electra reminds you that companion support is optional. The booth should already provide accessible entry, queue priority, and officer assistance.
                              </p>
                            </div>
                          ) : null}
                        </div>

                        {showPowerCut ? (
                          <div className="glass rounded-3xl border border-white/10 p-5">
                            <div className="flex items-center gap-3 text-[var(--myth)]">
                              <AlertTriangle className="h-5 w-5" />
                              <p className="font-semibold">Power cut scenario</p>
                            </div>
                            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                              The booth goes dark, but the vote is not casually discarded. Poll staff secure the machine, restore or replace equipment if needed, and resume under ECI procedure.
                            </p>
                            <Button
                              className="mt-4"
                              onClick={() => {
                                setShowPowerCut(false);
                                setSimulatorIndex((index) => Math.min(index + 1, SIMULATOR_STEPS.length - 1));
                              }}
                            >
                              Resume poll procedure
                            </Button>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="quiz" forceMount>
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
                    <Card>
                      <CardHeader>
                        <CardTitle>Adaptive Election IQ Quiz</CardTitle>
                        <CardDescription>
                          Pre- and post- confidence feeds the Personalization Agent and proves skill growth.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-6">
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Before the quiz</span>
                            <span>{preConfidence[0]}/10</span>
                          </div>
                          <Slider
                            max={10}
                            min={1}
                            step={1}
                            value={preConfidence}
                            onValueChange={setPreConfidence}
                          />
                        </div>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>After the quiz</span>
                            <span>{postConfidence[0]}/10</span>
                          </div>
                          <Slider
                            max={10}
                            min={1}
                            step={1}
                            value={postConfidence}
                            onValueChange={setPostConfidence}
                          />
                        </div>
                        <div className="rounded-2xl border p-4">
                          <p className="text-sm text-[var(--muted-foreground)]">Confidence growth</p>
                          <p className="mt-2 text-2xl font-semibold text-[var(--accent)]">
                            You grew {postConfidence[0] - preConfidence[0]} points
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <Badge className="w-fit" variant="default">
                          Question {quizStep + 1} of {QUIZ_QUESTIONS.length}
                        </Badge>
                        <CardTitle>{currentQuestion.prompt}</CardTitle>
                        <CardDescription>
                          Arrow keys move through options. Enter locks the current answer.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            className={cn(
                              "rounded-2xl border p-4 text-left transition",
                              quizAnswers[currentQuestion.id] === option.id
                                ? "border-[var(--primary)] bg-[var(--primary)]/8"
                                : "border-[var(--border)]",
                            )}
                            key={option.id}
                            onClick={() => {
                              touch();
                              setQuizAnswers((state) => ({
                                ...state,
                                [currentQuestion.id]: option.id,
                              }));
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                                event.preventDefault();
                                const next = currentQuestion.options[(index + 1) % currentQuestion.options.length];
                                setQuizAnswers((state) => ({
                                  ...state,
                                  [currentQuestion.id]: next.id,
                                }));
                              }

                              if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                                event.preventDefault();
                                const next =
                                  currentQuestion.options[
                                    (index - 1 + currentQuestion.options.length) %
                                      currentQuestion.options.length
                                  ];
                                setQuizAnswers((state) => ({
                                  ...state,
                                  [currentQuestion.id]: next.id,
                                }));
                              }

                              if (event.key === "Enter") {
                                event.preventDefault();
                                setQuizAnswers((state) => ({
                                  ...state,
                                  [currentQuestion.id]: option.id,
                                }));
                              }
                            }}
                            tabIndex={0}
                            type="button"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium">{option.label}</p>
                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                  {quizAnswers[currentQuestion.id] === option.id
                                    ? option.explanation
                                    : "Choose this to see the rule behind it."}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  quizAnswers[currentQuestion.id] === option.id
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {String.fromCharCode(65 + index)}
                              </Badge>
                            </div>
                          </button>
                        ))}
                        <div className="flex flex-col gap-3 md:flex-row">
                          <Button
                            className="md:flex-1"
                            variant="secondary"
                            onClick={() => setQuizStep((step) => Math.max(step - 1, 0))}
                            disabled={quizStep === 0}
                          >
                            Previous
                          </Button>
                          {quizStep < QUIZ_QUESTIONS.length - 1 ? (
                            <Button
                              className="md:flex-1"
                              onClick={() => setQuizStep((step) => Math.min(step + 1, QUIZ_QUESTIONS.length - 1))}
                            >
                              Next question
                            </Button>
                          ) : (
                            <Button className="md:flex-1" onClick={submitQuiz}>
                              Finish quiz
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="rights" forceMount>
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <Card>
                      <CardHeader>
                        <CardTitle>Rights and Accessibility Briefing</CardTitle>
                        <CardDescription>
                          Rights confidence grows when the voter knows what the booth owes them.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <RuleCard
                          icon={ShieldCheck}
                          title="Queue protection"
                          copy="If you are in the queue at closing time, you are marked and still allowed to vote."
                        />
                        <RuleCard
                          icon={Bot}
                          title="PwD autonomy"
                          copy="Assistance is available, but a companion is not automatically mandatory for every PwD voter."
                        />
                        <RuleCard
                          icon={ScrollText}
                          title="Identity vs enrolment"
                          copy="An accepted document proves identity. It never replaces having your name on the electoral roll."
                        />
                        <RuleCard
                          icon={MapPinned}
                          title="Booth support"
                          copy="Ramps, help desks, queue priority, and officer assistance should be visible at accessible polling stations."
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Mission completion</CardTitle>
                        <CardDescription>
                          Lock this mission once you can say the booth adapts to the voter, not the other way around.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/8 p-4">
                          <p className="font-medium">Rights confidence</p>
                          <p className="mt-2 text-3xl font-semibold">{confidence.rights}%</p>
                        </div>
                        <Button onClick={() => {
                          touch();
                          completeMission("rights-and-accessibility");
                          celebrate(0.48, 0.42);
                        }}>
                          I know my booth rights
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="booth" forceMount>
                  <div className="grid gap-6">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                      <Card>
                        <CardHeader>
                          <CardTitle>Booth Finder + What to Carry</CardTitle>
                          <CardDescription>
                            Dynamic carry guidance changes with your profile, and the queue heatmap is static data shaped to feel live.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                          {BOOTH_LOCATIONS.filter((booth) => booth.state === profile.state).map((booth) => (
                            <button
                              className={cn(
                                "rounded-2xl border p-4 text-left transition",
                                selectedBooth.id === booth.id
                                  ? "border-[var(--primary)] bg-[var(--primary)]/8"
                                  : "border-[var(--border)]",
                              )}
                              key={booth.id}
                              onClick={() => {
                                touch();
                                selectBooth(booth.id);
                              }}
                              type="button"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-medium">{booth.name}</p>
                                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                    {booth.address}
                                  </p>
                                </div>
                                <Badge variant="outline">{booth.district}</Badge>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {booth.accessible.map((item) => (
                                  <Badge key={item} variant="success">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                Peak queue: {booth.peakWindow}
                              </p>
                            </button>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>{t("whatToCarry")}</CardTitle>
                          <CardDescription>
                            Tailored to first-time, PwD, and NRI context.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                          {carryChecklist.map((item) => (
                            <div className="flex items-start gap-3 rounded-2xl border p-3" key={item}>
                              <BadgeCheck className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                          <div className="rounded-2xl border p-4">
                            <p className="text-sm font-medium">Accepted photo IDs</p>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {ACCEPTED_DOCUMENTS.join(", ")}
                            </p>
                          </div>
                          <Button onClick={() => {
                            touch();
                            completeMission("document-briefing");
                          }}>
                            Document briefing complete
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                      <Card>
                        <CardHeader>
                          <CardTitle>Queue time heatmap</CardTitle>
                          <CardDescription>
                            Static intelligence, live feeling.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <div className="grid grid-cols-6 gap-3">
                            {selectedBooth.queueHeatmap.map((slot) => (
                              <div className="grid gap-2" key={slot.slot}>
                                <div
                                  className="aspect-[0.9] rounded-2xl"
                                  style={{
                                    background: `rgba(26, 86, 219, ${0.12 + slot.intensity * 0.12})`,
                                  }}
                                />
                                <div className="text-center text-xs">
                                  <p>{slot.slot}</p>
                                  <p className="text-[var(--muted-foreground)]">{slot.minutes} min</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button onClick={() => {
                            touch();
                            completeMission("booth-finder");
                          }}>
                            This is my booth plan
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Timeline tracker</CardTitle>
                          <CardDescription>
                            Hardcoded 2026 data, exactly as provided.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                          {stateTimeline.map((item) => (
                            <div className="rounded-2xl border p-4" key={`${item.state}-${item.phaseLabel}`}>
                              <p className="font-medium">{item.phaseLabel}</p>
                              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                {formatDateLong(item.date)}
                              </p>
                            </div>
                          ))}
                          <div className="rounded-2xl border p-4">
                            <p className="font-medium">Counting</p>
                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                              {formatDateLong(COUNTING_DAY)}
                            </p>
                          </div>
                          <Button onClick={() => {
                            touch();
                            completeMission("timeline-tracker");
                          }}>
                            Lock election timeline
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="passport" forceMount>
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <Card>
                      <CardHeader>
                        <CardTitle>Election Passport</CardTitle>
                        <CardDescription>
                          The reward surface: confidence graph, badges, timeline, and a QR route to ECI voter services.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid gap-4 rounded-3xl border p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-[var(--muted-foreground)]">Readiness proof</p>
                              <p className="text-3xl font-semibold">{confidence.readiness}%</p>
                            </div>
                            <Badge variant={passportUnlocked ? "success" : "outline"}>
                              {passportUnlocked ? "Unlocked" : "Locked"}
                            </Badge>
                          </div>
                          <Separator />
                          <div className="grid gap-2">
                            <p className="text-sm font-medium">Debate badges</p>
                            <div className="flex flex-wrap gap-2">
                              {mythDebates.badges.length ? (
                                mythDebates.badges.map((badge) => (
                                  <Badge key={badge} variant="success">
                                    {badge}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline">No badges yet</Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <p className="text-sm font-medium">Latest verdicts</p>
                            {mythDebates.records.slice(0, 3).map((record) => (
                              <p className="text-sm text-[var(--muted-foreground)]" key={record.completedAt}>
                                {record.mythTitle} - {record.finalVerdict}
                              </p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Export PDF</CardTitle>
                        <CardDescription>
                          Mission 8 becomes available once the rest of the readiness work is complete.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="rounded-2xl border p-4 text-sm text-[var(--muted-foreground)]">
                          {passportUnlocked
                            ? "Passport export is ready. The graph and badge evidence will be embedded into the PDF."
                            : "Finish the other seven missions to unlock the Passport reward surface."}
                        </div>
                        <Button
                          disabled={!passportUnlocked || passportBusy}
                          onClick={() => void downloadPassport()}
                        >
                          {passportBusy ? "Building passport..." : t("exportPassport")}
                        </Button>
                        {passport.generated && passport.downloadUrl ? (
                          <a
                            className="text-sm text-[var(--primary)] underline underline-offset-4"
                            href={passport.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open latest exported passport
                          </a>
                        ) : null}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>

        <AssistantSidebar
          currentMissionLabel={MISSION_MAP[ui.currentMission].title}
          electionDateLabel={electionDateLabel}
          history={assistantHistory}
          hint={assistantHint}
          onJumpToMission={openMission}
          onSubmit={submitAssistant}
          readiness={confidence.readiness}
          state={profile.state}
          weakestTopic={confidence.weakestTopic}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      <p className={cn("mt-2 text-2xl font-semibold", capitalize && "capitalize")}>
        {value}
      </p>
    </div>
  );
}

function RuleCard({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)]/12 text-[var(--primary)]">
          <Icon className="h-4 w-4" />
        </div>
        <p className="font-medium">{title}</p>
      </div>
      <p className="mt-3 text-sm text-[var(--muted-foreground)]">{copy}</p>
    </div>
  );
}
