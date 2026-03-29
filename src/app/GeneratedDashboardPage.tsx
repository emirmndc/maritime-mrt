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
export type SettlementOpeningMode = "generated-signal" | "manual-review";

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
  openingMode: SettlementOpeningMode;
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
  payerRole: ClaimPartyRole;
  payerName: string;
  payeeRole: ClaimPartyRole;
  payeeName: string;
};

type ClaimSideInference = {
  side: ClaimPartyRole;
  confidence: "low" | "medium" | "high";
};

export type ClaimSideConstraint = {
  lockedSide: ClaimPartyRole;
  message: string;
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

const reasonTypePriority: Record<DisputeReasonKey, EvidenceDocumentType[]> = {
  port_cost_difference: ["PDA / FDA", "Port document", "Invoice", "Email", "Recap", "CP clause", "SOF"],
  invoice_mismatch: ["Invoice", "Email", "Recap", "CP clause", "PDA / FDA", "Port document", "SOF"],
  off_hire_deduction: ["SOF", "CP clause", "Email", "Invoice", "Recap", "Port document", "PDA / FDA"],
  bunker_difference: ["Invoice", "Email", "CP clause", "Recap", "PDA / FDA", "Port document", "SOF"],
  freight_shortfall: ["Invoice", "Recap", "CP clause", "Email", "Port document", "PDA / FDA", "SOF"],
  laytime_demurrage_difference: ["SOF", "CP clause", "Email", "Invoice", "Recap", "Port document", "PDA / FDA"],
  custom: ["Invoice", "Email", "Recap", "CP clause", "Port document", "PDA / FDA", "SOF"],
};

const reasonKeywords: Record<DisputeReasonKey, string[]> = {
  port_cost_difference: ["port", "disbursement", "pda", "fda", "da", "advance", "receipt", "reimbursement"],
  invoice_mismatch: ["invoice", "mismatch", "debit", "credit", "comment", "variance"],
  off_hire_deduction: ["off-hire", "off hire", "performance", "speed", "deduction", "downtime", "breakdown"],
  bunker_difference: ["bunker", "fuel", "stem", "consumption", "reconciliation"],
  freight_shortfall: ["freight", "shortfall", "underpaid", "unpaid", "balance", "payment"],
  laytime_demurrage_difference: ["laytime", "demurrage", "sof", "nor", "time sheet", "timebar", "timesheet"],
  custom: ["claim", "settlement", "dispute"],
};

const demoDirectionRules: Partial<
  Record<
    DisputeReasonKey,
    {
      claimSide: ClaimPartyRole;
      message: string;
    }
  >
> = {
  freight_shortfall: {
    claimSide: "Owner",
    message: "Freight shortfall should be raised from the Owner side in this demo.",
  },
  off_hire_deduction: {
    claimSide: "Charterer",
    message: "Off-hire deduction should be raised from the Charterer side in this demo.",
  },
  laytime_demurrage_difference: {
    claimSide: "Owner",
    message: "Laytime / demurrage difference is expected to open from the Owner side in this demo.",
  },
};

type GeneratedSettlementSignal = Pick<
  SettlementSeedContext,
  "disputeDetected" | "summary" | "referenceAmount" | "currency"
>;

export function loadEvidenceVaultDocuments(): EvidenceVaultDocument[] {
  if (typeof window === "undefined") return [];

  const manualDocuments = loadStoredEvidenceDocuments();
  return dedupeEvidenceDocuments(manualDocuments);
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
  const corpus = buildDisputeCorpus(generated);
  const generatedSignal = deriveGeneratedSettlementSignal();
  const reasonKey = inferDisputeReason(corpus, evidenceDocuments);
  const summary = generatedSignal.disputeDetected
    ? buildDisputeSummary(generated, reasonKey)
    : generatedSignal.summary;

  return {
    disputeDetected: generatedSignal.disputeDetected,
    reasonKey,
    claimSide: getSuggestedClaimSide(reasonKey, evidenceDocuments),
    summary,
    referenceAmount: generatedSignal.referenceAmount,
    currency: generatedSignal.currency,
    evidenceIds: getSuggestedEvidenceIds(reasonKey, evidenceDocuments),
  };
}

export function getSuggestedEvidenceIds(
  reasonKey: DisputeReasonKey,
  evidenceDocuments: EvidenceVaultDocument[] = loadEvidenceVaultDocuments(),
) {
  const ranked = rankEvidenceDocumentsForReason(reasonKey, evidenceDocuments);
  const positiveMatches = ranked.filter((item) => item.score > 0).slice(0, 4);

  if (positiveMatches.length > 0) {
    return positiveMatches.map((item) => item.document.id);
  }

  return ranked.slice(0, 2).map((item) => item.document.id);
}

export function getSuggestedClaimSide(
  reasonKey: DisputeReasonKey,
  evidenceDocuments: EvidenceVaultDocument[] = loadEvidenceVaultDocuments(),
) {
  const claimSideConstraint = getClaimSideConstraint(reasonKey);
  if (claimSideConstraint) {
    return claimSideConstraint.lockedSide;
  }

  return inferClaimSide(reasonKey, buildDisputeCorpus(loadGeneratedVoyage()), evidenceDocuments).side;
}

export function getClaimSideConstraint(reasonKey: DisputeReasonKey): ClaimSideConstraint | null {
  const demoRule = demoDirectionRules[reasonKey];
  if (!demoRule) return null;

  return {
    lockedSide: demoRule.claimSide,
    message: demoRule.message,
  };
}

export function getSettlementPartyModel(
  claimSide: ClaimPartyRole,
  reasonKey: DisputeReasonKey = "custom",
): SettlementPartyModel {
  const generated = loadGeneratedVoyage();
  const ownerName = generated?.owner || "Northshore Bulk Pte. Ltd.";
  const chartererName = generated?.charterer || "Bluewake Shipping";
  const respondentRole = claimSide === "Owner" ? "Charterer" : "Owner";
  const claimantName = claimSide === "Owner" ? ownerName : chartererName;
  const respondentName = respondentRole === "Owner" ? ownerName : chartererName;
  const paymentDirection = derivePaymentDirection(reasonKey, claimSide);

  return {
    claimSide,
    claimantRole: claimSide,
    claimantName,
    respondentRole,
    respondentName,
    payerRole: paymentDirection.payerRole,
    payerName: paymentDirection.payerRole === "Owner" ? ownerName : chartererName,
    payeeRole: paymentDirection.payeeRole,
    payeeName: paymentDirection.payeeRole === "Owner" ? ownerName : chartererName,
  };
}

export function assessSettlementDraft(
  draft: SettlementDraft,
  selectedEvidence: EvidenceVaultDocument[],
): SettlementAssessment {
  const generatedSignal = deriveGeneratedSettlementSignal();
  const disputeOpen = generatedSignal.disputeDetected || draft.openingMode === "manual-review";
  const issues: string[] = [];
  const disputedAmount = deriveDisputedAmount(draft.claimedAmount, draft.admittedAmount);
  const directionIssue = getDirectionIssue(draft.reasonKey, draft.claimSide, selectedEvidence);
  const requirementChecks = getEvidenceRequirements(draft.reasonKey).map((requirement) => ({
    ...requirement,
    satisfied: selectedEvidence.some((document) => requirement.anyOf.includes(document.type)),
  }));
  const missingRequirementLabels = requirementChecks
    .filter((item) => !item.satisfied)
    .map((item) => item.label);

  if (!disputeOpen) {
    issues.push(
      "No dispute signal was detected in the generated recap. Keep settlement closed until a real payment, cost, deduction, or claim issue is identified.",
    );
  }

  if (disputeOpen && draft.claimedAmount <= 0) {
    issues.push("Set the claimed exposure before opening settlement.");
  }

  if (disputeOpen && draft.admittedAmount < 0) {
    issues.push("Admitted payable amount cannot be negative.");
  }

  if (disputeOpen && draft.admittedAmount > draft.claimedAmount) {
    issues.push("Admitted payable amount cannot exceed claimed amount.");
  }

  if (disputeOpen && disputedAmount <= 0) {
    issues.push(
      "The dispute package is open, but the disputed portion has not been isolated yet. Confirm the payable amount before splitting.",
    );
  }

  if (disputeOpen && !draft.dueDate.trim()) {
    issues.push("Set a due date or payment deadline.");
  }

  if (draft.reasonKey === "custom" && !draft.customReason.trim()) {
    issues.push("Add a custom reason note before continuing.");
  }

  if (disputeOpen && selectedEvidence.length === 0) {
    issues.push("Link at least one supporting evidence item.");
  }

  if (directionIssue) {
    issues.push(directionIssue);
  }

  if (selectedEvidence.length > 0 && missingRequirementLabels.length > 0) {
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

function rankEvidenceDocumentsForReason(
  reasonKey: DisputeReasonKey,
  evidenceDocuments: EvidenceVaultDocument[],
) {
  const requirements = getEvidenceRequirements(reasonKey);
  const priority = reasonTypePriority[reasonKey];
  const keywords = reasonKeywords[reasonKey];

  return evidenceDocuments
    .map((document, index) => {
      const lowerName = document.name.toLowerCase();
      const typeIndex = priority.indexOf(document.type);
      let score = typeIndex >= 0 ? Math.max(20 - typeIndex * 2, 4) : 0;

      requirements.forEach((requirement, requirementIndex) => {
        if (requirement.anyOf.includes(document.type)) {
          score += 40 - requirementIndex * 5;
        }
      });

      keywords.forEach((keyword) => {
        if (lowerName.includes(keyword)) {
          score += 6;
        }
      });

      score += getReasonSpecificEvidenceBoost(reasonKey, document);

      if (document.source === "manual-upload") {
        score += 4;
      }

      if (document.uploaderRole === "Agent" && reasonKey === "port_cost_difference") {
        score += 8;
      }

      return { document, score, index };
    })
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.index - right.index;
    });
}

function getReasonSpecificEvidenceBoost(
  reasonKey: DisputeReasonKey,
  document: EvidenceVaultDocument,
) {
  switch (reasonKey) {
    case "port_cost_difference":
      return document.type === "PDA / FDA"
        ? 18
        : document.type === "Port document"
          ? 16
          : document.type === "Invoice"
            ? 12
            : document.type === "Email"
              ? 8
              : 0;
    case "invoice_mismatch":
      return document.type === "Invoice"
        ? 18
        : document.type === "Email"
          ? 12
          : document.type === "Recap"
            ? 10
            : 0;
    case "off_hire_deduction":
      return document.type === "SOF"
        ? 18
        : document.type === "CP clause"
          ? 16
          : document.type === "Email"
            ? 10
            : 0;
    case "bunker_difference":
      return document.type === "Invoice"
        ? 18
        : document.type === "Email"
          ? 12
          : document.type === "CP clause"
            ? 10
            : 0;
    case "freight_shortfall":
      return document.type === "Invoice"
        ? 18
        : document.type === "Recap"
          ? 16
          : document.type === "CP clause"
            ? 12
            : 0;
    case "laytime_demurrage_difference":
      return document.type === "SOF"
        ? 18
        : document.type === "CP clause"
          ? 14
          : document.type === "Email"
            ? 10
            : 0;
    case "custom":
      return document.type === "Email" || document.type === "Invoice" ? 6 : 0;
  }
}

function buildSeedSettlementDraft(): SettlementDraft {
  const generated = loadGeneratedVoyage();
  const evidence = loadEvidenceVaultDocuments();
  const seedContext = deriveSettlementSeedContext(evidence);

  return {
    id: "settlement-a102",
    title: seedContext.disputeDetected
      ? generated?.route
        ? `Settlement Review - ${generated.route}`
        : "Settlement Review - Voyage #A102"
      : generated?.route
        ? `No Dispute Package Opened - ${generated.route}`
        : "No Dispute Package Opened - Voyage #A102",
    claimedAmount: 0,
    admittedAmount: 0,
    currency: seedContext.currency,
    dueDate: generated?.next_deadline || generated?.claim_deadline || "28 Mar 2026",
    claimSide: seedContext.claimSide,
    openingMode: "generated-signal",
    reasonKey: seedContext.reasonKey,
    customReason: seedContext.reasonKey === "custom" ? seedContext.summary : "",
    evidenceIds: [],
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
  const generatedSignal = deriveGeneratedSettlementSignal();
  const availableEvidenceIds = new Set(loadEvidenceVaultDocuments().map((document) => document.id));
  const isLegacyDraft = item.totalAmount !== undefined || item.disputedAmount !== undefined;
  const openingMode = normalizeOpeningMode(item.openingMode, fallback.openingMode);

  if ((!generatedSignal.disputeDetected && openingMode !== "manual-review") || isLegacyDraft) {
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
    openingMode,
    reasonKey: isDisputeReasonKey(item.reasonKey) ? item.reasonKey : fallback.reasonKey,
    customReason: typeof item.customReason === "string" ? item.customReason : "",
    evidenceIds: Array.isArray(item.evidenceIds)
      ? item.evidenceIds.filter(
          (value): value is string =>
            typeof value === "string" && availableEvidenceIds.has(value),
        )
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

function buildDisputeCorpus(generated: ReturnType<typeof loadGeneratedVoyage>) {
  return [
    generated?.commercial_risk,
    ...(generated?.health_reasons ?? []),
    ...(generated?.flags ?? []).flatMap((item) => [item.title, item.guidance]),
    ...(generated?.risk_notes ?? []).map((note) =>
      typeof note === "string" ? note : `${note.title} ${note.body}`,
    ),
    ...(generated?.documents ?? []).map((document) => document.title),
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .toLowerCase();
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
    "reimbursement",
    "invoice",
  ].some((keyword) => corpus.includes(keyword));
}

function inferDisputeReason(
  corpus: string,
  evidenceDocuments: EvidenceVaultDocument[],
): DisputeReasonKey {
  if (corpus.includes("off-hire") || corpus.includes("off hire")) return "off_hire_deduction";
  if (corpus.includes("bunker") || corpus.includes("fuel")) return "bunker_difference";
  if (corpus.includes("demurrage") || corpus.includes("laytime")) {
    return "laytime_demurrage_difference";
  }
  if (
    corpus.includes("freight") &&
    (corpus.includes("shortfall") || corpus.includes("underpaid") || corpus.includes("unpaid"))
  ) {
    return "freight_shortfall";
  }
  if (corpus.includes("invoice") || corpus.includes("mismatch") || corpus.includes("debit note")) {
    return "invoice_mismatch";
  }
  if (
    corpus.includes("port cost") ||
    corpus.includes("disbursement") ||
    corpus.includes("pda") ||
    corpus.includes("fda") ||
    corpus.includes("reimbursement")
  ) {
    return "port_cost_difference";
  }

  if (evidenceDocuments.some((document) => document.type === "PDA / FDA" || document.type === "Port document")) {
    return "port_cost_difference";
  }
  if (evidenceDocuments.some((document) => document.type === "SOF")) {
    return "laytime_demurrage_difference";
  }
  if (evidenceDocuments.some((document) => document.name.toLowerCase().includes("bunker"))) {
    return "bunker_difference";
  }
  if (evidenceDocuments.some((document) => document.name.toLowerCase().includes("freight"))) {
    return "freight_shortfall";
  }
  if (evidenceDocuments.some((document) => document.type === "Invoice" || document.type === "Email")) {
    return "invoice_mismatch";
  }

  return "custom";
}

function inferClaimSide(
  reasonKey: DisputeReasonKey,
  corpus: string,
  evidenceDocuments: EvidenceVaultDocument[],
): ClaimSideInference {
  let ownerScore = 0;
  let chartererScore = 0;

  switch (reasonKey) {
    case "freight_shortfall":
      ownerScore += 4;
      break;
    case "laytime_demurrage_difference":
      ownerScore += 3;
      break;
    case "off_hire_deduction":
      chartererScore += 4;
      break;
    case "port_cost_difference":
      ownerScore += 2;
      break;
    case "bunker_difference":
      ownerScore += 1;
      chartererScore += 1;
      break;
    case "invoice_mismatch":
      ownerScore += 1;
      chartererScore += 1;
      break;
    case "custom":
      break;
  }

  if (corpus.includes("underpaid") || corpus.includes("unpaid") || corpus.includes("freight shortfall")) {
    ownerScore += 2;
  }
  if (corpus.includes("off-hire") || corpus.includes("deduction") || corpus.includes("overcharge")) {
    chartererScore += 2;
  }
  if (corpus.includes("reimbursement") || corpus.includes("demurrage")) {
    ownerScore += 1;
  }

  evidenceDocuments.forEach((document) => {
    const lowerName = document.name.toLowerCase();

    if (document.type === "Invoice" && document.uploaderRole === "Owner") {
      ownerScore += 2;
    }
    if (document.type === "Email" && document.uploaderRole === "Charterer") {
      chartererScore += 1;
    }
    if (document.type === "PDA / FDA" || document.type === "Port document") {
      ownerScore += reasonKey === "port_cost_difference" ? 2 : 1;
    }
    if (document.type === "SOF") {
      if (reasonKey === "off_hire_deduction") chartererScore += 2;
      if (reasonKey === "laytime_demurrage_difference") ownerScore += 2;
    }
    if (lowerName.includes("deduction") || lowerName.includes("counterclaim")) {
      chartererScore += 2;
    }
    if (lowerName.includes("freight") || lowerName.includes("demurrage") || lowerName.includes("reimbursement")) {
      ownerScore += 2;
    }
    if (lowerName.includes("bunker")) {
      if (document.uploaderRole === "Owner") ownerScore += 1;
      if (document.uploaderRole === "Charterer") chartererScore += 1;
    }
  });

  const side: ClaimPartyRole = ownerScore >= chartererScore ? "Owner" : "Charterer";
  const spread = Math.abs(ownerScore - chartererScore);

  return {
    side,
    confidence: spread >= 3 ? "high" : spread >= 1 ? "medium" : "low",
  };
}

function derivePaymentDirection(reasonKey: DisputeReasonKey, claimSide: ClaimPartyRole) {
  const respondentRole: ClaimPartyRole = claimSide === "Owner" ? "Charterer" : "Owner";

  if (reasonKey === "off_hire_deduction" && claimSide === "Charterer") {
    return {
      payerRole: "Owner" as ClaimPartyRole,
      payeeRole: "Charterer" as ClaimPartyRole,
    };
  }

  return {
    payerRole: respondentRole,
    payeeRole: claimSide,
  };
}

function getDirectionIssue(
  reasonKey: DisputeReasonKey,
  claimSide: ClaimPartyRole,
  evidenceDocuments: EvidenceVaultDocument[],
) {
  const claimSideConstraint = getClaimSideConstraint(reasonKey);
  if (claimSideConstraint && claimSide !== claimSideConstraint.lockedSide) {
    return claimSideConstraint.message;
  }

  const inferred = inferClaimSide(reasonKey, "", evidenceDocuments);
  if (inferred.confidence === "high" && inferred.side !== claimSide) {
    return `${getDisputeReasonLabel(reasonKey).labelEn} currently points more naturally to the ${inferred.side} side based on the evidence pack.`;
  }

  return null;
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

  if (reasonKey === "port_cost_difference") {
    return "Generated recap indicates a port-cost exposure that may need DA / invoice review.";
  }

  return `Generated recap indicates a ${reasonLabel.toLowerCase()} that may require settlement review.`;
}

function deriveGeneratedSettlementSignal(): GeneratedSettlementSignal {
  const generated = loadGeneratedVoyage();
  const corpus = buildDisputeCorpus(generated);

  return {
    disputeDetected: hasDisputeSignal(corpus),
    summary: "No payment or claim dispute signal was detected in the generated recap context.",
    referenceAmount: null,
    currency: parseCurrencyAmount(generated?.freight_term).currency ?? "USD",
  };
}

function normalizeClaimSide(value: unknown, fallback: ClaimPartyRole): ClaimPartyRole {
  return value === "Owner" || value === "Charterer" ? value : fallback;
}

function normalizeOpeningMode(
  value: unknown,
  fallback: SettlementOpeningMode,
): SettlementOpeningMode {
  return value === "generated-signal" || value === "manual-review" ? value : fallback;
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
