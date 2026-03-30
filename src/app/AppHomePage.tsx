import { AppShell, CTAButton, Surface, StatusPill } from "./ui";
import { getSupabaseStatusLabel } from "./supabase";

const workflowTrack = [
  {
    step: "01",
    title: "Load one recap",
    text: "Start from one voyage recap and derive a bounded case instead of navigating a broad module catalog.",
  },
  {
    step: "02",
    title: "Discipline the evidence",
    text: "Keep evidence voyage-scoped, role-aware, and explicitly tied to the active package.",
  },
  {
    step: "03",
    title: "Isolate the disputed remainder",
    text: "Separate admitted payable amount from the disputed portion before anything moves into settlement review.",
  },
];

const liveRegister = [
  "Recap-driven case review surface",
  "Voyage-scoped evidence intake",
  "Dispute package staging and settlement demo",
];

const boundaryRegister = [
  "No live evidence network",
  "No mainnet dispute release rail",
  "No broad maritime operating system",
];

export function AppHomePage() {
  return (
    <AppShell
      eyebrow="Workflow Proof"
      title="Port Cost Vault-first workflow proof"
      description="The app should be read as one narrow operational path: recap intake, evidence discipline, disputed remainder logic, and a case file that can move into settlement review."
    >
      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status="ready" />
            <span className="text-sm text-white/58">{getSupabaseStatusLabel()}</span>
          </div>

          <div className="mt-5 border-t border-white/8 pt-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8eb9e7]">
              Default route
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white">
              Start from one case, not from many modules
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/66">
              The current proof is intentionally narrow. It is closer to a case worksheet than to a
              platform dashboard: DA advance review, invoice support, linked evidence, admitted
              payable amount, and disputed remainder.
            </p>
          </div>

          <div className="mt-6 border border-white/8 bg-[#0d141c] p-5">
            {workflowTrack.map((item) => (
              <div
                key={item.step}
                className="grid gap-3 border-t border-white/8 py-4 first:border-t-0 first:pt-0 md:grid-cols-[70px_1fr]"
              >
                <div className="text-sm font-semibold tracking-[0.2em] text-[#8eb9e7]">
                  {item.step}
                </div>
                <div>
                  <div className="text-base font-semibold text-white">{item.title}</div>
                  <div className="mt-2 text-sm leading-7 text-white/64">{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <div className="grid gap-5">
          <Surface>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8eb9e7]">
              Entry points
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white">
              Open the workflow at the right step
            </div>
            <div className="mt-3 text-sm leading-7 text-white/66">
              Generate a case, inspect the package, then move only a coherent file into the
              settlement demo.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton route="/app/try-demo">Try Demo</CTAButton>
              <CTAButton route="/app/generated-dashboard" tone="secondary">
                Open Case Review
              </CTAButton>
              <CTAButton route="/app/settlement" tone="secondary">
                Open Settlement
              </CTAButton>
            </div>
          </Surface>

          <Surface>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
              Scope boundary
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <RegisterCard title="Live in the proof" items={liveRegister} tone="live" />
              <RegisterCard title="Not in scope now" items={boundaryRegister} tone="boundary" />
            </div>
          </Surface>
        </div>
      </div>
    </AppShell>
  );
}

function RegisterCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "live" | "boundary";
}) {
  return (
    <div className="border border-white/8 bg-[#0d141c] p-4">
      <div
        className={[
          "text-xs font-semibold uppercase tracking-[0.22em]",
          tone === "live" ? "text-[#8eb9e7]" : "text-white/50",
        ].join(" ")}
      >
        {title}
      </div>
      <div className="mt-4 space-y-3 text-sm leading-7 text-white/74">
        {items.map((item) => (
          <div key={item} className="border-t border-white/8 pt-3 first:border-t-0 first:pt-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
