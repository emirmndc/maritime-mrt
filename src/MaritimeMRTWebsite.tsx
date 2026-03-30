import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  ShieldCheck,
} from "lucide-react";

const externalLinks = {
  quickswap:
    "https://dapp.quickswap.exchange/swap/best/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  polygonscan:
    "https://polygonscan.com/token/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  dexscreener:
    "https://dexscreener.com/polygon/0x3c959fd489cbf4060edf4c4b7133895c1e78edde",
  twitter: "https://x.com/maritime_coin",
  discord: "https://discord.gg/gXZftbpZJg",
};

const quickFacts = [
  ["Network", "Polygon PoS"],
  ["Token", "MARITIME / MRT"],
  ["Supply", "100,000,000 fixed"],
  ["Status", "Live market phase"],
];

const overviewItems = [
  {
    title: "What MRT is",
    text: "MARITIME (MRT) is a fixed-supply ERC-20 token deployed on Polygon PoS and presented with a market-first structure.",
  },
  {
    title: "Current live scope",
    text: "The live layer today is token plus market access. Settlement and reporting modules remain roadmap items.",
  },
  {
    title: "Security posture",
    text: "No admin mint, no tax, no blacklist, and no pause logic. The token layer is intentionally simple.",
  },
  {
    title: "Public trust layer",
    text: "Wallet proofs, tokenomics, security notes, and buying guidance form the project's public information layer.",
  },
];

const featureItems = [
  {
    title: "Polygon native",
    text: "Polygon remains the canonical network for MRT.",
  },
  {
    title: "Minimal token design",
    text: "The token is structured to be readable, verifiable, and free of hidden admin behaviour.",
  },
  {
    title: "Market-first approach",
    text: "Visibility, clean access, and public documentation come before higher-complexity product claims.",
  },
  {
    title: "Transparent access",
    text: "Official market, contract, and community destinations are separated clearly from descriptive content.",
  },
];

const docItems = [
  {
    title: "Security notes",
    text: "Fixed supply minted once at deployment. No mint after deployment. No admin mint, no tax, no blacklist, no pause.",
  },
  {
    title: "Network strategy",
    text: "Polygon PoS is the primary and canonical execution environment. Any later expansion would be conditional and documented.",
  },
  {
    title: "Tokenomics",
    text: "Community 40%, Treasury 25%, Owner Hold 20%, Liquidity Pool Wallet 15%.",
  },
  {
    title: "Official contract",
    text: "0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  },
];

const roadmapItems = [
  {
    title: "Phase 1 - Markets",
    text: "Visibility, verification, wallet disclosures, and clean market access.",
  },
  {
    title: "Phase 2 - Settlement MVP",
    text: "Deal Ledger, Evidence Vault, allowlist logic, and dispute-oriented vault design.",
  },
  {
    title: "Phase 3 - Charter Modules",
    text: "Off-hire, bunker, commission, and war-risk compatible flows.",
  },
  {
    title: "Phase 4 - Reporting",
    text: "Audit artifacts, exports, and integrations after real usage proves the structure.",
  },
];

const buySteps = [
  "Set up MetaMask or another EVM wallet.",
  "Switch to Polygon and keep a small amount of POL for gas.",
  "Acquire USDC on Polygon.",
  "Use the official MRT route on QuickSwap.",
];

function MaritimeLogo({ className = "h-16 w-16" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#3373B7" />
      <path
        fill="#F3F4F6"
        d="M25 24h16l10 28 9-28h16v52H64V47l-8 23H45l-8-23v29H25z"
      />
    </svg>
  );
}

function GlowButton({
  href,
  children,
  secondary = false,
  icon = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  icon?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "relative z-20 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-[0.02em] transition-all duration-300 pointer-events-auto",
        "focus:outline-none focus:ring-2 focus:ring-[#6fb1ff]/70 focus:ring-offset-2 focus:ring-offset-[#050913]",
        secondary
          ? "border border-white/10 bg-white/[0.03] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#6fb1ff]/35 hover:bg-white/[0.06]"
          : "bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] text-[#06111f] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_14px_34px_rgba(51,115,183,0.35)] hover:translate-y-[-1px] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_40px_rgba(51,115,183,0.42)]",
      ].join(" ")}
    >
      <span className="relative z-10">{children}</span>
      {icon ? <ArrowRight className="h-4 w-4 shrink-0" /> : null}
    </a>
  );
}

