import { loadGeneratedVoyage } from "./generatedVoyage";

export type EvidenceDocumentType =
  | "Invoice"
  | "SOF"
  | "CP clause"
  | "Email"
  | "PDA / FDA"
  | "Recap"
  | "Port document";

export type EvidenceUploaderRole = "Owner" | "Charterer" | "Agent";

export type EvidenceVaultDocument = {
  id: string;
  name: string;
  type: EvidenceDocumentType;
  uploaderRole: EvidenceUploaderRole;
  uploadedAt: string;
  source: "generated-dashboard" | "manual-upload";
  fileDataUrl?: string;
};

export type DisputeReasonKey =
  | "port_cost_difference"
  | "invoice_mismatch"
  | "off_hire_deduction"
  | "bunker_difference"
  | "freight_shortfall"
  | "laytime_demurrage_difference"
  | "custom";

export type SettlementDraft = {
  id: string;
  title: string;
  totalAmount: number;
  disputedAmount: number;
  currency: string;
  counterparty: string;
  dueDate: string;
  initiatedBy: string;
  reasonKey: DisputeReasonKey;
  customReason: string;
  evidenceIds: string[];
};

const EVIDENCE_KEY = "generated-dashboard-evidence-vault";
const SETTLEMENT_DRAFT_KEY = "generated-dashboard-settlement-draft";
const SETTLEMENT_STORE_EVENT = "generated-dashboard-settlement-store-updated";

export const disputeReasonCatalog: Array<{
  key: DisputeReasonKey;
  labelEn: string;
  labelTr: string;
}> = [
  { key: "port_cost_difference", labelEn: "Port cost difference", labelTr: "Liman maliyeti farki" },
  { key: "invoice_mismatch", labelEn: "Invoice mismatch", labelTr: "Fatura uyusmazligi" },
  { key: "off_hire_deduction", labelEn: "Off-hire deduction", labelTr: "Off-hire kesintisi" },
  { key: "bunker_difference", labelEn: "Bunker difference", labelTr: "Bunker farki" },
  { key: "freight_shortfall", labelEn: "Freight shortfall", labelTr: "Navlun eksigi" },
  {
    key: "laytime_demurrage_difference",
    labelEn: "Laytime / demurrage difference",
    labelTr: "Laytime / demurrage farki",
  },
  { key: "custom", labelEn: "Custom reason", labelTr: "Ozel neden" },
];

export const evidenceTypeCatalog: Array<{
  value: EvidenceDocumentType;
  labelEn: string;
  labelTr: string;
}> = [
  { value: "Invoice", labelEn: "Invoice", labelTr: "Fatura" },
  { value: "SOF", labelEn: "SOF", labelTr: "SOF" },
  { value: "CP clause", labelEn: "CP clause", labelTr: "CP klozu" },
  { value: "Email", labelEn: "Email", labelTr: "E-posta" },
  { value: "PDA / FDA", labelEn: "PDA / FDA", labelTr: "PDA / FDA" },
  { value: "Recap", labelEn: "Recap", labelTr: "Recap" },
  { value: "Port document", labelEn: "Port document", labelTr: "Liman evraki" },
];

export function loadEvidenceVaultDocuments(): EvidenceVaultDocument[] {
  if (typeof window === "undefined") return [];

  const raw = sessionStorage.getItem(EVIDENCE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as EvidenceVaultDocument[];
    } catch {
      sessionStorage.removeItem(EVIDENCE_KEY);
    }
  }

  const seeded = buildSeedDocuments();
  saveEvidenceVaultDocuments(seeded);
  return seeded;
}

export function saveEvidenceVaultDocuments(documents: EvidenceVaultDocument[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(EVIDENCE_KEY, JSON.stringify(documents));
  emitSettlementStoreUpdate();
}

export function appendEvidenceVaultDocument(document: EvidenceVaultDocument) {
  const current = loadEvidenceVaultDocuments();
  saveEvidenceVaultDocuments([document, ...current]);
}

export function loadSettlementDraft(): SettlementDraft {
  if (typeof window === "undefined") {
    return buildSeedSettlementDraft();
  }

  const raw = sessionStorage.getItem(SETTLEMENT_DRAFT_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as SettlementDraft;
    } catch {
      sessionStorage.removeItem(SETTLEMENT_DRAFT_KEY);
    }
  }

  const seeded = buildSeedSettlementDraft();
  saveSettlementDraft(seeded);
  return seeded;
}

