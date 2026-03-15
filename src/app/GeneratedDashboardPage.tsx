import { useMemo, useState } from "react";
import { AlertTriangle, FileSearch, FileStack, Mail, Activity, TimerReset, TriangleAlert, Upload, Clock3, Filter } from "lucide-react";
import { AppShell, CTAButton, Surface, StatusPill } from "./ui";
import { loadGeneratedVoyage } from "./generatedVoyage";

const healthTone = {
  "On track": "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  "At risk": "border-amber-400/20 bg-amber-500/10 text-amber-200",
  Delayed: "border-rose-400/20 bg-rose-500/10 text-rose-200",
} as const;

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

const filterOptions = ["All", "Owner", "Charterer"] as const;
type FilterOption = (typeof filterOptions)[number];

export function GeneratedDashboardPage() {
  const generated = typeof window !== "undefined" ? loadGeneratedVoyage() : null;
  const [taskFilter, setTaskFilter] = useState<FilterOption>("All");

  const ownerTasks = useMemo(() => {
    if (!generated) return [];
    return taskFilter === "Charterer" ? [] : generated.owner_tasks;
  }, [generated, taskFilter]);

  const chartererTasks = useMemo(() => {
    if (!generated) return [];
    return taskFilter === "Owner" ? [] : generated.charterer_tasks;
  }, [generated, taskFilter]);

  if (!generated) {
    return (
      <AppShell
        eyebrow="Generated Dashboard"
        title="No generated voyage found."
        description="Generate a recap result first, then this screen will show the AI-produced dashboard."
      >
        <Surface>
          <div className="text-sm text-white/70">
            No parsed voyage is stored in this session yet.
          </div>
          <div className="mt-6">
            <CTAButton route="/app/try-demo">Go to Try Demo</CTAButton>
          </div>
        </Surface>
      </AppShell>
    );
  }

  const healthClass =
    healthTone[generated.voyage_health as keyof typeof healthTone] ??
    "border-white/15 bg-white/10 text-white";

  return (
    <AppShell
      eyebrow="Generated Dashboard"
      title="AI-generated voyage dashboard."
      description="This screen shows the result of the recap you just parsed. Treat it as assistive output and review the recap wording before relying on it."
    >
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold">
              {(generated.route || `${generated.loadport || "Unknown"} › ${generated.disport || "Unknown"}`)}
            </h2>
            <StatusPill status="active" />
          </div>
          <p className="mt-3 text-white/68">
            {generated.cargo || "Cargo pending review"} • Broker: {generated.broker || "Pending review"}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TopMetric label="Voyage status" value={generated.voyage_status || "Pending review"} />
            <TopMetric label="Upcoming trigger" value={generated.upcoming_trigger || "Pending review"} />
            <TopMetric label="Next deadline" value={generated.next_deadline || "Pending review"} />
            <TopMetric label="Commercial risk" value={generated.commercial_risk || "Pending review"} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InfoStrip label="Owner" value={generated.owner || "Not found"} />
            <InfoStrip label="Charterer" value={generated.charterer || "Not found"} />
            <InfoStrip label="Claim deadline" value={generated.claim_deadline || "Not found"} />
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={Activity} label="Voyage health" subtitle={generated.voyage_health || "Pending review"} />
          <div className={`mt-5 rounded-2xl border px-4 py-4 ${healthClass}`}>
            <div className="text-sm font-semibold">Operational health: {generated.voyage_health || "Pending review"}</div>
            <div className="mt-3 space-y-2 text-sm leading-7">
              {(generated.health_reasons?.length ? generated.health_reasons : ["No health reasons returned"]).map((reason) => (
                <div key={reason}>- {reason}</div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {(generated.flags?.length ? generated.flags : []).map((flag) => (
              <div key={flag.title} className={`rounded-2xl border px-4 py-3 text-sm ${flagTone[flag.severity]}`}>
                <div className="flex items-center gap-3 font-semibold">
                  <TriangleAlert className="h-4 w-4" />
                  <span>{flag.title}</span>
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
            {(generated.parser_summary?.length ? generated.parser_summary : []).map((item) => (
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
            {(generated.changes_since_last_update?.length ? generated.changes_since_last_update : []).map((item) => (
              <div key={`${item.title}-${item.stamp}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
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
          <SectionTitle icon={Filter} label="Task filters" subtitle="Generated task views" />
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
        <TaskColumn title="Owner tasks" items={ownerTasks} />
        <TaskColumn title="Charterer tasks" items={chartererTasks} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <SectionTitle icon={FileStack} label="Evidence pack" subtitle="Document status visible" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(generated.documents?.length ? generated.documents : []).map((document) => (
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
            {(generated.risk_notes?.length ? generated.risk_notes : []).map((note) => (
              <div key={note} className="rounded-2xl border border-amber-400/15 bg-amber-500/5 px-4 py-3 text-sm leading-7 text-white/78">
                {note}
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="mt-5">
        <SectionTitle icon={Mail} label="Reminder drafts" subtitle="AI-generated tasks first, drafts later" />
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/70">
          Draft generation can be added next once you are happy with recap parsing and task quality.
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
  }>;
}) {
  return (
    <Surface>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
            No tasks returned for this section.
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
                <div className="mt-2 font-semibold text-white/88">{item.clause_source_title}</div>
                <div className="mt-1 leading-7">{item.clause_source_text}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Why this matters</div>
                <div className="mt-2 leading-7">{item.why_matters}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Risk if missed</div>
                <div className="mt-2 leading-7">{item.risk_if_missed}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/[0.06]"
              >
                <Upload className="h-3.5 w-3.5" />
                Review task
              </button>
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

type ActivityIcon =
  | typeof Activity
  | typeof FileSearch
  | typeof FileStack
  | typeof AlertTriangle
  | typeof Mail
  | typeof Clock3
  | typeof TimerReset
  | typeof Filter;
