export type ConfidenceLevel = "high" | "medium" | "low";

export type SourceTraceItem = {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
  sourceType?:
    | "explicit_obligation"
    | "payment_term"
    | "documentary_requirement"
    | "approval_dependency"
    | "commercial_uncertainty"
    | "operational_condition";
  reasoning?: string;
};

export type GeneratedFlag = {
  title: string;
  guidance: string;
  severity: "medium" | "high";
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
};

export type GeneratedParserItem = {
  label: string;
  value: string;
};

export type GeneratedDocument = {
  title: string;
  status: "uploaded" | "missing" | "awaiting_review" | "draft_only" | "confirmed";
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
};

export type GeneratedChange = {
  title: string;
  detail: string;
  stamp: string;
};

export type GeneratedTask = {
  title: string;
  detail: string;
  status: "pending" | "ready" | "active" | "complete";
  clause_source_title: string;
  clause_source_text: string;
  why_matters: string;
  risk_if_missed: string;
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
};

export type GeneratedCaution = {
  title: string;
  body: string;
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
};

export type TimingAdvisory = {
  country: string;
  port_context: string;
  holiday_name?: string;
  advisory: string;
  impact: "banking" | "port_ops" | "docs" | "customs";
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
};

export type AutopsyInsight = {
  insight: string;
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
};

export type RecapAutopsy = {
  contradictions: AutopsyInsight[];
  dependencies: AutopsyInsight[];
  missing_structure: AutopsyInsight[];
  risk_concentration: AutopsyInsight[];
};

export type GeneratedVoyage = {
  owner: string;
  charterer: string;
  broker: string;
  cargo: string;
  loadport: string;
  disport: string;
  route: string;
  freight_term: string;
  demurrage: string;
  claim_deadline: string;
  voyage_status: string;
  upcoming_trigger: string;
  next_deadline: string;
  voyage_health: string;
  health_reasons: string[];
  commercial_risk: string;
  flags: GeneratedFlag[];
  parser_summary: GeneratedParserItem[];
  documents: GeneratedDocument[];
  timing_advisories?: TimingAdvisory[];
  risk_notes: Array<string | GeneratedCaution>;
  changes_since_last_update: GeneratedChange[];
  owner_tasks: GeneratedTask[];
  charterer_tasks: GeneratedTask[];
  recap_autopsy?: RecapAutopsy;
};

const STORAGE_KEY = "generated-voyage-demo";

export function saveGeneratedVoyage(voyage: GeneratedVoyage) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(voyage));
}

export function loadGeneratedVoyage(): GeneratedVoyage | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as GeneratedVoyage;
  } catch {
    return null;
  }
}
