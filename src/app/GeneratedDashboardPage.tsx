import { AppShell, CTAButton, Surface } from "./ui";
import { loadGeneratedVoyage } from "./generatedVoyage";

export function GeneratedDashboardPage() {
  const result = typeof window !== "undefined" ? loadGeneratedVoyage() : null;

  if (!result) {
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

  return (
    <AppShell
      eyebrow="Generated Dashboard"
      title="AI-generated voyage dashboard."
      description="This screen shows the result of the recap you just parsed. Treat it as assistive output and review the recap wording before relying on it."
    >
      <div className="grid gap-5">
        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Voyage summary</div>
          <h2 className="mt-3 text-2xl font-bold">
            {(result.loadport || "Unknown")} › {(result.disport || "Unknown")}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Owner" value={result.owner || "Not found"} />
            <InfoCard label="Charterer" value={result.charterer || "Not found"} />
            <InfoCard label="Broker" value={result.broker || "Not found"} />
            <InfoCard label="Cargo" value={result.cargo || "Not found"} />
            <InfoCard label="Voyage status" value={result.voyage_status || "Pending review"} />
            <InfoCard label="Upcoming trigger" value={result.upcoming_trigger || "Pending review"} />
            <InfoCard label="Voyage health" value={result.voyage_health || "Pending review"} />
            <InfoCard label="Commercial risk" value={result.commercial_risk || "Pending review"} />
          </div>
        </Surface>

        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Extracted terms</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoCard label="Loadport" value={result.loadport || "Not found"} />
            <InfoCard label="Disport" value={result.disport || "Not found"} />
            <InfoCard label="Freight term" value={result.freight_term || "Not found"} />
            <InfoCard label="Demurrage" value={result.demurrage || "Not found"} />
            <InfoCard label="Claim deadline" value={result.claim_deadline || "Not found"} />
          </div>
        </Surface>

        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Flags</div>
          <div className="mt-4 grid gap-3">
            {(result.flags?.length ? result.flags : ["No flags returned"]).map((flag) => (
              <div
                key={flag}
                className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
              >
                Warning: {flag}
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </AppShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-white/90">{value}</div>
    </div>
  );
}
