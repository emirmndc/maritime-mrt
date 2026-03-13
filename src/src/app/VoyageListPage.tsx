import { CTAButton, AppShell, Surface, StatusPill } from "./ui";
import { voyages } from "./data";

export function VoyageListPage() {
  return (
    <AppShell
      eyebrow="Voyages"
      title="Operational voyages at a glance."
      description="This list is the future home for real recap-backed voyages. For now it shows seeded examples with route, freight status, next deadline, and risk posture."
    >
      <div className="grid gap-5">
        {voyages.map((voyage) => (
          <Surface key={voyage.id}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{voyage.route}</h2>
                  <StatusPill status={voyage.id === "demo" ? "active" : "pending"} />
                </div>
                <p className="mt-2 text-white/65">
                  {voyage.cargo} • {voyage.owner} vs {voyage.charterer}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoCard label="Freight" value={voyage.freight} />
                  <InfoCard label="Status" value={voyage.status} />
                  <InfoCard label="Next deadline" value={voyage.nextDeadline} />
                  <InfoCard label="Risk" value={voyage.riskLevel} />
                </div>
              </div>
              <div className="flex shrink-0 items-start">
                <CTAButton route="/app/voyages/demo">Open dashboard</CTAButton>
              </div>
            </div>
          </Surface>
        ))}
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
