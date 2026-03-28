import { useMemo, useState } from "react";
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
  type EvidenceVaultDocument,
} from "./settlementStore";
import { AppShell, CTAButton, Surface } from "./ui";

type SettlementStatus =
  | "review_required"
  | "ready_to_split"
  | "undisputed_released"
  | "disputed_portion_vaulted";

type SettlementItem = {
  id: string;
  title: string;
  totalAmount: number;
  currency: string;
  undisputedAmount: number;
  disputedAmount: number;
  counterparty: string;
  dueDate: string;
  reasonEn: string;
  reasonTr: string;
  status: SettlementStatus;
  initiatedBy: string;
};

type DisputedPortionVault = {
  id: string;
  amount: number;
  currency: string;
  reasonEn: string;
  reasonTr: string;
  initiatedBy: string;
  createdAt: string;
  statusEn: string;
  statusTr: string;
  nextActionEn: string;
  nextActionTr: string;
  evidenceRefs: EvidenceVaultDocument[];
};

type TimelineEvent = {
  id: string;
  actionEn: string;
  actionTr: string;
  timestamp: string;
  actor: string;
};

const initialTimeline: TimelineEvent[] = [
  {
    id: "evt-1",
    actionEn: "Settlement opened",
    actionTr: "Settlement kaydi acildi",
    timestamp: "28 Mar 2026, 09:10 HRS",
    actor: "Charterer ops",
  },
  {
    id: "evt-2",
    actionEn: "Payment difference flagged for review",
    actionTr: "Odeme farki inceleme icin isaretlendi",
    timestamp: "28 Mar 2026, 09:35 HRS",
    actor: "Charterer finance",
  },
];

