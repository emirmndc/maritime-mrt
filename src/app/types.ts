export type TaskStatus = "pending" | "ready" | "active" | "complete";

export type TaskItem = {
  title: string;
  owner: "Owner" | "Charterer";
  detail: string;
  status: TaskStatus;
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
  nextDeadline: string;
  riskLevel: string;
  summary: Array<[string, string]>;
  ownerTasks: TaskItem[];
  chartererTasks: TaskItem[];
  triggers: string[];
  documents: string[];
  riskNotes: string[];
  timeline: TimelineEvent[];
  drafts: MessageDraft[];
};
