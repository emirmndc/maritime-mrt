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
  status: "Partial owner response submitted",
  openItem: "Remaining response on challenged fuel legs",
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

const heroMeta = [
  `${format0(financialState.disputedVault)} USD locked`,
  `Response window ${caseHeader.responseWindow}`,
  caseHeader.openItem,
];

const caseMeta = [
  {
    label: "Off-hire period",
    value: `${caseHeader.period} (${caseHeader.days.toFixed(3)} days)`,
  },
  { label: "Response window", value: caseHeader.responseWindow },
  { label: "Open item", value: caseHeader.openItem },
];

const statusSummary = [
  {
    label: "Claimed on account",
    value: `${money0.format(caseHeader.claimedOnAccount)} USD`,
  },
  {
    label: "Current file support",
    value: `${money2.format(totalClaimed)} USD`,
  },
  {
    label: "Commercially accepted so far",
    value: `${money0.format(financialState.acceptedDeduction)} USD`,
  },
  {
    label: "Remaining disputed and neutralized",
    value: `${money0.format(financialState.disputedVault)} USD`,
  },
];

const thresholdSummary = [
  { label: "Minimum evidence threshold", value: "Met" },
  { label: "Full support package", value: "Incomplete" },
];

const rolePending = [
  {
    label: "Pending from owner",
    value: "Response on challenged fuel legs",
  },
  {
    label: "Pending from charter",
    value: "Engine / consumption logs and fuel pricing basis",
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
    label: "Pending from owner",
    tone: "waiting",
    items: ["Remaining response on challenged fuel legs"],
  },
  {
    label: "Pending from charter",
    tone: "waiting",
    items: ["Engine logs and fuel pricing basis"],
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
    title: "Submit remaining owner response",
    note: "Pending review",
  },
] as const;

const caseStates = [
  {
    label: "Claim filed",
    detail: "Notice opened on account.",
    tone: "done",
  },
  {
    label: "Minimum evidence met",
    detail: "Threshold reached for live handling.",
    tone: "done",
  },
  {
    label: "Neutral funding complete",
    detail: "Disputed value locked outside one party's pocket.",
    tone: "done",
  },
  {
    label: "Partial owner response submitted",
    detail: "Fuel-leg response still open.",
    tone: "active",
  },
  {
    label: "Fuel review pending",
    detail: "Logs and price basis still incomplete.",
    tone: "active",
  },
  {
    label: "Negotiation open",
    detail: "Commercial treatment continues.",
    tone: "pending",
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
    <span className={tone === "warm" ? "text-[#efb19a]" : "text-[#b9c7ff]"}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[12px] font-medium tracking-[0.12em] text-white/46">
      {children}
    </div>
  );
}

