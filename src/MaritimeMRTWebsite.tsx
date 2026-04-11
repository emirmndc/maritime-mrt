import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  Globe,
  MoveRight,
  Radar,
  Scale,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { navigateTo } from "./app/router";

const externalLinks = {
  quickswap:
    "https://dapp.quickswap.exchange/swap/best/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  polygonscan:
    "https://polygonscan.com/token/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  dexscreener:
    "https://dexscreener.com/polygon/0x3c959fd489cbf4060edf4c4b7133895c1e78edde",
  github: "https://github.com/maritime-mrt/maritime-mrt",
  twitter: "https://x.com/maritime_coin",
};

const latestWeeklyReport = {
  href:
    "https://github.com/maritime-mrt/maritime-mrt/raw/main/WEEKLY%20REPORT/latest-weekly-report.pdf",
};

const weeklyReportsArchive = {
  href: "https://github.com/maritime-mrt/maritime-mrt/tree/main/WEEKLY%20REPORT",
};

const offHirePreview = {
  caseTitle: "OFF-HIRE DISPUTE (Hold Cleaning)",
  charterDeduction: "48,000 USD",
  structuredClaim: "25,267.09 USD",
  disputedVault: "16,500 USD",
  ownerPosition: "Partial owner response submitted",
  period: "20 Oct 23:00 -> 22 Oct 12:00 (1.542 days)",
  status: "Fuel review pending",
};

const signalTape = [
  "Polygon PoS",
  "MARITIME / MRT",
  "Fixed supply 100,000,000",
  "No admin mint",
  "Voyage recap demo live",
  "Deduction rail demo live",
];

const narrativeRows = [
  {
    number: "01",
    title: "Token clarity first.",
    body:
      "The live layer stays intentionally simple: fixed supply, Polygon-native access, public wallet labeling, and a cleaner place for first contact.",
  },
  {
    number: "02",
    title: "Operational story second.",
    body:
      "The product narrative is not a fantasy dashboard. It is a working demo showing how voyage recap text can become a structured review surface.",
  },
  {
    number: "03",
    title: "Trust is staged in public.",
    body:
      "Security notes, tokenomics, transparency pages, and the contract address remain visible without forcing people into GitHub before they understand the project.",
  },
];

const demoFlow = [
  {
    label: "Paste recap",
    text: "Feed the demo with a real or sample voyage recap and let the parser organize the operational signal.",
  },
  {
    label: "Generate signal",
    text: "The recap becomes route, parties, deadlines, flags, and documentary checkpoints without pretending to replace review.",
  },
  {
    label: "Review together",
    text: "Results stay assistive and readable so commercial, ops, or claims teams can discuss the draft in one place.",
  },
];

const offHireFlow = [
  {
    label: "Open the case",
    text: "The dispute starts as a readable case file with period, deduction notice, and a visible owner position.",
  },
  {
    label: "Structure the legs",
    text: "Hire, VLSFO, LSMGO, and fixed-cost legs become separate lines instead of one vague off-hire number.",
  },
  {
    label: "Neutralize cash",
    text: "Undisputed value flows. Disputed value moves to a neutral vault so it cannot become leverage inside one party's pocket.",
  },
];

const proofRows = [
  {
    label: "Contract",
    value: "0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
    href: externalLinks.polygonscan,
    action: "Verify on PolygonScan",
  },
  {
    label: "Tokenomics",
    value: "40% community, 25% treasury, 20% owner hold, 15% liquidity",
    href: "/docs/TOKENOMICS.pdf",
    action: "Open tokenomics",
  },
  {
    label: "Security",
    value: "Constructor mint only. No pause, blacklist, or tax logic.",
    href: "/docs/SECURITY.pdf",
    action: "Open security notes",
  },
  {
    label: "Whitepaper",
    value:
      "High-level thesis, transparency framing, and market-first roadmap context.",
    href: "/docs/MARITIME_MRT_Whitepaper_v1.5.pdf",
    action: "Open whitepaper",
  },
];

