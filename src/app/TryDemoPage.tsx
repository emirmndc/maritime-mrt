import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  LoaderCircle,
  Radar,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { loadGeneratedVoyage, saveGeneratedVoyage, type GeneratedVoyage } from "./generatedVoyage";
import { navigateTo } from "./router";

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

function AccentWord({
  children,
  tone = "cool",
}: {
  children: ReactNode;
  tone?: "cool" | "warm";
}) {
  return (
    <span
      className={[
        "ml-[0.12em] inline bg-clip-text font-semibold tracking-[-0.04em] text-transparent",
        tone === "warm"
          ? "bg-[linear-gradient(135deg,#ffd4c7_0%,#ff9b78_55%,#ff8b69_100%)]"
          : "bg-[linear-gradient(135deg,#e1e6ff_0%,#9cb2ff_55%,#7e95ff_100%)]",
      ].join(" ")}
      style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
    >
      {children}
    </span>
  );
}

export function TryDemoPage() {
  const [recapText, setRecapText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<GeneratedVoyage | null>(() =>
    typeof window !== "undefined" ? loadGeneratedVoyage() : null,
  );

  async function generateSignal() {
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
        throw new Error(data?.error || "Signal generation failed");
      }

      saveGeneratedVoyage(data);
      setGenerated(data);

      requestAnimationFrame(() => {
        document.getElementById("demo-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const routeLabel =
    generated?.route ||
    [generated?.loadport, generated?.disport].filter(Boolean).join(" to ") ||
    "Awaiting generated route";

  const riskNotes = (generated?.risk_notes || []).map((note) =>
    typeof note === "string" ? note : note.body,
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05060d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,133,255,0.16),transparent_24%),radial-gradient(circle_at_80%_16%,rgba(255,147,118,0.12),transparent_20%),radial-gradient(circle_at_28%_92%,rgba(255,145,112,0.1),transparent_22%),radial-gradient(circle_at_84%_90%,rgba(97,115,255,0.12),transparent_24%),linear-gradient(180deg,#06070d_0%,#090912_46%,#06070e_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen"
        style={{
          backgroundImage: "url('/media/hero-texture.jpg')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[#5168ff]/16 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-80px] top-[440px] h-80 w-80 rounded-full bg-[#ff8f6f]/16 blur-[150px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-120px] h-[560px] bg-[radial-gradient(circle_at_22%_74%,rgba(255,145,112,0.11),transparent_22%),radial-gradient(circle_at_82%_84%,rgba(97,115,255,0.12),transparent_24%),linear-gradient(180deg,transparent_0%,rgba(10,10,18,0.16)_24%,rgba(11,11,21,0.78)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1540px] px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-30 rounded-[34px] border border-white/10 bg-[linear-gradient(90deg,rgba(14,14,27,0.92),rgba(24,21,46,0.92),rgba(15,13,30,0.92))] px-6 py-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(3,4,10,0.48)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/76 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to landing
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo("/off-hire-demo")}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Open off-hire demo
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <a
                href="https://polygonscan.com/token/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                PolygonScan
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </header>

        <main className="pt-14 lg:pt-20">
          <section className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[0.82fr_1.18fr] lg:pt-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb29a]">
                Demo
              </div>
              <h1
                className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Voyage recap
                <br />
                to operational <AccentWord>signal.</AccentWord>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/66 sm:text-lg">
                Paste recap text, generate a review-friendly structure, and keep
                the outcome assistive. This is one of two bounded product demos:
                the recap rail for operational signal, and the off-hire rail for
                disputed deduction control.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(10,11,21,0.92))] shadow-[0_34px_110px_rgba(4,5,12,0.56)] backdrop-blur-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-white/42">
                    Current state
                  </div>
                  <div className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    {generated ? "Generated signal loaded" : "Waiting for recap input"}
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8da4ff]/18 bg-[#7f97ff]/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-[#dbe3ff]">
                  <Radar className="h-3.5 w-3.5" />
                  Demo only
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
                <div className="border-b border-white/10 px-6 py-6 lg:border-b-0 lg:border-r">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                    Signal route
                  </div>
                  <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {routeLabel}
                  </div>
                  <div className="mt-4 text-sm leading-7 text-white/58">
                    {generated?.voyage_health ||
                      "Generate output to reveal health tone, deadline pressure, and document requirements."}
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                    Review principle
                  </div>
                  <div className="mt-4 flex items-start gap-3 text-sm leading-7 text-white/60">
                    <ShieldAlert className="mt-1 h-4 w-4 shrink-0 text-[#ffb29a]" />
                    The output is assistive, trace-minded, and intentionally not a final commercial or legal decision.
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mt-10 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(11,12,22,0.92))] shadow-[0_30px_100px_rgba(4,5,12,0.48)] backdrop-blur-xl">
            <div className="grid gap-0 lg:grid-cols-[0.96fr_1.04fr]">
              <div className="border-b border-white/10 px-6 py-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                    Input
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#95a8ff]">
                    Paste a real or sample recap
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRecapText(sampleRecap);
                      setError("");
                    }}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/86 transition hover:border-white/18 hover:bg-white/[0.07]"
                  >
                    Use sample recap
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecapText("");
                      setError("");
                    }}
                    className="rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/62 transition hover:border-white/18 hover:text-white"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={generateSignal}
                    disabled={loading || !recapText.trim()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#ffb59b]/30 bg-[linear-gradient(135deg,rgba(255,167,143,0.96),rgba(255,122,92,0.9))] px-5 py-2.5 text-sm font-semibold text-[#180d12] shadow-[0_18px_40px_rgba(255,130,101,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {loading ? "Generating signal" : "Generate signal"}
                  </button>
                </div>

                <textarea
                  value={recapText}
                  onChange={(event) => {
                    setRecapText(event.target.value);
                    setError("");
                  }}
                  placeholder="Paste recap text here..."
                  className="mt-6 min-h-[340px] w-full resize-none rounded-[28px] border border-white/10 bg-black/15 px-5 py-5 text-sm leading-7 text-white outline-none placeholder:text-white/30"
                />

                {error ? (
                  <div className="mt-5 rounded-[22px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="px-6 py-6 lg:px-8 lg:py-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                  Live summary
                </div>

                <div className="mt-6 border-t border-white/10">
                  <PreviewLine label="Route" value={routeLabel} />
                  <PreviewLine
                    label="Health"
                    value={generated?.voyage_health || "Pending review"}
                  />
                  <PreviewLine
                    label="Commercial risk"
                    value={generated?.commercial_risk || "Pending review"}
                  />
                  <PreviewLine
                    label="Next deadline"
                    value={generated?.next_deadline || generated?.claim_deadline || "Pending review"}
                  />
                </div>

                <div className="mt-8 rounded-[26px] border border-white/10 bg-black/15 px-5 py-5">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#ffb29a]">
                    Read before action
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    The system helps teams structure recap language. It should not
                    override contract review, claims analysis, or commercial
                    judgment.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="demo-results" className="pt-20">
            <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb29a]">
                  Output
                </div>
                <h2
                  className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                  style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
                >
                  Structured,
                  <br />
                  reviewable, <AccentWord>assistive.</AccentWord>
                </h2>
                <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                  Once generated, the output stays on this same page. No extra
                  dashboard branches, no route sprawl.
                </p>
              </div>

              <div>
                {generated ? (
                  <div className="border-t border-white/10">
                    <ResultRow label="Owner" value={generated.owner || "Pending review"} />
                    <ResultRow label="Charterer" value={generated.charterer || "Pending review"} />
                    <ResultRow label="Broker" value={generated.broker || "Pending review"} />
                    <ResultRow label="Cargo" value={generated.cargo || "Pending review"} />
                    <ResultRow label="Freight term" value={generated.freight_term || "Pending review"} />
                  </div>
                ) : (
                  <EmptyState text="Generate a recap signal to populate the structured output sections below." />
                )}
              </div>
            </div>

            <div className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#95a8ff]">
                  Flags
                </div>
                <h3
                  className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
                  style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
                >
                  Risk signals and <AccentWord tone="warm">cautions.</AccentWord>
                </h3>
              </div>

              <div className="border-t border-white/10">
                {generated?.flags?.length ? (
                  generated.flags.slice(0, 4).map((flag) => (
                    <ResultRow
                      key={flag.title}
                      label={flag.severity.toUpperCase()}
                      value={`${flag.title} - ${flag.guidance}`}
                    />
                  ))
                ) : riskNotes.length ? (
                  riskNotes.slice(0, 4).map((note, index) => (
                    <ResultRow key={`${note}-${index}`} label="NOTE" value={note} />
                  ))
                ) : (
                  <EmptyState text="No flags yet. Generated cautions and timing notes will appear here." />
                )}
              </div>
            </div>

            <div className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb29a]">
                  Documents
                </div>
                <div className="mt-6 border-t border-white/10">
                  {generated?.documents?.length ? (
                    generated.documents.slice(0, 6).map((document) => (
                      <ResultRow
                        key={document.title}
                        label={document.status.replace("_", " ").toUpperCase()}
                        value={document.title}
                      />
                    ))
                  ) : (
                    <EmptyState text="Document requirements will appear here once the recap is parsed." />
                  )}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#95a8ff]">
                  Tasks
                </div>
                <div className="mt-6 border-t border-white/10">
                  {generated?.owner_tasks?.length || generated?.charterer_tasks?.length ? (
                    [...(generated.owner_tasks || []), ...(generated.charterer_tasks || [])]
                      .slice(0, 6)
                      .map((task) => (
                        <ResultRow
                          key={task.title}
                          label={task.status.toUpperCase()}
                          value={`${task.title} - ${task.detail}`}
                        />
                      ))
                  ) : (
                    <EmptyState text="Suggested follow-up tasks will appear here after generation." />
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-3 border-b border-white/10 py-4 last:border-b-0 lg:grid-cols-[130px_1fr]">
      <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">{label}</div>
      <div className="text-sm font-semibold leading-7 text-white/82">{value}</div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-3 border-b border-white/10 py-5 last:border-b-0 lg:grid-cols-[138px_1fr]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        {label}
      </div>
      <div className="text-base leading-8 text-white/74">{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.03] px-5 py-5 text-sm leading-7 text-white/56">
      {text}
    </div>
  );
}
