import { useMemo, useState } from "react";
import { AppShell, Surface, StatusPill } from "./ui";

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

type ParseState = "idle" | "ready" | "generated";

export function TryDemoPage() {
  const [recapText, setRecapText] = useState("");
  const [parseState, setParseState] = useState<ParseState>("idle");

  const generatedSummary = useMemo(() => {
    if (parseState !== "generated") {
      return null;
    }

    return [
      ["Voyage status", "LOADING"],
      ["Upcoming trigger", "B/L signing"],
      ["Commercial risk", "Medium"],
      ["Freight term", "3 banking days after B/L signing"],
      ["Demurrage", "USD 6,000 PD"],
      ["Claim deadline", "15 business days after discharge"],
    ];
  }, [parseState]);

  return (
    <AppShell
      eyebrow="Interactive Demo"
      title="Recap to dashboard demo."
      description="Paste a voyage recap and see how the system could turn it into an operational dashboard. This is an experimental demo."
    >
      <div className="grid gap-5">
        <Surface>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Experimental demo</div>
            <StatusPill status={parseState === "generated" ? "complete" : parseState === "ready" ? "ready" : "pending"} />
          </div>

          <h2 className="mt-3 text-2xl font-bold">Paste voyage recap</h2>
          <p className="mt-3 text-white/68">
            This is the playground entry point. For now it simulates recap-to-dashboard flow before live AI extraction is connected.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setRecapText(sampleRecap);
                setParseState("ready");
              }}
              className="rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f]"
            >
              Try sample voyage
            </button>

            <button
              type="button"
              onClick={() => {
                setRecapText("");
                setParseState("idle");
              }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/85"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => {
                if (recapText.trim()) {
                  setParseState("generated");
                }
              }}
              className="rounded-full border border-[#4f97e8]/25 bg-[#3373B7]/10 px-5 py-3 text-sm font-semibold text-[#cfe7ff]"
            >
              Generate dashboard
            </button>
          </div>

          <div className="mt-6">
            <textarea
              value={recapText}
              onChange={(event) => {
                const nextValue = event.target.value;
                setRecapText(nextValue);
                setParseState(nextValue.trim() ? "ready" : "idle");
              }}
              placeholder="Paste recap text here..."
              className="min-h-[260px] w-full rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InfoCard
              label="Demo state"
              value={
                parseState === "generated"
                  ? "Dashboard preview generated"
                  : parseState === "ready"
                    ? "Recap loaded and ready"
                    : "Waiting for recap input"
              }
            />
            <InfoCard
              label="Current mode"
              value={parseState === "generated" ? "Simulated extraction output" : "Input preparation"}
            />
            <InfoCard
              label="Next step"
              value={parseState === "generated" ? "Connect live AI parser" : "Paste recap or load sample voyage"}
            />
          </div>
        </Surface>

        {generatedSummary ? (
          <Surface>
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Generated preview</div>
            <h2 className="mt-3 text-2xl font-bold">Recap parsed into dashboard signals</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {generatedSummary.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-white/90">{value}</div>
                </div>
              ))}
            </div>
          </Surface>
        ) : null}
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
