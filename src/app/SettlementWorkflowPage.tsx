import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightLeft,
  CircleDollarSign,
  FileStack,
  Landmark,
  ShieldEllipsis,
} from "lucide-react";
import {
  getDisputeReasonLabel,
  loadEvidenceVaultDocuments,
  loadSettlementDraft,
  subscribeSettlementStore,
  type EvidenceVaultDocument,
  type SettlementDraft,
} from "./settlementStore";
import { AppShell, CTAButton, Surface } from "./ui";

type SettlementStatus =
  | "review_required"
  | "ready_to_split"
  | "disputed_portion_vaulted";

type SettlementSource = {
  draft: SettlementDraft;
  linkedEvidence: EvidenceVaultDocument[];
};

type SettlementView = {
  id: string;
  title: string;
  totalAmount: number;
  currency: string;
  undisputedAmount: number;
  disputedAmount: number;
  counterparty: string;
  dueDate: string;
  reason: string;
  status: SettlementStatus;
  initiatedBy: string;
};

type DisputedPortionVault = {
  id: string;
  amount: number;
  currency: string;
  reason: string;
  initiatedBy: string;
  createdAt: string;
  status: string;
  nextAction: string;
  evidenceRefs: EvidenceVaultDocument[];
};

type TimelineEvent = {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
};

