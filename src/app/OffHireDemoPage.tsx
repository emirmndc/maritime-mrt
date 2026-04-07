import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  MoveRight,
  Radar,
  Scale,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { navigateTo } from "./router";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return moneyFormatter.format(Math.round(value));
}

function parseAmount(value: string) {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 0;
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

export function OffHireDemoPage() {
  const [grossDue, setGrossDue] = useState(270000);
  const [hireLeg, setHireLeg] = useState(31500);
  const [lsmgoLeg, setLsmgoLeg] = useState(9200);
  const [vlsfoLeg, setVlsfoLeg] = useState(4800);
  const [extraCostLeg, setExtraCostLeg] = useState(2500);
  const [acceptedDeduction, setAcceptedDeduction] = useState(31500);
  const [ownerResponseHours, setOwnerResponseHours] = useState(72);
  const [clauseReference, setClauseReference] = useState("NYPE 93 Clause 17 / Rider 49");
  const [minimumEvidenceSet, setMinimumEvidenceSet] = useState(true);
  const [vaultFunded, setVaultFunded] = useState(true);
  const [robSupportReady, setRobSupportReady] = useState(false);
  const [noticeChainReady, setNoticeChainReady] = useState(false);
  const [quantitySource, setQuantitySource] = useState("ROB report");
  const [lsmgoPriceBasis, setLsmgoPriceBasis] = useState("Latest stem invoice");
  const [vlsfoPriceBasis, setVlsfoPriceBasis] = useState("");

  const claimedDeduction = hireLeg + lsmgoLeg + vlsfoLeg + extraCostLeg;
  const acceptedAmount = Math.min(Math.max(acceptedDeduction, 0), claimedDeduction);
  const disputedNeutralized = Math.max(claimedDeduction - acceptedAmount, 0);
  const netPaidNow = grossDue - claimedDeduction;
  const overDeducted = netPaidNow < 0;
  const equationHolds =
    Math.abs(grossDue - (netPaidNow + acceptedAmount + disputedNeutralized)) < 0.5;

  const linkedLegs = [
    hireLeg > 0 ? "Off-hire" : null,
    lsmgoLeg > 0 ? "LSMGO" : null,
    vlsfoLeg > 0 ? "VLSFO" : null,
    extraCostLeg > 0 ? "Extra Cost" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const evidenceGaps = [
    !robSupportReady ? "ROB support" : null,
    !vlsfoPriceBasis ? "VLSFO pricing basis" : null,
    !noticeChainReady ? "notice chain" : null,
  ].filter(Boolean) as string[];

  const liveClaimReady =
    minimumEvidenceSet && vaultFunded && clauseReference.trim().length > 0 && !overDeducted;

  const statusLabel = overDeducted
    ? "Claim exceeds gross due"
    : !minimumEvidenceSet
      ? "Draft only"
      : !vaultFunded
        ? "Funding required"
        : disputedNeutralized > 0
          ? "Counter-evidence pending"
          : "Accepted and ready for execution";

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
          <section className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[0.82fr_1.18fr] lg:pt-14">
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
                deduction <AccentWord>rail.</AccentWord>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
                MARITIME does not decide who is right. It moves disputed cash
                out of one party&apos;s pocket, disciplines the evidence pack,
                and prepares a controlled path to settlement or external
                decision.
              </p>

              <div className="mt-7 rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 text-sm leading-7 text-white/72">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#95a8ff]">
                  Core line
                </div>
                <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                  Deduct if you must. Don&apos;t hold if it is disputed. Vault it.
                </p>
              </div>
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
                    Neutral rail snapshot
                  </div>
                  <div className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    Time Charter Deduction Case
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8da4ff]/18 bg-[#7f97ff]/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-[#dbe3ff]">
                  <Radar className="h-3.5 w-3.5" />
                  Off-hire + linked legs
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="grid gap-4 border-b border-white/10 pb-5 sm:grid-cols-2">
                  <MetricRow label="Primary basis" value="Off-hire" />
                  <MetricRow label="Linked legs" value={linkedLegs || "None"} />
                </div>

                <div className="grid gap-4 border-b border-white/10 py-5 sm:grid-cols-2">
                  <MetricRow label="Gross due" value={formatMoney(grossDue)} />
                  <MetricRow
                    label="Claimed deduction"
                    value={formatMoney(claimedDeduction)}
                  />
                  <MetricRow label="Accepted" value={formatMoney(acceptedAmount)} />
                  <MetricRow
                    label="Disputed neutralized"
                    value={formatMoney(disputedNeutralized)}
                    tone="warm"
                  />
                  <MetricRow
                    label="Owner response window"
                    value={`${ownerResponseHours}h`}
                  />
                  <MetricRow
                    label="Status"
                    value={statusLabel}
                    tone={liveClaimReady ? "cool" : "warm"}
                  />
                </div>

                <div className="pt-5">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                    Evidence gaps
                  </div>
                  <div className="mt-3 text-sm leading-7 text-white/66">
                    {evidenceGaps.length
                      ? evidenceGaps.join(", ")
                      : "No immediate evidence gaps visible."}
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mt-10 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(11,12,22,0.92))] shadow-[0_30px_100px_rgba(4,5,12,0.48)] backdrop-blur-xl">
            <div className="grid gap-0 lg:grid-cols-[0.96fr_1.04fr]">
              <div className="border-b border-white/10 px-6 py-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                  Deduction stack engine
                </div>

                <div className="mt-6 space-y-5">
                  <NumberField
                    label="Gross amount due"
                    value={grossDue}
                    onChange={setGrossDue}
                    helper="G"
                  />
                  <NumberField
                    label="Hire / off-hire leg"
                    value={hireLeg}
                    onChange={setHireLeg}
                    helper="H"
                  />
                  <NumberField
                    label="LSMGO leg"
                    value={lsmgoLeg}
                    onChange={setLsmgoLeg}
                    helper="B"
                  />
                  <NumberField
                    label="VLSFO leg"
                    value={vlsfoLeg}
                    onChange={setVlsfoLeg}
                    helper="B"
                  />
                  <NumberField
                    label="Extra cost leg"
                    value={extraCostLeg}
                    onChange={setExtraCostLeg}
                    helper="X"
                  />
                  <NumberField
                    label="Accepted by owner"
                    value={acceptedDeduction}
                    onChange={setAcceptedDeduction}
                    helper="A"
                  />
                  <NumberField
                    label="Owner response window (hours)"
                    value={ownerResponseHours}
                    onChange={setOwnerResponseHours}
                    helper="72h"
                  />

                  <div>
                    <div className="mb-2 text-sm font-semibold text-white/84">
                      CP clause hook
                    </div>
                    <input
                      value={clauseReference}
                      onChange={(event) => setClauseReference(event.target.value)}
                      placeholder="Clause reference"
                      className="w-full rounded-[22px] border border-white/10 bg-black/15 px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <SelectField
                      label="Quantity source"
                      value={quantitySource}
                      onChange={setQuantitySource}
                      options={[
                        "ROB report",
                        "Noon report",
                        "BDN",
                        "Survey",
                        "Engine log",
                      ]}
                    />
                    <SelectField
                      label="LSMGO price basis"
                      value={lsmgoPriceBasis}
                      onChange={setLsmgoPriceBasis}
                      options={[
                        "Latest stem invoice",
                        "Delivery price",
                        "Redelivery price",
                        "Agreed benchmark",
                      ]}
                    />
                    <SelectField
                      label="VLSFO price basis"
                      value={vlsfoPriceBasis}
                      onChange={setVlsfoPriceBasis}
                      options={[
                        "",
                        "Latest stem invoice",
                        "Delivery price",
                        "Redelivery price",
                        "Agreed benchmark",
                      ]}
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <ToggleField
                      label="Minimum evidence set"
                      value={minimumEvidenceSet}
                      onToggle={() => setMinimumEvidenceSet((current) => !current)}
                    />
                    <ToggleField
                      label="Vault funded"
                      value={vaultFunded}
                      onToggle={() => setVaultFunded((current) => !current)}
                    />
                    <ToggleField
                      label="ROB support"
                      value={robSupportReady}
                      onToggle={() => setRobSupportReady((current) => !current)}
                    />
                    <ToggleField
                      label="Notice chain"
                      value={noticeChainReady}
                      onToggle={() => setNoticeChainReady((current) => !current)}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 lg:px-8 lg:py-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                  Controlled financial state
                </div>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-black/15 px-5 py-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#95a8ff]">
                    <Scale className="h-4 w-4" />
                    Equation lock
                  </div>
                  <div
                    className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white"
                    style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
                  >
                    G = N + A + D
                  </div>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-white/70">
                    <div>Gross due: {formatMoney(grossDue)}</div>
                    <div>Net paid now: {formatMoney(netPaidNow)}</div>
                    <div>Accepted deduction: {formatMoney(acceptedAmount)}</div>
                    <div>Disputed neutralized: {formatMoney(disputedNeutralized)}</div>
                  </div>
                  <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72">
                    {equationHolds
                      ? "The deduction stack is balanced."
                      : "The deduction stack no longer balances."}
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-black/15 px-5 py-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#ffb29a]">
                    <Wallet className="h-4 w-4" />
                    Live claim gates
                  </div>

                  <div className="mt-5 border-t border-white/10">
                    <GateRow
                      label="No evidence, no live claim"
                      active={minimumEvidenceSet}
                      body="The case stays draft until a minimum evidence set exists."
                    />
                    <GateRow
                      label="No funding, no valid deduction status"
                      active={vaultFunded}
                      body="Disputed cash belongs in the vault, not in one party's pocket."
                    />
                    <GateRow
                      label="CP hook required"
                      active={clauseReference.trim().length > 0}
                      body="Every live leg needs a clause reference before it becomes serious."
                    />
                    <GateRow
                      label="Price basis visible"
                      active={Boolean(lsmgoPriceBasis) && Boolean(vlsfoPriceBasis)}
                      body="Fuel-grade claims should show their valuation basis before confidence rises."
                    />
                  </div>

                  {overDeducted ? (
                    <div className="mt-5 rounded-[22px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                      Claimed deduction is larger than gross due. The demo keeps
                      the math visible, but the case should be corrected before
                      it is treated as valid.
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-black/15 px-5 py-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#95a8ff]">
                    <ShieldAlert className="h-4 w-4" />
                    Positioning
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/66">
                    Cash rail stays on USDC or existing rails. MRT stays on the
                    workflow side: access, coordination, reporting, and future
                    participation layers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb29a]">
                Rules
              </div>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Serious only if the
                <br />
                control logic stays <AccentWord>intact.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10">
              <RuleRow
                title="No auto release"
                body="Silence is not treated as victory. The workflow should wait for agreement or external decision."
              />
              <RuleRow
                title="No unilateral withdrawal"
                body="No single actor should empty disputed cash without the controlled execution path."
              />
              <RuleRow
                title="No double counting"
                body="The same incident cannot mint value through off-hire, bunker, and performance legs at the same time."
              />
              <RuleRow
                title="Source and basis stay attached"
                body="Quantity and fuel pricing should remain tied to ROB, BDN, survey, engine logs, or explicit benchmark selection."
              />
            </div>
          </section>

          <section className="grid gap-12 border-t border-white/10 pt-20 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#95a8ff]">
                Flow
              </div>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl"
                style={{ fontFamily: '"Space Grotesk", "Plus Jakarta Sans", sans-serif' }}
              >
                Evidence in order.
                <br />
                Cash in a <AccentWord tone="warm">vault.</AccentWord>
              </h2>
            </div>

            <div className="border-t border-white/10">
              <FlowRow
                step="01"
                title="Charter opens the case."
                body="The case starts with gross due, linked deduction legs, clause hooks, and a minimum evidence set."
              />
              <FlowRow
                step="02"
                title="Disputed cash is neutralized."
                body="Undisputed value moves normally. Disputed value moves to the neutral vault instead of staying with one party."
              />
              <FlowRow
                step="03"
                title="Owner responds with evidence."
                body="Accept, reject, or partial response enters a sequenced record with counter-evidence and timestamps."
              />
              <FlowRow
                step="04"
                title="Negotiation or external venue."
                body="The workflow supports a response window, negotiated resolution, or a move to arbitration or court without pretending to replace them."
              />
              <FlowRow
                step="05"
                title="Controlled execution."
                body="Once agreement or binding decision arrives, execution follows a controlled sequence rather than unilateral seizure."
              />
            </div>
          </section>

          <section className="relative mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,9,17,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(4,5,12,0.46)] sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_26%,rgba(255,149,116,0.09),transparent_20%),radial-gradient(circle_at_78%_72%,rgba(96,116,255,0.12),transparent_24%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#ffb29a]">
                  Next
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

function NumberField({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helper: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-white/84">
        <span>{label}</span>
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/36">
          {helper}
        </span>
      </div>
      <input
        type="number"
        min="0"
        step="100"
        value={value}
        onChange={(event) => onChange(parseAmount(event.target.value))}
        className="w-full rounded-[22px] border border-white/10 bg-black/15 px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-white/84">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[22px] border border-white/10 bg-black/15 px-4 py-3 text-sm text-white outline-none"
      >
        {options.map((option) => (
          <option key={option || "not-set"} value={option}>
            {option || "Not selected"}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/15 px-4 py-3 text-left transition hover:border-white/18"
    >
      <span className="text-sm font-semibold text-white/84">{label}</span>
      <span
        className={[
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
          value
            ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
            : "border border-white/10 bg-white/[0.04] text-white/48",
        ].join(" ")}
      >
        {value ? "Ready" : "Missing"}
      </span>
    </button>
  );
}

function MetricRow({
  label,
  value,
  tone = "base",
}: {
  label: string;
  value: string;
  tone?: "base" | "cool" | "warm";
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-lg font-semibold tracking-[-0.03em]",
          tone === "cool"
            ? "text-[#dbe1ff]"
            : tone === "warm"
              ? "text-[#ffd7cc]"
              : "text-white",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function GateRow({
  label,
  active,
  body,
}: {
  label: string;
  active: boolean;
  body: string;
}) {
  return (
    <div className="grid gap-4 border-b border-white/10 py-4 last:border-b-0 lg:grid-cols-[210px_1fr_auto]">
      <div className="text-sm font-semibold text-white/86">{label}</div>
      <div className="text-sm leading-7 text-white/62">{body}</div>
      <div
        className={[
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
          active
            ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
            : "border border-white/10 bg-white/[0.04] text-white/48",
        ].join(" ")}
      >
        {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
        {active ? "Ready" : "Pending"}
      </div>
    </div>
  );
}

function RuleRow({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 lg:grid-cols-[260px_1fr]">
      <div className="text-xl font-semibold tracking-[-0.03em] text-white">
        {title}
      </div>
      <div className="text-base leading-8 text-white/66 sm:text-lg">{body}</div>
    </div>
  );
}

function FlowRow({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 lg:grid-cols-[100px_1fr]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8ea1ff]">
        {step}
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
