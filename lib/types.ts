export type SupportedLanguage = "en" | "hi" | "bn" | "ta";

export type VotingState =
  | "Assam"
  | "Kerala"
  | "Puducherry"
  | "Tamil Nadu"
  | "West Bengal";

export type AgeGroup = "18-19" | "20-24" | "25-34" | "35+";

export type TopicKey = "documents" | "evm" | "rights" | "timelines" | "myths";

export type MissionId =
  | "socratic-challenge"
  | "document-briefing"
  | "election-iq-quiz"
  | "evm-simulator"
  | "rights-and-accessibility"
  | "booth-finder"
  | "timeline-tracker"
  | "election-passport";

export interface Profile {
  name: string;
  state: VotingState;
  ageGroup: AgeGroup;
  isFirstTimeVoter: boolean;
  hasPwD: boolean | null;
  language: SupportedLanguage;
  isNri: boolean;
}

export interface ActivityEvent {
  id: string;
  label: string;
  kind: "onboarding" | "mission" | "quiz" | "debate" | "passport";
  timestamp: string;
  impact: Partial<Record<TopicKey, number>>;
}

export interface Progress {
  completedMissions: MissionId[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  activityLog: ActivityEvent[];
}

export interface QuizAttempt {
  id: string;
  score: number;
  total: number;
  preConfidence: number;
  postConfidence: number;
  confidenceDelta: number;
  topicBreakdown: Partial<Record<TopicKey, number>>;
  completedAt: string;
}

export interface QuizHistory {
  attempts: QuizAttempt[];
  bestScore: number;
  confidenceDelta: number;
}

export interface MythDebateRecord {
  mythId: string;
  mythTitle: string;
  roundsUsed: number;
  conceded: boolean;
  finalVerdict: string;
  badgeAwarded: string;
  arguments: string[];
  rebuttals: string[];
  completedAt: string;
}

export interface MythDebates {
  debated: string[];
  won: string[];
  badges: string[];
  records: MythDebateRecord[];
  argumentativenessScore: number;
}

export interface PassportState {
  generated: boolean;
  downloadUrl: string | null;
}

export interface AssistantTurn {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SimulatorState {
  completedSteps: string[];
  voiceEnabledSteps: string[];
  powerCutSeen: boolean;
  selectedCandidate: string | null;
}

export interface UiState {
  onboardingCompleted: boolean;
  currentMission: MissionId;
  selectedMythId: string;
  selectedBoothId: string | null;
}

export interface ConfidenceJourneyPoint {
  label: string;
  readiness: number;
  documents: number;
  evm: number;
  rights: number;
  timelines: number;
  myths: number;
}

export interface ConfidenceModel extends Record<TopicKey, number> {
  readiness: number;
  weakestTopic: TopicKey;
  journey: ConfidenceJourneyPoint[];
  unlockedMissions: MissionId[];
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  shortTitle: string;
  description: string;
  cta: string;
  impact: Partial<Record<TopicKey, number>>;
  xp: number;
  prominent?: boolean;
  prerequisites?: MissionId[];
}

export interface MythArgumentHook {
  keywords: string[];
  acknowledgement: string;
  pivot: string;
}

export interface MythDefinition {
  id: string;
  statement: string;
  prompt: string;
  truth: string;
  sourceLabel: string;
  sourceDetail: string;
  verdictLabel: string;
  hooks: MythArgumentHook[];
  rebuttals: Array<{
    evidence: string;
    escalation: string;
    citation: string;
  }>;
}

export interface QuizQuestion {
  id: string;
  topic: TopicKey;
  prompt: string;
  options: Array<{
    id: string;
    label: string;
    correct: boolean;
    explanation: string;
  }>;
}

export interface BoothLocation {
  id: string;
  state: VotingState;
  name: string;
  district: string;
  address: string;
  accessible: string[];
  peakWindow: string;
  queueHeatmap: Array<{
    slot: string;
    intensity: number;
    minutes: number;
  }>;
}

export interface TimelineEntry {
  state: VotingState;
  phaseLabel: string;
  date: string;
}

export interface AssistantReply {
  answer: string;
  followUp: string;
  missionHint: MissionId;
}

export interface OrchestratorHint {
  title: string;
  body: string;
  mission: MissionId;
}

export interface SocraticRoundResult {
  conceded: boolean;
  finished: boolean;
  badgeAwarded: string | null;
  rebuttal: string;
  verdict: string;
  citation: string;
  moveLabel: string;
  heard: string;
  counterQuestion: string;
  pressure: number;
}

export interface ElectraStoreState {
  profile: Profile;
  progress: Progress;
  quizHistory: QuizHistory;
  mythDebates: MythDebates;
  passport: PassportState;
  simulator: SimulatorState;
  assistantHistory: AssistantTurn[];
  ui: UiState;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  completeOnboarding: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  setCurrentMission: (mission: MissionId) => void;
  selectMyth: (mythId: string) => void;
  selectBooth: (boothId: string) => void;
  completeMission: (missionId: MissionId) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  recordDebate: (record: MythDebateRecord) => void;
  recordSimulatorStep: (stepId: string) => void;
  toggleVoiceStep: (stepId: string) => void;
  setPowerCutSeen: () => void;
  setSelectedCandidate: (candidate: string | null) => void;
  addAssistantTurn: (turn: AssistantTurn) => void;
  setPassportDownload: (downloadUrl: string) => void;
  clearPassportDownload: () => void;
  touchSession: () => void;
  resetProgress: () => void;
}
