import type { QuizQuestion } from "@/lib/types";

/** 10 real ECI-based quiz questions — Easy → Medium → Hard → Expert */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1-voting-age",
    difficulty: "easy",
    topic: "rights",
    prompt: "What is the minimum age to vote in India?",
    options: [
      { id: "a", label: "18", correct: true, explanation: "The Constitution of India grants voting rights to every citizen who is 18 years or older on the qualifying date." },
      { id: "b", label: "21", correct: false, explanation: "21 was the voting age before the 61st Amendment in 1988 lowered it to 18." },
      { id: "c", label: "25", correct: false, explanation: "25 is the minimum age to contest elections for the Lok Sabha, not to vote." },
      { id: "d", label: "16", correct: false, explanation: "India has not lowered the voting age to 16." },
    ],
  },
  {
    id: "q2-eci-body",
    difficulty: "easy",
    topic: "rights",
    prompt: "Which body conducts elections in India?",
    options: [
      { id: "a", label: "Supreme Court", correct: false, explanation: "The Supreme Court adjudicates election disputes but does not conduct elections." },
      { id: "b", label: "Election Commission of India", correct: true, explanation: "The ECI is an autonomous constitutional body responsible for administering all elections in India." },
      { id: "c", label: "Parliament", correct: false, explanation: "Parliament makes election laws but does not conduct elections." },
      { id: "d", label: "President's Office", correct: false, explanation: "The President appoints the Election Commission but does not conduct elections." },
    ],
  },
  {
    id: "q3-nota",
    difficulty: "medium",
    topic: "rights",
    prompt: "What does NOTA stand for?",
    options: [
      { id: "a", label: "None of the Above", correct: true, explanation: "NOTA was introduced by the Supreme Court in 2013. It allows voters to reject all candidates formally." },
      { id: "b", label: "Not One True Answer", correct: false, explanation: "This is not an official term used by ECI." },
      { id: "c", label: "No Official Total Available", correct: false, explanation: "NOTA is about candidate rejection, not vote counting." },
      { id: "d", label: "National Option To Abstain", correct: false, explanation: "NOTA is not about abstaining — it is an active vote choice recorded on the ballot." },
    ],
  },
  {
    id: "q4-documents-count",
    difficulty: "medium",
    topic: "documents",
    prompt: "How many documents does ECI accept as proof of identity at the polling booth?",
    options: [
      { id: "a", label: "5", correct: false, explanation: "ECI accepts more than 5 documents for voter identification." },
      { id: "b", label: "7", correct: false, explanation: "The official list includes more than 7 accepted documents." },
      { id: "c", label: "10", correct: true, explanation: "ECI officially accepts 10 photo identity documents including EPIC, Aadhaar, Passport, Driving Licence, PAN Card, and others." },
      { id: "d", label: "15", correct: false, explanation: "The official ECI list has exactly 10 accepted documents." },
    ],
  },
  {
    id: "q5-vvpat-definition",
    difficulty: "medium",
    topic: "evm",
    prompt: "What is the VVPAT?",
    options: [
      { id: "a", label: "A voter registration form", correct: false, explanation: "Voter registration uses Form 6, not VVPAT." },
      { id: "b", label: "A paper trail machine attached to the EVM", correct: true, explanation: "VVPAT (Voter Verifiable Paper Audit Trail) is attached to the EVM and prints a paper slip for visual verification." },
      { id: "c", label: "A voter ID card", correct: false, explanation: "VVPAT is a machine, not a document." },
      { id: "d", label: "An app for booth finding", correct: false, explanation: "The Voter Helpline App is for booth finding. VVPAT is physical hardware." },
    ],
  },
  {
    id: "q6-vvpat-seconds",
    difficulty: "hard",
    topic: "evm",
    prompt: "For how many seconds is the VVPAT slip visible to the voter?",
    options: [
      { id: "a", label: "3 seconds", correct: false, explanation: "3 seconds is too short for verification. ECI allows more time." },
      { id: "b", label: "5 seconds", correct: false, explanation: "The display time was extended from 5 to 7 seconds for better verification." },
      { id: "c", label: "7 seconds", correct: true, explanation: "The VVPAT slip is displayed behind a glass window for exactly 7 seconds before automatically dropping into the sealed box." },
      { id: "d", label: "10 seconds", correct: false, explanation: "The ECI standard display time is 7 seconds, not 10." },
    ],
  },
  {
    id: "q7-form-6",
    difficulty: "hard",
    topic: "documents",
    prompt: "What is Form 6 used for?",
    options: [
      { id: "a", label: "Changing your address on the voter list", correct: false, explanation: "Address changes use Form 8A, not Form 6." },
      { id: "b", label: "Registering as a new voter", correct: true, explanation: "Form 6 is the application for new voter registration. Any citizen turning 18 can use it to get enrolled on the Electoral Roll." },
      { id: "c", label: "Applying for postal ballot", correct: false, explanation: "Postal ballots use Form 12, not Form 6." },
      { id: "d", label: "Requesting a new Voter ID card", correct: false, explanation: "Form 6 is for initial registration, not replacing a lost card." },
    ],
  },
  {
    id: "q8-ink-finger",
    difficulty: "hard",
    topic: "rights",
    prompt: "Which finger receives the indelible ink mark after voting?",
    options: [
      { id: "a", label: "Right index finger", correct: false, explanation: "The right hand is not used for the ink mark." },
      { id: "b", label: "Left thumb", correct: false, explanation: "The thumb is not the designated finger for the ink mark." },
      { id: "c", label: "Left index finger", correct: true, explanation: "ECI marks the left index finger with indelible ink. The ink penetrates the skin and lasts 2–4 weeks." },
      { id: "d", label: "Right thumb", correct: false, explanation: "The right thumb is not used for the election ink mark." },
    ],
  },
  {
    id: "q9-helpline",
    difficulty: "hard",
    topic: "timelines",
    prompt: "What is the voter helpline number in India?",
    options: [
      { id: "a", label: "1800", correct: false, explanation: "1800 is a toll-free prefix, not the voter helpline." },
      { id: "b", label: "1950", correct: true, explanation: "1950 is the national voter helpline number. Voters can call for registration queries, booth info, and election schedules." },
      { id: "c", label: "100", correct: false, explanation: "100 is the police emergency number." },
      { id: "d", label: "112", correct: false, explanation: "112 is the unified emergency number, not specific to elections." },
    ],
  },
  {
    id: "q10-wb-phases",
    difficulty: "expert",
    topic: "timelines",
    prompt: "In West Bengal 2026 state elections, how many polling phases are scheduled?",
    options: [
      { id: "a", label: "1", correct: false, explanation: "West Bengal 2026 has multi-phase polling due to the state's size." },
      { id: "b", label: "2", correct: true, explanation: "West Bengal 2026 has 2 polling phases: Phase 1 on 23 April and Phase 2 on 29 April. Counting is on 4 May." },
      { id: "c", label: "3", correct: false, explanation: "The 2026 West Bengal election has 2 phases, not 3." },
      { id: "d", label: "4", correct: false, explanation: "4 phases were used in past elections but 2026 has only 2 phases." },
    ],
  },
];
