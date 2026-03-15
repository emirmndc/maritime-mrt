import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { AppShell, Surface, StatusPill } from "./ui";

const sampleRecap = `Owner: Northshore Bulk Pte. Ltd.
Charterer: Golden Delta Foods
Broker: Harborline Brokers
Cargo: 4,800 MT corn
Loadport: Novorise
Disport: Southbay
Freight: USD 168,000 payable within 3 banking days after signing of B/L.
NOR to be tendered within laycan and at permitted tender location.
SOF, NOR, laytime sheet, and supporting correspondence required for claim review.
Demurrage rate: USD 6,000 PD.
Claim deadline: 15 business days after discharge.`;

type ParseResult = {
  owner: string;
  charterer: string;
  broker: string;
  cargo: string;
  loadport: string;
  disport: string;
  freight_term: string;
  demurrage: string;
  claim_deadline: string;
  voyage_status: string;
  upcoming_trigger: string;
  voyage_health: string;
  commercial_risk: string;
  flags: string[];
};

export function TryDemoPage() {
  const [recapText, setRecapText] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateDashboard() {
    if (!recapText.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/parse-recap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recap: recapText }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Parsing failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      eyebrow="Interactive Demo"
      title="Recap to dashboard demo."
      description="Paste a voyage recap and let Gemini turn it into structured dashboard signals. This is an experimental demo and still requires human review."
    >
      <div className="grid gap-5">
        <Surface>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Experimental demo</div>
            <StatusPill status={result ? "complete" : recapText.trim() ? "ready" : "pending"} />
          </div>

          <h2 className="mt-3 text-2xl font-bold">Paste voyage recap</h2>
          <p className="mt-3 text-white/68">
            This version sends recap text to a secure server-side Gemini endpoint and renders the extracted result below.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setRecapText(sampleRecap);
                setResult(null);
                setError("");
              }}
              className="rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f]"
            >
              Try sample voyage
            </button>

            <button
              type="button"
              onClick={() => {
                setRecapText("");
                setResult(null);
                setError("");
              }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/85"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={generateDashboard}
              disabled={loading || !recapText.trim()}
              className="inline-flex items-center gap-2 rounded-full border border-[#4f97e8]/25 bg-[#3373B7]/10 px-5 py-3 text-sm font-semibold text-[#cfe7ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Generating..." : "Generate dashboard"}
            </button>
          </div>

          <div className="mt-6">
            <textarea
              value={recapText}
              onChange={(event) => {
                setRecapText(event.target.value);
                setResult(null);
                setError("");
              }}
              placeholder="Paste recap text here..."
              className="min-h-[260px] w-full rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InfoCard
              label="Demo state"
              value={result ? "Gemini extraction generated" : recapText.trim() ? "Ready to parse" : "Waiting for recap input"}
            />
            <InfoCard
              label="Current mode"
              value={result ? "Live Gemini server-side parsing" : "Input preparation"}
            />
            <InfoCard
              label="Review note"
              value="AI output is assistive; always review recap wording before relying on it."
            />
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}
        </Surface>

        {result ? (
          <Surface>
            <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Generated preview</div>
            <h2 className="mt-3 text-2xl font-bold">Recap parsed into dashboard signals</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoCard label="Owner" value={result.owner || "Not found"} />
              <InfoCard label="Charterer" value={result.charterer || "Not found"} />
              <InfoCard label="Broker" value={result.broker || "Not found"} />
              <InfoCard label="Cargo" value={result.cargo || "Not found"} />
              <InfoCard label="Loadport" value={result.loadport || "Not found"} />
              <InfoCard label="Disport" value={result.disport || "Not found"} />
              <InfoCard label="Voyage status" value={result.voyage_status || "Pending review"} />
              <InfoCard label="Upcoming trigger" value={result.upcoming_trigger || "Pending review"} />
              <InfoCard label="Voyage health" value={result.voyage_health || "Pending review"} />
              <InfoCard label="Commercial risk" value={result.commercial_risk || "Pending review"} />
              <InfoCard label="Freight term" value={result.freight_term || "Not found"} />
              <InfoCard label="Demurrage" value={result.demurrage || "Not found"} />
              <InfoCard label="Claim deadline" value={result.claim_deadline || "Not found"} />
            </div>

            <div className="mt-5">
              <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Flags</div>
              <div className="mt-3 grid gap-3">
                {(result.flags?.length ? result.flags : ["No flags returned"]).map((flag) => (
                  <div
                    key={flag}
                    className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
                  >
                    Warning: {flag}
                  </div>
                ))}
              </div>
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
