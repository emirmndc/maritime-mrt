import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  FileText,
  MoveRight,
} from "lucide-react";
import { navigateTo } from "./router";

const money0 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const money2 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const caseHeader = {
  title: "OFF-HIRE DISPUTE",
  subtitle: "Hold Cleaning",
  claimedOnAccount: 48000,
  period: "20 Oct 23:00 -> 22 Oct 12:00",
  days: 1.542,
  responseWindow: "72h",
  status: "Owner response pending",
  waitingOn: "Owner response + fuel support review",
};

const financialState = {
  grossHireDue: 270000,
  netPaid: 222000,
  acceptedDeduction: 31500,
  disputedVault: 16500,
};

const calculationBasis = {
  hireRate: 14500,
  addressCommissionPct: 0.0375,
  brokeragePct: 0.0125,
  vlsfoQty: 5.82,
  vlsfoPrice: 500,
  lsmgoQty: 1.3,
  lsmgoPrice: 800,
  cveAnnualEquivalent: 1500,
};

const hireGross = caseHeader.days * calculationBasis.hireRate;
const addressCommission = hireGross * calculationBasis.addressCommissionPct;
const brokerageCommission = hireGross * calculationBasis.brokeragePct;
const hireNet = hireGross - addressCommission - brokerageCommission;
const vlsfoTotal = calculationBasis.vlsfoQty * calculationBasis.vlsfoPrice;
const lsmgoTotal = calculationBasis.lsmgoQty * calculationBasis.lsmgoPrice;
const cve =
  caseHeader.days * ((calculationBasis.cveAnnualEquivalent / 365) * 12);
const totalClaimed = hireNet + vlsfoTotal + lsmgoTotal + cve;
const fuelTotal = vlsfoTotal + lsmgoTotal;

const heroChips = [
  `${format0(financialState.disputedVault)} USD locked`,
  caseHeader.status,
  `Response window ${caseHeader.responseWindow}`,
  "Fuel basis unverified",
];

const caseMeta = [
  {
    label: "Off-hire period",
    value: `${caseHeader.period} (${caseHeader.days.toFixed(3)} days)`,
  },
  { label: "Response window", value: caseHeader.responseWindow },
  { label: "Waiting on", value: caseHeader.waitingOn },
];

const statusSummary = [
  {
    label: "Claimed",
    value: `${money0.format(caseHeader.claimedOnAccount)} USD`,
  },
  {
    label: "Evidenced",
    value: `${money2.format(totalClaimed)} USD`,
  },
  {
    label: "Neutralized",
    value: `${money0.format(financialState.disputedVault)} USD`,
  },
  {
    label: "Status",
    value: "Incomplete",
  },
];

const pressureGroups = [
  {
    label: "Critical",
    tone: "critical",
    items: [
      "Engine / consumption logs missing",
      "Fuel pricing basis unverified",
    ],
  },
  {
    label: "Active dispute",
    tone: "active",
    items: [
      `${format0(financialState.disputedVault)} USD locked in neutral vault`,
      "VLSFO and LSMGO legs challenged",
    ],
  },
  {
    label: "Waiting",
    tone: "waiting",
    items: [
      caseHeader.status,
      "Fuel support review still open",
    ],
  },
] as const;

const nextMoves = [
  {
    step: "01",
    title: "Upload engine / consumption logs",
    note: "Blocking",
  },
  {
    step: "02",
    title: "Confirm ROB quantity support",
    note: "Required",
  },
  {
    step: "03",
    title: "Attach fuel pricing basis",
    note: "Required",
  },
  {
    step: "04",
    title: "Submit owner response",
    note: "Pending release review",
  },
] as const;

const disputeBreakdown = [
  { label: "Hire leg", value: "Partially accepted" },
  { label: "VLSFO leg", value: "Challenged" },
  { label: "LSMGO leg", value: "Challenged" },
  { label: "CVE", value: "Minor" },
];

