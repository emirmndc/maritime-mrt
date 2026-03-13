import { Database, FileText, Route, Sparkles } from "lucide-react";
import { demoVoyage } from "./data";
import { CTAButton, AppShell, Surface, StatusPill } from "./ui";
import { getSupabaseStatusLabel } from "./supabase";

const pillars = [
  {
    title: "Recap upload",
    text: "Load recap text, PDF, or email into one operational workflow surface.",
    icon: FileText,
  },
  {
    title: "Clause to task engine",
    text: "Turn payment, notice, NOR, and claim clauses into visible responsibilities.",
    icon: Sparkles,
  },
  {
    title: "Voyage timeline",
    text: "Track arrival, NOR, loading, B/L, discharge, and claim events in sequence.",
    icon: Route,
  },
  {
    title: "Connected data layer",
    text: "Supabase is wired for the next step: auth, storage, documents, and events.",
    icon: Database,
  },
];

export function AppHomePage() {
  return (
    <AppShell
      eyebrow="MVP Workspace"
      title="Recap in, tasks out, deadlines visible."
      description="This app section turns a voyage recap into an operational dashboard. The current build now surfaces parser output, voyage health, next trigger, and action-led workflow cards."
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Surface>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status="ready" />
            <span className="text-sm text-white/60">{getSupabaseStatusLabel()}</span>
          </div>
          <h2 className="mt-5 text-3xl font-bold">Start with one bounded workflow proof.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-white/70">
            The first app pass focuses on one voyage dashboard: voyage status, owner and charterer actions, trigger tracking,
            parser output, documents, message drafts, and risk flags. Payments and legal decisioning remain out of scope.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton route="/app/voyages">Open voyage list</CTAButton>
            <CTAButton route="/app/voyages/demo">Open demo dashboard</CTAButton>
          </div>
        </Surface>

        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Featured voyage</div>
          <div className="mt-3 text-3xl font-bold">{demoVoyage.route}</div>
          <div className="mt-2 text-white/65">{demoVoyage.cargo}</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Voyage status" value={demoVoyage.stage} />
            <InfoCard label="Next trigger" value={demoVoyage.nextTrigger} />
            <InfoCard label="Voyage health" value={demoVoyage.health.label} />
            <InfoCard label="Top flag" value={demoVoyage.flags[0]?.title ?? "No active flag"} />
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Surface key={pillar.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-5 text-xl font-semibold">{pillar.title}</div>
              <p className="mt-3 text-[15px] leading-7 text-white/68">{pillar.text}</p>
            </Surface>
          );
        })}
      </div>
    </AppShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 font-semibold">{value}</div>
    </div>
  );
}