export function SettlementWorkflowPage() {
  const evidenceVaultDocuments = useMemo(() => loadEvidenceVaultDocuments(), []);
  const draft = useMemo(() => loadSettlementDraft(), []);

  const disputeReason = getDisputeReasonLabel(draft.reasonKey);
  const linkedEvidence = useMemo(
    () => evidenceVaultDocuments.filter((item) => draft.evidenceIds.includes(item.id)),
    [draft.evidenceIds, evidenceVaultDocuments],
  );

  const seededSettlement = useMemo<SettlementItem>(
    () => ({
      id: draft.id,
      title: draft.title,
      totalAmount: draft.totalAmount,
      currency: draft.currency,
      undisputedAmount: Math.max(draft.totalAmount - draft.disputedAmount, 0),
      disputedAmount: draft.disputedAmount,
      counterparty: draft.counterparty,
      dueDate: draft.dueDate,
      reasonEn: draft.reasonKey === "custom" ? draft.customReason || "Custom review note" : disputeReason.labelEn,
      reasonTr: draft.reasonKey === "custom" ? draft.customReason || "Ozel inceleme notu" : disputeReason.labelTr,
      status: "ready_to_split",
      initiatedBy: draft.initiatedBy,
    }),
    [draft, disputeReason],
  );

  const [settlement, setSettlement] = useState<SettlementItem>(seededSettlement);
  const [vault, setVault] = useState<DisputedPortionVault | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const breakdownRows = useMemo(
    () => [
      {
        labelEn: "Total amount",
        labelTr: "Toplam tutar",
        amount: settlement.totalAmount,
        statusEn: "In review",
        statusTr: "Incelemede",
        tone: "border-white/10 bg-white/[0.03] text-white/88",
      },
      {
        labelEn: "Undisputed portion",
        labelTr: "Tartismasiz kisim",
        amount: settlement.undisputedAmount,
        statusEn: vault ? "Released / payable" : "Ready for release",
        statusTr: vault ? "Serbest / odenebilir" : "Serbest birakilmaya hazir",
        tone: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
      },
      {
        labelEn: "Disputed portion",
        labelTr: "Tartismali kisim",
        amount: settlement.disputedAmount,
        statusEn: vault ? "Vaulted" : "Awaiting neutralization",
        statusTr: vault ? "Vault icinde" : "Notrleme bekliyor",
        tone: "border-amber-400/20 bg-amber-500/10 text-amber-200",
      },
    ],
    [settlement, vault],
  );

  const settlementReady = settlement.disputedAmount > 0 && linkedEvidence.length > 0;

  function handleSplitAndNeutralize() {
    const createdAt = formatNow();
    const eventBase = Date.now();

    const vaultRecord: DisputedPortionVault = {
      id: `vault-${eventBase}`,
      amount: settlement.disputedAmount,
      currency: settlement.currency,
      reasonEn: settlement.reasonEn,
      reasonTr: settlement.reasonTr,
      initiatedBy: settlement.initiatedBy,
      createdAt,
      statusEn: "Counterparty response pending",
      statusTr: "Karsi taraf yaniti bekleniyor",
      nextActionEn: "Counterparty response awaited before negotiation window closes.",
      nextActionTr: "Muzakere penceresi kapanmadan once karsi taraf yaniti bekleniyor.",
      evidenceRefs: linkedEvidence,
    };

    setSettlement((current) => ({
      ...current,
      status: "disputed_portion_vaulted",
    }));
    setVault(vaultRecord);
    setTimeline((current) => [
      {
        id: `evt-${eventBase}-1`,
        actionEn: "Undisputed portion released",
        actionTr: "Tartismasiz kisim serbest birakildi",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      {
        id: `evt-${eventBase}-2`,
        actionEn: "Disputed portion moved to vault",
        actionTr: "Tartismali kisim vault icine alindi",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      {
        id: `evt-${eventBase}-3`,
        actionEn: "Counterparty notified",
        actionTr: "Karsi taraf bilgilendirildi",
        timestamp: createdAt,
        actor: "Settlement workflow",
      },
      ...current,
    ]);
    setIsModalOpen(false);
  }

  return (
    <AppShell
      eyebrow="Settlement Workflow / Settlement akisi"
      title="Split & Neutralize"
      description="Small disputes should not freeze the full payment. Kucuk uyusmazliklar tum odemeyi durdurmamali. The undisputed portion flows, and only the disputed portion is isolated."
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="h-full">
          <WorkflowHeader settlement={settlement} />

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {breakdownRows.map((row) => (
              <div key={row.labelEn} className={`rounded-2xl border p-4 ${row.tone}`}>
                <div className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                  {row.labelEn} / {row.labelTr}
                </div>
                <div className="mt-3 text-2xl font-bold">{formatMoney(row.amount, settlement.currency)}</div>
                <div className="mt-3 text-sm leading-6">
                  {row.statusEn}
                  <br />
                  <span className="text-white/70">{row.statusTr}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Counterparty / Karsi taraf" value={settlement.counterparty} />
            <InfoCard label="Due date / Vade tarihi" value={settlement.dueDate} />
            <InfoCard label="Reason / Neden" value={`${settlement.reasonEn} / ${settlement.reasonTr}`} />
            <InfoCard label="Status / Durum" value={getStatusLabel(settlement.status)} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.22em] text-[#88c4ff]">Default rule / Varsayilan kural</div>
            <div className="mt-3 text-2xl font-bold">Deduction -&gt; Vault</div>
            <div className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
              If a paying party would otherwise delay the full amount, the workflow releases the undisputed portion and isolates only the disputed portion.
              <br />
              Odeyen taraf tum tutari geciktirecekse, akis tartismasiz kismi serbest birakir ve yalnizca tartismali kismi izole eder.
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-[#88c4ff]">
                  Intake source / Giris kaynagi
                </div>
                <div className="mt-2 text-sm leading-7 text-white/70">
                  This dispute record is sourced from the generated dashboard evidence vault and dispute intake.
                  <br />
                  Bu uyusmazlik kaydi generated dashboard icindeki evidence vault ve dispute intake verisinden gelir.
                </div>
              </div>
              <CTAButton route="/app/generated-dashboard">Open dashboard source</CTAButton>
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
              {settlementReady
                ? "Ready to proceed / Islem icin hazir"
                : "Add evidence from dashboard first / Once dashboarddan kanit ekleyin"}
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
                Settlement thesis / Settlement tezi
              </div>
              <div className="mt-1 text-2xl font-bold">Only the disputed portion is neutralized</div>
              <div className="mt-2 text-sm text-white/65">Yalnizca tartismali kisim notrlestirilir.</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ThesisLine en="The full amount is not locked." tr="Tum tutar kilitlenmez." />
            <ThesisLine en="The undisputed portion remains payable." tr="Tartismasiz kisim odenebilir kalir." />
            <ThesisLine en="The disputed portion is isolated in neutral custody." tr="Tartismali kisim notr saklamada izole edilir." />
            <ThesisLine en="The workflow does not decide who is right." tr="Akis kimin hakli olduguna karar vermez." />
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">
              Evidence intake / Kanit girisi
            </div>
            <div className="mt-4 grid gap-3">
              <InfoCard label="Linked evidence / Bagli kanit" value={`${linkedEvidence.length} document(s)`} />
              <InfoCard label="Initiated by / Baslatan" value={settlement.initiatedBy} />
              <InfoCard
                label="Workflow scope / Akis kapsami"
                value="No legal decisioning; only split, vault, and audit trail / Hukuki karar yok; sadece bolme, vault ve denetim izi"
              />
            </div>
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface className="h-full">
          <PanelTitle
            icon={Landmark}
            eyebrow="Disputed Portion Vault / Tartismali kisim kasasi"
            title={vault ? "Vault record created / Vault kaydi olustu" : "Awaiting vault record / Vault kaydi bekleniyor"}
            description={
              vault
                ? "Only the disputed amount is isolated here while the undisputed amount remains released and payable."
                : "Open the generated dashboard, prepare the dispute intake, then confirm Split & Neutralize."
            }
          />

          {vault ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <InfoCard label="Amount / Tutar" value={formatMoney(vault.amount, vault.currency)} />
              <InfoCard label="Status / Durum" value={`${vault.statusEn} / ${vault.statusTr}`} />
              <InfoCard label="Initiated by / Baslatan" value={vault.initiatedBy} />
              <InfoCard label="Created at / Olusma zamani" value={vault.createdAt} />
              <InfoCard label="Reason / Neden" value={`${vault.reasonEn} / ${vault.reasonTr}`} />
              <InfoCard label="Next action / Sonraki aksiyon" value={`${vault.nextActionEn} / ${vault.nextActionTr}`} />
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/65">
              Vault remains empty until the disputed portion is confirmed.
              <br />
              Tartismali kisim onaylanana kadar vault bos kalir.
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">
              Evidence references / Kanit referanslari
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {linkedEvidence.length > 0 ? (
                linkedEvidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-3"
                  >
                    <div className="truncate text-sm font-semibold text-sky-100">{item.name}</div>
                    <div className="mt-2 text-xs leading-6 text-sky-200/80">
                      {item.type} • {item.uploaderRole} • {item.uploadedAt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/55">
                  No evidence linked yet. Use generated dashboard to attach evidence first.
                </div>
              )}
            </div>
          </div>
        </Surface>

        <Surface className="h-full">
          <PanelTitle
            icon={FileStack}
            eyebrow="Timeline / Zaman cizelgesi"
            title="Settlement activity log"
            description="Audit-oriented event trail. No legal decisioning, only workflow state changes."
          />

          <div className="mt-5 space-y-3">
            {timeline.map((event) => (
              <div key={event.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold leading-6 text-white/92">{event.actionEn}</div>
                    <div className="mt-1 text-sm leading-6 text-white/62">{event.actionTr}</div>
                  </div>
                  <div className="shrink-0 text-xs text-[#88c4ff]">{event.timestamp}</div>
                </div>
                <div className="mt-3 text-sm text-white/65">Actor / Aktor: {event.actor}</div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      {isModalOpen ? (
        <SplitNeutralizeModal
          settlement={settlement}
          evidence={linkedEvidence}
          onClose={() => setIsModalOpen(false)}
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
        Settlement workflow / Settlement akisi
      </div>
      <h2 className="mt-4 text-3xl font-bold">{settlement.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
        This workflow does not freeze the full amount, does not decide who is right, and does not replace arbitration.
        <br />
        Bu akis tum tutari dondurmez, kimin hakli olduguna karar vermez ve tahkimin yerini almaz.
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
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">{eyebrow}</div>
        <div className="mt-1 text-2xl font-bold">{title}</div>
        <div className="mt-2 max-w-2xl text-sm leading-7 text-white/65">{description}</div>
      </div>
    </div>
  );
}

function ThesisLine({ en, tr }: { en: string; tr: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/78">
      <div>{en}</div>
      <div className="text-white/58">{tr}</div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold leading-6 text-white/90">{value}</div>
    </div>
  );
}

function SplitNeutralizeModal({
  settlement,
  evidence,
  onClose,
  onConfirm,
}: {
  settlement: SettlementItem;
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
              Split & Neutralize / Bol ve notrlestir
            </div>
            <div className="mt-4 text-3xl font-bold">Confirm payment split</div>
            <div className="mt-2 text-sm text-white/62">Odeme bolunmesini onayla</div>
            <div className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
              The full amount will not be frozen. The undisputed portion will be marked as released / payable, and only the disputed portion will move into the vault workflow.
              <br />
              Tum tutar dondurulmaz. Tartismasiz kisim serbest / odenebilir olarak isaretlenir ve yalnizca tartismali kisim vault akisina gider.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/75"
          >
            Close / Kapat
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard label="Total / Toplam" value={formatMoney(settlement.totalAmount, settlement.currency)} />
          <InfoCard label="Undisputed / Tartismasiz" value={formatMoney(settlement.undisputedAmount, settlement.currency)} />
          <InfoCard label="Disputed / Tartismali" value={formatMoney(settlement.disputedAmount, settlement.currency)} />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Reason / Neden</div>
            <div className="mt-4 rounded-2xl border border-[#4f97e8]/25 bg-[#3373B7]/10 px-4 py-4">
              <div className="font-semibold text-white">{settlement.reasonEn}</div>
              <div className="mt-1 text-sm text-white/65">{settlement.reasonTr}</div>
            </div>

            <div className="mt-5 grid gap-3">
              <InfoCard label="Counterparty / Karsi taraf" value={settlement.counterparty} />
              <InfoCard label="Initiated by / Baslatan" value={settlement.initiatedBy} />
              <InfoCard label="Evidence count / Kanit adedi" value={`${evidence.length} document(s)`} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">
              Evidence references / Kanit referanslari
            </div>
            <div className="mt-4 grid gap-2">
              {evidence.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  <div className="truncate text-sm font-semibold text-white/92">{item.name}</div>
                  <div className="mt-1 text-xs leading-6 text-white/62">
                    {item.type} • {item.uploaderRole} • {item.uploadedAt}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">Summary / Ozet</div>
              <div className="mt-3 space-y-2 text-sm leading-7 text-white/78">
                <div>Undisputed portion -&gt; released / payable</div>
                <div>Tartismasiz kisim -&gt; serbest / odenebilir</div>
                <div>Disputed portion -&gt; neutral vault record</div>
                <div>Tartismali kisim -&gt; notr vault kaydi</div>
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
            Cancel / Iptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px]"
          >
            Confirm split / Bolmeyi onayla
            <CircleDollarSign className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusLabel(status: SettlementStatus) {
  switch (status) {
    case "review_required":
      return "Review required / Inceleme gerekli";
    case "ready_to_split":
      return "Ready to split / Bolmeye hazir";
    case "undisputed_released":
      return "Undisputed released / Tartismasiz serbest";
    case "disputed_portion_vaulted":
      return "Disputed portion vaulted / Tartismali kisim vault icinde";
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
