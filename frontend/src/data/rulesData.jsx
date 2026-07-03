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

export const generalGuidelines = [
  {
    title: "Professional Conduct",
    icon: Shield,
    points: [
      "Treat every civilian with respect.",
      "Maintain roleplay quality at all times.",
      "Follow the chain of command.",
      "Do not abuse staff permissions.",
      "Represent EMS professionally.",
    ],
  },
  {
    title: "Patient Care",
    icon: HeartPulse,
    points: [
      "Patient safety is your highest priority.",
      "Perform proper medical RP.",
      "Never skip treatment procedures.",
      "Document serious incidents.",
    ],
  },
  {
    title: "Medical Equipment",
    icon: Stethoscope,
    points: [
      "Use equipment correctly.",
      "Restock medical supplies.",
      "Report damaged equipment.",
      "Keep emergency kits ready.",
    ],
  },
  {
    title: "Ambulance Operations",
    icon: Ambulance,
    points: [
      "Drive responsibly.",
      "Use sirens only during emergencies.",
      "Never abandon EMS vehicles.",
      "Park vehicles correctly after duty.",
    ],
  },
  {
    title: "Emergency Response",
    icon: Siren,
    points: [
      "Respond immediately.",
      "Inform dispatch.",
      "Coordinate with Police.",
      "Protect civilians first.",
    ],
  },
  {
    title: "Teamwork",
    icon: Users,
    points: [
      "Respect fellow EMS staff.",
      "Communicate clearly.",
      "Help junior members.",
      "Share important information.",
    ],
  },
];

export const disciplinaryRules = [
  {
    title: "Minor Violations",
    icon: AlertTriangle,
    points: [
      "Verbal Warning",
      "Written Warning",
      "Supervisor Review",
    ],
  },
  {
    title: "Major Violations",
    icon: Shield,
    points: [
      "Suspension",
      "Internal Investigation",
      "Termination if required",
    ],
  },
  {
    title: "Power Abuse",
    icon: ClipboardCheck,
    points: [
      "No abuse of authority.",
      "No corruption.",
      "Immediate report to Command.",
    ],
  },
];

export const tenCodes = [
  {
    title: "Common EMS Codes",
    icon: Radio,
    points: [
      "10-4  → Acknowledged",
      "10-7  → Out of Service",
      "10-8  → Available",
      "10-20 → Location",
      "10-97 → On Scene",
      "10-98 → Assignment Complete",
      "10-99 → Emergency",
    ],
  },
];

export const gradeProtocols = [
  {
    title: "Intern",
    icon: BookOpen,
    points: [
      "Training Period",
      "Works under supervision",
    ],
  },
  {
    title: "EMT",
    icon: Activity,
    points: [
      "Responds to emergencies",
      "Provides first response treatment",
    ],
  },
  {
    title: "Doctor",
    icon: Award,
    points: [
      "Advanced medical treatment",
      "Leads hospital operations",
      "Supervises EMS staff",
    ],
  },
];
