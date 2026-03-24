import { useMemo } from "react";
import {
  AlertTriangle,
  Clock3,
  FileSearch,
  FileStack,
  Mail,
  TriangleAlert,
} from "lucide-react";
import { AppShell, CTAButton, Surface, StatusPill } from "./ui";
import {
  loadGeneratedVoyage,
  type ConfidenceLevel,
  type GeneratedCaution,
  type SourceTraceItem,
} from "./generatedVoyage";

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

export function GeneratedDashboardPage() {
  const generated = typeof window !== "undefined" ? loadGeneratedVoyage() : null;

  const summaryRoute = generated?.route || `${generated?.loadport || "Unknown"} > ${generated?.disport || "Unknown"}`;

  const keyRisks = useMemo(() => {
    if (!generated) return [];
    return (generated.flags || []).slice(0, 3);
  }, [generated]);

  const nextActions = useMemo(() => {
    if (!generated) return [];
    return [...(generated.owner_tasks || []), ...(generated.charterer_tasks || [])].slice(0, 3);
  }, [generated]);

  const blockingDocuments = useMemo(() => {
    if (!generated) return [];
    return (generated.documents || []).filter(
      (item) => item.status === "missing" || item.status === "awaiting_review" || item.status === "draft_only",
    );
  }, [generated]);

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
          <h2 className="mt-4 text-3xl font-bold">{summaryRoute}</h2>
          <p className="mt-3 text-white/68">
            {generated.cargo || "Cargo pending review"} - Broker: {generated.broker || "Pending review"}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <LabeledMetric tag="Extracted" label="Owner" value={generated.owner || "Pending review"} tone="extracted" />
            <LabeledMetric tag="Extracted" label="Charterer" value={generated.charterer || "Pending review"} tone="extracted" />
            <LabeledMetric tag="Suggested" label="Workflow status" value={generated.voyage_status || "Pending review"} tone="suggested" />
            <LabeledMetric tag="Requires confirmation" label="Next deadline" value={generated.next_deadline || "Pending review"} tone="review" />
          </div>

          <div className="mt-6 rounded-2xl border border-[#4f97e8]/15 bg-[#3373B7]/10 p-4 text-sm leading-7 text-white/72">
            Part of the <span className="font-semibold text-white">MARITIME (MRT)</span> project.
            <div className="mt-2 text-white/78">
              Token layer is live. Workflow layer is in development.
            </div>
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
              {(generated.health_reasons?.length ? generated.health_reasons : ["No summary reasons returned"])
                .slice(0, 3)
                .map((reason) => (
                  <div key={reason}>- {reason}</div>
                ))}
            </div>
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
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
          <SectionTitle icon={Clock3} label="3 next actions" subtitle="Operational next steps" />
          <div className="mt-5 space-y-3">
            {nextActions.length === 0 ? (
              <EmptyBox text="No next actions were returned." />
            ) : (
              nextActions.map((task) => (
                <div key={task.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{task.title}</div>
                      {task.confidence ? <ConfidenceBadge level={task.confidence} /> : null}
                    </div>
                    <StatusPill status={task.status} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/68">{task.detail}</p>
                  <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/45">Why this matters</div>
                  <div className="mt-2 text-sm leading-7 text-white/78">{task.why_matters}</div>
                  <TraceFooter confidence={task.confidence} sourceTrace={task.sourceTrace} />
                </div>
              ))
            )}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Requires confirmation" tone="review" />
          <SectionTitle icon={FileStack} label="Missing documents blocking progress" subtitle="Evidence comes first" />
          <div className="mt-5 space-y-3">
            {blockingDocuments.length === 0 ? (
              <EmptyBox text="No blocking document gaps are visible in this draft." />
            ) : (
              blockingDocuments.map((document) => (
                <div key={document.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-white/90">{document.title}</div>
                    {document.confidence ? <ConfidenceBadge level={document.confidence} /> : null}
                  </div>
                  <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${documentTone[document.status]}`}>
                    {formatDocumentStatus(document.status)}
                  </div>
                  <TraceFooter confidence={document.confidence} sourceTrace={document.sourceTrace} />
                </div>
              ))
            )}
          </div>
        </Surface>
      </div>

      <div id="full-breakdown" className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface>
          <HeaderTag label="Extracted" tone="extracted" />
          <SectionTitle icon={FileSearch} label="Recap summary" subtitle="Directly extracted terms" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(generated.parser_summary?.length ? generated.parser_summary : []).map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                <div className="mt-2 text-sm font-semibold leading-6 text-white/90">{item.value}</div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Demo state" tone="mixed" />
          <SectionTitle icon={Clock3} label="Since last update" subtitle="No new events recorded (demo state)" />
          <div className="mt-5 space-y-4">
            {(generated.changes_since_last_update?.length ? generated.changes_since_last_update : []).length > 0 ? (
              generated.changes_since_last_update.map((item) => (
                <div key={`${item.title}-${item.stamp}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{item.title}</div>
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
        <details className="group">
          <summary className="list-none">
            <Surface>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <HeaderTag label="Suggested" tone="suggested" />
                  <div className="mt-3 text-2xl font-bold">View Owner tasks</div>
                  <div className="mt-2 text-sm text-white/65">
                    Suggested responsibilities extracted from the recap and organized for review.
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#b8dcff] group-open:hidden">Open</div>
                <div className="hidden text-sm font-semibold text-[#b8dcff] group-open:block">Close</div>
              </div>
            </Surface>
          </summary>
          <div className="mt-4">
            <TaskColumn title="Owner tasks" items={generated.owner_tasks || []} />
          </div>
        </details>

        <details className="group">
          <summary className="list-none">
            <Surface>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <HeaderTag label="Suggested" tone="suggested" />
                  <div className="mt-3 text-2xl font-bold">View Charterer tasks</div>
                  <div className="mt-2 text-sm text-white/65">
                    Suggested responsibilities extracted from the recap and organized for review.
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#b8dcff] group-open:hidden">Open</div>
                <div className="hidden text-sm font-semibold text-[#b8dcff] group-open:block">Close</div>
              </div>
            </Surface>
          </summary>
          <div className="mt-4">
            <TaskColumn title="Charterer tasks" items={generated.charterer_tasks || []} />
          </div>
        </details>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={AlertTriangle} label="Operational cautions" subtitle="Short caution summary" />
          <div className="mt-5 space-y-3">
            {(generated.risk_notes?.length ? generated.risk_notes : []).length > 0 ? (
              generated.risk_notes.map((note, index) => {
                const caution = normalizeCaution(note, index);
                const shortBody =
                  caution.body.length > 180 ? `${caution.body.slice(0, 180)}...` : caution.body;

                return (
                  <div key={caution.title} className="rounded-2xl border border-amber-400/15 bg-amber-500/5 px-4 py-3 text-sm leading-7 text-white/78">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-white/90">{caution.title}</div>
                      {caution.confidence ? <ConfidenceBadge level={caution.confidence} /> : null}
                    </div>
                    <div className="mt-2">{shortBody}</div>
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

function LabeledMetric({
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
      <div className="mt-2 text-sm font-semibold leading-6 text-white/90">{value}</div>
    </div>
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
        {items.length === 0 ? (
          <EmptyBox text="No tasks returned for this section." />
        ) : null}

        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{item.title}</div>
                {item.confidence ? <ConfidenceBadge level={item.confidence} /> : null}
              </div>
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
                  <div className="mt-2 font-semibold text-white/88">{item.clause_source_title}</div>
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
      <div>
        <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">{label}</div>
        <div className="mt-1 text-2xl font-bold">{subtitle}</div>
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
      <div className="flex items-center gap-2">
        <div className="font-semibold">{title}</div>
        {confidence ? <ConfidenceBadge level={confidence} /> : null}
      </div>
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
  const primaryTrace = traceItems[0];

  const derivedLabel = hasTrace
    ? traceItems.length === 1
      ? `Derived from: Clause ${primaryTrace.sectionId} (${primaryTrace.sectionTitle})`
      : `Derived from: Clause ${primaryTrace.sectionId} (${primaryTrace.sectionTitle}) + ${traceItems.length - 1} more`
    : "Source trace not attached";

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/52">{derivedLabel}</span>
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
              <div key={`${item.sectionId}-${item.sectionTitle}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
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
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles[level]}`}>
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

function normalizeCaution(note: string | GeneratedCaution, index: number): GeneratedCaution {
  if (typeof note === "string") {
    return {
      title: `Suggested caution ${index + 1}`,
      body: note,
    };
  }

  return note;
}

type ActivityIcon =
  | typeof AlertTriangle
  | typeof Clock3
  | typeof FileSearch
  | typeof FileStack
  | typeof Mail
  | typeof TriangleAlert;
