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

function buildSeedDocuments(): EvidenceVaultDocument[] {
  const generated = loadGeneratedVoyage();
  const docsFromVoyage =
    generated?.documents
      ?.map((document, index) => mapGeneratedDocumentToEvidence(document.title, index))
      .filter((item): item is EvidenceVaultDocument => Boolean(item)) ?? [];

  if (docsFromVoyage.length > 0) {
    return docsFromVoyage;
  }

  const fallbackReason = inferDisputeReason(buildDisputeCorpus(generated), []);
  return buildFallbackDocuments(
    fallbackReason === "custom" ? "port_cost_difference" : fallbackReason,
  );
}

function buildFallbackDocuments(reasonKey: DisputeReasonKey): EvidenceVaultDocument[] {
  switch (reasonKey) {
    case "port_cost_difference":
      return [
        buildDocument("seed-port-1", "Estimated DA advance - Qingdao.pdf", "PDA / FDA", "Agent", "generated-dashboard"),
        buildDocument("seed-port-2", "Final port disbursement invoice.pdf", "Invoice", "Owner", "generated-dashboard"),
        buildDocument("seed-port-3", "Qingdao port receipts bundle.pdf", "Port document", "Agent", "generated-dashboard"),
        buildDocument("seed-port-4", "DA reimbursement discussion.msg", "Email", "Charterer", "generated-dashboard"),
      ];
    case "invoice_mismatch":
      return [
        buildDocument("seed-invoice-1", "Commercial invoice - disputed line items.pdf", "Invoice", "Owner", "generated-dashboard"),
        buildDocument("seed-invoice-2
