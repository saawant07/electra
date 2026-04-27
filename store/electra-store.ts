"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type {
  ConfidenceEntry,
  ElectraStoreState,
  MythDebateRecord,
  Profile,
  QuizAttempt,
} from "@/lib/types";

const nowIso = () => new Date().toISOString();

const safeStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined" || typeof window.localStorage?.getItem !== "function") {
      return null;
    }
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined" || typeof window.localStorage?.setItem !== "function") {
      return;
    }
    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined" || typeof window.localStorage?.removeItem !== "function") {
      return;
    }
    window.localStorage.removeItem(name);
  },
};

const emptyProfile: Profile = {
  name: "",
  state: "West Bengal",
  phase: null,
  isFirstTimeVoter: true,
  hasPwD: null,
  language: "en",
  boothDetails: null,
  electionDate: "",
  selectedDocuments: [],
};

const buildStreak = (lastActiveDate: string | null, streak: number) => {
  const today = new Date();
  if (!lastActiveDate) return 1;
  const last = new Date(lastActiveDate);
  const dayMs = 24 * 60 * 60 * 1000;
  const delta = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(last.getFullYear(), last.getMonth(), last.getDate())) /
      dayMs,
  );
  if (delta <= 0) return streak;
  if (delta === 1) return streak + 1;
  return 1;
};

const XP_PER_STEP = 25;

const initialState = {
  profile: emptyProfile,
  progress: {
    completedSteps: [] as number[],
    currentStep: 1,
    xp: 0,
    streak: 0,
    lastActiveDate: null as string | null,
    confidenceHistory: [] as ConfidenceEntry[],
    activityLog: [] as ElectraStoreState["progress"]["activityLog"],
  },
  quizHistory: {
    attempts: [] as QuizAttempt[],
    bestScore: 0,
  },
  mythDebates: {
    debated: [] as string[],
    won: [] as string[],
    badges: [] as string[],
    records: [] as MythDebateRecord[],
  },
  passport: {
    generated: false,
    downloadUrl: null as string | null,
  },
  simulator: {
    completedScenarios: [] as string[],
    lastCandidate: null as string | null,
  },
  assistantHistory: [] as ElectraStoreState["assistantHistory"],
  ui: {
    onboardingCompleted: false,
    selectedMythId: "nota-wasted",
  },
  hydrated: false,
};

