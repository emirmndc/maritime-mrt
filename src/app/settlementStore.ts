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
export type ClaimPartyRole = "Owner" | "Charterer";

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
  claimedAmount: number;
  admittedAmount: number;
  currency: string;
  dueDate: string;
  claimSide: ClaimPartyRole;
  reasonKey: DisputeReasonKey;
  customReason: string;
  evidenceIds: string[];
};

export type EvidenceRequirement = {
  id: string;
  label: string;
  labelTr: string;
  anyOf: EvidenceDocumentType[];
};

export type EvidenceRequirementCheck = EvidenceRequirement & {
  satisfied: boolean;
};

export type SettlementAssessment = {
  disputedAmount: number;
  directionIssue: string | null;
  requirementChecks: EvidenceRequirementCheck[];
  missingRequirementLabels: string[];
  issues: string[];
  isReady: boolean;
};

export type SettlementSeedContext = {
  disputeDetected: boolean;
  reasonKey: DisputeReasonKey;
  claimSide: ClaimPartyRole;
  summary: string;
  referenceAmount: number | null;
  currency: string;
  evidenceIds: string[];
};

export type SettlementPartyModel = {
  claimSide: ClaimPartyRole;
  claimantRole: ClaimPartyRole;
  claimantName: string;
  respondentRole: ClaimPartyRole;
  respondentName: string;
  payerRole: "Charterer";
  payerName: string;
  payeeRole: "Owner";
  payeeName: string;
};

const EVIDENCE_KEY = "mrt-evidence-vault";
const LEGACY_EVIDENCE_KEY = "generated-dashboard-evidence-vault";
const SETTLEMENT_DRAFT_KEY = "generated-dashboard-settlement-draft";
const SETTLEMENT_STORE_EVENT = "generated-dashboard-settlement-store-updated";

export const disputeReasonCatalog: Array<{
  key: DisputeReasonKey;
  labelEn: string;
  labelTr: string;
}> = [
  { key: "port_cost_difference", labelEn: "Port cost difference", labelTr: "Port cost difference" },
  { key: "invoice_mismatch", labelEn: "Invoice mismatch", labelTr: "Invoice mismatch" },
  { key: "off_hire_deduction", labelEn: "Off-hire deduction", labelTr: "Off-hire deduction" },
  { key: "bunker_difference", labelEn: "Bunker difference", labelTr: "Bunker difference" },
  { key: "freight_shortfall", labelEn: "Freight shortfall", labelTr: "Freight shortfall" },
  {
    key: "laytime_demurrage_difference",
    labelEn: "Laytime / demurrage difference",
    labelTr: "Laytime / demurrage difference",
  },
  { key: "custom", labelEn: "Custom reason", labelTr: "Custom reason" },
];

export const evidenceTypeCatalog: Array<{
  value: EvidenceDocumentType;
  labelEn: string;
  labelTr: string;
}> = [
  { value: "Invoice", labelEn: "Invoice", labelTr: "Invoice" },
  { value: "SOF", labelEn: "SOF", labelTr: "SOF" },
  { value: "CP clause", labelEn: "CP clause", labelTr: "CP clause" },
  { value: "Email", labelEn: "Email", labelTr: "Email" },
  { value: "PDA / FDA", labelEn: "PDA / FDA", labelTr: "PDA / FDA" },
  { value: "Recap", labelEn: "Recap", labelTr: "Recap" },
  { value: "Port document", labelEn: "Port document", labelTr: "Port document" },
];

export function loadEvidenceVaultDocuments(): EvidenceVaultDocument[] {
  if (typeof window === "undefined") return [];

  const manualDocuments = loadStoredEvidenceDocuments();
  const seededDocuments = buildSeedDocuments();

  return dedupeEvidenceDocuments([...manualDocuments, ...seededDocuments]);
}