export function saveSettlementDraft(draft: SettlementDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SETTLEMENT_DRAFT_KEY, JSON.stringify(draft));
  emitSettlementStoreUpdate();
}

export function getDisputeReasonLabel(key: DisputeReasonKey) {
  return disputeReasonCatalog.find((item) => item.key === key) ?? disputeReasonCatalog[0];
}

export function subscribeSettlementStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();
  window.addEventListener(SETTLEMENT_STORE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(SETTLEMENT_STORE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

function buildSeedDocuments(): EvidenceVaultDocument[] {
  const generated = loadGeneratedVoyage();
  const docsFromVoyage =
    generated?.documents
      ?.map((document, index) => mapGeneratedDocumentToEvidence(document.title, index))
      .filter((item): item is EvidenceVaultDocument => Boolean(item)) ?? [];

  if (docsFromVoyage.length > 0) {
    return docsFromVoyage;
  }

  return [
    buildDocument("evd-1", "Freight invoice A102.pdf", "Invoice", "Owner", "generated-dashboard"),
    buildDocument("evd-2", "Voyage recap A102.eml", "Recap", "Charterer", "generated-dashboard"),
    buildDocument("evd-3", "Port disbursement estimate.xlsx", "PDA / FDA", "Agent", "generated-dashboard"),
    buildDocument("evd-4", "Ops clarification thread.msg", "Email", "Charterer", "manual-upload"),
  ];
}

function buildSeedSettlementDraft(): SettlementDraft {
  const generated = loadGeneratedVoyage();
  const evidence = buildSeedDocuments();
  const defaultReason = generated?.commercial_risk?.toLowerCase().includes("demurrage")
    ? "laytime_demurrage_difference"
    : "port_cost_difference";

  return {
    id: "settlement-a102",
    title: generated?.route ? `Freight Payment - ${generated.route}` : "Freight Payment - Voyage #A102",
    totalAmount: 1000000,
    disputedAmount: 10000,
    currency: "USD",
    counterparty: generated?.charterer || "Bluewake Shipping",
    dueDate: "28 Mar 2026",
    initiatedBy: "Charterer",
    reasonKey: defaultReason,
    customReason: "",
    evidenceIds: evidence.slice(0, 4).map((item) => item.id),
  };
}

function mapGeneratedDocumentToEvidence(title: string, index: number) {
  const lowered = title.toLowerCase();
  let type: EvidenceDocumentType | null = null;

  if (lowered.includes("invoice")) type = "Invoice";
  else if (lowered.includes("sof")) type = "SOF";
  else if (lowered.includes("clause") || lowered.includes("cp")) type = "CP clause";
  else if (lowered.includes("email") || lowered.includes("correspondence")) type = "Email";
  else if (lowered.includes("pda") || lowered.includes("fda")) type = "PDA / FDA";
  else if (lowered.includes("recap")) type = "Recap";
  else if (lowered.includes("port")) type = "Port document";

  if (!type) return null;

  return buildDocument(`generated-${index + 1}`, title, type, inferUploaderRole(type), "generated-dashboard");
}

function inferUploaderRole(type: EvidenceDocumentType): EvidenceUploaderRole {
  if (type === "Invoice" || type === "CP clause") return "Owner";
  if (type === "PDA / FDA" || type === "Port document") return "Agent";
  return "Charterer";
}

function buildDocument(
  id: string,
  name: string,
  type: EvidenceDocumentType,
  uploaderRole: EvidenceUploaderRole,
  source: "generated-dashboard" | "manual-upload",
): EvidenceVaultDocument {
  return {
    id,
    name,
    type,
    uploaderRole,
    source,
    uploadedAt: "28 Mar 2026, 09:20 HRS",
  };
}

function emitSettlementStoreUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SETTLEMENT_STORE_EVENT));
}
