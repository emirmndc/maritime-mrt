import type { VoyageRecord } from "./types";

export const voyages: VoyageRecord[] = [
  {
    id: "demo",
    vessel: "MV Cedar Bay",
    owner: "Northshore Bulk Pte. Ltd.",
    charterer: "Golden Delta Foods",
    broker: "Harborline Brokers",
    cargo: "4,800 MT corn",
    route: "Novorise → Southbay",
    freight: "USD 168,000",
    paymentTerm: "Within 3 banking days after B/L signing",
    status: "Freight trigger pending",
    nextDeadline: "ETA 5 days notice",
    riskLevel: "Medium",
    summary: [
      ["Owner", "Northshore Bulk Pte. Ltd."],
      ["Charterer", "Golden Delta Foods"],
      ["Broker", "Harborline Brokers"],
      ["Cargo", "4,800 MT corn"],
      ["Loadport", "Novorise"],
      ["Disport", "Southbay"],
      ["Freight", "4,800 × 35 = USD 168,000"],
      ["Payment", "3 banking days after B/L signing"],
    ],
    ownerTasks: [
      {
        title: "ETA 5 days notice",
        owner: "Owner",
        detail: "Reminder draft prepared for master and ops.",
        status: "pending",
      },
      {
        title: "NOR template ready",
        owner: "Owner",
        detail: "Template checked against laycan and tender location wording.",
        status: "ready",
      },
      {
        title: "Holds inspection follow-up",
        owner: "Owner",
        detail: "Awaiting surveyor result and photo upload.",
        status: "active",
      },
      {
        title: "Demurrage claim pack window",
        owner: "Owner",
        detail: "15 business day filing clock will activate after discharge.",
        status: "pending",
      },
    ],
    chartererTasks: [
      {
        title: "Agent nomination",
        owner: "Charterer",
        detail: "Loadport agent nomination still missing.",
        status: "pending",
      },
      {
        title: "PDA entry",
        owner: "Charterer",
        detail: "Expected PDA deduction must be uploaded before freight due.",
        status: "pending",
      },
      {
        title: "Freight instruction prep",
        owner: "Charterer",
        detail: "Remittance path drafted, awaiting B/L signing trigger.",
        status: "ready",
      },
      {
        title: "Surveyor nomination",
        owner: "Charterer",
        detail: "Cargo and hold survey contacts not yet confirmed.",
        status: "active",
      },
    ],
    triggers: [
      "Arrival at Outer Roads",
      "NOR tender",
      "Loading complete",
      "B/L signed",
      "Freight due",
      "Discharge complete",
      "Demurrage claim deadline",
    ],
    documents: [
      "Recap / CP extract",
      "Arrival report",
      "NOR",
      "Survey report / hold photos",
      "B/L",
      "SOF",
      "PDA / Final DA invoice",
      "SWIFT payment proof",
    ],
    riskNotes: [
      "NOR must not be tendered before laycan or outside allowed place wording.",
      "Failed hold inspection may suspend laytime counting and require fresh NOR.",
      "Freight amount may reduce by PDA if recap wording confirms deduction.",
      "Demurrage claim pack must include signed SOF and laytime sheet within 15 business days.",
    ],
    timeline: [
      {
        title: "Recap parsed",
        stamp: "System ready",
        status: "document-supported",
        detail: "Owner and charterer obligations extracted into tasks and deadlines.",
      },
      {
        title: "Arrival at Outer Roads",
        stamp: "Awaiting event",
        status: "next trigger",
        detail: "Arrival report upload unlocks NOR tender condition checks.",
      },
      {
        title: "NOR tender",
        stamp: "Awaiting event",
        status: "risk check",
        detail: "System flags laycan, place, and working-hours alignment without legal conclusion.",
      },
      {
        title: "Loading complete",
        stamp: "Future trigger",
        status: "freight prep",
        detail: "Draft survey and mate's receipt will activate freight countdown after B/L signing.",
      },
      {
        title: "B/L signed",
        stamp: "Future trigger",
        status: "payment due",
        detail: "Charterer payment task opens with +3 banking days deadline.",
      },
    ],
    drafts: [
      {
        audience: "To Charterer",
        subject: "Freight due reminder",
        body: "Good day, kindly note freight will fall due within 3 banking days after signing of B/L as per recap terms. Please keep funds arranged accordingly.",
      },
      {
        audience: "To Master / Ops",
        subject: "NOR timing reminder",
        body: "Reminder: NOR must not be tendered prior to laycan. Please ensure timing and place of tender strictly follow recap terms.",
      },
      {
        audience: "To Owners",
        subject: "Holds failure draft",
        body: "Good day, pls note holds inspection has failed as per attached survey report. Owners are arranging immediate cleaning. Fresh NOR to be tendered once vessel is fully ready.",
      },
    ],
  },
];

export const demoVoyage = voyages[0];