const evidenceItems = [
  {
    label: "Off-hire notice chain",
    status: "COMPLETE",
    note: "Time leg notice path attached.",
  },
  {
    label: "Noon reports",
    status: "COMPLETE",
    note: "Interval support visible.",
  },
  {
    label: "ROB verification (fuel quantities)",
    status: "UNVERIFIED",
    note: "Quantity support still weak.",
  },
  {
    label: "Engine / consumption logs",
    status: "MISSING",
    note: "Blocking fuel review.",
  },
  {
    label: "Price basis confirmation",
    status: "UNVERIFIED",
    note: "Fuel price basis not confirmed.",
  },
  {
    label: "CP clause reference",
    status: "COMPLETE",
    note: "Clause hook attached.",
  },
] as const;

const formulaRows = [
  {
    title: "H_net",
    formula: "t x R x (1 - ac - bc)",
    detail: `1.542 x ${money0.format(
      calculationBasis.hireRate,
    )} x (1 - 3.75% - 1.25%)`,
    result: `${money2.format(hireNet)} USD`,
  },
  {
    title: "B_g",
    formula: "Q x P",
    detail: `VLSFO ${calculationBasis.vlsfoQty.toFixed(2)} x ${money0.format(
      calculationBasis.vlsfoPrice,
    )} | LSMGO ${calculationBasis.lsmgoQty.toFixed(2)} x ${money0.format(
      calculationBasis.lsmgoPrice,
    )}`,
    result: `${money2.format(fuelTotal)} USD`,
  },
  {
    title: "C_total",
    formula: "H_net + B_vlsfo + B_lsmgo + CVE",
    detail: `Includes ${money2.format(cve)} USD CVE allocation`,
    result: `${money2.format(totalClaimed)} USD`,
  },
];

const guardrailRows = [
  {
    title: "Owner protection",
    body: "Charter cannot hold disputed cash without funding it.",
    tone: "warm",
  },
  {
    title: "Charter legitimacy",
    body: "A funded dispute can stay active while review continues.",
    tone: "base",
  },
  {
    title: "No minimum evidence",
    body: "Claim stays draft until the minimum package exists.",
    tone: "base",
  },
  {
    title: "No price basis or no source",
    body: "Fuel legs stay incomplete or unverified.",
    tone: "base",
  },
] as const;

const flowRows = [
  "Charter opens claim",
  "Claim is structured into legs",
  "Disputed amount funded to vault",
  "Owner responds and negotiation starts",
  "Controlled execution follows outcome",
];

function format0(value: number) {
  return money0.format(value);
}

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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.36em] text-[#f5a78f]">
      {children}
    </div>
  );
}

