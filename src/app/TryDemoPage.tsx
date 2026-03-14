import { useState } from "react";
import { AppShell, Surface } from "./ui";

const sampleRecap = `Owner: Northshore Bulk Pte. Ltd.
Charterer: Golden Delta Foods
Broker: Harborline Brokers
Cargo: 4,800 MT corn
Loadport: Novorise
Disport: Southbay
Freight: USD 168,000
Payment term: Freight payable within 3 banking days after signing of B/L.
NOR to be tendered within laycan and at permitted tender location.
SOF, NOR, laytime sheet, and supporting correspondence required for claim review.
Demurrage rate: USD 6,000 PD.
Claim deadline: 15 business days after discharge.`;

export function TryDemoPage() {
  const [recapText, setRecapText] = useState("");
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  return (
    <AppShell
      eyebrow="Interactive Demo"
      title="Recap to dashboard demo."
      description="Paste a voyage recap and see how the system could turn it into an operational dashboard. This is an experimental demo."
    >
      <div className="grid gap-5">
        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Experimental demo</div>
          <h2 className="mt-3 text-2xl font-bold">Paste voyage recap</h2>
          <p className="mt-3 text-white/68">
            This is the playground entry point. For now it accepts recap text and prepares the flow for the next AI parsing step.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setRecapText(sampleRecap);
                setStatus("ready");
              }}
              className="rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f]"
            >
              Try sample voyage
            </button>

            <button
              type="button"
              onClick={() => {
                setRecapText("");
                setStatus("idle");
              }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/85"
            >
              Clear
            </button>
          </div>

          <div className="mt-6">
            <textarea
              value={recapText}
              onChange={(event) => {
                setRecapText(event.target.value);
                setStatus(event.target.value.trim() ? "ready" : "idle");
              }}
              placeholder="Paste recap text here..."
              className="min-h-[260px] w-full rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoCard
              label="Demo state"
              value={status === "ready" ? "Recap loaded and ready for AI parse" : "Waiting for recap input"}
            />
            <InfoCard
              label="Next step"
              value={status === "ready" ? "Connect AI extraction and render generated dashboard" : "Paste recap or load sample voyage"}
            />
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
