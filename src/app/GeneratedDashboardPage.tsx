import { useEffect, useId, useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Clock3,
  FileSearch,
  FileStack,
  Mail,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { AppShell, CTAButton, Surface, StatusPill } from "./ui";
import {
  loadGeneratedVoyage,
  type ConfidenceLevel,
  type GeneratedCaution,
  type SourceTraceItem,
} from "./generatedVoyage";
import { navigateTo } from "./router";
import {
  deriveDisputedAmount,
  deriveSettlementSeedContext,
  disputeReasonCatalog,
  getClaimSideConstraint,
  getCurrentVoyageScopeKey,
  getDisputeReasonLabel,
  getEvidenceVaultStorageKey,
  getEvidenceRequirements,
  getSuggestedClaimSide,
  getSuggestedEvidenceIds,
  loadEvidenceVaultDocuments,
  loadSettlementDraft,
  saveSettlementDraft,
  type ClaimPartyRole,
  type DisputeReasonKey,
  type SettlementDraft,
  type SettlementOpeningMode,
} from "./settlementStore";

const flagTone = {
  medium: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  high: "border-rose-400/20 bg-rose-500/10 text-rose-100",
} as const;

const documentTone = {
  uploaded: "border-sky-400/20 bg-sky-500/10 text-sky-100",
  missing: "border-rose-400/20 bg-rose-500/10 text-rose-100",
  awaiting_review: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  draft_only: "border-violet-400/20 bg-violet-500/10 text-violet-100",
  confirmed: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
} as const;

type EvidenceType =
  | "Invoice"
  | "SOF"
  | "CP clause"
  | "Email"
  | "PDA / FDA"
  | "Recap"
  | "Port document";

type VaultEntry = {
  id: string;
  fileName: string;
  timestamp: string;
  uploaderRole: "Owner" | "Charterer" | "Agent";
  documentType: EvidenceType;
  fileUrl: string;
};

const evidenceTypeOptions: EvidenceType[] = [
  "Invoice",
  "SOF",
  "CP clause",
  "Email",
  "PDA / FDA",
  "Recap",
  "Port document",
];

export function GeneratedDashboardPage() {
  const generated = typeof window !== "undefined" ? loadGeneratedVoyage() : null;
  const voyageScopeKey = getCurrentVoyageScopeKey();
  const [vaultVersion, setVaultVersion] = useState(0);

  const summaryRoute =
    generated?.route || `${generated?.loadport || "Unknown"} > ${generated?.disport || "Unknown"}`;
  const vaultDocuments = useMemo(() => loadEvidenceVaultDocuments(), [vaultVersion, voyageScopeKey]);
  const currentSettlement = useMemo(() => loadSettlementDraft(), [vaultVersion, voyageScopeKey]);
  const settlementSeed = useMemo(
    () => deriveSettlementSeedContext(vaultDocuments),
    [vaultDocuments],
  );
  const defaultDueDate = generated?.next_deadline || generated?.claim_deadline || "";

  const keyRisks = useMemo(() => (generated?.flags || []).slice(0, 3), [generated]);
  const nextActions = useMemo(
    () => [...(generated?.owner_tasks || []), ...(generated?.charterer_tasks || [])].slice(0, 3),
    [generated],
  );
  const blockingDocuments = useMemo(
    () =>
      (generated?.documents || []).filter(
        (item) =>
          item.status === "missing" ||
          item.status === "awaiting_review" ||
          item.status === "draft_only",
      ),
    [generated],
  );
  const timingAdvisories = useMemo(
    () => (generated?.timing_advisories || []).slice(0, 4),
    [generated],
  );
  const [openingMode, setOpeningMode] = useState<SettlementOpeningMode>(() =>
    deriveInitialOpeningMode(currentSettlement, settlementSeed),
  );
  const [reasonKey, setReasonKey] = useState<DisputeReasonKey>(() =>
    deriveInitialReasonKey(currentSettlement, settlementSeed),
  );
  const [claimSide, setClaimSide] = useState<ClaimPartyRole>(() =>
    deriveInitialClaimSide(currentSettlement, settlementSeed),
  );
  const [claimedAmount, setClaimedAmount] = useState<number>(() => currentSettlement.claimedAmount);
  const [admittedAmount, setAdmittedAmount] = useState<number>(() => currentSettlement.admittedAmount);
  const [dueDate, setDueDate] = useState<string>(() => currentSettlement.dueDate || defaultDueDate);
  const [customReason, setCustomReason] = useState<string>(
    () =>
      currentSettlement.customReason ||
      (settlementSeed.reasonKey === "custom" ? settlementSeed.summary : ""),
  );
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    () => currentSettlement.evidenceIds.length > 0 ? currentSettlement.evidenceIds : settlementSeed.evidenceIds,
  );
  const [amountsNeedReconfirm, setAmountsNeedReconfirm] = useState(false);
  const [amountReconfirmProgress, setAmountReconfirmProgress] = useState({
    claimed: false,
    admitted: false,
  });
  const suggestedEvidenceIds = useMemo(
    () => getSuggestedEvidenceIds(reasonKey, vaultDocuments),
    [reasonKey, vaultDocuments],
  );
  const claimSideConstraint = useMemo(
    () => getClaimSideConstraint(reasonKey),
    [reasonKey],
  );
  const effectiveOpeningMode =
    openingMode === "generated-signal" && !settlementSeed.disputeDetected
      ? "manual-review"
      : openingMode;

  useEffect(() => {
    if (openingMode === "generated-signal" && !settlementSeed.disputeDetected) {
      setOpeningMode("manual-review");
    }
  }, [openingMode, settlementSeed.disputeDetected]);

  useEffect(() => {
    const nextDraft = loadSettlementDraft();
    const nextVaultDocuments = loadEvidenceVaultDocuments();
    const nextSeed = deriveSettlementSeedContext(nextVaultDocuments);

    setOpeningMode(deriveInitialOpeningMode(nextDraft, nextSeed));
    setReasonKey(deriveInitialReasonKey(nextDraft, nextSeed));
    setClaimSide(deriveInitialClaimSide(nextDraft, nextSeed));
    setClaimedAmount(nextDraft.claimedAmount);
    setAdmittedAmount(nextDraft.admittedAmount);
    setDueDate(nextDraft.dueDate || defaultDueDate);
    setCustomReason(
      nextDraft.customReason ||
        (nextSeed.reasonKey === "custom" ? nextSeed.summary : ""),
    );
    setSelectedEvidenceIds(
      nextDraft.evidenceIds.length > 0 ? nextDraft.evidenceIds : nextSeed.evidenceIds,
    );
    setAmountsNeedReconfirm(false);
    setAmountReconfirmProgress({ claimed: false, admitted: false });
  }, [voyageScopeKey]);

  useEffect(() => {
    if (selectedEvidenceIds.length === 0 && suggestedEvidenceIds.length > 0) {
      setSelectedEvidenceIds(suggestedEvidenceIds);
    }
  }, [selectedEvidenceIds.length, suggestedEvidenceIds]);

  useEffect(() => {
    if (reasonKey === "custom" && !customReason.trim()) {
      setCustomReason(settlementSeed.summary);
    }
  }, [customReason, reasonKey, settlementSeed.summary]);

  useEffect(() => {
    if (claimSideConstraint && claimSide !== claimSideConstraint.lockedSide) {
      setClaimSide(claimSideConstraint.lockedSide);
    }
  }, [claimSide, claimSideConstraint]);

  useEffect(() => {
    if (
      amountsNeedReconfirm &&
      amountReconfirmProgress.claimed &&
      amountReconfirmProgress.admitted
    ) {
      setAmountsNeedReconfirm(false);
    }
  }, [amountReconfirmProgress, amountsNeedReconfirm]);

  const selectedEvidence = useMemo(
    () => vaultDocuments.filter((item) => selectedEvidenceIds.includes(item.id)),
    [vaultDocuments, selectedEvidenceIds],
  );
  const rankedVaultDocuments = useMemo(() => {
    const selected = new Set(selectedEvidenceIds);
    const suggested = new Set(suggestedEvidenceIds);

    return [...vaultDocuments].sort((left, right) => {
      const leftScore = (selected.has(left.id) ? 2 : 0) + (suggested.has(left.id) ? 1 : 0);
      const rightScore = (selected.has(right.id) ? 2 : 0) + (suggested.has(right.id) ? 1 : 0);
      return rightScore - leftScore;
    });
  }, [selectedEvidenceIds, suggestedEvidenceIds, vaultDocuments]);
  const disputeRequirements = useMemo(
    () => getEvidenceRequirements(reasonKey),
    [reasonKey],
  );
  const disputeRequirementChecks = useMemo(
    () =>
      disputeRequirements.map((requirement) => ({
        ...requirement,
        satisfied: selectedEvidence.some((document) => requirement.anyOf.includes(document.type)),
      })),
    [disputeRequirements, selectedEvidence],
  );
  const missingRequirementLabels = useMemo(
    () =>
      disputeRequirementChecks
        .filter((item) => !item.satisfied)
        .map((item) => item.label),
    [disputeRequirementChecks],
  );
  const disputedAmount = useMemo(
    () => deriveDisputedAmount(claimedAmount, admittedAmount),
    [admittedAmount, claimedAmount],
  );
  const pendingAmountReconfirmLabels = useMemo(() => {
    const pending: string[] = [];

    if (!amountReconfirmProgress.claimed) {
      pending.push("Claimed exposure");
    }

    if (!amountReconfirmProgress.admitted) {
      pending.push("Admitted payable amount");
    }

    return pending;
  }, [amountReconfirmProgress]);
  const disputeIssues = useMemo(() => {
    const issues: string[] = [];

    if (amountsNeedReconfirm) {
      issues.push("Dispute reason changed. Retype both amount fields before opening the package.");
    }

    if (claimedAmount <= 0) {
      issues.push("Set the claimed exposure before opening the dispute package.");
    }

    if (admittedAmount < 0) {
      issues.push("Admitted payable amount cannot be negative.");
    }

    if (admittedAmount > claimedAmount) {
      issues.push("Admitted payable amount cannot exceed claimed amount.");
    }

    if (disputedAmount <= 0) {
      issues.push("A dispute package needs a positive disputed remainder.");
    }

    if (!dueDate.trim()) {
      issues.push("Set a due date or payment deadline.");
    }

    if (reasonKey === "custom" && !customReason.trim()) {
      issues.push("Add a custom dispute note for manual review.");
    }

    if (selectedEvidenceIds.length === 0) {
      issues.push("Link at least one supporting evidence item.");
    }

    if (selectedEvidenceIds.length > 0 && missingRequirementLabels.length > 0) {
      issues.push(`Suggested evidence still missing: ${missingRequirementLabels.join(", ")}.`);
    }

    return issues;
  }, [
    admittedAmount,
    amountsNeedReconfirm,
    claimedAmount,
    customReason,
    disputedAmount,
    dueDate,
    missingRequirementLabels,
    reasonKey,
    selectedEvidenceIds.length,
  ]);

  function toggleEvidenceSelection(documentId: string) {
    setSelectedEvidenceIds((current) =>
      current.includes(documentId)
        ? current.filter((item) => item !== documentId)
        : [...current, documentId],
    );
  }

  function applyReasonSelection(
    nextReason: DisputeReasonKey,
    options: { requireAmountRetype: boolean },
  ) {
    const reasonChanged = nextReason !== reasonKey;
    const nextClaimSideConstraint = getClaimSideConstraint(nextReason);

    setReasonKey(nextReason);
    setClaimSide(
      nextClaimSideConstraint?.lockedSide ?? getSuggestedClaimSide(nextReason, vaultDocuments),
    );
    setSelectedEvidenceIds(getSuggestedEvidenceIds(nextReason, vaultDocuments));

    if (
      options.requireAmountRetype &&
      reasonChanged &&
      (claimedAmount > 0 || admittedAmount > 0)
    ) {
      setAmountsNeedReconfirm(true);
      setAmountReconfirmProgress({ claimed: false, admitted: false });
      return;
    }

    setAmountsNeedReconfirm(false);
    setAmountReconfirmProgress({ claimed: false, admitted: false });
  }

  function handleReasonChange(nextReason: DisputeReasonKey) {
    applyReasonSelection(nextReason, { requireAmountRetype: true });
  }

  function applyGeneratedSuggestion() {
    setOpeningMode(settlementSeed.disputeDetected ? "generated-signal" : "manual-review");
    applyReasonSelection(settlementSeed.reasonKey, { requireAmountRetype: false });
    setDueDate(defaultDueDate);
    setCustomReason(settlementSeed.reasonKey === "custom" ? settlementSeed.summary : "");
  }

  function handleOpenDisputePackage() {
    if (disputeIssues.length > 0) {
      return;
    }

    const draft: SettlementDraft = {
      id: currentSettlement.id || "settlement-a102",
      title:
        effectiveOpeningMode === "manual-review"
          ? `Manual Dispute Review - ${summaryRoute}`
          : `Settlement Review - ${summaryRoute}`,
      claimedAmount,
      admittedAmount,
      currency: settlementSeed.currency,
      dueDate,
      claimSide,
      openingMode: effectiveOpeningMode,
      reasonKey,
      customReason: reasonKey === "custom" ? customReason.trim() : "",
      evidenceIds: selectedEvidenceIds,
    };

    saveSettlementDraft(draft);
    navigateTo("/app/settlement");
  }

  if (!generated) {
    return (
      <AppShell
        eyebrow="Workflow Draft"
        title="No operational draft available yet."
        description="Generate a draft from a voyage recap first. This screen is designed as a review surface, not a final decision engine."
      >
        <Surface>
          <div className="text-sm text-white/70">
            No operational draft is stored in this session yet.
          </div>
          <div className="mt-6">
            <CTAButton route="/app/try-demo">Go to Try Demo</CTAButton>
          </div>
        </Surface>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Workflow Draft"
      title="Recap -> Operational Draft Dashboard"
      description="Extracted from recap text and organized into a review-required workflow draft. This interface does not decide who is right and does not replace human review."
    >
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface>
          <HeaderTag label="Operational draft" tone="mixed" />
          <h2 className="mt-4 break-words text-3xl font-bold">{summaryRoute}</h2>
          <p className="mt-3 text-white/68">
            {generated.cargo || "Cargo pending review"} - Broker:{" "}
            {generated.broker || "Pending review"}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard tag="Extracted" label="Owner" value={generated.owner || "Pending review"} tone="extracted" />
            <MetricCard
              tag="Extracted"
              label="Charterer"
              value={generated.charterer || "Pending review"}
              tone="extracted"
            />
            <MetricCard
              tag="Suggested"
              label="Workflow status"
              value={generated.voyage_status || "Pending review"}
              tone="suggested"
            />
            <MetricCard
              tag="Requires confirmation"
              label="Next deadline"
              value={generated.next_deadline || "Pending review"}
              tone="review"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-[#4f97e8]/15 bg-[#3373B7]/10 p-4 text-sm leading-7 text-white/72">
            Part of the <span className="font-semibold text-white">MARITIME (MRT)</span>{" "}
            credibility-first roadmap: token layer live, workflow utility still in staged proof form.
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("full-breakdown");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/[0.06]"
            >
              View full breakdown
            </button>
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={AlertTriangle} label="Summary panel" subtitle="Attention required" />
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-amber-100">
            <div className="text-sm font-semibold">Risk signals detected</div>
            <div className="mt-3 space-y-2 text-sm leading-7">
              {(generated.health_reasons?.length
                ? generated.health_reasons
                : ["No summary reasons returned"])
                .slice(0, 3)
                .map((reason) => (
                  <div key={reason}>- {reason}</div>
                ))}
            </div>
          </div>
        </Surface>
      </div>

      <Surface className="mt-5">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div>
            <HeaderTag
              label={effectiveOpeningMode === "manual-review" ? "Manual review" : "Generated signal"}
              tone={effectiveOpeningMode === "manual-review" ? "mixed" : "suggested"}
            />
            <SectionTitle
              icon={ArrowRightLeft}
              label="Dispute opening"
              subtitle="Open a maritime dispute package from the dashboard"
            />

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                Review basis
              </div>
              <div className="mt-3 text-sm leading-7 text-white/78">
                {settlementSeed.disputeDetected
                  ? settlementSeed.summary
                  : "No generated dispute signal was found. You can still open a manual dispute review if operations or claims teams identify a real exposure."}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MetricCard
                  tag="Suggested"
                  label="Reason"
                  value={getDisputeReasonLabel(settlementSeed.reasonKey).labelEn}
                  tone="suggested"
                />
                <MetricCard
                  tag="Suggested"
                  label="Claim side"
                  value={settlementSeed.claimSide}
                  tone="suggested"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!settlementSeed.disputeDetected}
                onClick={() => {
                  setOpeningMode("generated-signal");
                  applyGeneratedSuggestion();
                }}
                className={[
                  "rounded-2xl border px-4 py-4 text-left transition",
                  effectiveOpeningMode === "generated-signal"
                    ? "border-[#4f97e8]/35 bg-[#3373B7]/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.05]",
                  !settlementSeed.disputeDetected ? "cursor-not-allowed opacity-45" : "",
                ].join(" ")}
              >
                <div className="font-semibold">Use generated signal</div>
                <div className="mt-2 text-sm leading-7 text-white/60">
                  Opens the package from the recap-derived dispute signal and suggested evidence pack.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOpeningMode("manual-review")}
                className={[
                  "rounded-2xl border px-4 py-4 text-left transition",
                  effectiveOpeningMode === "manual-review"
                    ? "border-[#4f97e8]/35 bg-[#3373B7]/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.05]",
                ].join(" ")}
              >
                <div className="font-semibold">Open manual review</div>
                <div className="mt-2 text-sm leading-7 text-white/60">
                  Lets claims users open a package even when the generated recap did not classify the dispute correctly.
                </div>
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                Maritime logic
              </div>
              <div className="mt-3 space-y-2 text-sm leading-7 text-white/72">
                <div>- A settlement package should only open when there is an actual monetary dispute.</div>
                <div>- Contract freight is not auto-treated as the disputed amount.</div>
                <div>- The package must identify claimant side, admitted payable amount, and disputed remainder separately.</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-white/75">
                <span>Dispute reason</span>
                <select
                  value={reasonKey}
                  onChange={(event) => handleReasonChange(event.target.value as DisputeReasonKey)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"
                >
                  {disputeReasonCatalog.map((reason) => (
                    <option key={reason.key} value={reason.key} className="bg-white text-slate-900">
                      {reason.labelEn}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-white/75">
                <span>Due date / payment deadline</span>
                <input
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-white/75">
                <span>Claimed exposure</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={claimedAmount}
                  onChange={(event) => {
                    setClaimedAmount(Number(event.target.value) || 0);
                    if (amountsNeedReconfirm) {
                      setAmountReconfirmProgress((current) => ({ ...current, claimed: true }));
                    }
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-white/75">
                <span>Admitted payable amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={admittedAmount}
                  onChange={(event) => {
                    setAdmittedAmount(Number(event.target.value) || 0);
                    if (amountsNeedReconfirm) {
                      setAmountReconfirmProgress((current) => ({ ...current, admitted: true }));
                    }
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                />
              </label>
            </div>

            {amountsNeedReconfirm ? (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                <div className="font-semibold">Retype both amount fields</div>
                <div className="mt-2 leading-7 text-amber-100/85">
                  The dispute reason changed. Re-enter both amount fields for this new basis before opening the package.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Claimed exposure", "Admitted payable amount"].map((label) => {
                    const confirmed = !pendingAmountReconfirmLabels.includes(label);

                    return (
                      <span
                        key={label}
                        className={[
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          confirmed
                            ? "bg-emerald-500/15 text-emerald-100"
                            : "bg-white/[0.06] text-amber-100/85",
                        ].join(" ")}
                      >
                        {confirmed ? `${label} confirmed` : `${label} pending`}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-4 grid gap-2 text-sm text-white/75">
              <span>Claim side</span>
              <div className="grid grid-cols-2 gap-2">
                {(["Owner", "Charterer"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    disabled={Boolean(claimSideConstraint && role !== claimSideConstraint.lockedSide)}
                    onClick={() => setClaimSide(role)}
                    className={[
                      "rounded-2xl border px-4 py-3 text-left transition",
                      claimSide === role
                        ? "border-[#4f97e8]/35 bg-[#3373B7]/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/75 hover:bg-white/[0.05]",
                      claimSideConstraint && role !== claimSideConstraint.lockedSide
                        ? "cursor-not-allowed opacity-45 hover:bg-white/[0.02]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="font-semibold">{role}</div>
                    <div className="mt-1 text-xs text-white/55">
                      {role === "Owner" ? "Owner-led claim package" : "Charterer-led claim package"}
                    </div>
                  </button>
                ))}
              </div>
              {claimSideConstraint ? (
                <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                  {claimSideConstraint.message}
                </div>
              ) : null}
            </div>

            {reasonKey === "custom" ? (
              <label className="mt-4 grid gap-2 text-sm text-white/75">
                <span>Custom dispute note</span>
                <textarea
                  value={customReason}
                  onChange={(event) => setCustomReason(event.target.value)}
                  className="min-h-[110px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                />
              </label>
            ) : null}

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <MetricCard
                tag="Draft"
                label="Currency"
                value={settlementSeed.currency}
                tone="review"
              />
              <MetricCard
                tag="Draft"
                label="Disputed remainder"
                value={formatMoney(disputedAmount, settlementSeed.currency)}
                tone={disputedAmount > 0 ? "suggested" : "review"}
              />
              <MetricCard
                tag="Draft"
                label="Linked evidence"
                value={`${selectedEvidenceIds.length} item(s)`}
                tone={selectedEvidenceIds.length > 0 ? "suggested" : "review"}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Suggested evidence pack
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvidenceIds(suggestedEvidenceIds)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/75 transition hover:bg-white/[0.06]"
                >
                  Use suggested pack
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/65">
                Only files uploaded through Evidence Vault appear here. Demo recap documents do not auto-populate this list anymore.
              </div>

              <div className="mt-4 grid gap-2">
                {disputeRequirementChecks.length > 0 ? (
                  disputeRequirementChecks.map((item) => (
                    <div
                      key={item.id}
                      className={[
                        "rounded-2xl border px-4 py-3 text-sm",
                        item.satisfied
                          ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                          : "border-amber-400/20 bg-amber-500/10 text-amber-100",
                      ].join(" ")}
                    >
                      <div className="font-semibold">{item.label}</div>
                      <div className="mt-1 text-xs opacity-80">{item.anyOf.join(" or ")}</div>
                    </div>
                  ))
                ) : (
                  <EmptyBox text="Custom review selected. Attach the evidence you intend to rely on." />
                )}
              </div>

              <div className="mt-4 grid gap-2">
                {rankedVaultDocuments.length > 0 ? (
                  rankedVaultDocuments.map((document) => {
                    const active = selectedEvidenceIds.includes(document.id);
                    return (
                      <button
                        key={document.id}
                        type="button"
                        onClick={() => toggleEvidenceSelection(document.id)}
                        className={[
                          "rounded-2xl border px-4 py-3 text-left transition",
                          active
                            ? "border-sky-400/30 bg-sky-500/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                        ].join(" ")}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="break-words font-semibold text-white/90">{document.name}</div>
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              active ? "bg-emerald-500/15 text-emerald-200" : "bg-white/[0.04] text-white/60",
                            ].join(" ")}
                          >
                            {active ? "Linked" : "Link"}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-white/58">
                          {document.type} - {document.uploaderRole} - {document.uploadedAt}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <EmptyBox text="No uploaded evidence is available yet. Add files in Evidence Vault first." />
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleOpenDisputePackage}
                disabled={disputeIssues.length > 0}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {effectiveOpeningMode === "manual-review" ? "Open manual dispute package" : "Open settlement package"}
              </button>
              <button
                type="button"
                onClick={applyGeneratedSuggestion}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06]"
              >
                Reset to suggestion
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {disputeIssues.length > 0 ? (
                disputeIssues.map((issue) => (
                  <div
                    key={issue}
                    className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    {issue}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  Dispute package is coherent and ready to open in settlement.
                </div>
              )}
            </div>
          </div>
        </div>
      </Surface>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_0.95fr_1.25fr]">
        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={TriangleAlert} label="3 critical review points" subtitle="Look here first" />
          <div className="mt-5 space-y-3">
            {keyRisks.length === 0 ? (
              <EmptyBox text="No highlighted review points were returned." />
            ) : (
              keyRisks.map((flag) => (
                <TraceableCard
                  key={flag.title}
                  title={flag.title}
                  body={flag.guidance}
                  confidence={flag.confidence}
                  sourceTrace={flag.sourceTrace}
                  accentClass={flagTone[flag.severity]}
                />
              ))
            )}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={Clock3} label="3 next actions" subtitle="Suggested workflow follow-up" />
          <div className="mt-5 space-y-3">
            {nextActions.length === 0 ? (
              <EmptyBox text="No next actions were returned." />
            ) : (
              nextActions.map((task) => (
                <div
                  key={task.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="break-words font-semibold">{task.title}</div>
                    <StatusPill status={task.status} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/68">{task.detail}</p>
                  <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/45">
                    Why this matters
                  </div>
                  <div className="mt-2 text-sm leading-7 text-white/78">{task.why_matters}</div>
                  <TraceFooter confidence={task.confidence} sourceTrace={task.sourceTrace} />
                </div>
              ))
            )}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Requires confirmation" tone="review" />
          <SectionTitle
            icon={FileStack}
            label="Missing documents blocking progress"
            subtitle="Evidence comes first"
          />
          <div className="mt-5 space-y-3">
            {blockingDocuments.length === 0 ? (
              <EmptyBox text="No blocking document gaps are visible in this draft." />
            ) : (
              blockingDocuments.map((document) => (
                <div
                  key={document.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="break-words font-semibold text-white/90">{document.title}</div>
                  <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${documentTone[document.status]}`}>
                    {formatDocumentStatus(document.status)}
                  </div>
                  <TraceFooter confidence={document.confidence} sourceTrace={document.sourceTrace} />
                </div>
              ))
            )}
          </div>
          <EvidenceVaultPanel
            className="mt-5"
            voyageScopeKey={voyageScopeKey}
            onEntriesChanged={() => setVaultVersion((current) => current + 1)}
          />
        </Surface>
      </div>

      <Surface className="mt-5">
        <HeaderTag label="Timing advisory" tone="mixed" />
        <div className="mt-3 text-2xl font-bold">Local holiday and banking watch</div>
        <div className="mt-2 text-sm text-white/65">
          Advisory only. Review local port, bank, agent, and customs working arrangements.
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {timingAdvisories.length === 0 ? (
            <EmptyBox text="No local holiday or banking advisory was generated for this draft." />
          ) : (
            timingAdvisories.map((item, index) => (
              <div
                key={`${item.country}-${item.port_context}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="break-words font-semibold text-white/90">
                    {item.country} - {item.port_context}
                  </div>
                  {item.confidence ? <ConfidenceBadge level={item.confidence} /> : null}
                </div>
                <div className="mt-2 text-sm text-[#88c4ff]">
                  {item.holiday_name || "Holiday / banking calendar review"}
                </div>
                <div className="mt-3 text-sm leading-7 text-white/78">{item.advisory}</div>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Potential impact
                  </div>
                  <div className="mt-2 text-sm leading-7 text-white/88">
                    {formatTimingImpact(item.impact)}
                  </div>
                </div>
                <TraceFooter confidence={item.confidence} sourceTrace={item.sourceTrace} />
              </div>
            ))
          )}
        </div>
      </Surface>

      <div id="full-breakdown" className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface>
          <HeaderTag label="Extracted" tone="extracted" />
          <SectionTitle icon={FileSearch} label="Recap summary" subtitle="Directly extracted terms" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(generated.parser_summary || []).map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                <div className="mt-2 break-words text-sm font-semibold leading-6 text-white/90">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Demo state" tone="mixed" />
          <SectionTitle icon={Clock3} label="Since last update" subtitle="No new events recorded (demo state)" />
          <div className="mt-5 space-y-4">
            {(generated.changes_since_last_update || []).length > 0 ? (
              generated.changes_since_last_update.map((item) => (
                <div
                  key={`${item.title}-${item.stamp}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="break-words font-semibold">{item.title}</div>
                    <div className="text-xs text-[#88c4ff]">{item.stamp}</div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
                </div>
              ))
            ) : (
              <EmptyBox text="No new events recorded (demo state)." />
            )}
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <TaskDisclosure
          title="View Owner tasks"
          description="Suggested responsibilities extracted from the recap and organized for review."
          columnTitle="Owner tasks"
          items={generated.owner_tasks || []}
        />
        <TaskDisclosure
          title="View Charterer tasks"
          description="Suggested responsibilities extracted from the recap and organized for review."
          columnTitle="Charterer tasks"
          items={generated.charterer_tasks || []}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={AlertTriangle} label="Operational cautions" subtitle="Suggested wording only" />
          <div className="mt-5 space-y-3">
            {(generated.risk_notes || []).length > 0 ? (
              generated.risk_notes.map((note, index) => {
                const caution = normalizeCaution(note, index);
                return (
                  <div
                    key={caution.title}
                    className="rounded-2xl border border-amber-400/15 bg-amber-500/5 px-4 py-3 text-sm leading-7 text-white/78"
                  >
                    <div className="break-words font-semibold text-white/90">{caution.title}</div>
                    <div className="mt-2">{caution.body}</div>
                    <TraceFooter confidence={caution.confidence} sourceTrace={caution.sourceTrace} />
                  </div>
                );
              })
            ) : (
              <EmptyBox text="No suggested cautions were returned." />
            )}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Future layer" tone="mixed" />
          <SectionTitle icon={Mail} label="Reminder drafts" subtitle="Not generated yet" />
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/70">
            Draft generation should come after extraction quality and task quality are stable.
          </div>
        </Surface>
      </div>
    </AppShell>
  );
}

function HeaderTag({
  label,
  tone,
}: {
  label: string;
  tone: "extracted" | "suggested" | "review" | "mixed";
}) {
  const toneClass =
    tone === "extracted"
      ? "border-sky-400/20 bg-sky-500/10 text-sky-200"
      : tone === "suggested"
        ? "border-amber-400/20 bg-amber-500/10 text-amber-200"
        : tone === "review"
          ? "border-rose-400/20 bg-rose-500/10 text-rose-200"
          : "border-white/15 bg-white/10 text-white/85";

  return (
    <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {label}
    </div>
  );
}

function MetricCard({
  tag,
  label,
  value,
  tone,
}: {
  tag: string;
  label: string;
  value: string;
  tone: "extracted" | "suggested" | "review";
}) {
  const toneClass =
    tone === "extracted"
      ? "text-sky-200"
      : tone === "suggested"
        ? "text-amber-200"
        : "text-rose-200";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${toneClass}`}>{tag}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold leading-6 text-white/90">{value}</div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  label,
  subtitle,
}: {
  icon: ActivityIcon;
  label: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">{label}</div>
        <div className="mt-1 break-words text-2xl font-bold">{subtitle}</div>
      </div>
    </div>
  );
}

function TraceableCard({
  title,
  body,
  confidence,
  sourceTrace,
  accentClass,
}: {
  title: string;
  body: string;
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
  accentClass: string;
}) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${accentClass}`}>
      <div className="break-words font-semibold">{title}</div>
      <div className="mt-2 leading-7 opacity-90">{body}</div>
      <TraceFooter confidence={confidence} sourceTrace={sourceTrace} />
    </div>
  );
}

function TraceFooter({
  confidence,
  sourceTrace,
}: {
  confidence?: ConfidenceLevel;
  sourceTrace?: SourceTraceItem[];
}) {
  const traceItems = sourceTrace || [];
  const hasTrace = traceItems.length > 0;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {confidence ? <ConfidenceBadge level={confidence} /> : null}
          <span className="text-xs text-white/52">
            Derived from:{" "}
            {hasTrace
              ? `${traceItems.length} source${traceItems.length > 1 ? "s" : ""}`
              : "source not attached"}
          </span>
        </div>
        {hasTrace ? <span className="text-xs font-semibold text-[#b8dcff]">View source</span> : null}
      </div>
      {hasTrace ? (
        <details className="mt-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[#b8dcff]">
            Open source trace
          </summary>
          <div className="mt-3 space-y-3">
            {traceItems.map((item, index) => (
              <div
                key={`${item.sectionId}-${item.sectionTitle}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-[#88c4ff]">
                  {item.sectionId}. {item.sectionTitle}
                </div>
                <div className="mt-2 text-sm leading-7 text-white/82">"{item.snippet}"</div>
                {item.reasoning ? (
                  <div className="mt-2 text-sm leading-7 text-white/62">Why: {item.reasoning}</div>
                ) : null}
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const styles = {
    high: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
    medium: "border-amber-400/20 bg-amber-500/10 text-amber-200",
    low: "border-rose-400/20 bg-rose-500/10 text-rose-200",
  } as const;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles[level]}`}
    >
      {level}
    </span>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/65">
      {text}
    </div>
  );
}

function TaskDisclosure({
  title,
  description,
  columnTitle,
  items,
}: {
  title: string;
  description: string;
  columnTitle: string;
  items: Array<{
    title: string;
    detail: string;
    status: string;
    clause_source_title: string;
    clause_source_text: string;
    why_matters: string;
    risk_if_missed: string;
    confidence?: ConfidenceLevel;
    sourceTrace?: SourceTraceItem[];
  }>;
}) {
  return (
    <details className="group">
      <summary className="list-none">
        <Surface>
          <div className="flex items-center justify-between gap-3">
            <div>
              <HeaderTag label="Suggested" tone="suggested" />
              <div className="mt-3 text-2xl font-bold">{title}</div>
              <div className="mt-2 text-sm text-white/65">{description}</div>
            </div>
            <div className="text-sm font-semibold text-[#b8dcff] group-open:hidden">Open</div>
            <div className="hidden text-sm font-semibold text-[#b8dcff] group-open:block">Close</div>
          </div>
        </Surface>
      </summary>
      <div className="mt-4">
        <TaskColumn title={columnTitle} items={items} />
      </div>
    </details>
  );
}

function TaskColumn({
  title,
  items,
}: {
  title: string;
  items: Array<{
    title: string;
    detail: string;
    status: string;
    clause_source_title: string;
    clause_source_text: string;
    why_matters: string;
    risk_if_missed: string;
    confidence?: ConfidenceLevel;
    sourceTrace?: SourceTraceItem[];
  }>;
}) {
  return (
    <Surface>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        <HeaderTag label="Suggested" tone="suggested" />
      </div>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? <EmptyBox text="No tasks returned for this section." /> : null}
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="break-words font-semibold">{item.title}</div>
              <StatusPill status={item.status} />
            </div>
            <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">Why this matters</div>
              <div className="mt-2 text-sm leading-7 text-white/78">{item.why_matters}</div>
            </div>
            <TraceFooter confidence={item.confidence} sourceTrace={item.sourceTrace} />
            <details className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[#b8dcff]">
                Show clause source
              </summary>
              <div className="mt-4 grid gap-3 text-sm text-white/72">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">Clause source</div>
                  <div className="mt-2 break-words font-semibold text-white/88">{item.clause_source_title}</div>
                  <div className="mt-1 leading-7">{item.clause_source_text}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">Risk if missed</div>
                  <div className="mt-2 leading-7">{item.risk_if_missed}</div>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function EvidenceVaultPanel({
  className = "",
  voyageScopeKey,
  onEntriesChanged,
}: {
  className?: string;
  voyageScopeKey: string;
  onEntriesChanged?: () => void;
}) {
  const inputId = useId();
  const [uploaderRole, setUploaderRole] = useState<"Owner" | "Charterer" | "Agent">("Owner");
  const [documentType, setDocumentType] = useState<EvidenceType>("Invoice");
  const [entries, setEntries] = useState<VaultEntry[]>(() => loadVaultEntries());
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setEntries(loadVaultEntries());
  }, [voyageScopeKey]);

  async function registerFiles(files: FileList | File[]) {
    const nextEntries = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`,
        fileName: file.name,
        timestamp: formatVaultTimestamp(new Date()),
        uploaderRole,
        documentType,
        fileUrl: await readFileAsDataUrl(file),
      })),
    );

    setEntries((current) => {
      const merged = [...nextEntries, ...current];
      saveVaultEntries(merged);
      onEntriesChanged?.();
      return merged;
    });
  }

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;
    await registerFiles(files);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!event.dataTransfer.files?.length) return;
    await registerFiles(event.dataTransfer.files);
  }

  return (
    <div className={className}>
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <HeaderTag label="Manual upload" tone="mixed" />
            <div className="mt-3 text-xl font-bold">Evidence Vault (Manual Upload)</div>
            <div className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
              Files stay off-chain at this stage. The system records only file name, uploader role, evidence type, and timestamp.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/60">
            Accepted: PDF, JPG, PNG
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Uploader role</div>
            <div className="mt-3 space-y-2">
              {(["Owner", "Charterer", "Agent"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUploaderRole(role)}
                  className={[
                    "block w-full rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition",
                    uploaderRole === role
                      ? "border-[#4f97e8]/35 bg-[#3373B7] text-white"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45">Evidence type</div>
            <select
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value as EvidenceType)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"
            >
              {evidenceTypeOptions.map((option) => (
                <option key={option} value={option} className="bg-white text-slate-900">
                  {option}
                </option>
              ))}
            </select>

            <div className="mt-5">
              <input
                id={inputId}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor={inputId}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={[
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border px-5 py-8 text-center transition",
                  isDragging ? "border-[#4f97e8]/40 bg-[#3373B7]/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                ].join(" ")}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold text-white/90">
                  {isDragging ? "Drop document here" : "Upload document"}
                </div>
                <div className="mt-2 text-sm leading-7 text-white/60">
                  Click to attach or drag and drop a file. No OCR, no parsing, no text extraction.
                </div>
              </label>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Vault log</div>
            <div className="mt-4 space-y-3">
              {entries.length === 0 ? (
                <EmptyBox text="No manually uploaded evidence has been logged yet." />
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0 font-semibold text-white/90">{entry.fileName}</div>
                      <button
                        type="button"
                        onClick={() => window.open(entry.fileUrl, "_blank", "noopener,noreferrer")}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/[0.06]"
                      >
                        View
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/58">
                      <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-sky-200">
                        {entry.uploaderRole}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/70">
                        {entry.documentType}
                      </span>
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDocumentStatus(
  status: "uploaded" | "missing" | "awaiting_review" | "draft_only" | "confirmed",
) {
  switch (status) {
    case "uploaded":
      return "Uploaded";
    case "missing":
      return "Missing";
    case "awaiting_review":
      return "Awaiting review";
    case "draft_only":
      return "Draft only";
    case "confirmed":
      return "Confirmed";
  }
}

function formatTimingImpact(impact: "banking" | "port_ops" | "docs" | "customs") {
  switch (impact) {
    case "banking":
      return "May affect banking days and payment timing.";
    case "port_ops":
      return "Port operations or local working hours may vary.";
    case "docs":
      return "Documentation flow may slow locally.";
    case "customs":
      return "Customs or clearance handling may take longer.";
  }
}

function normalizeCaution(note: string | GeneratedCaution, index: number): GeneratedCaution {
  if (typeof note === "string") {
    return {
      title: `Suggested caution ${index + 1}`,
      body: note,
    };
  }

  return note;
}

function loadVaultEntries(): VaultEntry[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(getEvidenceVaultStorageKey());
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Array<
      VaultEntry & { evidenceType?: EvidenceType; documentType?: EvidenceType }
    >;

    return parsed.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      timestamp: item.timestamp,
      uploaderRole: item.uploaderRole,
      documentType: item.documentType ?? item.evidenceType ?? "Invoice",
      fileUrl: item.fileUrl,
    }));
  } catch {
    return [];
  }
}

function saveVaultEntries(entries: VaultEntry[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(getEvidenceVaultStorageKey(), JSON.stringify(entries));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatVaultTimestamp(date: Date) {
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart}, ${timePart} HRS`;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function deriveInitialOpeningMode(
  draft: SettlementDraft,
  seed: ReturnType<typeof deriveSettlementSeedContext>,
): SettlementOpeningMode {
  if (draft.openingMode === "manual-review") return "manual-review";
  return seed.disputeDetected ? "generated-signal" : "manual-review";
}

function deriveInitialReasonKey(
  draft: SettlementDraft,
  seed: ReturnType<typeof deriveSettlementSeedContext>,
): DisputeReasonKey {
  return draft.reasonKey ?? seed.reasonKey;
}

function deriveInitialClaimSide(
  draft: SettlementDraft,
  seed: ReturnType<typeof deriveSettlementSeedContext>,
): ClaimPartyRole {
  return draft.claimSide ?? seed.claimSide;
}

type ActivityIcon =
  | typeof AlertTriangle
  | typeof ArrowRightLeft
  | typeof Clock3
  | typeof FileSearch
  | typeof FileStack
  | typeof Mail
  | typeof TriangleAlert;
