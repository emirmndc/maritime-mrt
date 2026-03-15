import { useMemo } from "react";
import { CTAButton, AppShell, Surface } from "./ui";
import { loadGeneratedVoyage } from "./generatedVoyage";

export function VoyageListPage() {
  const generated = typeof window !== "undefined" ? loadGeneratedVoyage() : null;

  const voyageCard = useMemo(() => {
    if (!generated) return null;

    return {
      route:
        generated.route ||
        `${generated.loadport || "Unknown"} › ${generated.disport || "Unknown"}`,
      cargo: generated.cargo || "Pending review",
      owner: generated.owner || "Pending review",
      charterer: generated.charterer || "Pending review",
      status: generated.voyage_status || "Pending review",
      upcomingTrigger: generated.upcoming_trigger || "Pending review",
      nextDeadline: generated.next_deadline || "Pending review",
      health: generated.voyage_health || "Pending review",
      commercialRisk: generated.commercial_risk || "Pending review",
    };
  }, [generated]);

  return (
    <AppShell
      eyebrow="Voyages"
      title="Operational voyages at a glance."
      description="This screen now shows the most recent AI-generated voyage from Try Demo. Seeded mock voyages have been removed."
    >
      {!voyageCard ? (
        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">No generated voyage</div>
          <h2 className="mt-3 text-2xl font-bold">Nothing has been generated yet.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-white/70">
            Use Try Demo, paste a recap, and generate a dashboard. The latest generated voyage will appear here.
          </p>
          <div className="mt-6">
            <CTAButton route="/app/try-demo">Go to Try Demo</CTAButton>
          </div>
        </Surface>
      ) : (
        <div className="grid gap-5">
          <Surface>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{voyageCard.route}</h2>
                  <span className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
                    Latest generated
                  </span>
                </div>
                <p className="mt-2 text-white/65">
                  {voyageCard.cargo} • {voyageCard.owner} vs {voyageCard.charterer}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <InfoCard label="Status" value={voyageCard.status} />
                  <InfoCard label="Upcoming trigger" value={voyageCard.upcomingTrigger} />
                  <InfoCard label="Next deadline" value={voyageCard.nextDeadline} />
                  <InfoCard label="Voyage health" value={voyageCard.health} />
                  <InfoCard label="Commercial risk" value={voyageCard.commercialRisk} />
                </div>
              </div>
              <div className="flex shrink-0 items-start">
                <CTAButton route="/app/generated-dashboard">Open dashboard</CTAButton>
              </div>
            </div>
          </Surface>
        </div>
      )}
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