export function saveEvidenceVaultDocuments(documents: EvidenceVaultDocument[]) {
  if (typeof window === "undefined") return;

  const storedDocuments = documents
    .filter((document) => document.source === "manual-upload")
    .map((document) => ({
      id: document.id,
      fileName: document.name,
      timestamp: document.uploadedAt,
      uploaderRole: document.uploaderRole,
      documentType: document.type,
      fileUrl: document.fileDataUrl ?? "",
    }));

  sessionStorage.setItem(EVIDENCE_KEY, JSON.stringify(storedDocuments));
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
      return normalizeSettlementDraft(JSON.parse(raw));
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
  sessionStorage.setItem(SETTLEMENT_DRAFT_KEY, JSON.stringify(clampSettlementDraft(draft)));
  emitSettlementStoreUpdate();
}

export function getDisputeReasonLabel(key: DisputeReasonKey) {
  return disputeReasonCatalog.find((item) => item.key === key) ?? disputeReasonCatalog[0];
}

export function getEvidenceRequirements(reasonKey: DisputeReasonKey): EvidenceRequirement[] {
  switch (reasonKey) {
    case "port_cost_difference":
      return [
        {
          id: "port-cost-basis",
          label: "Port cost backup",
          labelTr: "Port cost backup",
          anyOf: ["PDA / FDA", "Port document"],
        },
        {
          id: "commercial-correspondence",
          label: "Commercial support",
          labelTr: "Commercial support",
          anyOf: ["Email", "Invoice"],
        },
      ];
    case "invoice_mismatch":
      return [
        {
          id: "invoice-base",
          label: "Invoice basis",
          labelTr: "Invoice basis",
          anyOf: ["Invoice"],
        },
        {
          id: "supporting-thread",
          label: "Supporting thread",
          labelTr: "Supporting thread",
          anyOf: ["Email", "Recap"],
        },
      ];
    case "off_hire_deduction":
      return [
        {
          id: "contract-basis",
          label: "Contract basis",
          labelTr: "Contract basis",
          anyOf: ["CP clause", "Email"],
        },
        {
          id: "operational-support",
          label: "Operational support",
          labelTr: "Operational support",
          anyOf: ["SOF", "Email"],
        },
      ];
    case "bunker_difference":
      return [
        {
          id: "bunker-basis",
          label: "Bunker cost basis",
          labelTr: "Bunker cost basis",
          anyOf: ["Invoice"],
        },
        {
          id: "bunker-thread",
          label: "Commercial support",
          labelTr: "Commercial support",
          anyOf: ["Email", "CP clause"],
        },
      ];
    case "freight_shortfall":
      return [
        {
          id: "freight-invoice",
          label: "Freight invoice",
          labelTr: "Freight invoice",
          anyOf: ["Invoice"],
        },
        {
          id: "freight-basis",
          label: "Freight basis",
          labelTr: "Freight basis",
          anyOf: ["Recap", "CP clause", "Email"],
        },
      ];
    case "laytime_demurrage_difference":
      return [
        {
          id: "time-counting-record",
          label: "Time-counting record",
          labelTr: "Time-counting record",
          anyOf: ["SOF"],
        },
        {
          id: "contract-or-thread",
          label: "Contract / correspondence support",
          labelTr: "Contract / correspondence support",
          anyOf: ["CP clause", "Email"],
        },
      ];
    case "custom":
      return [];
  }
}

export function deriveDisputedAmount(claimedAmount: number, admittedAmount: number) {
  return Math.max(claimedAmount - admittedAmount, 0);
}

