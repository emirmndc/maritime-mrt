export type TaskStatus = "pending" | "ready" | "active" | "complete";

export type TaskAction = {
  label: string;
  tone?: "primary" | "secondary";
};

export type TaskItem = {
  title: string;
  owner: "Owner" | "Charterer";
  detail: string;
  status: TaskStatus;
  actions: TaskAction[];
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
};

export type VoyageHealth = {
  label: string;
  tone: "low" | "medium" | "high";
  reasons: string[];
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
  nextTrigger: string;
  nextDeadline: string;
  riskLevel: string;
  health: VoyageHealth;
  parserSummary: ParserField[];
  flags: VoyageFlag[];
  summary: Array<[string, string]>;
  ownerTasks: TaskItem[];
  chartererTasks: TaskItem[];
  triggers: string[];
  documents: string[];
  riskNotes: string[];
  timeline: TimelineEvent[];
  drafts: MessageDraft[];
};
