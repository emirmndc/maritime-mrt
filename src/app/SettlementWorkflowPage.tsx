import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  CircleDollarSign,
  FileStack,
  Landmark,
  ShieldEllipsis,
} from "lucide-react";
import { AppShell, CTAButton, Surface } from "./ui";

const EVIDENCE_VAULT_STORAGE_KEY = "mrt-evidence-vault";

type SettlementStatus =
  | "Review required"
  | "Ready to split"
  | "Undisputed released"
  | "Disputed portion vaulted";

type UploadedEvidenceRef = {
  id: string;
  fileName: string;
  timestamp: string;
  uploaderRole: "Owner" | "Charterer" | "Agent";
  documentType:
    | "Invoice"
    | "SOF"
    | "CP clause"
    | "Email"
    | "PDA / FDA"
    | "Recap"
    | "Port document";
  fileUrl: string;
};

type SettlementItem = {
  id: string;
  title: string;
  totalAmount: number;
  currency: string;
  undisputedAmount: number;
  disputedAmount: number;
  counterparty: string;
  dueDate: string;
  reason: string;
  evidenceRefs: string[];
  status: SettlementStatus;
};

type DisputedPortionVault = {
  id: string;
  amount: number;
  currency: string;
  reason: string;
  initiatedBy: string;
  createdAt: string;
  status: "Open" | "Counterparty response pending" | "Under discussion" | "Resolved";
  nextAction: string;
  evidenceRefs: UploadedEvidenceRef[];
};

type TimelineEvent = {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
};

const reasonOptions = [
  "Port cost difference",
  "Invoice mismatch",
  "Off-hire deduction",
  "Bunker difference",
  "Freight shortfall",
  "Laytime / demurrage difference",
  "Custom",
] as const;

const initialSettlement: SettlementItem = {
  id: "settlement-a102",
  title: "Freight Payment - Voyage #A102",
  totalAmount: 1000000,
  currency: "USD",
  undisputedAmount: 990000,
  disputedAmount: 10000,
  counterparty: "Bluewake Shipping",
  dueDate: "28 Mar 2026",
  reason: "Port cost difference",
  evidenceRefs: [],
  status: "Ready to split",
};

const initialTimeline: TimelineEvent[] = [
  {
    id: "evt-1",
    action: "Settlement opened",
    timestamp: "28 Mar 2026, 09:10 HRS",
    actor: "Charterer ops",
  },
  {
    id: "evt-2",
    action: "Payment difference flagged for review",
    timestamp: "28 Mar 2026, 09:35 HRS",
    actor: "Charterer finance",
  },
];

function loadUploadedEvidenceRefs(): UploadedEvidenceRef[] {
  if (typeof window === "undefined") return [];

  const raw = sessionStorage.getItem(EVIDENCE_VAULT_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as UploadedEvidenceRef[];
  } catch {
    return [];
  }
}

