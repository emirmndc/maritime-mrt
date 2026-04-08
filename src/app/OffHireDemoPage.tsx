import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
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
  charterDeduction: 48000,
  ownerPosition: "Partially disputed",
  period: "20 Oct 23:00 -> 22 Oct 12:00",
  days: 1.542,
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

const evidenceItems = [
  {
    label: "Off-hire notice chain",
    status: "COMPLETE",
    note: "Notice path is visible in sequence.",
  },
  {
    label: "Noon reports",
    status: "COMPLETE",
    note: "Interval support is present for the time leg.",
  },
  {
    label: "ROB verification (fuel quantities)",
    status: "UNVERIFIED",
    note: "Fuel deltas need stronger quantity confirmation.",
  },
  {
    label: "Engine / consumption logs",
    status: "MISSING",
    note: "Consumption support is not yet complete.",
  },
  {
    label: "Price basis confirmation",
    status: "UNVERIFIED",
    note: "Fuel pricing basis should be confirmed before the leg is treated as settled.",
  },
  {
    label: "CP clause reference",
    status: "COMPLETE",
    note: "Clause hook remains attached to the claim file.",
  },
] as const;

const disputeBreakdown = [
  { label: "Hire leg", value: "Partially accepted" },
  { label: "VLSFO", value: "Disputed" },
  { label: "LSMGO", value: "Disputed" },
  { label: "CVE", value: "Minor" },
];

const ruleRows = [
  {
    title: "Owner protection",
    body: "Charter cannot hold disputed cash without funding it.",
    tone: "warm",
  },
  {
    title: "No evidence -> Claim cannot go live",
    body: "The case can be drafted, but it should not become a live deduction claim.",
    tone: "base",
  },
  {
    title: "No funding -> Deduction not valid",
    body: "Disputed value belongs in the neutral vault before the deduction is treated as serious.",
    tone: "base",
  },
  {
    title: "No price basis -> Fuel claim incomplete",
    body: "Fuel legs should stay incomplete until the pricing basis is attached and reviewable.",
    tone: "base",
  },
  {
    title: "No source -> Quantity unverified",
    body: "ROB, BDN, survey, or engine support should stay attached to fuel quantity claims.",
    tone: "base",
  },
] as const;

const flowRows = [
  {
    title: "Charter opens claim",
    body: "The deduction is opened as a case file, not as a loose accounting line.",
  },
  {
    title: "Claim is structured into legs",
    body: "Hire, fuel, and fixed-cost elements are separated so the dispute is readable.",
  },
  {
    title: "Disputed amount funded to vault",
    body: "Cash leverage is removed by moving the disputed part into the neutral rail.",
  },
  {
    title: "Owner responds with evidence",
    body: "Acceptance, rejection, and counter-evidence enter the record in sequence.",
  },
  {
    title: "Negotiation / escalation",
    body: "The case can settle commercially or move outward to arbitration or court.",
  },
  {
    title: "Controlled execution",
    body: "Release follows agreement or binding outcome, not unilateral withdrawal.",
  },
];

function format0(value: number) {
  return money0.format(value);
}