export function OffHireDemoPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05060d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,133,255,0.18),transparent_24%),radial-gradient(circle_at_76%_16%,rgba(255,147,118,0.12),transparent_20%),radial-gradient(circle_at_24%_90%,rgba(255,145,112,0.11),transparent_24%),radial-gradient(circle_at_84%_90%,rgba(97,115,255,0.12),transparent_24%),linear-gradient(180deg,#06070d_0%,#090912_46%,#06070e_100%)]" />
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
                onClick={() => navigateTo("/demo")}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Open recap demo
                <MoveRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="pt-14 lg:pt-20">
          <section className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:pt-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb29a]">
                Live case
              </div>
              <h1
                className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.055em] text-white sm:text-7xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                {caseHeader.title}
              </h1>
              <div className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#ffd7cc] sm:text-3xl">
                {caseHeader.subtitle}
              </div>
              <div
                className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                <AccentWord tone="warm">
                  {format0(financialState.disputedVault)} USD
                </AccentWord>{" "}
                AT RISK
              </div>
              <div className="mt-4 text-lg font-semibold text-white/84 sm:text-2xl">
                {caseHeader.status}
              </div>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
                Hold cleaning claim with multi-leg deduction structure and a
                funded neutral vault.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroChips.map((chip) => (
                  <StatusChip key={chip}>{chip}</StatusChip>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(10,11,21,0.92))] shadow-[0_34px_110px_rgba(4,5,12,0.56)] backdrop-blur-xl"
            >
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/42">
                  <FileText className="h-3.5 w-3.5" />
                  Current case state
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {caseMeta.map((item) => (
                    <MetaCell key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="border-t border-white/10">
                  {statusSummary.map((row) => (
                    <StatusRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-white/10 bg-black/15 px-4 py-4 text-sm leading-7 text-white/64">
                  Working file supports {money2.format(totalClaimed)} USD.
                  {" "}
                  {format0(financialState.disputedVault)} USD remains locked
                  pending review.
                </div>
              </div>
            </motion.div>
          </section>

          <section className="grid gap-8 pt-14 lg:grid-cols-[1fr_1fr]">
            <PressurePanel />
            <ActionPanel />
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Financial Posture</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                G = N + A + D
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/64 sm:text-lg">
                Gross due, net paid, accepted deduction, and neutralized
                disputed cash.
              </p>
            </div>

            <div className="border-t border-white/10">
              <StatusRow
                label="Gross hire due"
                value={`${format0(financialState.grossHireDue)} USD`}
              />
              <StatusRow
                label="Net paid"
                value={`${format0(financialState.netPaid)} USD`}
              />
              <StatusRow
                label="Accepted deduction"
                value={`${format0(financialState.acceptedDeduction)} USD`}
              />
              <StatusRow
                label="Disputed and neutralized"
                value={`${format0(financialState.disputedVault)} USD`}
                tone="warm"
              />
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Claim Breakdown</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Multi-leg structure,
                <br />
                not one vague <AccentWord tone="warm">deduction.</AccentWord>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/64 sm:text-lg">
                Current working pack supports {money2.format(totalClaimed)} USD.
              </p>
            </div>

            <div className="border-t border-white/10">
              <LegRow
                badge="[Hire Leg]"
                title="Hire loss (net)"
                summary={`${money2.format(hireNet)} USD`}
                details={[
                  `Duration: ${caseHeader.days.toFixed(3)} days`,
                  `Rate: ${format0(calculationBasis.hireRate)} USD/day`,
                  `Gross: ${money2.format(hireGross)}`,
                  `Address commission (3.75%): -${money2.format(addressCommission)}`,
                  `Brokerage commission (1.25%): -${money2.format(brokerageCommission)}`,
                ]}
              />
              <LegRow
                badge="[Fuel Leg - VLSFO]"
                title="VLSFO consumption"
                summary={`${money2.format(vlsfoTotal)} USD`}
                details={[
                  `Quantity: ${calculationBasis.vlsfoQty.toFixed(2)} MT`,
                  `Price: ${format0(calculationBasis.vlsfoPrice)} USD/MT`,
                ]}
              />
              <LegRow
                badge="[Fuel Leg - LSMGO]"
                title="LSMGO consumption"
                summary={`${money2.format(lsmgoTotal)} USD`}
                details={[
                  `Quantity: ${calculationBasis.lsmgoQty.toFixed(2)} MT`,
                  `Price: ${format0(calculationBasis.lsmgoPrice)} USD/MT`,
                ]}
              />
              <LegRow
                badge="[Fixed Cost Leg - CVE]"
                title="CVE allocation"
                summary={`${money2.format(cve)} USD`}
                details={[
                  `Basis: ${format0(calculationBasis.cveAnnualEquivalent)} USD annual equivalent`,
                ]}
              />

              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8ea1ff]">
                  Math snapshot
                </div>
                <div className="mt-4 space-y-5">
                  {formulaRows.map((row) => (
                    <FormulaMiniRow key={row.title} {...row} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Case Support</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Challenged legs
                <br />
                and missing <AccentWord>support.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10 pt-2">
              <div className="py-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8ea1ff]">
                  What is being disputed
                </div>
                <div className="mt-4 border-t border-white/10">
                  {disputeBreakdown.map((item) => (
                    <StatusRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 py-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8ea1ff]">
                  Evidence required
                </div>
                <div className="mt-4 border-t border-white/10">
                  {evidenceItems.map((item) => (
                    <EvidenceRow key={item.label} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Execution Rail</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Hard edges
                <br />
                around live <AccentWord tone="warm">money.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10 pt-2">
              <div className="py-6">
                {guardrailRows.map((row) => (
                  <GuardrailRow key={row.title} {...row} />
                ))}
              </div>

              <div className="border-t border-white/10 py-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8ea1ff]">
                  Workflow
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {flowRows.map((row, index) => (
                    <FlowStep key={row} index={index + 1} text={row} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative mt-10 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,9,17,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(4,5,12,0.46)] sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_26%,rgba(255,149,116,0.09),transparent_20%),radial-gradient(circle_at_78%_72%,rgba(96,116,255,0.12),transparent_24%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#ffb29a]">
                  Final line
                </div>
                <div
                  className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
                  style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
                >
                  Disputed deduction belongs in a vault, not in one party&apos;s
                  pocket.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo("/demo")}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ffb59b]/30 bg-[linear-gradient(135deg,rgba(255,167,143,0.96),rgba(255,122,92,0.9))] px-6 py-3 text-sm font-semibold text-[#180d12] shadow-[0_20px_40px_rgba(255,130,101,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_55px_rgba(255,130,101,0.3)]"
                >
                  Open recap demo
                  <MoveRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo("/")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/82 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Back to landing
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatusChip({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/78">
      {children}
    </div>
  );
}

function MetaCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">
        {label}
      </div>
      <div className="mt-2 text-sm leading-7 text-white/72">{value}</div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  tone = "base",
}: {
  label: string;
  value: string;
  tone?: "base" | "warm";
}) {
  return (
    <div className="grid gap-4 border-b border-white/10 py-4 last:border-b-0 lg:grid-cols-[220px_1fr]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        {label}
      </div>
      <div
        className={[
          "text-base leading-8",
          tone === "warm" ? "text-[#ffd7cc]" : "text-white/76",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function PressurePanel() {
  return (
    <div className="rounded-[30px] border border-[#ff9b78]/18 bg-[linear-gradient(180deg,rgba(255,155,120,0.06),rgba(10,11,21,0.92))] px-6 py-6 shadow-[0_24px_90px_rgba(4,5,12,0.38)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ffb29a]">
        What Matters Now
      </div>
      <div
        className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[2rem]"
        style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
      >
        Operational pressure
      </div>
      <div className="mt-6 space-y-5">
        {pressureGroups.map((group) => (
          <PressureBlock key={group.label} {...group} />
        ))}
      </div>
    </div>
  );
}

function PressureBlock({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "critical" | "active" | "waiting";
  items: readonly string[];
}) {
  const toneClass =
    tone === "critical"
      ? "text-[#ffd1c3]"
      : tone === "active"
        ? "text-[#dce2ff]"
        : "text-white/84";

  const dotClass =
    tone === "critical"
      ? "bg-[#ff8b69]"
      : tone === "active"
        ? "bg-[#8ea1ff]"
        : "bg-white/50";

  return (
    <div className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
      <div className={["text-[10px] font-semibold uppercase tracking-[0.3em]", toneClass].join(" ")}>
        {label}
      </div>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-base leading-8 text-white/76">
            <span className={["mt-3 h-2 w-2 rounded-full", dotClass].join(" ")} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionPanel() {
  return (
    <div className="rounded-[30px] border border-[#8ea1ff]/16 bg-[linear-gradient(180deg,rgba(142,161,255,0.05),rgba(10,11,21,0.92))] px-6 py-6 shadow-[0_24px_90px_rgba(4,5,12,0.38)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8ea1ff]">
        Next Move
      </div>
      <div
        className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[2rem]"
        style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
      >
        Required actions
      </div>
      <div className="mt-6 space-y-4">
        {nextMoves.map((item) => (
          <ActionRow key={item.step} {...item} />
        ))}
      </div>
    </div>
  );
}

function ActionRow({
  step,
  title,
  note,
}: {
  step: string;
  title: string;
  note: string;
}) {
  const noteTone =
    note === "Blocking"
      ? "border border-rose-400/20 bg-rose-500/10 text-rose-100"
      : note === "Required"
        ? "border border-amber-400/20 bg-amber-500/10 text-amber-100"
        : "border border-white/12 bg-white/[0.04] text-white/74";

  return (
    <div className="grid gap-4 rounded-[22px] border border-white/10 bg-black/15 px-4 py-4 sm:grid-cols-[52px_1fr_auto] sm:items-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8ea1ff]">
        {step}
      </div>
      <div className="text-base leading-7 text-white/80">{title}</div>
      <div
        className={[
          "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
          noteTone,
        ].join(" ")}
      >
        {note}
      </div>
    </div>
  );
}

function LegRow({
  badge,
  title,
  summary,
  details,
}: {
  badge: string;
  title: string;
  summary: string;
  details: string[];
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 lg:grid-cols-[190px_1fr]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8ea1ff]">
        {badge}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.9rem]">
          {title}
        </div>
        <div className="mt-2 text-base font-semibold text-[#ffd7cc]">{summary}</div>
        <div className="mt-4 space-y-2 text-base leading-8 text-white/66 sm:text-lg">
          {details.map((detail) => (
            <div key={detail}>{detail}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormulaMiniRow({
  title,
  formula,
  detail,
  result,
}: {
  title: string;
  formula: string;
  detail: string;
  result: string;
}) {
  return (
    <div className="grid gap-3 border-b border-white/10 pb-4 last:border-b-0 last:pb-0 lg:grid-cols-[92px_1fr_auto]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8ea1ff]">
        {title}
      </div>
      <div>
        <div
          className="text-lg tracking-[-0.03em] text-white"
          style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
        >
          {formula}
        </div>
        <div className="mt-1 text-sm leading-7 text-white/56">{detail}</div>
      </div>
      <div className="text-base font-semibold text-[#ffd7cc]">{result}</div>
    </div>
  );
}

function EvidenceRow({
  label,
  status,
  note,
}: {
  label: string;
  status: "COMPLETE" | "MISSING" | "UNVERIFIED";
  note: string;
}) {
  const statusTone =
    status === "COMPLETE"
      ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
      : status === "MISSING"
        ? "border border-rose-400/20 bg-rose-500/10 text-rose-100"
        : "border border-amber-400/20 bg-amber-500/10 text-amber-100";

  return (
    <div className="grid gap-4 border-b border-white/10 py-5 last:border-b-0 lg:grid-cols-[1fr_auto]">
      <div>
        <div className="text-base leading-8 text-white/76">{label}</div>
        <div className="mt-1 text-sm leading-7 text-white/52">{note}</div>
      </div>
      <div
        className={[
          "inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
          statusTone,
        ].join(" ")}
      >
        {status === "COMPLETE" ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <CircleAlert className="h-3.5 w-3.5" />
        )}
        {status}
      </div>
    </div>
  );
}

function GuardrailRow({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "base" | "warm";
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-5 last:border-b-0 lg:grid-cols-[240px_1fr]">
      <div
        className={[
          "text-xl font-semibold tracking-[-0.03em]",
          tone === "warm" ? "text-[#ffd7cc]" : "text-white",
        ].join(" ")}
      >
        {title}
      </div>
      <div className="text-base leading-8 text-white/64 sm:text-lg">{body}</div>
    </div>
  );
}

function FlowStep({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8ea1ff]">
        {String(index).padStart(2, "0")}
      </div>
      <div className="mt-3 text-base leading-7 text-white/76">{text}</div>
    </div>
  );
}
