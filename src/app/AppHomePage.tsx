import { Database, FileText, Route, Sparkles } from "lucide-react";
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
      description="This app section turns a voyage recap into an operational dashboard. The current build now surfaces parser output, voyage health, commercial risk, upcoming trigger, and action-led workflow cards."
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
            parser output, documents, message drafts, and review-oriented flags. Payments and legal decisioning remain out of scope.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton route="/app/try-demo">Try the demo</CTAButton>
            <CTAButton route="/app/voyages">Open voyage list</CTAButton>
            <CTAButton route="/app/generated-dashboard">Open generated dashboard</CTAButton>
          </div>
        </Surface>

        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">
            How it works
          </div>
          <div className="mt-3 text-3xl font-bold">Start here before generating anything</div>
          <div className="mt-2 text-white/65">
            This demo is designed to turn one voyage recap into a structured review dashboard. Use the flow below so the output makes sense on first pass.
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Step 1" value="Open Try Demo and paste your voyage recap text." />
            <InfoCard label="Step 2" value="Generate the dashboard from the recap using the AI parser." />
            <InfoCard label="Step 3" value="Review owner tasks, charterer tasks, risks, and deadlines." />
            <InfoCard label="Step 4" value="Use Voyages to reopen the latest generated result in this session." />
          </div>
          <div className="mt-6">
            <CTAButton route="/app/try-demo">Start with Try Demo</CTAButton>
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