export function deriveSettlementSeedContext(
  evidenceDocuments: EvidenceVaultDocument[] = loadEvidenceVaultDocuments(),
): SettlementSeedContext {
  const generated = loadGeneratedVoyage();
  const corpus = [
    generated?.commercial_risk,
    ...(generated?.health_reasons ?? []),
    ...(generated?.flags ?? []).flatMap((item) => [item.title, item.guidance]),
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .toLowerCase();

  const reasonKey = inferDisputeReasonFromCorpus(corpus);
  const disputeDetected = hasDisputeSignal(corpus);
  const referenceAmount = null;
  const currency = parseCurrencyAmount(generated?.freight_term).currency ?? "USD";
  const summary = disputeDetected
    ? buildDisputeSummary(generated, reasonKey)
    : "No payment or claim dispute signal was detected in the generated recap context.";

  return {
    disputeDetected,
    reasonKey,
    claimSide: getDefaultClaimSideForReason(reasonKey),
    summary,
    referenceAmount,
    currency,
    evidenceIds: disputeDetected ? selectSuggestedEvidenceIds(reasonKey, evidenceDocuments) : [],
  };
}

export function getSettlementPartyModel(claimSide: ClaimPartyRole): SettlementPartyModel {
  const generated = loadGeneratedVoyage();
  const ownerName = generated?.owner || "Northshore Bulk Pte. Ltd.";
  const chartererName = generated?.charterer || "Bluewake Shipping";
  const respondentRole = claimSide === "Owner" ? "Charterer" : "Owner";

  return {
    claimSide,
    claimantRole: claimSide,
    claimantName: claimSide === "Owner" ? ownerName : chartererName,
    respondentRole,
    respondentName: respondentRole === "Owner" ? ownerName : chartererName,
    payerRole: "Charterer",
    payerName: chartererName,
    payeeRole: "Owner",
    payeeName: ownerName,
  };
}

export function assessSettlementDraft(
  draft: SettlementDraft,
  selectedEvidence: EvidenceVaultDocument[],
): SettlementAssessment {
  const seedContext = deriveSettlementSeedContext();
  const issues: string[] = [];
  const disputedAmount = deriveDisputedAmount(draft.claimedAmount, draft.admittedAmount);
  const directionIssue = getDirectionIssue(draft.reasonKey, draft.claimSide);
  const requirementChecks = getEvidenceRequirements(draft.reasonKey).map((requirement) => ({
    ...requirement,
    satisfied: selectedEvidence.some((document) => requirement.anyOf.includes(document.type)),
  }));
  const missingRequirementLabels = requirementChecks
    .filter((item) => !item.satisfied)
    .map((item) => item.label);

  if (!seedContext.disputeDetected) {
    issues.push(
      "No dispute signal was detected in the generated recap. Keep settlement closed until a real payment, cost, deduction, or claim issue is identified.",
    );
  }

  if (seedContext.disputeDetected && draft.claimedAmount <= 0) {
    issues.push("Set the claimed exposure before opening settlement.");
  }

  if (seedContext.disputeDetected && draft.admittedAmount < 0) {
    issues.push("Admitted payable amount cannot be negative.");
  }

  if (seedContext.disputeDetected && draft.admittedAmount > draft.claimedAmount) {
    issues.push("Admitted payable amount cannot exceed claimed amount.");
  }

  if (seedContext.disputeDetected && disputedAmount <= 0) {
    issues.push(
      "A dispute signal exists, but the disputed portion has not been isolated yet. Confirm the payable amount before splitting.",
    );
  }

  if (seedContext.disputeDetected && !draft.dueDate.trim()) {
    issues.push("Set a due date or payment deadline.");
  }

  if (draft.reasonKey === "custom" && !draft.customReason.trim()) {
    issues.push("Add a custom reason note before continuing.");
  }

  if (directionIssue) {
    issues.push(directionIssue);
  }

  if (missingRequirementLabels.length > 0) {
    issues.push(`Missing evidence pack: ${missingRequirementLabels.join(", ")}.`);
  }

  return {
    disputedAmount,
    directionIssue,
    requirementChecks,
    missingRequirementLabels,
    issues,
    isReady: issues.length === 0,
  };
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
  const seedContext = deriveSettlementSeedContext(evidence);
  const claimedAmount = 0;
  const admittedAmount = 0;

  return {
    id: "settlement-a102",
    title: seedContext.disputeDetected
      ? generated?.route
        ? `Settlement Review - ${generated.route}`
        : "Settlement Review - Voyage #A102"
      : generated?.route
        ? `No Dispute Package Opened - ${generated.route}`
        : "No Dispute Package Opened - Voyage #A102",
    claimedAmount,
    admittedAmount,
    currency: seedContext.currency,
    dueDate: generated?.next_deadline || generated?.claim_deadline || "28 Mar 2026",
    claimSide: seedContext.claimSide,
    reasonKey: seedContext.reasonKey,
    customReason: seedContext.reasonKey === "custom" ? seedContext.summary : "",
    evidenceIds: seedContext.evidenceIds,
  };
}

function normalizeEvidenceDocument(raw: unknown): EvidenceVaultDocument | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Partial<EvidenceVaultDocument> & {
    fileName?: string;
    documentType?: EvidenceDocumentType;
    evidenceType?: EvidenceDocumentType;
    timestamp?: string;
    fileUrl?: string;
  };
  const type = item.type ?? item.documentType ?? item.evidenceType;

  if (
    typeof item.id !== "string" ||
    typeof (item.name ?? item.fileName) !== "string" ||
    !isEvidenceDocumentType(type) ||
    !isUploaderRole(item.uploaderRole)
  ) {
    return null;
  }

  return {
    id: item.id,
    name: item.name ?? item.fileName ?? "Unnamed document",
    type,
    uploaderRole: item.uploaderRole,
    uploadedAt: typeof item.uploadedAt === "string" ? item.uploadedAt : item.timestamp || "Unknown",
    source:
      item.source === "generated-dashboard" || item.source === "manual-upload"
        ? item.source
        : "manual-upload",
    fileDataUrl:
      typeof item.fileDataUrl === "string"
        ? item.fileDataUrl
        : typeof item.fileUrl === "string"
          ? item.fileUrl
          : undefined,
  };
}

