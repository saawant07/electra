import type { BoothLocation, SupportedLanguage, TimelineEntry, VotingState } from "@/lib/types";

export const LANGUAGE_META: Record<
  SupportedLanguage,
  { label: string; speech: string }
> = {
  en: { label: "English", speech: "en-IN" },
  hi: { label: "Hindi", speech: "hi-IN" },
  bn: { label: "Bengali", speech: "bn-IN" },
  ta: { label: "Tamil", speech: "ta-IN" },
};

export const ELECTION_TIMELINE: TimelineEntry[] = [
  { state: "Assam", phaseLabel: "Single phase", date: "2026-04-09" },
  { state: "Kerala", phaseLabel: "Single phase", date: "2026-04-09" },
  { state: "Puducherry", phaseLabel: "Single phase", date: "2026-04-09" },
  { state: "Tamil Nadu", phaseLabel: "Single phase", date: "2026-04-23" },
  { state: "West Bengal", phaseLabel: "Phase 1", date: "2026-04-23" },
  { state: "West Bengal", phaseLabel: "Phase 2", date: "2026-04-29" },
];

export const COUNTING_DAY = "2026-05-04";

export const ACCEPTED_DOCUMENTS = [
  "Voter ID (EPIC)",
  "Aadhaar",
  "Passport",
  "Driving Licence",
  "PAN Card",
  "Smart Card (MNREGA)",
  "Photo Passbook",
  "Pension Card with photo",
  "Health Insurance Smart Card",
  "NPR Smart Card",
];

export const BOOTH_LOCATIONS: BoothLocation[] = [
  {
    id: "kolkata-saltlake",
    state: "West Bengal",
    name: "Salt Lake Mission Booth",
    district: "Kolkata",
    address: "Sector V Civic Hall, Bidhannagar",
    accessible: ["Wheelchair ramp", "Priority queue", "Help desk"],
    peakWindow: "11:00 AM to 1:30 PM",
    queueHeatmap: [
      { slot: "7 AM", intensity: 2, minutes: 8 },
      { slot: "9 AM", intensity: 3, minutes: 14 },
      { slot: "11 AM", intensity: 5, minutes: 26 },
      { slot: "1 PM", intensity: 4, minutes: 19 },
      { slot: "3 PM", intensity: 2, minutes: 10 },
      { slot: "5 PM", intensity: 3, minutes: 13 },
    ],
  },
  {
    id: "chennai-adyar",
    state: "Tamil Nadu",
    name: "Adyar Community Booth",
    district: "Chennai",
    address: "LB Road Municipal School, Adyar",
    accessible: ["Low-height entry", "Wheelchair zone", "Shade seating"],
    peakWindow: "9:30 AM to 12:00 PM",
    queueHeatmap: [
      { slot: "7 AM", intensity: 2, minutes: 7 },
      { slot: "9 AM", intensity: 4, minutes: 18 },
      { slot: "11 AM", intensity: 5, minutes: 24 },
      { slot: "1 PM", intensity: 3, minutes: 16 },
      { slot: "3 PM", intensity: 2, minutes: 9 },
      { slot: "5 PM", intensity: 2, minutes: 8 },
    ],
  },
  {
    id: "guwahati-panbazar",
    state: "Assam",
    name: "Panbazar Civic Booth",
    district: "Guwahati",
    address: "MG Road Public Library Hall",
    accessible: ["Accessible washroom", "Dedicated assistance desk"],
    peakWindow: "10:30 AM to 12:30 PM",
    queueHeatmap: [
      { slot: "7 AM", intensity: 1, minutes: 5 },
      { slot: "9 AM", intensity: 3, minutes: 13 },
      { slot: "11 AM", intensity: 4, minutes: 20 },
      { slot: "1 PM", intensity: 3, minutes: 14 },
      { slot: "3 PM", intensity: 2, minutes: 8 },
      { slot: "5 PM", intensity: 1, minutes: 6 },
    ],
  },
  {
    id: "thiruvananthapuram-palayam",
    state: "Kerala",
    name: "Palayam Knowledge Booth",
    district: "Thiruvananthapuram",
    address: "University Jubilee Hall, Palayam",
    accessible: ["Braille signage", "Priority lane", "Transport desk"],
    peakWindow: "10:00 AM to 1:00 PM",
    queueHeatmap: [
      { slot: "7 AM", intensity: 1, minutes: 4 },
      { slot: "9 AM", intensity: 2, minutes: 9 },
      { slot: "11 AM", intensity: 4, minutes: 22 },
      { slot: "1 PM", intensity: 3, minutes: 15 },
      { slot: "3 PM", intensity: 2, minutes: 7 },
      { slot: "5 PM", intensity: 1, minutes: 5 },
    ],
  },
  {
    id: "puducherry-white-town",
    state: "Puducherry",
    name: "White Town Voter Hub",
    district: "Puducherry",
    address: "Mission Street Arts Hall",
    accessible: ["Ramp", "Queue seating", "Volunteer escort"],
    peakWindow: "9:00 AM to 11:00 AM",
    queueHeatmap: [
      { slot: "7 AM", intensity: 2, minutes: 7 },
      { slot: "9 AM", intensity: 4, minutes: 17 },
      { slot: "11 AM", intensity: 4, minutes: 19 },
      { slot: "1 PM", intensity: 3, minutes: 12 },
      { slot: "3 PM", intensity: 2, minutes: 9 },
      { slot: "5 PM", intensity: 2, minutes: 8 },
    ],
  },
];

export const STATE_OPTIONS: VotingState[] = [
  "Assam",
  "Kerala",
  "Puducherry",
  "Tamil Nadu",
  "West Bengal",
];