export function SettlementWorkflowPage() {
  const [settlement, setSettlement] = useState<SettlementItem>(initialSettlement);
  const [vault, setVault] = useState<DisputedPortionVault | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] =
    useState<(typeof reasonOptions)[number]>("Port cost difference");
  const [customReason, setCustomReason] = useState("");

  const uploadedEvidence = useMemo(() => loadUploadedEvidenceRefs(), []);

  const resolvedReason =
    selectedReason === "Custom" ? customReason.trim() || "Custom review note" : selectedReason;

  const breakdownRows = useMemo(
    () => [
      {
        label: "Total amount",
        amount: settlement.totalAmount,
        status: "In review",
        tone: "border-white/10 bg-white/[0.03] text-white/88",
      },
      {
        label: "Undisputed portion",
        amount: settlement.undisputedAmount,
        status: vault ? "Released / payable" : "Ready for release",
        tone: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
      },
      {
        label: "Disputed portion",
        amount: settlement.disputedAmount,
        status: vault ? "Vaulted" : "Awaiting neutralization",
        tone: "border-amber-400/20 bg-amber-500/10 text-amber-200",
      },
    ],
    [settlement, vault],
  );

  const handleSplitAndNeutralize = () => {
    const createdAt = formatNow();
    const vaultRecord: DisputedPortionVault = {
      id: `vault-${Date.now()}`,
      amount: settlement.disputedAmount,
      currency: settlement.currency,
      reason: resolvedReason,
      initiatedBy: "Charterer",
      createdAt,
      status: "Counterparty response pending",
      nextAction: "Counterparty response awaited before negotiation window closes.",
      evidenceRefs: uploadedEvidence,
    };

    setSettlement((current) => ({
      ...current,
      reason: resolvedReason,
      evidenceRefs: uploadedEvidence.map((item) => item.fileName),
      status: "Disputed portion vaulted",
    }));

    setVault(vaultRecord);
    setTimeline((current) => [
      {
        id: `evt-${Date.now()}-1`,
        action: "Undisputed portion released",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      {
        id: `evt-${Date.now()}-2`,
        action: "Disputed portion moved to vault",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      {
        id: `evt-${Date.now()}-3`,
        action: "Counterparty response awaited",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      ...current,
    ]);

    setIsModalOpen(false);
  };

  return (
    <AppShell
      eyebrow="Settlement Workflow"
      title="Split & Neutralize"
      description="Small disputes should not freeze the full payment. The undisputed portion flows. Only the disputed portion is isolated."
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="h-full">
          <WorkflowHeader settlement={settlement} />

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {breakdownRows.map((row) => (
              <div key={row.label} className={`rounded-2xl border p-4 ${row.tone}`}>
                <div className="text-xs uppercase tracking-[0.2em] opacity-70">{row.label}</div>
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
            <InfoCard label="Current reason" value={settlement.reason} />
            <InfoCard label="Status" value={settlement.status} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.22em] text-[#88c4ff]">Default rule</div>
            <div className="mt-3 text-2xl font-bold">Deduction -&gt; Vault</div>
            <div className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
              If a paying party would otherwise delay or hold the full amount, the workflow proposes
              a narrower move: release the undisputed portion and isolate only the disputed portion in
              a neutral vault.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px]"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Split & Neutralize
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80"
            >
              Counterparty response awaited
            </button>
          </div>
        </Surface>

        <Surface className="h-full">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
              <ShieldEllipsis className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Settlement thesis</div>
              <div className="mt-1 break-words text-2xl font-bold">Only the disputed portion is neutralized</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ThesisLine text="The full amount is not locked." />
            <ThesisLine text="The undisputed portion remains payable." />
            <ThesisLine text="The disputed portion is isolated in neutral custody." />
            <ThesisLine text="The workflow does not decide who is right." />
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
                ? "Only the disputed amount is isolated here while the undisputed amount remains released / payable."
                : "Use Split & Neutralize to create a vault record for the disputed portion."
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
              Vault remains empty until a disputed portion is isolated.
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Evidence references</div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {uploadedEvidence.length > 0 ? (
                uploadedEvidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-3"
                  >
                    <div className="break-words text-sm font-semibold text-sky-100">
                      {item.fileName}
                    </div>
                    <div className="mt-2 text-xs leading-6 text-sky-200/80">
                      {item.documentType} • {item.uploaderRole} • {item.timestamp}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/55">
                  No uploaded evidence found in generated dashboard.
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
                  <div className="min-w-0 break-words font-semibold text-white/90">{event.action}</div>
                  <div className="shrink-0 text-xs text-[#88c4ff]">{event.timestamp}</div>
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
          selectedReason={selectedReason}
          customReason={customReason}
          uploadedEvidence={uploadedEvidence}
          onClose={() => setIsModalOpen(false)}
          onReasonChange={setSelectedReason}
          onCustomReasonChange={setCustomReason}
          onConfirm={handleSplitAndNeutralize}
        />
      ) : null}
    </AppShell>
  );
}

function WorkflowHeader({ settlement }: { settlement: SettlementItem }) {
  return (
    <div>
      <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
        Settlement workflow
      </div>
      <h2 className="mt-4 break-words text-3xl font-bold">{settlement.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
        This workflow does not freeze the full amount, does not decide who is right, and does not
        replace arbitration. It narrows the dispute to the amount actually under challenge.
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
        <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">{eyebrow}</div>
        <div className="mt-1 break-words text-2xl font-bold">{title}</div>
        <div className="mt-2 max-w-2xl text-sm leading-7 text-white/65">{description}</div>
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
      <div className="mt-2 break-words text-sm font-semibold leading-7 text-white/90">{value}</div>
    </div>
  );
}

function SplitNeutralizeModal({
  settlement,
  selectedReason,
  customReason,
  uploadedEvidence,
  onClose,
  onReasonChange,
  onCustomReasonChange,
  onConfirm,
}: {
  settlement: SettlementItem;
  selectedReason: (typeof reasonOptions)[number];
  customReason: string;
  uploadedEvidence: UploadedEvidenceRef[];
  onClose: () => void;
  onReasonChange: (value: (typeof reasonOptions)[number]) => void;
  onCustomReasonChange: (value: string) => void;
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
              The full amount will not be frozen. The undisputed portion will be marked as released
              / payable, and only the disputed portion will move into the vault workflow.
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
          <InfoCard label="Total" value={formatMoney(settlement.totalAmount, settlement.currency)} />
          <InfoCard label="Undisputed" value={formatMoney(settlement.undisputedAmount, settlement.currency)} />
          <InfoCard label="Disputed" value={formatMoney(settlement.disputedAmount, settlement.currency)} />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Dispute reason</div>
            <div className="mt-4 grid gap-2">
              {reasonOptions.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => onReasonChange(reason)}
                  className={[
                    "rounded-2xl border px-4 py-3 text-left text-sm transition",
                    selectedReason === reason
                      ? "border-[#4f97e8]/35 bg-[#3373B7]/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-white/72 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  {reason}
                </button>
              ))}
            </div>

            {selectedReason === "Custom" ? (
              <textarea
                value={customReason}
                onChange={(event) => onCustomReasonChange(event.target.value)}
                placeholder="Enter a concise dispute reason"
                className="mt-4 min-h-[110px] w-full rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white outline-none placeholder:text-white/35"
              />
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Evidence references</div>
            <div className="mt-4 grid gap-2">
              {uploadedEvidence.length > 0 ? (
                uploadedEvidence.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <div className="break-words text-sm font-semibold text-white/92">{item.fileName}</div>
                    <div className="mt-1 text-xs leading-6 text-white/62">
                      {item.documentType} • {item.uploaderRole} • {item.timestamp}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/55">
                  No uploaded evidence found in generated dashboard.
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">Summary</div>
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
