export type SupportedLanguage = "en" | "hi";

export type VotingState =
  | "Assam"
  | "Kerala"
  | "Puducherry"
  | "Tamil Nadu"
  | "West Bengal"
  | "Other";

export type TopicKey = "documents" | "evm" | "rights" | "timelines" | "myths";

export type MissionId =
  | "complete-profile"
  | "check-voter-list"
  | "verify-documents"
  | "find-booth"
  | "evm-simulator"
  | "election-iq-quiz"
  | "debate-myths"
  | "become-voteready";

export interface BoothDetails {
  number: string;
  address: string;
}

export interface Profile {
  name: string;
  state: VotingState;
  phase: 1 | 2 | null;
  isFirstTimeVoter: boolean;
  hasPwD: boolean | null;
  language: SupportedLanguage;
  boothDetails: BoothDetails | null;
  electionDate: string;
  selectedDocuments: string[];
}

export interface ConfidenceEntry {
  date: string;
  score: number;
  topic: string;
}

export interface ActivityEvent {
  id: string;
  label: string;
  kind: "onboarding" | "step" | "mission" | "quiz" | "debate" | "passport";
  timestamp: string;
  impact: Partial<Record<TopicKey, number>>;
}

export interface Progress {
  completedSteps: number[];
  currentStep: number;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  confidenceHistory: ConfidenceEntry[];
  activityLog: ActivityEvent[];
}

export interface QuizAttempt {
  id: string;
  score: number;
  total: number;
  date: string;
  confidenceBefore: number;
  confidenceAfter: number;
  topicBreakdown: Partial<Record<TopicKey, number>>;
}

export interface QuizHistory {
  attempts: QuizAttempt[];
  bestScore: number;
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
  completedScenarios: string[];
  lastCandidate: string | null;
}

export interface UiState {
  onboardingCompleted: boolean;
  selectedMythId: string;
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
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  icon: string;
  description: string;
  xp: number;
  href: string;
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
  difficulty: "easy" | "medium" | "hard" | "expert";
  topic: TopicKey;
  prompt: string;
  options: Array<{
    id: string;
    label: string;
    correct: boolean;
    explanation: string;
  }>;
}

export interface TimelineStep {
  step: number;
  title: string;
  how: string;
  why: string;
  aiContext: string;
  actionLabel: string | null;
  actionHref: string | null;
  topicImpact: TopicKey[];
}

export interface TimelineEntry {
  state: VotingState;
  phaseLabel: string;
  date: string;
}

export interface AssistantReply {
  answer: string;
  followUp: string;
}

export type OrchestratorHint = {
  title: string;
  body: string;
} | null;

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

  // Actions
  setHydrated: (value: boolean) => void;
  completeOnboarding: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  completeStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
  addXP: (amount: number) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  recordDebate: (record: MythDebateRecord) => void;
  selectMyth: (mythId: string) => void;
  addConfidenceEntry: (entry: ConfidenceEntry) => void;
  addAssistantTurn: (turn: AssistantTurn) => void;
  setPassportDownload: (downloadUrl: string) => void;
  clearPassportDownload: () => void;
  touchSession: () => void;
  resetProgress: () => void;
}