function loadStoredEvidenceDocuments() {
  if (typeof window === "undefined") return [];

  const raw = sessionStorage.getItem(EVIDENCE_KEY) ?? sessionStorage.getItem(LEGACY_EVIDENCE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .map((item) => normalizeEvidenceDocument(item))
      .filter((item): item is EvidenceVaultDocument => Boolean(item));
  } catch {
    sessionStorage.removeItem(EVIDENCE_KEY);
    sessionStorage.removeItem(LEGACY_EVIDENCE_KEY);
    return [];
  }
}

function dedupeEvidenceDocuments(documents: EvidenceVaultDocument[]) {
  const seen = new Set<string>();

  return documents.filter((document) => {
    if (seen.has(document.id)) return false;
    seen.add(document.id);
    return true;
  });
}

function normalizeSettlementDraft(raw: unknown): SettlementDraft {
  if (!raw || typeof raw !== "object") {
    return buildSeedSettlementDraft();
  }

  const item = raw as Partial<SettlementDraft> & {
    totalAmount?: number;
    disputedAmount?: number;
    initiatedBy?: string;
  };
  const fallback = buildSeedSettlementDraft();
  const seedContext = deriveSettlementSeedContext();
  const isLegacyDraft = item.totalAmount !== undefined || item.disputedAmount !== undefined;

  if (!seedContext.disputeDetected || isLegacyDraft) {
    return fallback;
  }

  const claimedAmount = sanitizeNumber(item.claimedAmount, fallback.claimedAmount);
  const admittedAmount = clampNumber(
    sanitizeNumber(item.admittedAmount, fallback.admittedAmount),
    0,
    claimedAmount,
  );

  return {
    id: typeof item.id === "string" ? item.id : fallback.id,
    title: typeof item.title === "string" && item.title.trim() ? item.title : fallback.title,
    claimedAmount,
    admittedAmount,
    currency: typeof item.currency === "string" && item.currency.trim() ? item.currency : fallback.currency,
    dueDate: typeof item.dueDate === "string" ? item.dueDate : fallback.dueDate,
    claimSide: normalizeClaimSide(item.claimSide ?? item.initiatedBy, fallback.claimSide),
    reasonKey: isDisputeReasonKey(item.reasonKey) ? item.reasonKey : fallback.reasonKey,
    customReason: typeof item.customReason === "string" ? item.customReason : "",
    evidenceIds: Array.isArray(item.evidenceIds)
      ? item.evidenceIds.filter((value): value is string => typeof value === "string")
      : fallback.evidenceIds,
  };
}