function NavLink({ label, id }: { label: string; id: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="text-white/68 transition hover:text-white"
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-bold uppercase tracking-[0.38em] text-[#88c4ff]">
      {children}
    </div>
  );
}

function LinkCard({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative z-20 flex w-full items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(7,17,29,0.92))] px-5 py-5 text-left text-sm font-semibold text-white transition-all duration-300 pointer-events-auto hover:border-[#4f97e8]/35 hover:bg-white/[0.04] hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] focus:outline-none focus:ring-2 focus:ring-[#6fb1ff]/70 focus:ring-offset-2 focus:ring-offset-[#050913]"
    >
      <span>{children}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition group-hover:border-[#4f97e8]/30 group-hover:bg-[#4f97e8]/10">
        <ExternalLink className="h-4 w-4 text-white/55 transition group-hover:text-[#cfe7ff]" />
      </span>
    </a>
  );
}

function AccordionList({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
      {items.map((item, index) => (
        <details
          key={item.title}
          className="group border-b border-white/10 last:border-b-0"
          open={index === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left md:px-6">
            <span className="text-lg font-semibold text-white md:text-[22px]">
              {item.title}
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-white/45 transition group-open:rotate-90 group-open:text-[#b8dcff]" />
          </summary>
          <div className="px-5 pb-6 text-[15px] leading-8 text-white/72 md:px-6 md:text-[17px]">
            {item.text}
          </div>
        </details>
      ))}
    </div>
  );
}

function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[32px] border border-white/10",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(9,19,33,0.72))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-8",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,163,235,0.12),transparent_34%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function MaritimeMRTWebsite() {
  return (
    <div
      className="relative isolate min-h-screen overflow-x-hidden bg-[#04070b] text-white"
      style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(51,115,183,0.18),transparent_28%),radial-gradient(circle_at_18%_18%,rgba(51,115,183,0.12),transparent_18%),radial-gradient(circle_at_80%_22%,rgba(189,223,255,0.10),transparent_18%),linear-gradient(180deg,#03060a_0%,#060b12_36%,#08111d_100%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-[260px] bg-[radial-gradient(circle_at_50%_100%,rgba(51,115,183,0.24),rgba(51,115,183,0.08)_24%,transparent_65%)] blur-3xl" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-6 md:px-8 lg:px-10">
        <header className="sticky top-4 z-30 rounded-[28px] border border-white/10 bg-[#050913]/78 px-5 py-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.34)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <MaritimeLogo className="h-14 w-14 shrink-0 drop-shadow-[0_0_28px_rgba(51,115,183,0.18)] md:h-16 md:w-16" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.34em] text-white/45">
                  MARITIME
                </div>
                <div className="mt-1 text-lg font-bold tracking-[0.18em] text-white">
                  MRT
                </div>
              </div>
            </div>

            <nav className="flex flex-wrap gap-5 text-sm">
              <NavLink label="Overview" id="overview" />
              <NavLink label="Features" id="features" />
              <NavLink label="Docs" id="docs" />
              <NavLink label="Roadmap" id="roadmap" />
              <NavLink label="How to Buy" id="buy" />
            </nav>

            <div className="flex flex-wrap gap-3">
              <GlowButton href={externalLinks.polygonscan} secondary>
                PolygonScan
              </GlowButton>
              <GlowButton href={externalLinks.quickswap}>Trade MRT</GlowButton>
            </div>
          </div>
        </header>

        <main>
          <section
            id="overview"
            className="grid gap-10 pb-20 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pt-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#b8dcff]">
                Polygon token layer
              </div>

              <h1 className="max-w-5xl text-5xl font-bold leading-[0.9] tracking-[-0.04em] text-white md:text-7xl xl:text-[108px]">
                Maritime token infrastructure
                <br />
                with a <span className="font-[Georgia] font-normal italic text-[#dcecff]">cleaner public face</span>.
              </h1>

              <p className="mt-8 max-w-3xl text-xl leading-9 text-white/72 md:text-[26px] md:leading-[1.6]">
                A maritime-focused token project with direct market access, transparent
                public information, and a staged roadmap toward settlement workflows.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <GlowButton href={externalLinks.dexscreener} icon>
                  View Market
                </GlowButton>
                <GlowButton href={externalLinks.twitter} secondary>
                  Official X
                </GlowButton>
              </div>

              <div className="mt-12 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                {quickFacts.map(([label, value]) => (
                  <div key={label} className="border-b border-white/10 pb-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
                      {label}
                    </div>
                    <div className="mt-3 text-base font-semibold text-white">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <Surface>
                <div className="mb-5 flex items-center gap-4">
                  <MaritimeLogo className="h-14 w-14 shrink-0 drop-shadow-[0_0_24px_rgba(51,115,183,0.18)]" />
                  <div>
                    <div className="text-base text-white/45 md:text-lg">Project Snapshot</div>
                    <div className="mt-1 text-3xl font-bold md:text-4xl">
                      Live token, staged roadmap
                    </div>
                  </div>
                </div>
                <AccordionList items={overviewItems} />
              </Surface>
            </motion.div>
          </section>

          <section id="features" className="pb-20">
            <div className="mb-8 max-w-3xl">
              <SectionLabel>Core Features</SectionLabel>
              <h2 className="mt-3 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-6xl xl:text-[72px]">
                Minimal structure, stronger presentation.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68 md:text-[22px] md:leading-9">
                The layout stays sharp and spare, but the interaction model remains
                obvious and reliable.
              </p>
            </div>
            <AccordionList items={featureItems} />
          </section>

          <section id="docs" className="pb-20">
            <div className="mb-8 max-w-3xl">
              <SectionLabel>Embedded Information</SectionLabel>
              <h2 className="mt-3 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-6xl xl:text-[72px]">
                The essential information lives inside the site.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68 md:text-[22px] md:leading-9">
                Visitors should understand the project before they ever need GitHub or
                a PDF.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <Surface>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#88c4ff]">
                      Public layer
                    </div>
                    <div className="mt-1 text-3xl font-bold md:text-4xl">Core docs</div>
                  </div>
                </div>
                <AccordionList items={docItems} />
              </Surface>

              <Surface>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#88c4ff]">
                      Live destinations
                    </div>
                    <div className="mt-1 text-3xl font-bold md:text-4xl">External links</div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {[
                    ["Open QuickSwap", externalLinks.quickswap],
                    ["Open PolygonScan", externalLinks.polygonscan],
                    ["Open DexScreener", externalLinks.dexscreener],
                    ["Open Discord", externalLinks.discord],
                  ].map(([label, href]) => (
                    <LinkCard key={label} href={href}>
                      {label}
                    </LinkCard>
                  ))}
                </div>
              </Surface>
            </div>
          </section>

          <section id="roadmap" className="pb-20">
            <div className="mb-8 max-w-3xl">
              <SectionLabel>Roadmap</SectionLabel>
              <h2 className="mt-3 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-6xl xl:text-[72px]">
                From visibility to settlement-oriented infrastructure.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68 md:text-[22px] md:leading-9">
                The roadmap reads more like an editorial progression than a stack of
                disconnected cards.
              </p>
            </div>
            <AccordionList items={roadmapItems} />
          </section>

          <section id="buy" className="pb-20">
            <div className="mb-8 max-w-3xl">
              <SectionLabel>How to Buy</SectionLabel>
              <h2 className="mt-3 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-6xl xl:text-[72px]">
                A cleaner flow for first-time visitors.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68 md:text-[22px] md:leading-9">
                Reduced visual clutter, clearer steps, and direct verified routes.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
              <Surface>
                <div className="space-y-4">
                  {buySteps.map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="w-10 shrink-0 text-sm font-bold text-[#b8dcff]">
                        0{index + 1}
                      </div>
                      <div className="text-[15px] leading-8 text-white/78 md:text-[17px]">{step}</div>
                    </div>
                  ))}
                </div>
              </Surface>

              <Surface>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#88c4ff]">
                      Official route
                    </div>
                    <div className="mt-1 text-3xl font-bold md:text-4xl">
                      Use only verified destinations
                    </div>
                  </div>
                </div>
                <p className="text-[15px] leading-8 text-white/72 md:text-[17px]">
                  Always verify the contract address. Never share your seed phrase.
                  Early-stage liquidity can create higher price impact.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <GlowButton href={externalLinks.quickswap}>
                    Open QuickSwap
                  </GlowButton>
                  <GlowButton href={externalLinks.polygonscan} secondary>
                    Verify Contract
                  </GlowButton>
                </div>
              </Surface>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
