"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { MISSION_MAP } from "@/data/missions";
import type {
  ActivityEvent,
  ElectraStoreState,
  MissionId,
  MythDebateRecord,
  Profile,
  QuizAttempt,
} from "@/lib/types";

const nowIso = () => new Date().toISOString();

const safeStorage: StateStorage = {
  getItem: (name) => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage?.getItem !== "function"
    ) {
      return null;
    }

    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage?.setItem !== "function"
    ) {
      return;
    }

    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage?.removeItem !== "function"
    ) {
      return;
    }

    window.localStorage.removeItem(name);
  },
};

const emptyProfile: Profile = {
  name: "",
  state: "West Bengal",
  ageGroup: "18-19",
  isFirstTimeVoter: true,
  hasPwD: null,
  language: "en",
  isNri: false,
};

const buildMissionActivity = (missionId: MissionId): ActivityEvent => {
  const timestamp = nowIso();

  return {
    id: `${missionId}-${timestamp}`,
    label: MISSION_MAP[missionId].title,
    kind: "mission",
    timestamp,
    impact: MISSION_MAP[missionId].impact,
  };
};

const buildStreak = (lastActiveDate: string | null, streak: number) => {
  const today = new Date();

  if (!lastActiveDate) {
    return 1;
  }

  const last = new Date(lastActiveDate);
  const dayMs = 24 * 60 * 60 * 1000;
  const delta = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(last.getFullYear(), last.getMonth(), last.getDate())) /
      dayMs,
  );

  if (delta <= 0) {
    return streak;
  }

  if (delta === 1) {
    return streak + 1;
  }

  return 1;
};