const roadmapRows = [
  {
    step: "Now",
    title: "A sharper public landing.",
    text:
      "The site leads with identity, proof, and a focused CTA path instead of a forest of small boxes and scattered product claims.",
  },
  {
    step: "Next",
    title: "Demo as the only product route.",
    text:
      "Visitors move from landing to one clear experience: recap to signal. No extra navigation tree, no abandoned subpages, no app maze.",
  },
  {
    step: "Later",
    title: "Operational modules only when earned.",
    text:
      "Claims, settlement, and reporting ideas should return only when they can ship as coherent tools instead of visual placeholders.",
  },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function HeaderLink({ label, id }: { label: string; id: string }) {
  return (
    <button
      type="button"
      onClick={() => scrollToSection(id)}
      className="rounded-[12px] px-3 py-2 text-[15px] font-medium text-white/68 transition hover:bg-white/[0.04] hover:text-white"
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[12px] font-medium tracking-[0.12em] text-white/46">
      {children}
    </div>
  );
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

function PrimaryAction({
  children,
  onClick,
  tone = "warm",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "warm" | "cool";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-[14px] px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
        tone === "warm"
          ? "border border-[#e7b29e] bg-[#e7b29e] text-[#15161f] hover:bg-[#ebbca9]"
          : "border border-[#9caef5] bg-[#9caef5] text-[#101520] hover:bg-[#adbcfb]",
      ].join(" ")}
    >
      {children}
      <MoveRight className="h-4 w-4" />
    </button>
  );
}

function PrimaryLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-[14px] border border-[#9caef5] bg-[#9caef5] px-5 py-3 text-sm font-semibold text-[#101520] transition hover:-translate-y-0.5 hover:bg-[#adbcfb]"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

function SecondaryLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-[14px] border border-white/12 bg-transparent px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/22 hover:bg-white/[0.03]"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

function HeroSignalBoard() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0c0f18] shadow-[0_14px_40px_rgba(0,0,0,0.26)]">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/media/hero-texture.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,20,0.35),rgba(10,12,20,0.92))]" />

      <div className="relative z-10 px-6 pb-7 pt-6 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
              Sample parsed output
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              Recap demo surface
            </div>
          </div>
          <div className="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/72">
            Derived from recap demo route
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <SignalLine
              label="Route"
              value="Novorise to Southbay"
              hint="Recap-derived lane"
            />
            <SignalLine
              label="Counterparties"
              value="Northshore Bulk / Golden Delta Foods"
              hint="Owner and charterer aligned"
            />
            <SignalLine
              label="Deadline"
              value="Payment within 3 banking days after B/L"
              hint="Needs document review"
            />
            <SignalLine
              label="Risk tone"
              value="Attention required"
              hint="Timing and claim wording matter"
            />
          </div>

          <div className="flex min-h-[300px] flex-col justify-between border-l border-white/10 pl-0 lg:pl-7">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/maritime-logo.png"
                  alt="Maritime logo"
                  className="h-12 w-12 rounded-[14px] border border-white/10 object-cover"
                />
                <div>
                  <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                    Workflow proof
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    Public proof before deeper utility
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-sm leading-7 text-white/70">
                <p>
                  See how recap text becomes route, counterparties, deadlines,
                  and risk tone before any heavier workflow is introduced.
                </p>
                <p>
                  Public docs, market links, and bounded demos stay visible
                  without forcing visitors into an app maze.
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Radar className="h-4 w-4 text-[#efb19a]" />
                Inspectable demo output
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalLine({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {label}
      </div>
      <div className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white sm:text-[1.65rem]">
        {value}
      </div>
      <div className="mt-2 text-sm text-white/54">{hint}</div>
    </div>
  );
}

function NarrativeRow({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 lg:grid-cols-[88px_1fr]">
      <div className="text-[28px] leading-none text-white/20">{number}</div>
      <div>
        <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.9rem]">
          {title}
        </div>
        <p className="mt-3 max-w-3xl text-base leading-8 text-white/64 sm:text-lg">
          {body}
        </p>
      </div>
    </div>
  );
}