export const useElectraStore = create<ElectraStoreState>()(
  persist(
    (set) => ({
      ...initialState,

      setHydrated: (value) => set({ hydrated: value }),

      completeOnboarding: (profile) =>
        set((state) => {
          const timestamp = nowIso();
          return {
            profile,
            ui: { ...state.ui, onboardingCompleted: true },
            progress: {
              ...state.progress,
              streak: buildStreak(state.progress.lastActiveDate, state.progress.streak),
              lastActiveDate: timestamp,
              xp: state.progress.xp + 50,
              activityLog: [
                ...state.progress.activityLog,
                {
                  id: `onboarding-${timestamp}`,
                  label: "Onboarding complete",
                  kind: "onboarding" as const,
                  timestamp,
                  impact: { documents: 10, timelines: 10, rights: 5, myths: 5, evm: 5 },
                },
              ],
            },
          };
        }),

      updateProfile: (patch) =>
        set((state) => ({
          profile: { ...state.profile, ...patch },
        })),

      completeStep: (step) =>
        set((state) => {
          if (state.progress.completedSteps.includes(step)) return state;
          const timestamp = nowIso();
          const topicMap: Record<number, Partial<Record<string, number>>> = {
            1: { documents: 10, rights: 5 },
            2: { documents: 15 },
            3: { timelines: 10 },
            4: { timelines: 10 },
            5: { documents: 5, timelines: 5 },
            6: { timelines: 5 },
            7: { rights: 10, evm: 5 },
            8: { evm: 10 },
            9: { evm: 15 },
            10: { evm: 10, rights: 5 },
          };
          return {
            progress: {
              ...state.progress,
              completedSteps: [...state.progress.completedSteps, step].sort((a, b) => a - b),
              currentStep: Math.min(step + 1, 10),
              xp: state.progress.xp + XP_PER_STEP,
              streak: buildStreak(state.progress.lastActiveDate, state.progress.streak),
              lastActiveDate: timestamp,
              activityLog: [
                ...state.progress.activityLog,
                {
                  id: `step-${step}-${timestamp}`,
                  label: `Step ${step} completed`,
                  kind: "step" as const,
                  timestamp,
                  impact: topicMap[step] || {},
                },
              ],
            },
          };
        }),

      setCurrentStep: (step) =>
        set((state) => ({
          progress: { ...state.progress, currentStep: step },
        })),

      addXP: (amount) =>
        set((state) => ({
          progress: { ...state.progress, xp: state.progress.xp + amount },
        })),

      recordQuizAttempt: (attempt) =>
        set((state) => ({
          quizHistory: {
            attempts: [...state.quizHistory.attempts, attempt],
            bestScore: Math.max(state.quizHistory.bestScore, attempt.score),
          },
          progress: {
            ...state.progress,
            xp: state.progress.xp + attempt.score * 12,
            activityLog: [
              ...state.progress.activityLog,
              {
                id: attempt.id,
                label: "Election IQ Quiz",
                kind: "quiz" as const,
                timestamp: attempt.date,
                impact: attempt.topicBreakdown,
              },
            ],
          },
        })),

      recordDebate: (record) =>
        set((state) => {
          const badges = new Set(state.mythDebates.badges);
          badges.add(record.badgeAwarded);
          const won = new Set(state.mythDebates.won);
          if (record.conceded) won.add(record.mythId);

          return {
            mythDebates: {
              debated: Array.from(new Set([...state.mythDebates.debated, record.mythId])),
              won: Array.from(won),
              badges: Array.from(badges),
              records: [record, ...state.mythDebates.records],
            },
            progress: {
              ...state.progress,
              xp: state.progress.xp + (record.conceded ? 30 : 15),
              activityLog: [
                ...state.progress.activityLog,
                {
                  id: `debate-${record.mythId}-${record.completedAt}`,
                  label: `Myth debate: ${record.mythTitle}`,
                  kind: "debate" as const,
                  timestamp: record.completedAt,
                  impact: record.conceded
                    ? { myths: 18, rights: 8 }
                    : { myths: 10, rights: 4 },
                },
              ],
            },
          };
        }),

      selectMyth: (mythId) =>
        set((state) => ({
          ui: { ...state.ui, selectedMythId: mythId },
        })),

      addConfidenceEntry: (entry) =>
        set((state) => ({
          progress: {
            ...state.progress,
            confidenceHistory: [...state.progress.confidenceHistory, entry],
          },
        })),

      addAssistantTurn: (turn) =>
        set((state) => ({
          assistantHistory: [...state.assistantHistory, turn].slice(-20),
        })),

      setPassportDownload: (downloadUrl) =>
        set((state) => {
          const timestamp = nowIso();
          return {
            passport: { generated: true, downloadUrl },
            progress: {
              ...state.progress,
              activityLog: [
                ...state.progress.activityLog,
                {
                  id: `passport-${timestamp}`,
                  label: "VoteReady Passport exported",
                  kind: "passport" as const,
                  timestamp,
                  impact: { documents: 5, timelines: 5, myths: 5, evm: 5, rights: 5 },
                },
              ],
            },
          };
        }),

      clearPassportDownload: () =>
        set((state) => ({
          passport: { ...state.passport, downloadUrl: null },
        })),

      touchSession: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            streak: buildStreak(state.progress.lastActiveDate, state.progress.streak),
            lastActiveDate: nowIso(),
          },
        })),

      resetProgress: () => set({ ...initialState }),
    }),
    {
      name: "voteready-store-v2",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        profile: state.profile,
        progress: state.progress,
        quizHistory: state.quizHistory,
        mythDebates: state.mythDebates,
        passport: state.passport,
        simulator: state.simulator,
        assistantHistory: state.assistantHistory,
        ui: state.ui,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