export function OffHireDemoPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05060d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,133,255,0.08),transparent_24%),radial-gradient(circle_at_76%_16%,rgba(255,147,118,0.06),transparent_20%),linear-gradient(180deg,#06070d_0%,#090912_46%,#06070e_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage: "url('/media/hero-texture.jpg')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1540px] px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-30 rounded-[20px] border border-white/10 bg-[rgba(12,14,22,0.9)] px-6 py-4 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
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
                className="inline-flex items-center gap-2 rounded-[14px] border border-white/12 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/22 hover:bg-white/[0.03]"
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
              <div className="text-[12px] font-medium tracking-[0.12em] text-white/46">
                Live case
              </div>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl">
                {caseHeader.title}
              </h1>
              <div className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#efb19a] sm:text-3xl">
                {caseHeader.subtitle}
              </div>
              <div className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
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

              <div className="mt-8 space-y-3 border-t border-white/10 pt-5 text-sm text-white/64">
                {heroMeta.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#efb19a]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0c0f18] shadow-[0_14px_40px_rgba(0,0,0,0.26)]"
            >
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] text-white/46">
                  <FileText className="h-3.5 w-3.5" />
                  Current case state
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {caseMeta.map((item) => (
                    <MetaCell
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="border-t border-white/10">
                  {statusSummary.map((row) => (
                    <StatusRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </div>

                <div className="mt-5 border-t border-white/10 pt-5 text-sm leading-7 text-white/64">
                  Accepted portion may reflect partial commercial treatment
                  beyond the currently evidenced working pack.
                </div>

                <div className="mt-5 border-t border-white/10">
                  {rolePending.map((group) => (
                    <StatusRow
                      key={group.label}
                      label={group.label}
                      value={group.value}
                    />
                  ))}
                </div>

                <div className="mt-5 border-t border-white/10">
                  {thresholdSummary.map((row) => (
                    <StatusRow key={row.label} label={row.label} value={row.value} />
                  ))}
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
              <SectionLabel>Financial posture</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
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
              <SectionLabel>Claim breakdown</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
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
                badge="Hire leg"
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
                badge="Fuel leg / VLSFO"
                title="VLSFO consumption"
                summary={`${money2.format(vlsfoTotal)} USD`}
                details={[
                  `Quantity: ${calculationBasis.vlsfoQty.toFixed(2)} MT`,
                  `Price: ${format0(calculationBasis.vlsfoPrice)} USD/MT`,
                ]}
              />
              <LegRow
                badge="Fuel leg / LSMGO"
                title="LSMGO consumption"
                summary={`${money2.format(lsmgoTotal)} USD`}
                details={[
                  `Quantity: ${calculationBasis.lsmgoQty.toFixed(2)} MT`,
                  `Price: ${format0(calculationBasis.lsmgoPrice)} USD/MT`,
                ]}
              />
              <LegRow
                badge="Fixed cost leg / CVE"
                title="CVE allocation"
                summary={`${money2.format(cve)} USD`}
                details={[
                  `Basis: ${format0(calculationBasis.cveAnnualEquivalent)} USD annual equivalent`,
                ]}
              />

              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
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
              <SectionLabel>Case support</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
                Challenged legs
                <br />
                and missing <AccentWord>support.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10 pt-2">
              <div className="py-6">
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                  What is being disputed
                </div>
                <div className="mt-4 border-t border-white/10">
                  {disputeBreakdown.map((item) => (
                    <StatusRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 py-6">
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
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
              <SectionLabel>Execution rail</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
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
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                  Case state
                </div>
                <div className="mt-4 border-t border-white/10">
                  {caseStates.map((state) => (
                    <StateRow
                      key={state.label}
                      label={state.label}
                      detail={state.detail}
                      tone={state.tone}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 py-6">
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                  Workflow
                </div>
                <div className="mt-4 border-t border-white/10">
                  {flowRows.map((row, index) => (
                    <WorkflowRow key={row} index={index + 1} text={row} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 border-t border-white/10 py-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                  Final line
                </div>
                <div className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  Disputed deduction belongs in a vault, not in one party&apos;s
                  pocket.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo("/demo")}
                  className="inline-flex items-center gap-2 rounded-[14px] border border-[#e7b29e] bg-[#e7b29e] px-5 py-3 text-sm font-semibold text-[#15161f] transition hover:-translate-y-0.5 hover:bg-[#ebbca9]"
                >
                  Open recap demo
                  <MoveRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo("/")}
                  className="inline-flex items-center gap-2 rounded-[14px] border border-white/12 bg-transparent px-5 py-3 text-sm font-semibold text-white/82 transition hover:border-white/22 hover:bg-white/[0.03]"
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

function MetaCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
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
    <div className="grid gap-4 border-b border-white/10 py-4 last:border-b-0 lg:grid-cols-[260px_1fr]">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {label}
      </div>
      <div
        className={[
          "text-base leading-8",
          tone === "warm" ? "text-[#efb19a]" : "text-white/76",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function PressurePanel() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-[#0c0f18] px-6 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.26)]">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        What matters now
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[2rem]">
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
      ? "text-[#efb19a]"
      : tone === "active"
        ? "text-[#b9c7ff]"
        : "text-white/80";

  const dotClass =
    tone === "critical"
      ? "bg-[#efb19a]"
      : tone === "active"
        ? "bg-[#b9c7ff]"
        : "bg-white/45";

  return (
    <div className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
      <div className={["text-[12px] font-medium tracking-[0.08em]", toneClass].join(" ")}>
        {label}
      </div>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 text-base leading-8 text-white/76"
          >
            <span className={["mt-3 h-1.5 w-1.5 rounded-full", dotClass].join(" ")} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionPanel() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-[#0c0f18] px-6 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.26)]">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        Next move
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[2rem]">
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
      ? "border border-[#efb19a]/24 text-[#efb19a]"
      : note === "Required"
        ? "border border-[#b9c7ff]/24 text-[#b9c7ff]"
        : "border border-white/12 text-white/70";

  return (
    <div className="grid gap-4 border-b border-white/10 py-4 last:border-b-0 sm:grid-cols-[52px_1fr_auto] sm:items-center">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {step}
      </div>
      <div className="text-base leading-7 text-white/80">{title}</div>
      <div
        className={[
          "inline-flex items-center rounded-[10px] px-2.5 py-1 text-[11px] font-semibold",
          noteTone,
        ].join(" ")}
      >
        {note}
      </div>
    </div>
  );
}

function StateRow({
  label,
  detail,
  tone,
}: {
  label: string;
  detail: string;
  tone: "done" | "active" | "pending";
}) {
  const toneClass =
    tone === "done"
      ? "bg-[#7bd6a8]"
      : tone === "active"
        ? "bg-[#b9c7ff]"
        : "bg-white/40";

  return (
    <div className="grid gap-4 border-b border-white/10 py-4 last:border-b-0 lg:grid-cols-[260px_1fr]">
      <div className="flex items-center gap-3 text-white/80">
        <span className={["h-2 w-2 rounded-full", toneClass].join(" ")} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="text-sm leading-7 text-white/62">{detail}</div>
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
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {badge}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.85rem]">
          {title}
        </div>
        <div className="mt-2 text-base font-semibold text-[#efb19a]">
          {summary}
        </div>
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
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {title}
      </div>
      <div>
        <div className="text-lg tracking-[-0.03em] text-white">{formula}</div>
        <div className="mt-1 text-sm leading-7 text-white/56">{detail}</div>
      </div>
      <div className="text-base font-semibold text-[#efb19a]">{result}</div>
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
        ? "border border-[#efb19a]/20 bg-[#efb19a]/10 text-[#ffd7cc]"
        : "border border-[#b9c7ff]/20 bg-[#b9c7ff]/10 text-[#dce2ff]";

  return (
    <div className="grid gap-4 border-b border-white/10 py-5 last:border-b-0 lg:grid-cols-[1fr_auto]">
      <div>
        <div className="text-base leading-8 text-white/76">{label}</div>
        <div className="mt-1 text-sm leading-7 text-white/52">{note}</div>
      </div>
      <div
        className={[
          "inline-flex items-center gap-2 self-start rounded-[10px] px-3 py-1 text-[11px] font-semibold",
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
          tone === "warm" ? "text-[#efb19a]" : "text-white",
        ].join(" ")}
      >
        {title}
      </div>
      <div className="text-base leading-8 text-white/64 sm:text-lg">{body}</div>
    </div>
  );
}

function WorkflowRow({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  return (
    <div className="grid gap-4 border-b border-white/10 py-4 last:border-b-0 lg:grid-cols-[72px_1fr]">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {String(index).padStart(2, "0")}
      </div>
      <div className="text-base leading-7 text-white/76">{text}</div>
    </div>
  );
}