function clampSettlementDraft(draft: SettlementDraft): SettlementDraft {
  const claimedAmount = Math.max(draft.claimedAmount, 0);
  const admittedAmount = clampNumber(draft.admittedAmount, 0, claimedAmount);

  return {
    ...draft,
    claimedAmount,
    admittedAmount,
    dueDate: draft.dueDate.trim(),
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
  else if (lowered.includes("port") || lowered.includes("bill of lading") || lowered.includes("mate")) {
    type = "Port document";
  }

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

function hasDisputeSignal(corpus: string) {
  if (!corpus.trim()) return false;

  return [
    "dispute",
    "claim",
    "shortfall",
    "mismatch",
    "difference",
    "deduction",
    "underpaid",
    "unpaid",
    "off-hire",
    "demurrage",
    "laytime",
    "bunker",
    "port cost",
    "overcharge",
  ].some((keyword) => corpus.includes(keyword));
}

function inferDisputeReasonFromCorpus(corpus: string): DisputeReasonKey {
  if (corpus.includes("off-hire")) return "off_hire_deduction";
  if (corpus.includes("bunker")) return "bunker_difference";
  if (corpus.includes("demurrage") || corpus.includes("laytime")) {
    return "laytime_demurrage_difference";
  }
  if (corpus.includes("freight") && (corpus.includes("shortfall") || corpus.includes("underpaid"))) {
    return "freight_shortfall";
  }
  if (corpus.includes("invoice") || corpus.includes("mismatch")) return "invoice_mismatch";
  if (corpus.includes("port cost") || corpus.includes("pda") || corpus.includes("fda")) {
    return "port_cost_difference";
  }
  return "custom";
}

function parseCurrencyAmount(text: string | undefined) {
  if (!text) {
    return { amount: null as number | null, currency: null as string | null };
  }

  const match = text.match(/\b(USD|EUR|GBP)\s*([0-9][0-9,]*(?:\.\d+)?)\b/i);
  if (!match) {
    return { amount: null as number | null, currency: null as string | null };
  }

  const amount = Number(match[2].replace(/,/g, ""));
  return {
    amount: Number.isFinite(amount) ? amount : null,
    currency: match[1].toUpperCase(),
  };
}

function buildDisputeSummary(
  generated: ReturnType<typeof loadGeneratedVoyage>,
  reasonKey: DisputeReasonKey,
) {
  const reasonLabel = getDisputeReasonLabel(reasonKey).labelEn;
  const commercialRisk = generated?.commercial_risk?.trim();

  if (commercialRisk) {
    return commercialRisk;
  }

  return `Generated recap indicates a ${reasonLabel.toLowerCase()} that may require settlement review.`;
}

function selectSuggestedEvidenceIds(
  reasonKey: DisputeReasonKey,
  evidenceDocuments: EvidenceVaultDocument[],
) {
  const relevantTypes = new Set(
    getEvidenceRequirements(reasonKey).flatMap((requirement) => requirement.anyOf),
  );

  if (relevantTypes.size === 0) {
    return evidenceDocuments.slice(0, 2).map((item) => item.id);
  }

  return evidenceDocuments
    .filter((document) => relevantTypes.has(document.type))
    .slice(0, 4)
    .map((item) => item.id);
}

function getDefaultClaimSideForReason(reasonKey: DisputeReasonKey): ClaimPartyRole {
  if (reasonKey === "freight_shortfall" || reasonKey === "laytime_demurrage_difference") {
    return "Owner";
  }

  return "Charterer";
}

function getDirectionIssue(
  reasonKey: DisputeReasonKey,
  claimSide: ClaimPartyRole,
) {
  if (reasonKey === "freight_shortfall" && claimSide !== "Owner") {
    return "In this freight-payment demo, freight shortfall should be raised from the Owner side.";
  }

  return null;
}

function normalizeClaimSide(value: unknown, fallback: ClaimPartyRole): ClaimPartyRole {
  return value === "Owner" || value === "Charterer" ? value : fallback;
}

function sanitizeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isDisputeReasonKey(value: unknown): value is DisputeReasonKey {
  return disputeReasonCatalog.some((item) => item.key === value);
}

function isEvidenceDocumentType(value: unknown): value is EvidenceDocumentType {
  return evidenceTypeCatalog.some((item) => item.value === value);
}

function isUploaderRole(value: unknown): value is EvidenceUploaderRole {
  return value === "Owner" || value === "Charterer" || value === "Agent";
}

function emitSettlementStoreUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SETTLEMENT_STORE_EVENT));
}