function format2(value: number) {
  return money2.format(value);
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
    <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#95a8ff]">
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
          <section className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[0.78fr_1.22fr] lg:pt-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb29a]">
                Off-hire demo
              </div>
              <h1
                className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Owner-charterer
                <br />
                deduction <AccentWord>case file.</AccentWord>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
                MARITIME does not decide who is right. It stops disputed cash
                from becoming leverage, structures the claim into legs, and
                keeps the file readable from first notice to controlled
                execution.
              </p>
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
                  Case header
                </div>
                <div
                  className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-[2.6rem]"
                  style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
                >
                  {caseHeader.title}
                </div>
                <div className="mt-2 text-base text-[#ffd6ca]">
                  ({caseHeader.subtitle})
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
                <div className="border-b border-white/10 px-6 py-6 lg:border-b-0 lg:border-r">
                  <CaseRow
                    label="Charter deduction"
                    value={`${format0(caseHeader.charterDeduction)} USD`}
                  />
                  <CaseRow
                    label="Owner position"
                    value={caseHeader.ownerPosition}
                  />
                </div>
                <div className="px-6 py-6">
                  <CaseRow
                    label="Off-hire period"
                    value={`${caseHeader.period} (${caseHeader.days.toFixed(3)} days)`}
                  />
                </div>
              </div>
            </motion.div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Financial Structure</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                G = N + A + D
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                This is the live payment posture of the period. Gross due,
                immediate net paid, accepted deduction, and disputed vault
                funding should stay in balance.
              </p>
            </div>

            <div className="border-t border-white/10">
              <CaseRow
                label="Gross hire due"
                value={`${format0(financialState.grossHireDue)} USD`}
              />
              <CaseRow
                label="Net paid"
                value={`${format0(financialState.netPaid)} USD`}
              />
              <CaseRow
                label="Accepted deduction"
                value={`${format0(financialState.acceptedDeduction)} USD`}
              />
              <CaseRow
                label="Disputed (vault)"
                value={`${format0(financialState.disputedVault)} USD`}
                tone="warm"
              />

              <div className="pt-6 text-sm leading-7 text-white/60">
                The cash posture reflects a {format0(caseHeader.charterDeduction)} USD
                deduction on account. The structured hold-cleaning leg file
                below currently evidences {format2(totalClaimed)} USD with full
                math visibility.
              </div>
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Deduction Breakdown</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Multi-leg structure,
                <br />
                not one vague <AccentWord tone="warm">deduction.</AccentWord>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                Total claimed deduction: {format2(totalClaimed)} USD
              </p>
            </div>

            <div className="border-t border-white/10">
              <LegRow
                badge="[Hire Leg]"
                title="Hire loss (net)"
                summary={`Net hire loss: ${format2(hireNet)} USD`}
                details={[
                  `Duration: ${caseHeader.days.toFixed(3)} days`,
                  `Rate: ${format0(calculationBasis.hireRate)} USD/day`,
                  `Gross: ${format2(hireGross)}`,
                  `Less commissions: Address (3.75%) -${format2(addressCommission)}`,
                  `Less commissions: Brokerage (1.25%) -${format2(brokerageCommission)}`,
                ]}
              />
              <LegRow
                badge="[Fuel Leg - VLSFO]"
                title="VLSFO consumption"
                summary={`${format2(vlsfoTotal)} USD`}
                details={[
                  `Quantity: ${calculationBasis.vlsfoQty.toFixed(2)} MT`,
                  `Price: ${format0(calculationBasis.vlsfoPrice)} USD/MT`,
                ]}
              />
              <LegRow
                badge="[Fuel Leg - LSMGO]"
                title="LSMGO consumption"
                summary={`${format2(lsmgoTotal)} USD`}
                details={[
                  `Quantity: ${calculationBasis.lsmgoQty.toFixed(2)} MT`,
                  `Price: ${format0(calculationBasis.lsmgoPrice)} USD/MT`,
                ]}
              />
              <LegRow
                badge="[Fixed Cost Leg - CVE]"
                title="CVE (fixed expense allocation)"
                summary={`${format2(cve)} USD`}
                details={[
                  `Basis: ${format0(calculationBasis.cveAnnualEquivalent)} USD annual equivalent`,
                ]}
              />
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Formula Set</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Transparent math,
                <br />
                not soft <AccentWord>guesswork.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10 font-mono text-sm text-white/74">
              <FormulaRow
                title="HIRE LEG"
                formula="H_net = t x R x (1 - ac - bc)"
                values={`t = ${caseHeader.days.toFixed(3)}, R = ${format0(
                  calculationBasis.hireRate,
                )}, ac = 3.75%, bc = 1.25%`}
                result={`${format2(hireNet)} USD`}
              />
              <FormulaRow
                title="FUEL LEG"
                formula="B_g = Q x P"
                values={`VLSFO: ${calculationBasis.vlsfoQty.toFixed(2)} x ${format0(
                  calculationBasis.vlsfoPrice,
                )} = ${format2(vlsfoTotal)} | LSMGO: ${calculationBasis.lsmgoQty.toFixed(
                  2,
                )} x ${format0(calculationBasis.lsmgoPrice)} = ${format2(lsmgoTotal)}`}
                result="Fuel legs priced grade by grade"
              />
              <FormulaRow
                title="FIXED COST LEG"
                formula="CVE = t x (annual basis / 365 x 12)"
                values={`t = ${caseHeader.days.toFixed(3)}, annual basis = ${format0(
                  calculationBasis.cveAnnualEquivalent,
                )}`}
                result={`${format2(cve)} USD`}
              />
              <FormulaRow
                title="TOTAL"
                formula="C_total = H_net + B_vlsfo + B_lsmgo + CVE"
                values="Structured case file total"
                result={`${format2(totalClaimed)} USD`}
              />
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>What Is Being Disputed?</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Disputed amount:
                <br />
                <AccentWord tone="warm">{format0(financialState.disputedVault)} USD</AccentWord>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                The number matters less until the file shows which leg is being
                challenged and at what level.
              </p>
            </div>

            <div className="border-t border-white/10">
              {disputeBreakdown.map((item) => (
                <CaseRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Evidence Required</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Evidence is not truth.
                <br />
                It is <AccentWord>discipline.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10">
              {evidenceItems.map((item) => (
                <EvidenceRow key={item.label} {...item} />
              ))}
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Critical Rules</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Serious only if the
                <br />
                boundaries stay <AccentWord tone="warm">hard.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10">
              {ruleRows.map((row) => (
                <RuleRow key={row.title} {...row} />
              ))}
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Flow</SectionLabel>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Case first.
                <br />
                Execution <AccentWord>last.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10">
              {flowRows.map((row, index) => (
                <FlowRow
                  key={row.title}
                  index={index + 1}
                  title={row.title}
                  body={row.body}
                />
              ))}
            </div>
          </section>

          <section className="relative mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,9,17,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(4,5,12,0.46)] sm:px-8 sm:py-10">
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
                <a
                  href="https://github.com/maritime-mrt/maritime-mrt"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/82 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  View GitHub
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function CaseRow({
  label,
  value,
  tone = "base",
}: {
  label: string;
  value: string;
  tone?: "base" | "warm";
}) {
  return (
    <div className="grid gap-4 border-b border-white/10 py-5 last:border-b-0 lg:grid-cols-[220px_1fr]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        {label}
      </div>
      <div
        className={[
          "text-base leading-8",
          tone === "warm" ? "text-[#ffd7cc]" : "text-white/74",
        ].join(" ")}
      >
        {value}
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

function FormulaRow({
  title,
  formula,
  values,
  result,
}: {
  title: string;
  formula: string;
  values: string;
  result: string;
}) {
  return (
    <div className="border-b border-white/10 py-6 last:border-b-0">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8ea1ff]">
        {title}
      </div>
      <div className="mt-3 text-lg text-white">{formula}</div>
      <div className="mt-3 leading-7 text-white/60">{values}</div>
      <div className="mt-3 text-base font-semibold text-[#ffd7cc]">{result}</div>
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
        <div className="text-base leading-8 text-white/74">{label}</div>
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

function RuleRow({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "base" | "warm";
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 lg:grid-cols-[280px_1fr]">
      <div
        className={[
          "text-xl font-semibold tracking-[-0.03em]",
          tone === "warm" ? "text-[#ffd7cc]" : "text-white",
        ].join(" ")}
      >
        {title}
      </div>
      <div className="text-base leading-8 text-white/66 sm:text-lg">{body}</div>
    </div>
  );
}

function FlowRow({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 lg:grid-cols-[90px_1fr]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8ea1ff]">
        {String(index).padStart(2, "0")}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.9rem]">
          {title}
        </div>
        <div className="mt-3 max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
          {body}
        </div>
      </div>
    </div>
  );
}
