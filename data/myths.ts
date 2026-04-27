import type { MythDefinition } from "@/lib/types";

export const MYTHS: MythDefinition[] = [
  {
    id: "nota-wasted",
    statement: "NOTA is a wasted vote.",
    prompt:
      "Defend the idea that NOTA is pointless. Make the strongest case you can, and Electra will argue back.",
    truth:
      "NOTA records deliberate dissent. It does not elect a candidate, but it is an official vote choice and a measurable signal in the result sheet.",
    sourceLabel: "ECI Conduct of Elections guidance and result reporting norms",
    sourceDetail:
      "NOTA appears as a formal option on the ballot unit and is counted as a valid choice in reporting.",
    verdictLabel: "Myth disarmed",
    hooks: [
      {
        keywords: ["doesn't change", "no effect", "winner", "same result"],
        acknowledgement:
          "You are arguing from outcome, which is the strongest version of this myth.",
        pivot:
          "But ECI treats NOTA as a recorded voter choice, not an empty act. A choice can fail to overturn the winner and still matter politically.",
      },
      {
        keywords: ["waste", "pointless", "useless"],
        acknowledgement:
          "That frustration is real, especially when no candidate feels acceptable.",
        pivot:
          "ECI's structure is explicit here: NOTA is a formal channel for rejection, and it shows up in the official tally instead of disappearing into silence.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "The ballot unit gives NOTA its own button. That means the system captures it as an intentional vote choice rather than a spoiled ballot.",
        escalation:
          "A 'wasted' action is one the system ignores. ECI does the opposite: it records NOTA in the result sheet as visible dissent.",
        citation: "ECI ballot design and result-tabulation practice",
      },
      {
        evidence:
          "When voters choose NOTA, parties and observers can see the scale of rejection constituency by constituency.",
        escalation:
          "That public tally changes campaign strategy, candidate quality debates, and media scrutiny even if it does not trigger a rerun.",
        citation: "ECI result disclosure norms",
      },
      {
        evidence:
          "If your benchmark is 'must change the winner to count,' then even many losing candidate votes would qualify as wasted, and ECI does not frame democracy that way.",
        escalation:
          "The rule-backed truth is narrower and more honest: NOTA will not elect anyone, but it absolutely registers a civic judgment.",
        citation: "ECI electoral choice framework",
      },
    ],
  },
  {
    id: "pwd-companion",
    statement: "PwD voters must bring a companion.",
    prompt:
      "Argue that a person with disability cannot realistically vote without bringing someone along.",
    truth:
      "PwD voters are entitled to accessible facilities and may choose assistance when needed, but a companion is not mandatory for all PwD voters.",
    sourceLabel: "ECI PwD voter facilitation guidelines",
    sourceDetail:
      "Polling stations are required to provide ramps, assistance, and optional companion support where permitted.",
    verdictLabel: "Accessibility myth busted",
    hooks: [
      {
        keywords: ["must", "mandatory", "cannot alone", "need someone"],
        acknowledgement:
          "You are highlighting a real fear: accessibility failures can make people feel dependent before they arrive.",
        pivot:
          "But ECI's rulebook places the burden on the polling station to be accessible. The system is supposed to adapt to the voter, not the other way around.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "ECI mandates accessibility measures such as ramps, help desks, and priority assistance so that the booth itself is usable.",
        escalation:
          "If a companion were legally required in every case, those accessibility provisions would be redundant. They are not.",
        citation: "ECI PwD facilitation instructions",
      },
      {
        evidence:
          "Where companion assistance is allowed, it is a choice tied to the voter's need, not a universal precondition for entering the booth.",
        escalation:
          "The legal framing protects autonomy. Mandatory companionship would convert a right into dependency.",
        citation: "ECI companion-assistance provisions",
      },
      {
        evidence:
          "ECI also trains polling teams to support electors with disability at the station itself.",
        escalation:
          "So the accurate claim is not 'must bring a companion,' but 'support is available, and the voter chooses what help is needed.'",
        citation: "ECI polling personnel accessibility handbook",
      },
    ],
  },
  {
    id: "nri-state-election",
    statement: "NRI voters cannot vote in state elections.",
    prompt: "Make the strongest case that overseas Indian voters are blocked from state polls entirely.",
    truth:
      "An NRI who is registered as an overseas elector in the relevant constituency can vote in that constituency, including for state assembly elections, by being physically present.",
    sourceLabel: "ECI overseas elector rules",
    sourceDetail:
      "Overseas electors remain tied to their Indian address constituency and can vote in person when enrolled there.",
    verdictLabel: "NRI myth corrected",
    hooks: [
      {
        keywords: ["abroad", "foreign", "state election", "not allowed"],
        acknowledgement:
          "You are mixing up remote voting limits with eligibility, which is exactly why this myth spreads.",
        pivot:
          "ECI restricts the method, not the franchise. Presence in person is the key distinction.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "ECI allows overseas electors to stay enrolled against their Indian address constituency.",
        escalation:
          "That constituency can be a parliamentary or assembly seat. So state election participation is not barred by category.",
        citation: "ECI overseas elector enrollment rules",
      },
      {
        evidence:
          "The constraint is that the NRI voter must be physically present to cast the vote.",
        escalation:
          "People often hear 'no remote voting' and wrongly compress it into 'no state voting.' The first is a method limit; the second is false.",
        citation: "ECI overseas voting procedure",
      },
      {
        evidence:
          "If the name is on the roll as an overseas elector for that assembly constituency, the vote is lawful.",
        escalation:
          "So the real planning question is travel and enrolment, not eligibility.",
        citation: "ECI overseas elector voting eligibility",
      },
    ],
  },
  {
    id: "epic-only",
    statement: "Voter ID card is the only accepted document.",
    prompt:
      "Defend the idea that without an EPIC card in hand, a voter should not even bother going to the booth.",
    truth:
      "ECI accepts multiple photo identity documents, including Aadhaar, Passport, Driving Licence, PAN Card, and others on the official list.",
    sourceLabel: "ECI approved photo ID list",
    sourceDetail:
      "EPIC is common, but it is one of several accepted documents for identification.",
    verdictLabel: "Document myth crushed",
    hooks: [
      {
        keywords: ["only", "must have voter id", "epic", "without card"],
        acknowledgement:
          "This sounds practical because EPIC is the most visible election document.",
        pivot:
          "But visibility is not exclusivity. ECI publishes a wider fallback list for exactly this scenario.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "ECI's accepted document list includes Aadhaar, Passport, Driving Licence, PAN Card, and additional photo documents beyond EPIC.",
        escalation:
          "So the claim 'only EPIC works' directly contradicts the official list.",
        citation: "ECI official accepted ID list",
      },
      {
        evidence:
          "The booth question is whether your identity can be verified using an approved document while your name appears on the roll.",
        escalation:
          "ECI built redundancy into the process so a missing EPIC card does not automatically disenfranchise an enrolled voter.",
        citation: "ECI voter identification procedure",
      },
      {
        evidence:
          "What you cannot do is replace enrolment with identity. The roll still matters.",
        escalation:
          "The precise rule is broader and stricter at the same time: many IDs work, but none bypass the voter list.",
        citation: "ECI voter roll and identity requirements",
      },
    ],
  },
  {
    id: "aadhaar-alone",
    statement: "If my name is not on the voter list, I can vote with Aadhaar alone.",
    prompt: "Argue that Aadhaar should be enough to vote even if the roll has a mistake.",
    truth:
      "Aadhaar can be an accepted identity document, but it does not replace the requirement that the voter's name be on the electoral roll.",
    sourceLabel: "ECI enrollment and ID rules",
    sourceDetail:
      "Being on the voter list and proving identity are separate checks.",
    verdictLabel: "Roll myth busted",
    hooks: [
      {
        keywords: ["aadhaar", "enough", "mistake", "roll missing"],
        acknowledgement:
          "You are framing this as an equity problem, and emotionally that lands.",
        pivot:
          "ECI still separates enrolment from identity. Aadhaar can support who you are, but not create a ballot where no enrolled entry exists.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "At the booth, the first gate is the electoral roll. Identity documents confirm the person standing there matches an enrolled voter.",
        escalation:
          "No approved photo ID, including Aadhaar, can manufacture an entry that is not on the list.",
        citation: "ECI booth verification flow",
      },
      {
        evidence:
          "That is why correction and enrolment drives happen before polling day.",
        escalation:
          "The system expects list accuracy to be solved upstream. Booth staff cannot rewrite the roll on voting day because someone has Aadhaar.",
        citation: "ECI roll revision and polling-day procedure",
      },
      {
        evidence:
          "So Aadhaar matters, but only in its lane: identity verification for an already enrolled elector.",
        escalation:
          "This myth is persuasive because Aadhaar feels universal. Legally, universal identity is still not the same as electoral entitlement.",
        citation: "ECI identity vs enrolment rule",
      },
    ],
  },
  {
    id: "queue-closing",
    statement: "If the booth closing time arrives, everyone still in line is turned away.",
    prompt: "Defend the idea that closing time means the queue instantly loses its vote.",
    truth:
      "Voters already in queue at the appointed closing time are marked and allowed to vote; the cutoff applies to new arrivals.",
    sourceLabel: "ECI queue management procedure",
    sourceDetail:
      "Polling staff identify and retain the queue present at closing time.",
    verdictLabel: "Queue myth defeated",
    hooks: [
      {
        keywords: ["close", "shut", "time up", "turned away"],
        acknowledgement:
          "That myth survives because people picture the booth like a shop shutter.",
        pivot:
          "ECI's polling logic is different: closing time freezes the line, it does not erase it.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "Polling staff mark the voters who are already in the queue at the official closing time.",
        escalation:
          "Once marked, those voters continue through the process even after the clock crosses closing time.",
        citation: "ECI end-of-poll queue protocol",
      },
      {
        evidence:
          "The cutoff is aimed at new arrivals, not the already waiting electorate.",
        escalation:
          "That distinction protects fairness: punctual queued voters are not penalized because the line moved slowly.",
        citation: "ECI booth closing practice",
      },
      {
        evidence:
          "So the smart behavior is to join the queue before closing, not to panic if the line is still moving at that moment.",
        escalation:
          "The myth weaponizes fear; the rule rewards timely presence.",
        citation: "ECI polling-hour guidance",
      },
    ],
  },
  {
    id: "first-time-parent",
    statement: "First-time voters need a parent or elder to accompany them into the process.",
    prompt: "Argue that a first-time voter is too inexperienced to handle the booth alone.",
    truth:
      "First-time voters vote in the same legal capacity as every adult elector; they do not need a parent or elder for validity.",
    sourceLabel: "ECI adult franchise principle",
    sourceDetail:
      "Once enrolled and eligible, first-time voters exercise the same independent vote as any other elector.",
    verdictLabel: "First-time voter myth corrected",
    hooks: [
      {
        keywords: ["first time", "parent", "elder", "alone"],
        acknowledgement:
          "It is common to confuse reassurance with legal requirement.",
        pivot:
          "ECI can support nervous first-time voters, but it does not downgrade their independent right.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "An enrolled 18-plus voter has the same franchise as every other adult elector.",
        escalation:
          "The law does not create a junior category of voter that needs parental validation.",
        citation: "ECI adult elector framework",
      },
      {
        evidence:
          "Polling staff can guide process steps, and awareness programs often target first-time voters.",
        escalation:
          "Guidance exists because the process is unfamiliar, not because the vote is conditional on accompaniment.",
        citation: "ECI first-time voter education practice",
      },
      {
        evidence:
          "So bringing someone may reduce anxiety, but it does not create legitimacy.",
        escalation:
          "Confidence and legal capacity are different things. ECI only requires the second.",
        citation: "ECI elector eligibility rule",
      },
    ],
  },
  {
    id: "vvpat-slip-home",
    statement: "The VVPAT slip can be taken home as proof of voting.",
    prompt: "Argue that the VVPAT slip belongs to the voter and should function like a receipt.",
    truth:
      "The VVPAT slip is shown briefly for verification and then automatically drops into a sealed box; the voter does not take it away.",
    sourceLabel: "ECI VVPAT operating procedure",
    sourceDetail:
      "The slip is meant for visual verification, not personal possession.",
    verdictLabel: "VVPAT myth denied",
    hooks: [
      {
        keywords: ["receipt", "proof", "take home", "belongs"],
        acknowledgement:
          "You are reaching for auditability, which is an understandable instinct.",
        pivot:
          "ECI separates auditability from voter possession so secrecy remains intact while verification still happens.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "The slip is visible through the VVPAT window for a few seconds and then drops into a sealed compartment.",
        escalation:
          "That design is deliberate. It verifies your choice without creating a portable receipt.",
        citation: "ECI VVPAT display-and-drop process",
      },
      {
        evidence:
          "Allowing voters to carry slips away would weaken ballot secrecy and invite coercion or vote-buying proof demands.",
        escalation:
          "ECI's procedure protects both verification and secrecy at the same time.",
        citation: "ECI secrecy-of-vote safeguards",
      },
      {
        evidence:
          "The sealed slips remain available for authorized audit procedures when required.",
        escalation:
          "So accountability exists, but it lives inside the election system rather than in personal take-home evidence.",
        citation: "ECI VVPAT audit framework",
      },
    ],
  },
  {
    id: "women-verification",
    statement: "Women in purdah need male verification to vote.",
    prompt: "Argue that purdah voters cannot be verified unless a male relative confirms their identity.",
    truth:
      "Identity verification is handled by polling procedures and authorized polling staff; a male relative is not a blanket legal requirement.",
    sourceLabel: "ECI elector verification procedure",
    sourceDetail:
      "Booth protocols handle identity and dignity through polling staff and prescribed checks.",
    verdictLabel: "Verification myth disproved",
    hooks: [
      {
        keywords: ["male relative", "verify", "purdah", "woman"],
        acknowledgement:
          "This myth often hides behind the language of respect while quietly stripping agency.",
        pivot:
          "ECI verification is institutional, not patriarchal. The booth process is designed to verify the elector directly.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "Polling staff use prescribed identity checks and booth procedures to verify the elector.",
        escalation:
          "Those procedures do not depend on a male family witness as the source of legitimacy.",
        citation: "ECI elector verification rules",
      },
      {
        evidence:
          "The election system is responsible for conducting verification with dignity and privacy.",
        escalation:
          "A blanket rule demanding male confirmation would compromise both autonomy and equal franchise.",
        citation: "ECI dignity and equal access principles",
      },
      {
        evidence:
          "So the accurate statement is that polling staff manage verification, including sensitive cases, under procedure.",
        escalation:
          "The myth swaps a civic process for a family permission model. ECI does not.",
        citation: "ECI polling-station verification protocol",
      },
    ],
  },
  {
    id: "powercut-vote-lost",
    statement: "If there is a power cut while I vote, my vote is automatically lost.",
    prompt: "Argue that a booth outage means the machine cannot be trusted and the vote disappears.",
    truth:
      "EVM-VVPAT units operate on dedicated power systems; if a disruption occurs, poll staff secure the process and resume according to procedure rather than casually losing votes.",
    sourceLabel: "ECI EVM-VVPAT operational protocol",
    sourceDetail:
      "Polling teams follow continuity and replacement procedures if equipment is interrupted.",
    verdictLabel: "Power-cut myth challenged",
    hooks: [
      {
        keywords: ["power cut", "lost", "machine fail", "disappear"],
        acknowledgement:
          "This myth taps into a basic trust fear: if the lights fail, the vote must have failed too.",
        pivot:
          "But ECI procedures treat disruptions as managed operational events, not as proof that votes vanish untracked.",
      },
    ],
    rebuttals: [
      {
        evidence:
          "EVM-VVPAT units are designed to operate independently of a building's casual power fluctuation.",
        escalation:
          "So a local outage does not map neatly to 'the machine forgot the vote.'",
        citation: "ECI EVM operating design notes",
      },
      {
        evidence:
          "If polling is interrupted, officers secure the unit, restore or replace equipment as required, and resume under procedure.",
        escalation:
          "That is the opposite of informal chaos. The recovery path is rule-bound.",
        citation: "ECI polling interruption protocol",
      },
      {
        evidence:
          "What matters operationally is where the interruption happened in the voting sequence, which is why poll staff do not simply guess or wave it through.",
        escalation:
          "The honest rule is procedural, not magical: disruptions are handled, documented, and resolved according to the EVM manual.",
        citation: "ECI EVM continuity procedure",
      },
    ],
  },
];

