import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightLeft,
  CircleDollarSign,
  FileStack,
  Landmark,
  ShieldEllipsis,
} from "lucide-react";
import {
  assessSettlementDraft,
  getDisputeReasonLabel,
  getSettlementPartyModel,
  loadEvidenceVaultDocuments,
  loadSettlementDraft,
  subscribeSettlementStore,
  type EvidenceRequirementCheck,
  type EvidenceVaultDocument,
  type SettlementDraft,
} from "./settlementStore";
import { AppShell, CTAButton, Surface } from "./ui";

type SettlementStatus =
  | "review_required"
  | "ready_to_split"
  | "disputed_portion_staged";

type SettlementSource = {
  draft: SettlementDraft;
  linkedEvidence: EvidenceVaultDocument[];
};

type SettlementView = {
  id: string;
  title: string;
  claimedAmount: number;
  admittedAmount: number;
  disputedAmount: number;
  currency: string;
  dueDate: string;
  reason: string;
  status: SettlementStatus;
  claimant: string;
  respondent: string;
  payer: string;
  payee: string;
};

type DemoStage = {
  amount: number;
  currency: string;
  reason: string;
  stagedAt: string;
};

type TimelineEvent = {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
};

export function SettlementWorkflowPage() {
  const [source, setSource] = useState<SettlementSource>(() => loadSettlementSource());
  const [lockedSource, setLockedSource] = useState<SettlementSource | null>(null);
  const [stage, setStage] = useState<DemoStage | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() =>
    buildInitialTimeline(loadSettlementSource()),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (lockedSource) return;

    const refresh = () => setSource(loadSettlementSource());
    const unsubscribe = subscribeSettlementStore(refresh);
    window.addEventListener("focus", refresh);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, [lockedSource]);

  const activeSource = lockedSource ?? source;
  const parties = useMemo(
    () => getSettlementPartyModel(activeSource.draft.claimSide),
    [activeSource.draft.claimSide],
  );
  const assessment = useMemo(
    () => assessSettlementDraft(activeSource.draft, activeSource.linkedEvidence),
    [activeSource],
  );
  const settlement = useMemo(
    () =>
      buildSettlementView(
        activeSource,
        parties,
        assessment.disputedAmount,
        assessment.isReady,
        Boolean(stage),
      ),
    [activeSource, parties, assessment.disputedAmount, assessment.isReady, stage],
  );

  useEffect(() => {
    if (stage || lockedSource) return;
    setTimeline(buildInitialTimeline(activeSource));
  }, [activeSource, lockedSource, stage]);

  function handleSplitAndNeutralize() {
    const timestamp = formatNow();
    const eventBase = Date.now();

    setLockedSource(activeSource);
    setStage({
      amount: settlement.disputedAmount,
      currency: settlement.currency,
      reason: settlement.reason,
      stagedAt: timestamp,
    });
    setTimeline((current) => [
      {
        id: `evt-${eventBase}-1`,
        action: "Admitted payable amount staged as releasable",
        timestamp,
        actor: "Settlement workflow demo",
      },
      {
        id: `evt-${eventBase}-2`,
        action: "Disputed remainder staged for neutral handling",
        timestamp,
        actor: "Settlement workflow demo",
      },
      {
        id: `evt-${eventBase}-3`,
        action: "Response track prepared (demo only)",
        timestamp,
        actor: "Settlement workflow demo",
      },
      ...current,
    ]);
    setIsModalOpen(false);
  }

  return (
    <AppShell
      eyebrow="Settlement Workflow"
      title="Split & Neutralize"
      description="Generated Dashboard is the source of truth for this demo workflow. Settlement only becomes available when the party direction, admitted payable amount, and evidence pack are coherent."
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="h-full">
          <WorkflowHeader title={settlement.title} />

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <AmountCard
              label="Claimed amount"
              amount={settlement.claimedAmount}
              currency={settlement.currency}
              tone="border-white/10 bg-white/[0.03] text-white/88"
              status="Raised in dashboard intake"
            />
            <AmountCard
              label="Admitted payable"
              amount={settlement.admittedAmount}
              currency={settlement.currency}
              tone="border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
              status={assessment.isReady ? "Ready to release" : "Pending intake correction"}
            />
            <AmountCard
              label="Disputed remainder"
              amount={settlement.disputedAmount}
              currency={settlement.currency}
              tone="border-amber-400/20 bg-amber-500/10 text-amber-200"
              status={stage ? "Staged in demo flow" : "Awaiting split confirmation"}
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Claimant" value={settlement.claimant} />
            <InfoCard label="Respondent" value={settlement.respondent} />
            <InfoCard label="Reason" value={settlement.reason} />
            <InfoCard label="Due date" value={settlement.dueDate} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.22em] text-[#88c4ff]">
              Payment direction
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <InfoCard label="Payer" value={settlement.payer} />
              <InfoCard label="Payee" value={settlement.payee} />
            </div>
            <div className="mt-4 text-sm leading-7 text-white/68">
              Demo assumption: this screen models a freight-payment flow, so Charterer pays and Owner receives.
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-sm uppercase tracking-[0.22em] text-[#88c4ff]">
              Readiness gate
            </div>
            <div className="mt-4 grid gap-2">
              {assessment.issues.length > 0 ? (
                assessment.issues.map((issue) => (
                  <div
                    key={issue}
                    className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100"
                  >
                    {issue}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                  Intake is coherent. Split can proceed in the demo flow.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={!assessment.isReady}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Split & Neutralize
            </button>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80">
              {assessment.isReady ? "Ready to proceed" : assessment.issues[0]}
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
                Admit what is payable, isolate only what is disputed
              </div>
              <div className="mt-2 text-sm text-white/65">
                This demo refuses loose arithmetic. Split only happens after party direction and evidence make sense.
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ThesisLine text="Claimed amount is the asserted exposure." />
            <ThesisLine text="Admitted payable amount is the portion you are willing to release." />
            <ThesisLine text="Disputed remainder is derived, not guessed." />
            <ThesisLine text="Freight shortfall cannot be staged from the Charterer side in this demo." />
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">
              Evidence pack
            </div>
            <div className="mt-4 grid gap-2">
              {assessment.requirementChecks.length > 0 ? (
                assessment.requirementChecks.map((item) => (
                  <RequirementRow key={item.id} item={item} />
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/65">
                  Custom reason selected. Review the uploaded evidence manually.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">
              Intake overview
            </div>
            <div className="mt-4 grid gap-3">
              <InfoCard label="Linked evidence" value={`${activeSource.linkedEvidence.length} document(s)`} />
              <InfoCard label="Status" value={getStatusLabel(settlement.status)} />
              <CTAButton route="/app/generated-dashboard">Open Generated Dashboard</CTAButton>
            </div>
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface className="h-full">
          <PanelTitle
            icon={Landmark}
            eyebrow="Disputed Portion Stage"
            title={stage ? "Disputed remainder staged" : "No staged split yet"}
            description={
              stage
                ? "The disputed remainder is staged in this demo flow. No real custody movement occurs."
                : "Complete the intake gate, then confirm Split & Neutralize to stage the disputed remainder."
            }
          />

          {stage ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <InfoCard label="Amount" value={formatMoney(stage.amount, stage.currency)} />
              <InfoCard label="Reason" value={stage.reason} />
              <InfoCard label="Staged at" value={stage.stagedAt} />
              <InfoCard label="Mode" value="Demo-only staging" />
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/65">
              Nothing is staged yet. The demo waits for a coherent split instruction.
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
                    <div className="break-words text-sm font-semibold text-sky-100">{item.name}</div>
                    <div className="mt-2 text-xs leading-6 text-sky-200/80">
                      {item.type} - {item.uploaderRole} - {item.uploadedAt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/55">
                  No evidence linked yet. Use Generated Dashboard to attach evidence first.
                </div>
              )}
            </div>
          </div>
        </Surface>

        <Surface className="h-full">
          <PanelTitle
            icon={FileStack}
            eyebrow="Timeline"
            title="Demo event trail"
            description="Session-only workflow trail. This is a demo aid, not a formal audit record."
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
          evidence={activeSource.linkedEvidence}
          requirementChecks={assessment.requirementChecks}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSplitAndNeutralize}
        />
      ) : null}
    </AppShell>
  );
}

function WorkflowHeader({ title }: { title: string }) {
  return (
    <div>
      <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
        Settlement workflow
      </div>
      <h2 className="mt-4 break-words text-3xl font-bold">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
        This demo only stages a split after the commercial direction makes sense:
        claimant, respondent, payer, payee, admitted amount, and evidence pack all need to align.
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

function AmountCard({
  label,
  amount,
  currency,
  tone,
  status,
}: {
  label: string;
  amount: number;
  currency: string;
  tone: string;
  status: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <div className="text-[11px] uppercase tracking-[0.2em] opacity-70">{label}</div>
      <div className="mt-3 text-2xl font-bold">{formatMoney(amount, currency)}</div>
      <div className="mt-3 text-sm">{status}</div>
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

function RequirementRow({ item }: { item: EvidenceRequirementCheck }) {
  return (
    <div
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
  requirementChecks,
  onClose,
  onConfirm,
}: {
  settlement: SettlementView;
  evidence: EvidenceVaultDocument[];
  requirementChecks: EvidenceRequirementCheck[];
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
              This demo will stage the admitted payable amount as releasable and isolate the disputed remainder conceptually.
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
          <InfoCard label="Claimed" value={formatMoney(settlement.claimedAmount, settlement.currency)} />
          <InfoCard label="Admitted" value={formatMoney(settlement.admittedAmount, settlement.currency)} />
          <InfoCard label="Disputed" value={formatMoney(settlement.disputedAmount, settlement.currency)} />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Party model</div>
            <div className="mt-4 grid gap-3">
              <InfoCard label="Claimant" value={settlement.claimant} />
              <InfoCard label="Respondent" value={settlement.respondent} />
              <InfoCard label="Payer" value={settlement.payer} />
              <InfoCard label="Payee" value={settlement.payee} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Evidence pack</div>
            <div className="mt-4 grid gap-2">
              {requirementChecks.map((item) => (
                <RequirementRow key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
                >
                  <div className="break-words text-sm font-semibold text-white/92">{item.name}</div>
                  <div className="mt-1 text-xs leading-6 text-white/62">
                    {item.type} - {item.uploaderRole} - {item.uploadedAt}
                  </div>
                </div>
              ))}
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
  parties: ReturnType<typeof getSettlementPartyModel>,
  disputedAmount: number,
  isReady: boolean,
  isStaged: boolean,
): SettlementView {
  const reasonLabel = getDisputeReasonLabel(source.draft.reasonKey);
  const reason =
    source.draft.reasonKey === "custom"
      ? source.draft.customReason.trim() || "Custom review note"
      : reasonLabel.labelEn;

  return {
    id: source.draft.id,
    title: source.draft.title,
    claimedAmount: source.draft.claimedAmount,
    admittedAmount: source.draft.admittedAmount,
    disputedAmount,
    currency: source.draft.currency,
    dueDate: source.draft.dueDate || "Pending confirmation",
    reason,
    status: isStaged
      ? "disputed_portion_staged"
      : isReady
        ? "ready_to_split"
        : "review_required",
    claimant: `${parties.claimantRole} - ${parties.claimantName}`,
    respondent: `${parties.respondentRole} - ${parties.respondentName}`,
    payer: `${parties.payerRole} - ${parties.payerName}`,
    payee: `${parties.payeeRole} - ${parties.payeeName}`,
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

function getStatusLabel(status: SettlementStatus) {
  switch (status) {
    case "review_required":
      return "Review required";
    case "ready_to_split":
      return "Ready to split";
    case "disputed_portion_staged":
      return "Disputed remainder staged";
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
