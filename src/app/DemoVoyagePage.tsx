import { AlertTriangle, FileStack, Mail, Siren, TimerReset } from "lucide-react";
import { demoVoyage } from "./data";
import { AppShell, Surface, StatusPill } from "./ui";

export function DemoVoyagePage() {
  return (
    <AppShell
      eyebrow="Demo Dashboard"
      title="Single voyage, single dashboard."
      description="This demo maps the Blue Sea Shipping / AgriWave Trading voyage into one operational view: obligations, triggers, documents, message drafts, and risk notes."
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold">{demoVoyage.route}</h2>
            <StatusPill status="active" />
          </div>
          <p className="mt-3 text-white/68">
            {demoVoyage.cargo} • Broker: {demoVoyage.broker} • Freight: {demoVoyage.freight}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {demoVoyage.summary.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
                <div className="mt-2 text-sm font-semibold leading-6 text-white/90">{value}</div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
              <Siren className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Critical triggers</div>
              <div className="mt-1 text-2xl font-bold">Clause-linked milestones</div>
            </div>
          </div>
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
            <SectionTitle icon={AlertTriangle} label="Risk notes" subtitle="System flags, not legal conclusions" />
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

function TaskColumn({
  title,
  items,
}: {
  title: string;
  items: typeof demoVoyage.ownerTasks;
}) {
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
  icon: typeof FileStack;
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