export const MYTH_MAP = Object.fromEntries(
  MYTHS.map((myth) => [myth.id, myth]),
) as Record<string, MythDefinition>;

export const MYTH_STARTERS: Record<string, string[]> = {
  "nota-wasted": [
    "If NOTA cannot change the winner, it does not achieve anything that matters on polling day.",
    "A protest vote that changes no outcome is just emotional theatre dressed up as participation.",
    "Serious voters should pick the least bad candidate because NOTA never produces a practical result.",
  ],
  "pwd-companion": [
    "Most PwD voters will struggle unless they bring someone, so calling a companion optional feels unrealistic.",
    "If the booth is unpredictable, the safe assumption is that a PwD voter should not go alone.",
    "Rules on paper do not matter if the actual station still expects a companion to make the process work.",
  ],
  "nri-state-election": [
    "NRI voting rules are so restrictive that state elections are effectively out of reach anyway.",
    "If overseas voters cannot vote remotely, saying they can vote in state polls sounds like legal fiction.",
    "State elections are local by design, so it makes sense that NRIs would be excluded in practice.",
  ],
  "epic-only": [
    "The whole system revolves around the voter card, so telling people other IDs work just creates confusion.",
    "If you show up without an EPIC card, the safer advice is to assume you cannot vote.",
    "A rule with too many fallback IDs becomes unreliable, so the real standard must still be the voter card.",
  ],
  "aadhaar-alone": [
    "Aadhaar is the national identity backbone, so it should be enough even when the roll has a mistake.",
    "Denying a vote to someone holding Aadhaar feels like punishing the voter for an administrative error.",
    "If identity is proven strongly enough, booth staff should be able to let the person vote anyway.",
  ],
  "queue-closing": [
    "When closing time hits, the booth should shut like any other official counter and stop the line immediately.",
    "It is unreasonable to expect polling staff to keep working past the official closing time for people still waiting.",
    "If you are not inside before the deadline, you probably took the risk and lost the chance.",
  ],
  "first-time-parent": [
    "First-time voters are too unfamiliar with the process, so they need an elder to make sure nothing goes wrong.",
    "A nervous new voter can easily make a mistake, which is why bringing a parent feels necessary.",
    "If the system is intimidating, first-time voters should not be expected to handle it independently.",
  ],
  "vvpat-slip-home": [
    "A voter should be allowed to take the VVPAT slip because a receipt is the clearest proof that the vote was recorded.",
    "Without a take-home slip, the voter has to trust the system blindly after pressing the button.",
    "Modern transactions give receipts, so voting should too if transparency is the goal.",
  ],
  "women-verification": [
    "In sensitive verification cases, a male relative may be the only practical way to confirm identity respectfully.",
    "If the booth wants certainty in a purdah case, family confirmation can seem more reliable than staff judgment.",
    "Some voters may not be comfortable with direct verification, so male confirmation sounds like the safer norm.",
  ],
  "powercut-vote-lost": [
    "If the power fails in the middle of voting, ordinary voters have no way to trust that the machine kept the vote.",
    "Any outage during voting should make people assume the vote was compromised unless it can be proved otherwise.",
    "When the booth goes dark, confidence disappears too, so it is reasonable to believe the vote is lost.",
  ],
};