function FlowPoint({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="grid gap-3 border-b border-white/10 py-6 last:border-b-0 lg:grid-cols-[160px_1fr]">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {label}
      </div>
      <div className="text-base leading-8 text-white/68 sm:text-lg">{text}</div>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  tone = "base",
}: {
  label: string;
  value: string;
  tone?: "base" | "cool" | "warm";
}) {
  return (
    <div className="border-b border-white/10 py-4 last:border-b-0">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {label}
      </div>
      <div
        className={[
          "mt-2 text-sm font-semibold leading-7",
          tone === "cool"
            ? "text-[#cdd7ff]"
            : tone === "warm"
              ? "text-[#efb19a]"
              : "text-white/72",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function ProofRow({
  label,
  value,
  href,
  action,
}: {
  label: string;
  value: string;
  href: string;
  action: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group grid gap-5 border-b border-white/10 py-6 transition last:border-b-0 hover:border-white/16 lg:grid-cols-[150px_1fr_auto]"
    >
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {label}
      </div>
      <div className="text-base leading-8 text-white/72 sm:text-lg">{value}</div>
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#efb19a] group-hover:text-white">
        {action}
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </a>
  );
}

function RoadmapRow({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 lg:grid-cols-[120px_1fr]">
      <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
        {step}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.85rem]">
          {title}
        </div>
        <div className="mt-3 max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
          {text}
        </div>
      </div>
    </div>
  );
}

export default function MaritimeMRTWebsite() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05060d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(114,128,255,0.08),transparent_26%),radial-gradient(circle_at_18%_12%,rgba(255,137,103,0.06),transparent_22%),linear-gradient(180deg,#06070d_0%,#0a0a15_52%,#070811_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage: "url('/media/hero-texture.jpg')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1540px] px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-30 w-full rounded-[20px] border border-white/10 bg-[rgba(12,14,22,0.9)] px-6 py-4 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 text-left"
            >
              <img
                src="/maritime-logo.png"
                alt="Maritime logo"
                className="h-11 w-11 rounded-[14px] border border-white/10 object-cover"
              />
              <div>
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                  MARITIME
                </div>
                <div className="mt-1 text-base font-semibold text-white">MRT</div>
              </div>
            </button>

            <nav className="hidden items-center gap-2 lg:flex">
              <HeaderLink label="Story" id="story" />
              <HeaderLink label="Demo" id="demo" />
              <HeaderLink label="Proof" id="proof" />
              <HeaderLink label="Roadmap" id="roadmap" />
            </nav>

            <div className="flex items-center gap-3">
              <SecondaryLink href={externalLinks.polygonscan}>
                PolygonScan
              </SecondaryLink>
              <PrimaryLink href={latestWeeklyReport.href}>
                Open last weekly report
              </PrimaryLink>
              <PrimaryAction onClick={() => navigateTo("/demo")}>
                Open recap demo
              </PrimaryAction>
            </div>
          </div>
        </header>

        <main>
          <section
            id="hero"
            className="grid gap-12 pb-14 pt-14 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:pt-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] font-medium text-white/70">
                Polygon-native maritime layer
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl xl:text-[6.2rem]">
                Voyage recap
                <br />
                to signal.
                <br />
                Off-hire deductions to a <AccentWord tone="warm">neutral rail.</AccentWord>
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68 sm:text-[1.28rem] sm:leading-10">
                MARITIME keeps two bounded workflow proofs in public view: a
                recap parser for operational signal and a neutral dispute rail
                for owner-charterer deductions, with the MRT token surface and
                public proof layer visible around them.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryAction onClick={() => navigateTo("/demo")}>
                  Open recap demo
                </PrimaryAction>
                <PrimaryAction
                  tone="cool"
                  onClick={() => navigateTo("/off-hire-demo")}
                >
                  Open off-hire demo
                </PrimaryAction>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/56">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#b9c7ff]" />
                  Bounded workflow demos
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#b9c7ff]" />
                  Public proof layer
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#b9c7ff]" />
                  Polygon market surface
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <HeroSignalBoard />
            </motion.div>
          </section>

          <section className="border-y border-white/10 py-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] font-medium text-white/52">
              {signalTape.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#efb19a]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section
            id="story"
            className="grid gap-12 border-t border-white/10 pb-8 pt-20 lg:grid-cols-[0.78fr_1.22fr]"
          >
            <div>
              <SectionLabel>Story</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
                Public proof,
                <br />
                cleaner <AccentWord>signal</AccentWord> and space.
              </h2>
            </div>

            <div>
              {narrativeRows.map((row) => (
                <NarrativeRow key={row.number} {...row} />
              ))}
            </div>
          </section>

          <section
            id="demo"
            className="grid gap-12 border-t border-white/10 pb-8 pt-20 lg:grid-cols-[0.82fr_1.18fr]"
          >
            <div>
              <SectionLabel>Demo</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
                Two bounded demos.
                <br />
                One clearer <AccentWord tone="warm">thesis.</AccentWord>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                One route turns recap language into an operational signal. The
                second turns off-hire and linked deductions into a neutral
                owner-charterer dispute rail.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryAction onClick={() => navigateTo("/demo")}>
                  Launch recap demo
                </PrimaryAction>
                <PrimaryAction
                  tone="cool"
                  onClick={() => navigateTo("/off-hire-demo")}
                >
                  Open off-hire demo
                </PrimaryAction>
                <SecondaryLink href={latestWeeklyReport.href}>
                  Open weekly report
                </SecondaryLink>
              </div>
            </div>

            <div className="space-y-10">
              <div className="border-t border-white/10 pt-6">
                <div className="mb-4 flex items-center gap-3 text-sm font-medium text-white/74">
                  <Waves className="h-4 w-4 text-[#b9c7ff]" />
                  Voyage recap to signal
                </div>

                <div className="border-t border-white/10">
                  {demoFlow.map((item) => (
                    <FlowPoint key={item.label} {...item} />
                  ))}
                </div>

                <div className="mt-6 grid gap-0 border-t border-white/10 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="border-b border-white/10 py-5 lg:border-b-0 lg:border-r lg:pr-6">
                    <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                      Input
                    </div>
                    <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
                      <div>Owner: Northshore Bulk Pte. Ltd.</div>
                      <div>Charterer: Golden Delta Foods</div>
                      <div>Loadport: Novorise</div>
                      <div>Disport: Southbay</div>
                      <div>Deadline: 15 business days after discharge.</div>
                    </div>
                  </div>
                  <div className="py-5 lg:pl-6">
                    <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                      Output
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="border-b border-white/10 pb-3 text-white/72">
                        Route signal: Novorise to Southbay
                      </div>
                      <div className="border-b border-white/10 pb-3 text-white/72">
                        Health: Attention required
                      </div>
                      <div className="border-b border-white/10 pb-3 text-white/72">
                        Documents: SOF, NOR, laytime sheet
                      </div>
                      <div className="text-white/72">
                        Review note: timing language remains assistive
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="mb-4 flex items-center gap-3 text-sm font-medium text-white/74">
                  <Scale className="h-4 w-4 text-[#efb19a]" />
                  Owner-charterer deduction rail
                </div>

                <div className="border-t border-white/10">
                  {offHireFlow.map((item) => (
                    <FlowPoint key={item.label} {...item} />
                  ))}
                </div>

                <div className="mt-6 grid gap-0 border-t border-white/10 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="border-b border-white/10 py-5 lg:border-b-0 lg:border-r lg:pr-6">
                    <SnapshotRow label="Case" value={offHirePreview.caseTitle} />
                    <SnapshotRow
                      label="Charter deduction"
                      value={offHirePreview.charterDeduction}
                    />
                    <SnapshotRow
                      label="Off-hire period"
                      value={offHirePreview.period}
                    />
                    <SnapshotRow
                      label="Structured claim"
                      value={offHirePreview.structuredClaim}
                    />
                  </div>
                  <div className="py-5 lg:pl-6">
                    <SnapshotRow
                      label="Owner position"
                      value={offHirePreview.ownerPosition}
                    />
                    <SnapshotRow
                      label="Disputed neutralized"
                      value={offHirePreview.disputedVault}
                      tone="warm"
                    />
                    <SnapshotRow label="Owner response window" value="72h" />
                    <SnapshotRow
                      label="Status"
                      value={offHirePreview.status}
                      tone="cool"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="proof"
            className="grid gap-12 border-t border-white/10 pb-8 pt-20 lg:grid-cols-[0.78fr_1.22fr]"
          >
            <div>
              <SectionLabel>Proof</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
                The trust layer
                <br />
                stays <AccentWord>visible.</AccentWord>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                Visitors should be able to verify the project without getting
                lost in repo structure. The essentials are linked here in one
                cleaner stream.
              </p>
            </div>

            <div className="border-t border-white/10">
              {proofRows.map((row) => (
                <ProofRow key={row.label} {...row} />
              ))}
            </div>
          </section>

          <section
            id="roadmap"
            className="grid gap-12 border-t border-white/10 pb-12 pt-20 lg:grid-cols-[0.78fr_1.22fr]"
          >
            <div>
              <SectionLabel>Roadmap</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-6xl">
                Build the public face
                <br />
                before the <AccentWord tone="warm">sprawl.</AccentWord>
              </h2>
            </div>

            <div>
              {roadmapRows.map((row) => (
                <RoadmapRow key={row.step} {...row} />
              ))}
            </div>
          </section>

          <section className="mt-8 border-t border-white/10 py-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="text-[12px] font-medium tracking-[0.08em] text-white/46">
                  Ready
                </div>
                <div className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  Landing first. Demo second. Nothing extra in the way.
                </div>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
                  Open the demo, check the public docs, or go straight to market
                  verification.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <PrimaryAction onClick={() => navigateTo("/demo")}>
                  Open recap demo
                </PrimaryAction>
                <PrimaryAction
                  tone="cool"
                  onClick={() => navigateTo("/off-hire-demo")}
                >
                  Open off-hire demo
                </PrimaryAction>
                <SecondaryLink href={weeklyReportsArchive.href}>
                  View all weekly reports
                </SecondaryLink>
                <SecondaryLink href={externalLinks.dexscreener}>
                  View market
                </SecondaryLink>
                <SecondaryLink href={externalLinks.twitter}>
                  Official X
                </SecondaryLink>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
