export interface DocumentInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
}

/** The 10 ECI-accepted photo identity documents */
export const ACCEPTED_DOCUMENTS: DocumentInfo[] = [
  {
    id: "epic",
    name: "Voter Photo ID Card (EPIC)",
    icon: "🪪",
    description: "The most common election document issued by ECI to every enrolled voter.",
  },
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    icon: "🆔",
    description: "12-digit unique identification issued by UIDAI with photo and biometrics.",
  },
  {
    id: "passport",
    name: "Passport",
    icon: "📘",
    description: "Travel document issued by the Ministry of External Affairs with photo.",
  },
  {
    id: "driving-licence",
    name: "Driving Licence",
    icon: "🚗",
    description: "Licence issued by the Regional Transport Office with photo identification.",
  },
  {
    id: "pan",
    name: "PAN Card",
    icon: "💳",
    description: "Permanent Account Number card issued by the Income Tax Department.",
  },
  {
    id: "mnrega",
    name: "MNREGA Job Card",
    icon: "👷",
    description: "Job card with photograph issued under the Mahatma Gandhi NREGA scheme.",
  },
  {
    id: "passbook",
    name: "Bank/Post Office Passbook",
    icon: "🏦",
    description: "Savings account passbook with photograph from a bank or post office.",
  },
  {
    id: "pension",
    name: "Pension Card",
    icon: "🧓",
    description: "Pension document with photograph issued by the government.",
  },
  {
    id: "health-insurance",
    name: "Health Insurance Smart Card",
    icon: "🏥",
    description: "Smart card with photo issued under government health insurance schemes.",
  },
  {
    id: "npr",
    name: "NPR Smart Card",
    icon: "🗂️",
    description: "Smart card issued under the National Population Register with photo.",
  },
];