const initialState = {
  profile: emptyProfile,
  progress: {
    completedMissions: [] as MissionId[],
    xp: 0,
    streak: 0,
    lastActiveDate: null as string | null,
    activityLog: [] as ActivityEvent[],
  },
  quizHistory: {
    attempts: [] as QuizAttempt[],
    bestScore: 0,
    confidenceDelta: 0,
  },
  mythDebates: {
    debated: [] as string[],
    won: [] as string[],
    badges: [] as string[],
    records: [] as MythDebateRecord[],
    argumentativenessScore: 0,
  },
  passport: {
    generated: false,
    downloadUrl: null as string | null,
  },
  simulator: {
    completedSteps: [] as string[],
    voiceEnabledSteps: [] as string[],
    powerCutSeen: false,
    selectedCandidate: null as string | null,
  },
  assistantHistory: [] as ElectraStoreState["assistantHistory"],
  ui: {
    onboardingCompleted: false,
    currentMission: "socratic-challenge" as MissionId,
    selectedMythId: "nota-wasted",
    selectedBoothId: null as string | null,
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
            ui: {
              ...state.ui,
              onboardingCompleted: true,
            },
            progress: {
              ...state.progress,
              streak: buildStreak(state.progress.lastActiveDate, state.progress.streak),
              lastActiveDate: timestamp,
              activityLog: [
                ...state.progress.activityLog,
                {
                  id: `onboarding-${timestamp}`,
                  label: "Onboarding complete",
                  kind: "onboarding",
                  timestamp,
                  impact: { documents: 6, timelines: 6, rights: 4, myths: 4, evm: 4 },
                },
              ],
            },
          };
        }),
      updateProfile: (patch) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...patch,
          },
        })),
      setCurrentMission: (mission) =>
        set((state) => ({
          ui: { ...state.ui, currentMission: mission },
        })),
      selectMyth: (mythId) =>
        set((state) => ({
          ui: { ...state.ui, selectedMythId: mythId },
        })),
      selectBooth: (boothId) =>
        set((state) => ({
          ui: { ...state.ui, selectedBoothId: boothId },
        })),
      completeMission: (missionId) =>
        set((state) => {
          if (state.progress.completedMissions.includes(missionId)) {
            return state;
          }

          return {
            progress: {
              ...state.progress,
              completedMissions: [...state.progress.completedMissions, missionId],
              xp: state.progress.xp + MISSION_MAP[missionId].xp,
              streak: buildStreak(
                state.progress.lastActiveDate,
                state.progress.streak,
              ),
              lastActiveDate: nowIso(),
              activityLog: [...state.progress.activityLog, buildMissionActivity(missionId)],
            },
          };
        }),
      recordQuizAttempt: (attempt) =>
        set((state) => ({
          quizHistory: {
            attempts: [...state.quizHistory.attempts, attempt],
            bestScore: Math.max(state.quizHistory.bestScore, attempt.score),
            confidenceDelta:
              state.quizHistory.confidenceDelta + attempt.confidenceDelta,
          },
          progress: {
            ...state.progress,
            activityLog: [
              ...state.progress.activityLog,
              {
                id: attempt.id,
                label: "Election IQ Quiz",
                kind: "quiz",
                timestamp: attempt.completedAt,
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
          if (record.conceded) {
            won.add(record.mythId);
          }

          return {
            mythDebates: {
              debated: Array.from(new Set([...state.mythDebates.debated, record.mythId])),
              won: Array.from(won),
              badges: Array.from(badges),
              records: [record, ...state.mythDebates.records],
              argumentativenessScore: Math.min(
                100,
                Math.round(
                  (state.mythDebates.argumentativenessScore +
                    record.roundsUsed * 18 +
                    record.arguments.join(" ").split(" ").length / 4) /
                    2,
                ),
              ),
            },
            progress: {
              ...state.progress,
              activityLog: [
                ...state.progress.activityLog,
                {
                  id: `debate-${record.mythId}-${record.completedAt}`,
                  label: `Myth debate: ${record.mythTitle}`,
                  kind: "debate",
                  timestamp: record.completedAt,
                  impact: record.conceded
                    ? { myths: 18, rights: 8 }
                    : { myths: 10, rights: 4 },
                },
              ],
            },
          };
        }),
      recordSimulatorStep: (stepId) =>
        set((state) => ({
          simulator: {
            ...state.simulator,
            completedSteps: Array.from(
              new Set([...state.simulator.completedSteps, stepId]),
            ),
          },
        })),
      toggleVoiceStep: (stepId) =>
        set((state) => {
          const has = state.simulator.voiceEnabledSteps.includes(stepId);

          return {
            simulator: {
              ...state.simulator,
              voiceEnabledSteps: has
                ? state.simulator.voiceEnabledSteps.filter((item) => item !== stepId)
                : [...state.simulator.voiceEnabledSteps, stepId],
            },
          };
        }),
      setPowerCutSeen: () =>
        set((state) => ({
          simulator: {
            ...state.simulator,
            powerCutSeen: true,
          },
        })),
      setSelectedCandidate: (candidate) =>
        set((state) => ({
          simulator: {
            ...state.simulator,
            selectedCandidate: candidate,
          },
        })),
      addAssistantTurn: (turn) =>
        set((state) => ({
          assistantHistory: [...state.assistantHistory, turn].slice(-10),
        })),
      setPassportDownload: (downloadUrl) =>
        set((state) => {
          const timestamp = nowIso();

          return {
            passport: {
              generated: true,
              downloadUrl,
            },
            progress: {
              ...state.progress,
              activityLog: [
                ...state.progress.activityLog,
                {
                  id: `passport-${timestamp}`,
                  label: "Election Passport exported",
                  kind: "passport",
                  timestamp,
                  impact: { documents: 4, timelines: 4, myths: 4 },
                },
              ],
            },
          };
        }),
      clearPassportDownload: () =>
        set((state) => ({
          passport: {
            ...state.passport,
            downloadUrl: null,
          },
        })),
      touchSession: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            streak: buildStreak(
              state.progress.lastActiveDate,
              state.progress.streak,
            ),
            lastActiveDate: nowIso(),
          },
        })),
      resetProgress: () => ({
        ...initialState,
      }),
    }),
    {
      name: "electra-2026-store",
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
