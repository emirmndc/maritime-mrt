export type TaskStatus = "pending" | "ready" | "active" | "complete";

export type TaskAction = {
  label: string;
  tone?: "primary" | "secondary";
};

export type ClauseReference = {
  title: string;
  text: string;
};

export type TaskItem = {
  title: string;
  owner: "Owner" | "Charterer";
  detail: string;
  status: TaskStatus;
  actions: TaskAction[];
  clauseSource: ClauseReference;
  whyMatters: string;
  riskIfMissed: string;
  today?: boolean;
};

export type TimelineEvent = {
  title: string;
  stamp: string;
  status: string;
  detail: string;
};

export type MessageDraft = {
  audience: string;
  subject: string;
  body: string;
};

export type ParserField = {
  label: string;
  value: string;
};

export type VoyageFlag = {
  title: string;
  severity: "medium" | "high";
  guidance: string;
};

export type VoyageHealth = {
  label: string;
  tone: "on_track" | "at_risk" | "delayed";
  reasons: string[];
};

export type VoyageDocumentStatus =
  | "uploaded"
  | "missing"
  | "awaiting_review"
  | "draft_only"
  | "confirmed";

export type VoyageDocument = {
  title: string;
  status: VoyageDocumentStatus;
};

export type ChangeLogItem = {
  title: string;
  detail: string;
  stamp: string;
};

export type VoyageRecord = {
  id: string;
  vessel: string;
  owner: string;
  charterer: string;
  broker: string;
  cargo: string;
  route: string;
  freight: string;
  paymentTerm: string;
  status: string;
  stage: string;
  upcomingTrigger: string;
  nextDeadline: string;
  commercialRisk: string;
  health: VoyageHealth;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  lastEventRecorded: string;
  parserSummary: ParserField[];
  flags: VoyageFlag[];
  changesSinceLastUpdate: ChangeLogItem[];
  summary: Array<[string, string]>;
  ownerTasks: TaskItem[];
  chartererTasks: TaskItem[];
  triggers: string[];
  documents: VoyageDocument[];
  riskNotes: string[];
  timeline: TimelineEvent[];
  drafts: MessageDraft[];
};
