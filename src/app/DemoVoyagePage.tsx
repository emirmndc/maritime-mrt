import { useMemo, useState } from "react";
import { AlertTriangle, FileSearch, FileStack, Mail, Activity, Siren, TimerReset, TriangleAlert, Upload, Clock3, Filter } from "lucide-react";
import { demoVoyage } from "./data";
import { AppShell, Surface, StatusPill } from "./ui";
import type { TaskItem, VoyageDocumentStatus } from "./types";

const healthTone = {
  on_track: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  at_risk: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  delayed: "border-rose-400/20 bg-rose-500/10 text-rose-200",
} as const;

const flagTone = {
  medium: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  high: "border-rose-400/20 bg-rose-500/10 text-rose-100",
} as const;

const documentTone: Record<VoyageDocumentStatus, string> = {
  uploaded: "border-sky-400/20 bg-sky-500/10 text-sky-100",
  missing: "border-rose-400/20 bg-rose-500/10 text-rose-100",
  awaiting_review: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  draft_only: "border-violet-400/20 bg-violet-500/10 text-violet-100",
  confirmed: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
};

const filterOptions = ["All", "My tasks", "Owner", "Charterer", "Today", "Docs missing"] as const;
type FilterOption = (typeof filterOptions)[number];

export function DemoVoyagePage() {
  const [taskFilter, setTaskFilter] = useState<FilterOption>("All");

  const filteredOwnerTasks = useMemo(
    () => filterTasks(demoVoyage.ownerTasks, taskFilter, "Owner"),
    [taskFilter],
  );
  const filteredChartererTasks = useMemo(
    () => filterTasks(demoVoyage.chartererTasks, taskFilter, "Charterer"),
    [taskFilter],
  );

  return (
    <AppShell
      eyebrow="Demo Dashboard"
      title="Single voyage, single dashboard."
      description="This demo maps a fictional voyage into one operational view: status, health, parser output, actions, document states, change log, and review-oriented cautions."
    >
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold">{demoVoyage.route}</h2>
            <StatusPill status="active" />
          </div>
          <p className="mt-3 text-white/68">
            {demoVoyage.cargo} • Broker: {demoVoyage.broker} • Freight: {demoVoyage.freight}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TopMetric label="Voyage status" value={demoVoyage.stage} />
            <TopMetric label="Upcoming trigger" value={demoVoyage.upcomingTrigger} />
            <TopMetric label="Next deadline" value={demoVoyage.nextDeadline} />
            <TopMetric label="Commercial risk" value={demoVoyage.commercialRisk} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InfoStrip label="Last event recorded" value={demoVoyage.lastEventRecorded} />
            <InfoStrip label="Last updated by" value={demoVoyage.lastUpdatedBy} />
            <InfoStrip label="Last updated time" value={demoVoyage.lastUpdatedAt} />
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={Activity} label="Voyage health" subtitle={demoVoyage.health.label} />
          <div className={`mt-5 rounded-2xl border px-4 py-4 ${healthTone[demoVoyage.health.tone]}`}>
            <div className="text-sm font-semibold">Operational health: {demoVoyage.health.label}</div>
            <div className="mt-3 space-y-2 text-sm leading-7">
              {demoVoyage.health.reasons.map((reason) => (
                <div key={reason}>- {reason}</div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {demoVoyage.flags.map((flag) => (
              <div key={flag.title} className={`rounded-2xl border px-4 py-3 text-sm ${flagTone[flag.severity]}`}>
                <div className="flex items-center gap-3 font-semibold">
                  <TriangleAlert className="h-4 w-4" />
                  <span>⚠ {flag.title}</span>
                </div>
                <div className="mt-2 leading-7 opacity-90">{flag.guidance}</div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface>
          <SectionTitle icon={FileSearch} label="Recap parser" subtitle="AI extraction visible" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {demoVoyage.parserSummary.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                <div className="mt-2 text-sm font-semibold leading-6 text-white/90">{item.value}</div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={Clock3} label="Since last update" subtitle="What changed" />
          <div className="mt-5 space-y-4">
            {demoVoyage.changesSinceLastUpdate.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-[#88c4ff]">{item.stamp}</div>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="mt-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionTitle icon={Filter} label="Task filters" subtitle="All or focused views" />
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTaskFilter(option)}
                className={[
                  "rounded-full border px-4 py-2 text-xs font-semibold transition",
                  taskFilter === option
                    ? "border-[#4f97e8]/35 bg-[#3373B7]/15 text-[#cfe7ff]"
                    : "border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Surface>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <TaskColumn title="Owner tasks" items={filteredOwnerTasks} />
        <TaskColumn title="Charterer tasks" items={filteredChartererTasks} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <SectionTitle icon={TimerReset} label="Recorded events and upcoming triggers" subtitle="Timeline flow" />
          <div className="mt-5 space-y-4">
            {demoVoyage.timeline.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-semibold">{item.title}</div>
                  <StatusPill status={item.status} />
                </div>
                <div className="mt-2 text-sm text-[#88c4ff]">{item.stamp}</div>
                <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
              </div>
            ))}
          </div>
        </Surface>

        <div className="grid gap-5">
          <Surface>
            <SectionTitle icon={FileStack} label="Evidence pack" subtitle="Document status visible" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {demoVoyage.documents.map((document) => (
                <div key={document.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white/90">{document.title}</div>
                  <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${documentTone[document.status]}`}>
                    {formatDocumentStatus(document.status)}
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface>
            <SectionTitle icon={AlertTriangle} label="Operational cautions" subtitle="Assistive language only" />
            <div className="mt-5 space-y-3">
              {demoVoyage.riskNotes.map((note) => (
                <div key={note} className="rounded-2xl border border-amber-400/15 bg-amber-500/5 px-4 py-3 text-sm leading-7 text-white/78">
                  {note}
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>

      <Surface className="mt-5">
        <SectionTitle icon={Mail} label="Reminder drafts" subtitle="Right clause, right person, right moment" />
        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          {demoVoyage.drafts.map((draft) => (
            <div key={draft.subject} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[#88c4ff]">{draft.audience}</div>
              <div className="mt-2 text-xl font-semibold">{draft.subject}</div>
              <p className="mt-4 text-[15px] leading-8 text-white/68">{draft.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <DraftButton label="Copy" />
                <DraftButton label="Open email draft" />
                <DraftButton label="Regenerate" />
                <DraftButton label="Neutral tone" />
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </AppShell>
  );
}

function TopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-white/90">{value}</div>
    </div>
  );
}

function InfoStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 text-sm leading-6 text-white/90">{value}</div>
    </div>
  );
}

function TaskColumn({ title, items }: { title: string; items: TaskItem[] }) {
  return (
    <Surface>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
            No tasks in this filter.
          </div>
        ) : null}
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-semibold">{item.title}</div>
              <StatusPill status={item.status} />
            </div>
            <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
            <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/72">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Clause source</div>
                <div className="mt-2 font-semibold text-white/88">{item.clauseSource.title}</div>
                <div className="mt-1 leading-7">{item.clauseSource.text}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Why this matters</div>
                <div className="mt-2 leading-7">{item.whyMatters}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Risk if missed</div>
                <div className="mt-2 leading-7">{item.riskIfMissed}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition",
                    action.tone === "primary"
                      ? "bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] text-[#06111f]"
                      : "border border-white/10 bg-white/[0.03] text-white/85 hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
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

function DraftButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/[0.06]"
    >
      {label}
    </button>
  );
}

function formatDocumentStatus(status: VoyageDocumentStatus) {
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

function filterTasks(items: TaskItem[], filter: FilterOption, owner: "Owner" | "Charterer") {
  switch (filter) {
    case "My tasks":
      return owner === "Owner" ? items : [];
    case "Owner":
      return owner === "Owner" ? items : [];
    case "Charterer":
      return owner === "Charterer" ? items : [];
    case "Today":
      return items.filter((item) => item.today);
    case "Docs missing":
      return items.filter((item) => item.actions.some((action) => action.label.toLowerCase().includes("upload")));
    default:
      return items;
  }
}

type ActivityIcon =
  | typeof Activity
  | typeof FileSearch
  | typeof Siren
  | typeof TimerReset
  | typeof FileStack
  | typeof AlertTriangle
  | typeof Mail
  | typeof Clock3
  | typeof Filter;
