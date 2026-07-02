import {
  Shield,
  HeartPulse,
  Stethoscope,
  Ambulance,
  Siren,
  Users,
  ClipboardCheck,
  Radio,
  AlertTriangle,
  BookOpen,
  Activity,
  Award,
} from "lucide-react";

/* ===========================
   GENERAL GUIDELINES
=========================== */

export const generalGuidelines = [
  {
    title: "Professional Conduct",
    icon: Shield,
    points: [
      "Treat every civilian respectfully.",
      "Maintain RP at all times.",
      "Follow chain of command.",
      "Avoid toxicity and arguments.",
    ],
  },

  {
    title: "Patient Care",
    icon: HeartPulse,
    points: [
      "Prioritize patient safety.",
      "Always perform proper RP treatment.",
      "Never rush medical procedures.",
      "Document serious incidents.",
    ],
  },

  {
    title: "Medical Equipment",
    icon: Stethoscope,
    points: [
      "Use equipment correctly.",
      "Return medical supplies.",
      "Report damaged equipment.",
      "Keep ambulance stocked.",
    ],
  },

  {
    title: "Ambulance Usage",
    icon: Ambulance,
    points: [
      "Drive responsibly.",
      "Use sirens only when necessary.",
      "Never abandon vehicles.",
      "Park correctly after duty.",
    ],
  },

  {
    title: "Emergency Response",
    icon: Siren,
    points: [
      "Respond immediately.",
      "Inform dispatch.",
      "Coordinate with police.",
      "Protect civilians.",
    ],
  },

  {
    title: "Teamwork",
    icon: Users,
    points: [
      "Respect fellow staff.",
      "Communicate clearly.",
      "Support junior members.",
      "Share information.",
    ],
  },
];

/* ===========================
   DISCIPLINARY RULES
=========================== */

export const disciplinaryRules = [
  {
    title: "Minor Offences",
    icon: AlertTriangle,
    points: [
      "Verbal warning.",
      "Written warning.",
      "Supervisor review.",
    ],
  },

  {
    title: "Major Offences",
    icon: Shield,
    points: [
      "Suspension.",
      "Command investigation.",
      "Possible termination.",
    ],
  },

  {
    title: "Power Abuse",
    icon: ClipboardCheck,
    points: [
      "No abuse of authority.",
      "No corruption.",
      "Immediate report required.",
    ],
  },
];

/* ===========================
   10 CODES
=========================== */

export const tenCodes = [
  {
    title: "Emergency Codes",
    icon: Radio,
    points: [
      "10-4  → Acknowledged",
      "10-8  → Available",
      "10-20 → Location",
      "10-97 → Arrived",
      "10-98 → Assignment Complete",
    ],
  },
];

/* ===========================
   GRADE PROTOCOLS
=========================== */

export const gradeProtocols = [
  {
    title: "Intern",
    icon: BookOpen,
    points: [
      "Training phase.",
      "Requires supervision.",
    ],
  },

  {
    title: "EMT",
    icon: Activity,
    points: [
      "Handles emergency calls.",
      "Provides first response.",
    ],
  },

  {
    title: "Doctor",
    icon: Award,
    points: [
      "Leads advanced treatment.",
      "Supervises medical operations.",
    ],
  },
];
