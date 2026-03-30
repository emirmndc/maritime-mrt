import { useEffect, useId, useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import { ArrowRightLeft, Upload } from "lucide-react";
import { AppShell, Surface } from "./ui";
import { loadGeneratedVoyage } from "./generatedVoyage";
import { navigateTo } from "./router";
import {
  deriveDisputedAmount,
  deriveSettlementSeedContext,
  disputeReasonCatalog,
  getClaimSideConstraint,
  getCurrentVoyageScopeKey,
  getDisputeReasonLabel,
  getEvidenceRequirements,
  getEvidenceVaultStorageKey,
  getSettlementPartyModel,
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
  const [roleView, setRoleView] = useState<"owner" | "charterer">("owner");

  const summaryRoute =
    generated?.route || `${generated?.loadport || "Unknown"} > ${generated?.disport || "Unknown"}`;
  const vaultDocuments = useMemo(() => loadEvidenceVaultDocuments(), [vaultVersion, voyageScopeKey]);
  const currentSettlement = useMemo(() => loadSettlementDraft(), [vaultVersion, voyageScopeKey]);
  const settlementSeed = useMemo(() => deriveSettlementSeedContext(vaultDocuments), [vaultDocuments]);
  const defaultDueDate = generated?.next_deadline || generated?.claim_deadline || "";

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
    () => currentSettlement.customReason || (settlementSeed.reasonKey === "custom" ? settlementSeed.summary : ""),
  );
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    () => currentSettlement.evidenceIds.length > 0 ? currentSettlement.evidenceIds : settlementSeed.evidenceIds,
  );
  const [amountsNeedReconfirm, setAmountsNeedReconfirm] = useState(false);
  const [amountReconfirmProgress, setAmountReconfirmProgress] = useState({ claimed: false, admitted: false });

  const suggestedEvidenceIds = useMemo(() => getSuggestedEvidenceIds(reasonKey, vaultDocuments), [reasonKey, vaultDocuments]);
  const claimSideConstraint = useMemo(() => getClaimSideConstraint(reasonKey), [reasonKey]);
  const effectiveOpeningMode =
    openingMode === "generated-signal" && !settlementSeed.disputeDetected ? "manual-review" : openingMode;
  const selectedEvidence = useMemo(
    () => vaultDocuments.filter((item) => selectedEvidenceIds.includes(item.id)),
    [vaultDocuments, selectedEvidenceIds],
  );
  const requirementChecks = useMemo(
    () =>
      getEvidenceRequirements(reasonKey).map((requirement) => ({
        ...requirement,
        satisfied: selectedEvidence.some((document) => requirement.anyOf.includes(document.type)),
      })),
    [reasonKey, selectedEvidence],
  );
  const missingRequirementLabels = useMemo(
    () => requirementChecks.filter((item) => !item.satisfied).map((item) => item.label),
    [requirementChecks],
  );
  const disputedAmount = useMemo(() => deriveDisputedAmount(claimedAmount, admittedAmount), [admittedAmount, claimedAmount]);
  const blockedDocuments = useMemo(
    () => (generated?.documents || []).filter((item) => item.status !== "uploaded" && item.status !== "confirmed"),
    [generated],
  );
  const partyModel = useMemo(() => getSettlementPartyModel(claimSide, reasonKey), [claimSide, reasonKey]);
  const activeRoleTasks = useMemo(() => {
    if (!generated) return [];
    return roleView === "owner" ? generated.owner_tasks : generated.charterer_tasks;
  }, [generated, roleView]);
  const disputeIssues = useMemo(
    () => buildDisputeIssues(amountsNeedReconfirm, claimedAmount, admittedAmount, disputedAmount, dueDate, reasonKey, customReason, selectedEvidenceIds.length, missingRequirementLabels),
    [admittedAmount, amountsNeedReconfirm, claimedAmount, customReason, disputedAmount, dueDate, missingRequirementLabels, reasonKey, selectedEvidenceIds.length],
  );

  useEffect(() => {
    if (openingMode === "generated-signal" && !settlementSeed.disputeDetected) setOpeningMode("manual-review");
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
    setCustomReason(nextDraft.customReason || (nextSeed.reasonKey === "custom" ? nextSeed.summary : ""));
    setSelectedEvidenceIds(nextDraft.evidenceIds.length > 0 ? nextDraft.evidenceIds : nextSeed.evidenceIds);
    setAmountsNeedReconfirm(false);
    setAmountReconfirmProgress({ claimed: false, admitted: false });
    setRoleView(nextDraft.claimSide === "Charterer" ? "charterer" : "owner");
  }, [voyageScopeKey, defaultDueDate]);

  useEffect(() => {
    if (selectedEvidenceIds.length === 0 && suggestedEvidenceIds.length > 0) setSelectedEvidenceIds(suggestedEvidenceIds);
  }, [selectedEvidenceIds.length, suggestedEvidenceIds]);

  useEffect(() => {
    if (claimSideConstraint && claimSide !== claimSideConstraint.lockedSide) setClaimSide(claimSideConstraint.lockedSide);
  }, [claimSide, claimSideConstraint]);

  useEffect(() => {
    if (amountsNeedReconfirm && amountReconfirmProgress.claimed && amountReconfirmProgress.admitted) setAmountsNeedReconfirm(false);
  }, [amountReconfirmProgress, amountsNeedReconfirm]);

  function applyReasonSelection(nextReason: DisputeReasonKey, requireAmountRetype: boolean) {
    const reasonChanged = nextReason !== reasonKey;
    const nextClaimSideConstraint = getClaimSideConstraint(nextReason);
    setReasonKey(nextReason);
    setClaimSide(nextClaimSideConstraint?.lockedSide ?? getSuggestedClaimSide(nextReason, vaultDocuments));
    setSelectedEvidenceIds(getSuggestedEvidenceIds(nextReason, vaultDocuments));

    if (requireAmountRetype && reasonChanged && (claimedAmount > 0 || admittedAmount > 0)) {
      setAmountsNeedReconfirm(true);
      setAmountReconfirmProgress({ claimed: false, admitted: false });
      return;
    }

    setAmountsNeedReconfirm(false);
    setAmountReconfirmProgress({ claimed: false, admitted: false });
  }

  function handleOpenDisputePackage() {
    if (disputeIssues.length > 0) return;

    const draft: SettlementDraft = {
      id: currentSettlement.id || "settlement-a102",
      title:
        reasonKey === "port_cost_difference"
          ? `Port Cost Case File - ${summaryRoute}`
          : `Dispute Case File - ${summaryRoute}`,
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
      <AppShell eyebrow="Case Review" title="No generated case is available yet." description="Generate one recap-driven case first. This screen only opens after a recap is parsed.">
        <Surface>
          <div className="text-sm text-white/66">No voyage case is stored in this session yet.</div>
          <button type="button" onClick={() => navigateTo("/app/try-demo")} className="mt-6 inline-flex items-center gap-2 border border-[#567189] bg-[#51697f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c768d]">
            Open Try Demo
          </button>
        </Surface>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Case Review"
      title={reasonKey === "port_cost_difference" ? "Port Cost Vault review" : "Dispute case review"}
      description="The default surface stays narrow: case brief, dispute worksheet, case file, and controlled evidence intake."
    >
      <Surface>
        <SectionTitle eyebrow="Case brief" title={summaryRoute} description={generated.commercial_risk || settlementSeed.summary} />
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="border border-white/8 bg-[#0d141c] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">Operational reading</div>
            <div className="mt-4 grid gap-3">
              <RecordRow label="Workflow posture" value={reasonKey === "port_cost_difference" ? "Port Cost Vault-first proof" : "General dispute review"} />
              <RecordRow label="Owner" value={generated.owner || "Pending review"} />
              <RecordRow label="Charterer" value={generated.charterer || "Pending review"} />
              <RecordRow label="Cargo" value={generated.cargo || "Pending review"} />
              <RecordRow label="Commercial issue" value={getDisputeReasonLabel(reasonKey).labelEn} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(generated.parser_summary || []).slice(0, 6).map((item) => (
                <MiniField key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="border border-white/8 bg-[#0d141c] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">What is missing</div>
              <div className="mt-4 grid gap-2">
                {blockedDocuments.length > 0 ? (
                  blockedDocuments.slice(0, 4).map((item) => (
                    <NoticeRow key={item.title} tone="warning" text={`${item.title} - ${formatDocumentStatus(item.status)}`} />
                  ))
                ) : (
                  <NoticeRow tone="ok" text="No recap-side blocking item is currently flagged." />
                )}
              </div>
            </div>

            <div className="border border-white/8 bg-[#0d141c] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">Next case step</div>
              <div className="mt-4 text-sm leading-7 text-white/72">
                {disputeIssues[0] ?? "Open settlement package once the worksheet and evidence pack are coherent."}
              </div>
            </div>
          </div>
        </div>
      </Surface>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface>
          <SectionTitle eyebrow="Dispute worksheet" title="Quantify only what can be defended" description="Claimed amount, admitted amount, claim side, reason, and evidence readiness stay central. Everything else is secondary." />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/72">
              <span>Dispute reason</span>
              <select value={reasonKey} onChange={(event) => applyReasonSelection(event.target.value as DisputeReasonKey, true)} className="border border-white/8 bg-[#0d141c] px-4 py-3 text-sm text-white outline-none">
                {disputeReasonCatalog.map((reason) => (
                  <option key={reason.key} value={reason.key} className="bg-[#0d141c] text-white">
                    {reason.labelEn}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-white/72">
              <span>Due date / payment deadline</span>
              <input value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="border border-white/8 bg-[#0d141c] px-4 py-3 text-white outline-none" />
            </label>
            <label className="grid gap-2 text-sm text-white/72">
              <span>Claimed exposure</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={claimedAmount}
                onChange={(event) => {
                  setClaimedAmount(Number(event.target.value) || 0);
                  if (amountsNeedReconfirm) setAmountReconfirmProgress((current) => ({ ...current, claimed: true }));
                }}
                className="border border-white/8 bg-[#0d141c] px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/72">
              <span>Admitted payable amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={admittedAmount}
                onChange={(event) => {
                  setAdmittedAmount(Number(event.target.value) || 0);
                  if (amountsNeedReconfirm) setAmountReconfirmProgress((current) => ({ ...current, admitted: true }));
                }}
                className="border border-white/8 bg-[#0d141c] px-4 py-3 text-white outline-none"
              />
            </label>
          </div>

          {amountsNeedReconfirm ? <div className="mt-4 border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">Retype both amount fields for the new reason basis before opening the package.</div> : null}

          <div className="mt-5">
            <div className="text-sm text-white/72">Claim side</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["Owner", "Charterer"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  disabled={Boolean(claimSideConstraint && role !== claimSideConstraint.lockedSide)}
                  onClick={() => {
                    setClaimSide(role);
                    setRoleView(role === "Owner" ? "owner" : "charterer");
                  }}
                  className={[
                    "border px-4 py-3 text-left transition",
                    claimSide === role ? "border-[#5f7890] bg-[#16202a] text-white" : "border-white/8 bg-[#0d141c] text-white/72 hover:bg-[#121a23]",
                    claimSideConstraint && role !== claimSideConstraint.lockedSide ? "cursor-not-allowed opacity-45" : "",
                  ].join(" ")}
                >
                  <div className="font-semibold">{role}</div>
                  <div className="mt-1 text-xs text-white/46">{role === "Owner" ? "Owner-led package" : "Charterer-led package"}</div>
                </button>
              ))}
            </div>
            {claimSideConstraint ? <div className="mt-3 border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">{claimSideConstraint.message}</div> : null}
          </div>

          {reasonKey === "custom" ? (
            <label className="mt-5 grid gap-2 text-sm text-white/72">
              <span>Custom dispute note</span>
              <textarea value={customReason} onChange={(event) => setCustomReason(event.target.value)} className="min-h-[110px] border border-white/8 bg-[#0d141c] px-4 py-3 text-white outline-none" />
            </label>
          ) : null}

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <AmountPanel label="Claimed" value={formatMoney(claimedAmount, settlementSeed.currency)} tone="neutral" />
            <AmountPanel label="Admitted" value={formatMoney(admittedAmount, settlementSeed.currency)} tone="ok" />
            <AmountPanel label="Disputed remainder" value={formatMoney(disputedAmount, settlementSeed.currency)} tone={disputedAmount > 0 ? "focus" : "warning"} />
          </div>

          <div className="mt-6 border border-white/8 bg-[#0d141c] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">Readiness gate</div>
            <div className="mt-4 grid gap-2">
              {disputeIssues.length > 0 ? disputeIssues.map((issue) => (
                <NoticeRow key={issue} tone="danger" text={issue} />
              )) : <NoticeRow tone="ok" text="Package is coherent and ready to open in settlement." />}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleOpenDisputePackage} disabled={disputeIssues.length > 0} className="inline-flex items-center gap-2 border border-[#567189] bg-[#51697f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c768d] disabled:cursor-not-allowed disabled:opacity-45">
              <ArrowRightLeft className="h-4 w-4" />
              Open settlement package
            </button>
            <button type="button" onClick={() => { setOpeningMode(settlementSeed.disputeDetected ? "generated-signal" : "manual-review"); applyReasonSelection(settlementSeed.reasonKey, false); setDueDate(defaultDueDate); setCustomReason(settlementSeed.reasonKey === "custom" ? settlementSeed.summary : ""); }} className="border border-white/10 bg-[#111821] px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/16 hover:bg-[#151d27]">
              Reset to suggestion
            </button>
          </div>
        </Surface>

        <Surface>
          <SectionTitle eyebrow="Case file" title={reasonKey === "port_cost_difference" ? "Exportable Port Cost file" : "Exportable dispute file"} description="The interface should read like a case package in preparation, not a generic dashboard." />
          <div className="mt-6 border border-white/8 bg-[#0d141c] p-5">
            <div className="grid gap-3">
              <RecordRow label="Claimant" value={`${partyModel.claimantRole} - ${partyModel.claimantName}`} />
              <RecordRow label="Respondent" value={`${partyModel.respondentRole} - ${partyModel.respondentName}`} />
              <RecordRow label="Payer" value={`${partyModel.payerRole} - ${partyModel.payerName}`} />
              <RecordRow label="Payee" value={`${partyModel.payeeRole} - ${partyModel.payeeName}`} />
              <RecordRow label="Reason" value={reasonKey === "custom" ? customReason.trim() || "Custom review note" : getDisputeReasonLabel(reasonKey).labelEn} />
              <RecordRow label="Current state" value={disputeIssues.length > 0 ? "Review blocked" : "Ready to open"} />
              <RecordRow label="Linked evidence" value={`${selectedEvidence.length} item(s)`} />
              <RecordRow label="Next procedural step" value={disputeIssues[0] ?? "Open settlement package"} />
            </div>
          </div>

          <div className="mt-5 border border-white/8 bg-[#0d141c] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">Event trail</div>
            <div className="mt-4 space-y-4">
              <TimelineLine label="Case opened from" value={effectiveOpeningMode === "manual-review" ? "Manual review path" : "Generated dispute signal"} />
              <TimelineLine label="Latest evidence event" value={selectedEvidence[0]?.uploadedAt ?? "No evidence linked"} />
              <TimelineLine label="Readiness state" value={disputeIssues.length > 0 ? "Blocked by review gate" : "Ready for settlement staging"} />
            </div>
          </div>
        </Surface>
      </div>

      <EvidenceVaultPanel
        className="mt-5"
        voyageScopeKey={voyageScopeKey}
        evidenceRequirements={requirementChecks.map((item) => ({ id: item.id, label: item.label, anyOf: item.anyOf, satisfied: item.satisfied }))}
        selectedEvidenceIds={selectedEvidenceIds}
        onToggleEvidence={(id) => setSelectedEvidenceIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
        onEntriesChanged={() => setVaultVersion((current) => current + 1)}
      />

      <details className="mt-5 border border-white/8 bg-[#0f161e] p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.22em] text-[#8eb9e7]">Secondary detail</summary>
        <div className="mt-5 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">Role-specific procedures</div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setRoleView("owner")} className={roleView === "owner" ? "border border-[#5f7890] bg-[#16202a] px-3 py-2 text-sm font-semibold text-white" : "border border-white/8 bg-[#0d141c] px-3 py-2 text-sm font-semibold text-white/70"}>Owner</button>
              <button type="button" onClick={() => setRoleView("charterer")} className={roleView === "charterer" ? "border border-[#5f7890] bg-[#16202a] px-3 py-2 text-sm font-semibold text-white" : "border border-white/8 bg-[#0d141c] px-3 py-2 text-sm font-semibold text-white/70"}>Charterer</button>
            </div>
            <div className="mt-4 border border-white/8 bg-[#0d141c] p-4">
              <div className="space-y-4">
                {activeRoleTasks.length > 0 ? activeRoleTasks.slice(0, 4).map((task) => (
                  <div key={task.title} className="border-t border-white/8 pt-4 first:border-t-0 first:pt-0">
                    <div className="text-sm font-semibold text-white">{task.title}</div>
                    <div className="mt-2 text-sm leading-7 text-white/64">{task.detail}</div>
                  </div>
                )) : <div className="text-sm text-white/60">No task detail is available for this role.</div>}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">Full extracted recap summary</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(generated.parser_summary || []).map((item) => (
                <MiniField key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>
        </div>
      </details>
    </AppShell>
  );
}

function EvidenceVaultPanel({
  className = "",
  voyageScopeKey,
  evidenceRequirements,
  selectedEvidenceIds,
  onToggleEvidence,
  onEntriesChanged,
}: {
  className?: string;
  voyageScopeKey: string;
  evidenceRequirements: Array<{ id: string; label: string; anyOf: EvidenceType[]; satisfied: boolean }>;
  selectedEvidenceIds: string[];
  onToggleEvidence: (id: string) => void;
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
    <Surface className={className}>
      <SectionTitle
        eyebrow="Evidence register"
        title="Controlled evidence intake"
        description="Structured intake, not a shared folder. Files stay voyage-scoped, typed, role-tagged, and explicitly included or excluded from the active package."
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          <div className="border border-white/8 bg-[#0d141c] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">
              Requirement map
            </div>
            <div className="mt-4 grid gap-2">
              {evidenceRequirements.length > 0 ? evidenceRequirements.map((item) => (
                <NoticeRow key={item.id} tone={item.satisfied ? "ok" : "warning"} text={`${item.label} - ${item.anyOf.join(" or ")}`} />
              )) : <NoticeRow tone="ok" text="Custom review selected. Requirement mapping is manual." />}
            </div>
          </div>

          <div className="border border-white/8 bg-[#0d141c] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">
              Intake controls
            </div>
            <div className="mt-4 grid gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                  Uploaded by
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Owner", "Charterer", "Agent"] as const).map((role) => (
                    <button key={role} type="button" onClick={() => setUploaderRole(role)} className={uploaderRole === role ? "border border-[#5f7890] bg-[#16202a] px-3 py-2 text-sm font-semibold text-white" : "border border-white/8 bg-[#111821] px-3 py-2 text-sm font-semibold text-white/70"}>
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <label className="grid gap-2 text-sm text-white/72">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                  Evidence type
                </span>
                <select value={documentType} onChange={(event) => setDocumentType(event.target.value as EvidenceType)} className="border border-white/8 bg-[#111821] px-4 py-3 text-sm text-white outline-none">
                  {evidenceTypeOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#111821] text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <input id={inputId} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={handleFileSelect} />
                <label
                  htmlFor={inputId}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={[
                    "flex min-h-[64px] cursor-pointer items-center justify-center gap-2 border px-4 py-3 text-sm font-semibold transition",
                    isDragging ? "border-[#5f7890] bg-[#16202a] text-white" : "border-white/10 bg-[#111821] text-white/80 hover:bg-[#151d27]",
                  ].join(" ")}
                >
                  <Upload className="h-4 w-4" />
                  Upload evidence file
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-white/8 bg-[#0d141c] p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/44">
              Evidence log
            </div>
            <div className="text-xs text-white/42">Accepted: PDF, JPG, PNG</div>
          </div>

          <div className="mt-4 space-y-4">
            {entries.length > 0 ? entries.map((entry) => {
              const isLinked = selectedEvidenceIds.includes(entry.id);
              const matchLabels = evidenceRequirements.filter((item) => item.anyOf.includes(entry.documentType)).map((item) => item.label);

              return (
                <div key={entry.id} className="grid gap-4 border-t border-white/8 pt-4 first:border-t-0 first:pt-0">
                  <div className="grid gap-3 lg:grid-cols-[1.25fr_0.95fr_0.95fr_auto] lg:items-start">
                    <div className="min-w-0">
                      <div className="break-words text-sm font-semibold text-white">{entry.fileName}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                        <span className="border border-white/10 bg-[#111821] px-2 py-1 text-white/70">{entry.uploaderRole}</span>
                        <span className="border border-white/10 bg-[#111821] px-2 py-1 text-white/70">{entry.documentType}</span>
                        <span className={matchLabels.length > 0 ? "border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-amber-100" : "border border-white/10 bg-[#111821] px-2 py-1 text-white/70"}>
                          {matchLabels[0] ?? "Supporting"}
                        </span>
                      </div>
                    </div>

                    <MiniField label="Timestamp" value={entry.timestamp} />
                    <MiniField label="Package state" value={isLinked ? "Included in case" : "Not included"} />

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <button type="button" onClick={() => window.open(entry.fileUrl, "_blank", "noopener,noreferrer")} className="border border-white/10 bg-[#111821] px-3 py-2 text-xs font-semibold text-white/78">
                        View
                      </button>
                      <button type="button" onClick={() => onToggleEvidence(entry.id)} className={isLinked ? "border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100" : "border border-white/10 bg-[#111821] px-3 py-2 text-xs font-semibold text-white/80"}>
                        {isLinked ? "Remove from case" : "Include in case"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : <div className="border border-dashed border-white/10 p-4 text-sm text-white/58">No voyage-scoped evidence has been uploaded yet.</div>}
          </div>
        </div>
      </div>

      <div className="mt-5 border border-white/8 bg-[#0d141c] p-4 text-sm leading-7 text-white/62">
        Files stay off-chain at this stage. The current proof records metadata and case linkage, not a live evidence network.
      </div>
    </Surface>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8eb9e7]">{eyebrow}</div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white md:text-[2rem]">{title}</div>
      <div className="mt-3 max-w-3xl text-sm leading-7 text-white/64">{description}</div>
    </div>
  );
}

function RecordRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-t border-white/8 pt-3 first:border-t-0 first:pt-0 md:grid-cols-[150px_1fr]">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="text-sm leading-7 text-white/82">{value}</div>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/8 bg-[#101922] p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{label}</div>
      <div className="mt-2 break-words text-sm leading-6 text-white/84">{value}</div>
    </div>
  );
}

function AmountPanel({ label, value, tone }: { label: string; value: string; tone: "neutral" | "ok" | "focus" | "warning" }) {
  const toneClass = {
    neutral: "border-white/8 bg-[#0d141c] text-white",
    ok: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
    focus: "border-sky-400/20 bg-sky-500/10 text-sky-100",
    warning: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  } as const;

  return (
    <div className={`border p-4 ${toneClass[tone]}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-72">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{value}</div>
    </div>
  );
}

function NoticeRow({ text, tone }: { text: string; tone: "ok" | "warning" | "danger" }) {
  const toneClass = {
    ok: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
    warning: "border-amber-400/20 bg-amber-500/10 text-amber-100",
    danger: "border-rose-400/20 bg-rose-500/10 text-rose-100",
  } as const;

  return <div className={`border px-4 py-3 text-sm ${toneClass[tone]}`}>{text}</div>;
}

function TimelineLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/8 pt-4 first:border-t-0 first:pt-0">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-2 text-sm leading-7 text-white/82">{value}</div>
    </div>
  );
}

function buildDisputeIssues(
  amountsNeedReconfirm: boolean,
  claimedAmount: number,
  admittedAmount: number,
  disputedAmount: number,
  dueDate: string,
  reasonKey: DisputeReasonKey,
  customReason: string,
  selectedEvidenceCount: number,
  missingRequirementLabels: string[],
) {
  const issues: string[] = [];
  if (amountsNeedReconfirm) issues.push("Retype both amount fields after changing the dispute reason.");
  if (claimedAmount <= 0) issues.push("Set the claimed exposure.");
  if (admittedAmount < 0) issues.push("Admitted payable amount cannot be negative.");
  if (admittedAmount > claimedAmount) issues.push("Admitted payable amount cannot exceed claimed amount.");
  if (disputedAmount <= 0) issues.push("A positive disputed remainder is required.");
  if (!dueDate.trim()) issues.push("Set a due date or payment deadline.");
  if (reasonKey === "custom" && !customReason.trim()) issues.push("Add a custom dispute note.");
  if (selectedEvidenceCount === 0) issues.push("Link at least one evidence item.");
  if (selectedEvidenceCount > 0 && missingRequirementLabels.length > 0) {
    issues.push(`Evidence still missing: ${missingRequirementLabels.join(", ")}.`);
  }
  return issues;
}

function loadVaultEntries(): VaultEntry[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(getEvidenceVaultStorageKey());
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Array<VaultEntry & { evidenceType?: EvidenceType; documentType?: EvidenceType }>;
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
  const datePart = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
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

function deriveInitialOpeningMode(draft: SettlementDraft, seed: ReturnType<typeof deriveSettlementSeedContext>): SettlementOpeningMode {
  if (draft.openingMode === "manual-review") return "manual-review";
  return seed.disputeDetected ? "generated-signal" : "manual-review";
}

function deriveInitialReasonKey(draft: SettlementDraft, seed: ReturnType<typeof deriveSettlementSeedContext>): DisputeReasonKey {
  return draft.reasonKey ?? seed.reasonKey;
}

function deriveInitialClaimSide(draft: SettlementDraft, seed: ReturnType<typeof deriveSettlementSeedContext>): ClaimPartyRole {
  return draft.claimSide ?? seed.claimSide;
}

function formatDocumentStatus(status: "uploaded" | "missing" | "awaiting_review" | "draft_only" | "confirmed") {
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