export function SettlementWorkflowPage() {
  const [source, setSource] = useState<SettlementSource>(() => loadSettlementSource());
  const [finalizedSource, setFinalizedSource] = useState<SettlementSource | null>(null);
  const [vault, setVault] = useState<DisputedPortionVault | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() =>
    buildInitialTimeline(loadSettlementSource()),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (finalizedSource) return;

    const refreshSource = () => setSource(loadSettlementSource());
    const unsubscribe = subscribeSettlementStore(refreshSource);
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshSource();
      }
    };

    window.addEventListener("focus", refreshSource);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", refreshSource);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [finalizedSource]);

  const activeSource = finalizedSource ?? source;
  const settlement = useMemo(
    () => buildSettlementView(activeSource, Boolean(vault)),
    [activeSource, vault],
  );
  const settlementReady =
    settlement.disputedAmount > 0 && activeSource.linkedEvidence.length > 0;

  useEffect(() => {
    if (vault || finalizedSource) return;
    setTimeline(buildInitialTimeline(activeSource));
  }, [
    activeSource,
    finalizedSource,
    vault,
  ]);

  const breakdownRows = useMemo(
    () => [
      {
        label: "Total amount",
        amount: settlement.totalAmount,
        status: "Loaded from Generated Dashboard",
        tone: "border-white/10 bg-white/[0.03] text-white/88",
      },
      {
        label: "Undisputed portion",
        amount: settlement.undisputedAmount,
        status: vault
          ? "Released / payable"
          : settlementReady
            ? "Ready for release"
            : "Waiting for dashboard intake",
        tone: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
      },
      {
        label: "Disputed portion",
        amount: settlement.disputedAmount,
        status: vault
          ? "Isolated in vault"
          : settlement.disputedAmount > 0
            ? "Pending split confirmation"
            : "No disputed amount set",
        tone: "border-amber-400/20 bg-amber-500/10 text-amber-200",
      },
    ],
    [settlement, settlementReady, vault],
  );

  function handleSplitAndNeutralize() {
    const createdAt = formatNow();
    const eventBase = Date.now();
    const sourceSnapshot = activeSource;
    const settlementSnapshot = buildSettlementView(sourceSnapshot, false);

    setFinalizedSource(sourceSnapshot);
    setVault({
      id: `vault-${eventBase}`,
      amount: settlementSnapshot.disputedAmount,
      currency: settlementSnapshot.currency,
      reason: settlementSnapshot.reason,
      initiatedBy: settlementSnapshot.initiatedBy,
      createdAt,
      status: "Counterparty response pending",
      nextAction:
        "Monitor counterparty response while the disputed amount remains isolated.",
      evidenceRefs: sourceSnapshot.linkedEvidence,
    });
    setTimeline((current) => [
      {
        id: `evt-${eventBase}-1`,
        action: "Undisputed portion marked as payable",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      {
        id: `evt-${eventBase}-2`,
        action: "Disputed portion moved to vault",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      {
        id: `evt-${eventBase}-3`,
        action: "Counterparty response requested",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      ...current,
    ]);
    setIsModalOpen(false);
  }

  return (
    <AppShell
      eyebrow="Settlement Workflow"
      title="Split & Neutralize"
      description="Generated Dashboard is the source of truth for this workflow. The prepared dispute package flows into settlement, and only the disputed portion is isolated."
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="h-full">
          <WorkflowHeader settlement={settlement} />

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {breakdownRows.map((row) => (
              <div key={row.label} className={`rounded-2xl border p-4 ${row.tone}`}>
                <div className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                  {row.label}
                </div>
                <div className="mt-3 text-2xl font-bold">
                  {formatMoney(row.amount, settlement.currency)}
                </div>
                <div className="mt-3 text-sm">{row.status}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Counterparty" value={settlement.counterparty} />
            <InfoCard label="Due date" value={settlement.dueDate} />
            <InfoCard label="Reason" value={settlement.reason} />
            <InfoCard label="Status" value={getStatusLabel(settlement.status)} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.22em] text-[#88c4ff]">
              Default rule
            </div>
            <div className="mt-3 text-2xl font-bold">Deduction -&gt; Vault</div>
            <div className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
              If a paying party would otherwise delay the full amount, this workflow
              releases the undisputed portion and isolates only the disputed portion.
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-[#88c4ff]">
                  Source sync
                </div>
                <div className="mt-2 text-sm leading-7 text-white/70">
                  Reason, amounts, counterparty, and linked evidence are pulled directly
                  from Generated Dashboard intake.
                </div>
              </div>
              <CTAButton route="/app/generated-dashboard">
                Open Generated Dashboard
              </CTAButton>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={!settlementReady}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Split & Neutralize
            </button>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80">
              {getReadinessMessage(activeSource)}
            </div>
          </div>
        </Surface>

        <Surface className="h-full">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
              <ShieldEllipsis className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">
                Settlement thesis
              </div>
              <div className="mt-1 text-2xl font-bold">
                Only the disputed portion is neutralized
              </div>
              <div className="mt-2 text-sm text-white/65">
                This workflow narrows the issue instead of freezing the full payment.
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ThesisLine text="The full amount is not locked." />
            <ThesisLine text="The undisputed portion remains payable." />
            <ThesisLine text="The disputed portion is isolated in neutral custody." />
            <ThesisLine text="The workflow does not decide who is right." />
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">
              Intake overview
            </div>
            <div className="mt-4 grid gap-3">
              <InfoCard
                label="Linked evidence"
                value={`${activeSource.linkedEvidence.length} document(s)`}
              />
              <InfoCard label="Initiated by" value={settlement.initiatedBy} />
              <InfoCard
                label="Workflow scope"
                value="No legal decisioning. Split, vault, and audit trail only."
              />
            </div>
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface className="h-full">
          <PanelTitle
            icon={Landmark}
            eyebrow="Disputed Portion Vault"
            title={vault ? "Vault record created" : "No vault record yet"}
            description={
              vault
                ? "The disputed amount is isolated here while the undisputed amount remains payable."
                : "Complete the dashboard intake first, then confirm Split & Neutralize to create the vault record."
            }
          />

          {vault ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <InfoCard label="Amount" value={formatMoney(vault.amount, vault.currency)} />
              <InfoCard label="Status" value={vault.status} />
              <InfoCard label="Initiated by" value={vault.initiatedBy} />
              <InfoCard label="Created at" value={vault.createdAt} />
              <InfoCard label="Reason" value={vault.reason} />
              <InfoCard label="Next action" value={vault.nextAction} />
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/65">
              The vault remains empty until the disputed portion is confirmed.
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">
              Evidence references
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {activeSource.linkedEvidence.length > 0 ? (
                activeSource.linkedEvidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-3"
                  >
                    <div className="break-words text-sm font-semibold text-sky-100">
                      {item.name}
                    </div>
                    <div className="mt-2 text-xs leading-6 text-sky-200/80">
                      {item.type} - {item.uploaderRole} - {item.uploadedAt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/55">
                  No evidence linked yet. Use Generated Dashboard to attach evidence
                  first.
                </div>
              )}
            </div>
          </div>
        </Surface>

        <Surface className="h-full">
          <PanelTitle
            icon={FileStack}
            eyebrow="Timeline"
            title="Settlement activity log"
            description="Audit-oriented event trail. No legal decisioning, only workflow state changes."
          />

          <div className="mt-5 space-y-3">
            {timeline.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 break-words font-semibold text-white/90">
                    {event.action}
                  </div>
                  <div className="shrink-0 text-xs text-[#88c4ff]">
                    {event.timestamp}
                  </div>
                </div>
                <div className="mt-2 text-sm text-white/65">Actor: {event.actor}</div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      {isModalOpen ? (
        <SplitNeutralizeModal
          settlement={settlement}
          evidence={activeSource.linkedEvidence}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSplitAndNeutralize}
        />
      ) : null}
    </AppShell>
  );
}

function WorkflowHeader({ settlement }: { settlement: SettlementView }) {
  return (
    <div>
      <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
        Settlement workflow
      </div>
      <h2 className="mt-4 break-words text-3xl font-bold">{settlement.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
        This workflow does not freeze the full amount, does not decide who is
        right, and does not replace arbitration. It narrows the operational
        dispute to the amount actually under challenge.
      </p>
    </div>
  );
}

function PanelTitle({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof Landmark | typeof FileStack;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">
          {eyebrow}
        </div>
        <div className="mt-1 break-words text-2xl font-bold">{title}</div>
        <div className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
          {description}
        </div>
      </div>
    </div>
  );
}

function ThesisLine({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
      {text}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold leading-7 text-white/90">
        {value}
      </div>
    </div>
  );
}

function SplitNeutralizeModal({
  settlement,
  evidence,
  onClose,
  onConfirm,
}: {
  settlement: SettlementView;
  evidence: EvidenceVaultDocument[];
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#07101b] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
              Split & Neutralize
            </div>
            <div className="mt-4 text-3xl font-bold">Confirm payment split</div>
            <div className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
              The full amount will not be frozen. The undisputed portion will be
              marked as payable, and only the disputed portion will move into the
              vault workflow.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/75"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            label="Total"
            value={formatMoney(settlement.totalAmount, settlement.currency)}
          />
          <InfoCard
            label="Undisputed"
            value={formatMoney(settlement.undisputedAmount, settlement.currency)}
          />
          <InfoCard
            label="Disputed"
            value={formatMoney(settlement.disputedAmount, settlement.currency)}
          />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">
              Settlement source
            </div>

            <div className="mt-4 rounded-2xl border border-[#4f97e8]/25 bg-[#3373B7]/10 px-4 py-4">
              <div className="font-semibold text-white">{settlement.reason}</div>
              <div className="mt-2 text-sm text-white/68">
                Prepared from Generated Dashboard intake.
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <InfoCard label="Counterparty" value={settlement.counterparty} />
              <InfoCard label="Initiated by" value={settlement.initiatedBy} />
              <InfoCard
                label="Evidence count"
                value={`${evidence.length} document(s)`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">
              Evidence references
            </div>
            <div className="mt-4 grid gap-2">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
                >
                  <div className="break-words text-sm font-semibold text-white/92">
                    {item.name}
                  </div>
                  <div className="mt-1 text-xs leading-6 text-white/62">
                    {item.type} - {item.uploaderRole} - {item.uploadedAt}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                Summary
              </div>
              <div className="mt-3 space-y-2 text-sm leading-7 text-white/78">
                <div>Undisputed portion -&gt; released / payable</div>
                <div>Disputed portion -&gt; neutral vault record</div>
                <div>Counterparty -&gt; notified through workflow timeline</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px]"
          >
            Confirm split
            <CircleDollarSign className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function loadSettlementSource(): SettlementSource {
  const draft = loadSettlementDraft();
  const linkedEvidence = loadEvidenceVaultDocuments().filter((item) =>
    draft.evidenceIds.includes(item.id),
  );

  return { draft, linkedEvidence };
}

function buildSettlementView(
  source: SettlementSource,
  isVaulted: boolean,
): SettlementView {
  const reasonLabel = getDisputeReasonLabel(source.draft.reasonKey);
  const reason =
    source.draft.reasonKey === "custom"
      ? source.draft.customReason.trim() || "Custom review note"
      : reasonLabel.labelEn;

  return {
    id: source.draft.id,
    title: source.draft.title,
    totalAmount: source.draft.totalAmount,
    currency: source.draft.currency,
    undisputedAmount: Math.max(
      source.draft.totalAmount - source.draft.disputedAmount,
      0,
    ),
    disputedAmount: source.draft.disputedAmount,
    counterparty: source.draft.counterparty || "Pending confirmation",
    dueDate: source.draft.dueDate || "Pending confirmation",
    reason,
    status: getSettlementStatus(source, isVaulted),
    initiatedBy: source.draft.initiatedBy || "Generated Dashboard",
  };
}

function buildInitialTimeline(source: SettlementSource): TimelineEvent[] {
  const timestamp = source.linkedEvidence[0]?.uploadedAt ?? formatNow();

  return [
    {
      id: "evt-intake",
      action: "Settlement intake synced from Generated Dashboard",
      timestamp,
      actor: "Generated Dashboard",
    },
    {
      id: "evt-evidence",
      action:
        source.linkedEvidence.length > 0
          ? `${source.linkedEvidence.length} evidence item(s) linked from dashboard vault`
          : "Waiting for linked evidence from Generated Dashboard",
      timestamp,
      actor: "Generated Dashboard",
    },
  ];
}

function getSettlementStatus(
  source: SettlementSource,
  isVaulted: boolean,
): SettlementStatus {
  if (isVaulted) return "disputed_portion_vaulted";
  if (source.draft.disputedAmount <= 0 || source.linkedEvidence.length === 0) {
    return "review_required";
  }
  return "ready_to_split";
}

function getReadinessMessage(source: SettlementSource) {
  if (source.draft.disputedAmount <= 0) {
    return "Set a disputed amount in Generated Dashboard first";
  }
  if (source.linkedEvidence.length === 0) {
    return "Link evidence in Generated Dashboard first";
  }
  return "Ready to proceed";
}

function getStatusLabel(status: SettlementStatus) {
  switch (status) {
    case "review_required":
      return "Review required";
    case "ready_to_split":
      return "Ready to split";
    case "disputed_portion_vaulted":
      return "Disputed portion vaulted";
    default:
      return status;
  }
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNow() {
  const now = new Date();
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return `${datePart}, ${timePart} HRS`;
}
