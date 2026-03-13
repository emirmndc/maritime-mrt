import { AlertTriangle, FileSearch, FileStack, Mail, Activity, Siren, TimerReset, TriangleAlert, Upload } from "lucide-react";
import { demoVoyage } from "./data";
import { AppShell, Surface, StatusPill } from "./ui";
import type { TaskItem } from "./types";

const healthTone = {
  low: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  medium: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  high: "border-rose-400/20 bg-rose-500/10 text-rose-200",
} as const;

const flagTone = {
  medium: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  high: "border-rose-400/20 bg-rose-500/10 text-rose-100",
} as const;

export function DemoVoyagePage() {
  return (
    <AppShell
      eyebrow="Demo Dashboard"
      title="Single voyage, single dashboard."
      description="This demo maps a fictional voyage into one operational view: status, health, parser output, actions, documents, message drafts, and risk notes."
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
            <TopMetric label="Next trigger" value={demoVoyage.nextTrigger} />
            <TopMetric label="Next deadline" value={demoVoyage.nextDeadline} />
            <TopMetric label="Risk" value={demoVoyage.riskLevel} />
          </div>
        </Surface>

        <Surface>
          <SectionTitle icon={Activity} label="Voyage health" subtitle={demoVoyage.health.label} />
          <div className={`mt-5 rounded-2xl border px-4 py-4 ${healthTone[demoVoyage.health.tone]}`}>
            <div className="text-sm font-semibold">Voyage health: {demoVoyage.health.label}</div>
            <div className="mt-3 space-y-2 text-sm leading-7">
              {demoVoyage.health.reasons.map((reason) => (
                <div key={reason}>- {reason}</div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {demoVoyage.flags.map((flag) => (
              <div key={flag.title} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${flagTone[flag.severity]}`}>
                <TriangleAlert className="h-4 w-4" />
                <span>⚠ {flag.title}</span>
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
          <SectionTitle icon={Siren} label="Critical triggers" subtitle="Clause-linked milestones" />
          <div className="mt-5 grid gap-3">
            {demoVoyage.triggers.map((trigger) => (
              <div key={trigger} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
                {trigger}
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <TaskColumn title="Owner tasks" items={demoVoyage.ownerTasks} />
        <TaskColumn title="Charterer tasks" items={demoVoyage.chartererTasks} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <SectionTitle icon={TimerReset} label="Timeline" subtitle="Event and document flow" />
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
            <SectionTitle icon={FileStack} label="Pending documents" subtitle="Evidence and support pack" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {demoVoyage.documents.map((document) => (
                <div key={document} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
                  {document}
                </div>
              ))}
            </div>
          </Surface>

          <Surface>
            <SectionTitle icon={AlertTriangle} label="System flags" subtitle="Operational cautions" />
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

function TaskColumn({ title, items }: { title: string; items: TaskItem[] }) {
  return (
    <Surface>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-semibold">{item.title}</div>
              <StatusPill status={item.status} />
            </div>
            <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
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

type ActivityIcon =
  | typeof Activity
  | typeof FileSearch
  | typeof Siren
  | typeof TimerReset
  | typeof FileStack
  | typeof AlertTriangle
  | typeof Mail;
