import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  Globe,
  MoveRight,
  Radar,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { navigateTo } from "./app/router";

const externalLinks = {
  quickswap:
    "https://dapp.quickswap.exchange/swap/best/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  polygonscan:
    "https://polygonscan.com/token/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  dexscreener: "https://dexscreener.com/polygon/0x3c959fd489cbf4060edf4c4b7133895c1e78edde",
  github: "https://github.com/maritime-mrt/maritime-mrt",
  twitter: "https://x.com/maritime_coin",
};

const signalTape = [
  "Polygon PoS",
  "MARITIME / MRT",
  "Fixed supply 100,000,000",
  "No admin mint",
  "Transparent wallet roles",
  "Voyage recap demo live",
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
    value: "High-level thesis, transparency framing, and market-first roadmap context.",
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
      className="rounded-full px-4 py-2 text-[15px] font-semibold tracking-[0.01em] text-white/68 transition hover:bg-white/[0.05] hover:text-white"
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.36em] text-[#f5a78f]">
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
    <span
      className={[
        "mx-[0.12em] inline-block bg-clip-text font-semibold tracking-[-0.05em] text-transparent",
        tone === "warm"
          ? "bg-[linear-gradient(135deg,#ffd4c7_0%,#ff9b78_55%,#ff8b69_100%)]"
          : "bg-[linear-gradient(135deg,#e1e6ff_0%,#9cb2ff_55%,#7e95ff_100%)]",
      ].join(" ")}
      style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
    >
      {children}
    </span>
  );
}

function PrimaryAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-[#ffb59b]/30 bg-[linear-gradient(135deg,rgba(255,167,143,0.96),rgba(255,122,92,0.9))] px-6 py-3 text-sm font-semibold text-[#180d12] shadow-[0_20px_40px_rgba(255,130,101,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_55px_rgba(255,130,101,0.3)]"
    >
      {children}
      <MoveRight className="h-4 w-4" />
    </button>
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
      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/82 transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

function HeroSignalBoard() {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/12 bg-[#0f1020]/82 shadow-[0_40px_120px_rgba(4,5,12,0.72)]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/media/hero-texture.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,162,130,0.16),transparent_25%),radial-gradient(circle_at_18%_32%,rgba(121,159,255,0.18),transparent_28%),linear-gradient(180deg,rgba(7,8,18,0.32),rgba(7,8,18,0.88))]" />
      <div className="absolute -left-16 bottom-8 h-40 w-40 rounded-full bg-[#5d78ff]/28 blur-[100px]" />
      <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-[#ff9c79]/25 blur-[105px]" />

      <div className="relative z-10 px-6 pb-8 pt-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.38em] text-white/42">
              Live prototype
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              Maritime signal surface
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8da4ff]/18 bg-[#7f97ff]/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-[#dbe3ff]">
            Demo route only
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

          <div className="flex min-h-[320px] flex-col justify-between rounded-[28px] border border-white/10 bg-black/15 p-5 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/maritime-logo.png"
                  alt="Maritime logo"
                  className="h-12 w-12 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/44">
                    Polygon token layer
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    Market access and operational signal
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-sm leading-7 text-white/70">
                <p>
                  The landing is editorial on purpose: less dashboard clutter,
                  more confidence, more air, more rhythm.
                </p>
                <p>
                  The demo stays available, but it no longer sits inside a maze
                  of half-built routes.
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#ffb29a]">
                <Radar className="h-4 w-4" />
                Clarity over noise
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
      <div className="text-[10px] uppercase tracking-[0.34em] text-white/38">
        {label}
      </div>
      <div className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white sm:text-[1.7rem]">
        {value}
      </div>
      <div className="mt-2 text-sm text-white/52">{hint}</div>
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
      <div className="text-[32px] leading-none text-white/16">{number}</div>
      <div>
        <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[2rem]">
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#ffb29a]">
        {label}
      </div>
      <div className="text-base leading-8 text-white/68 sm:text-lg">{text}</div>
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/42">
        {label}
      </div>
      <div className="text-base leading-8 text-white/72 sm:text-lg">{value}</div>
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffd4c8] group-hover:text-white">
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8ea1ff]">
        {step}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.9rem]">
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(114,128,255,0.18),transparent_26%),radial-gradient(circle_at_18%_12%,rgba(255,137,103,0.12),transparent_22%),radial-gradient(circle_at_24%_88%,rgba(255,146,113,0.14),transparent_25%),radial-gradient(circle_at_78%_92%,rgba(95,113,255,0.16),transparent_28%),linear-gradient(180deg,#06070d_0%,#0a0a15_48%,#090914_76%,#070811_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-screen"
        style={{
          backgroundImage: "url('/media/hero-texture.jpg')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#445dff]/18 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-110px] top-[420px] h-80 w-80 rounded-full bg-[#ff8e68]/20 blur-[150px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-120px] h-[700px] bg-[radial-gradient(circle_at_18%_72%,rgba(255,145,112,0.12),transparent_22%),radial-gradient(circle_at_82%_84%,rgba(97,115,255,0.14),transparent_24%),linear-gradient(180deg,transparent_0%,rgba(10,10,18,0.18)_24%,rgba(11,11,21,0.84)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[1540px] px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-30 w-full rounded-[34px] border border-white/10 bg-[linear-gradient(90deg,rgba(14,14,27,0.92),rgba(24,21,46,0.92),rgba(15,13,30,0.92))] px-6 py-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(3,4,10,0.48)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 text-left"
            >
              <img
                src="/maritime-logo.png"
                alt="Maritime logo"
                className="h-11 w-11 rounded-full border border-white/10 object-cover"
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.34em] text-white/38">
                  MARITIME
                </div>
                <div className="mt-1 text-base font-semibold tracking-[0.22em] text-white">
                  MRT
                </div>
              </div>
            </button>

            <nav className="hidden items-center gap-2 lg:flex">
              <HeaderLink label="Story" id="story" />
              <HeaderLink label="Demo" id="demo" />
              <HeaderLink label="Proof" id="proof" />
              <HeaderLink label="Roadmap" id="roadmap" />
            </nav>

            <div className="flex items-center gap-3">
              <SecondaryLink href={externalLinks.polygonscan}>PolygonScan</SecondaryLink>
              <PrimaryAction onClick={() => navigateTo("/demo")}>
                Open demo
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
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d7dcff]">
                Polygon-native maritime layer
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.055em] text-white sm:text-7xl xl:text-[6.6rem]">
                Maritime clarity
                <br />
                with a <AccentWord tone="warm">cleaner arrival</AccentWord>
                .
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68 sm:text-[1.35rem] sm:leading-10">
                The site is now reduced to what matters: a refined landing page,
                a single live demo, and a public proof layer around the MRT token
                on Polygon.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryAction onClick={() => navigateTo("/demo")}>
                  Enter the demo
                </PrimaryAction>
                <SecondaryLink href={externalLinks.quickswap}>
                  Trade on QuickSwap
                </SecondaryLink>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/54">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#95a8ff]" />
                  Fixed-supply ERC-20
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#95a8ff]" />
                  Polygon PoS
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#95a8ff]" />
                  Public documents
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

          <section className="overflow-hidden rounded-full border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-lg">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/54">
              {signalTape.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff9d7a]" />
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
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl">
                No cards.
                <br />
                Just signal, <AccentWord>rhythm</AccentWord> and space.
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
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl">
                One route.
                <br />
                One clear <AccentWord tone="warm">experience</AccentWord>
                .
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                The old internal app tree is out of the way. Visitors now move
                straight from the narrative into a single demo focused on recap
                parsing and review-friendly output.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryAction onClick={() => navigateTo("/demo")}>
                  Launch recap demo
                </PrimaryAction>
                <SecondaryLink href={externalLinks.github}>
                  View GitHub
                </SecondaryLink>
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(12,13,26,0.9))] p-6 shadow-[0_30px_100px_rgba(4,5,12,0.52)] backdrop-blur-xl sm:p-8">
              <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#95a8ff]">
                <Waves className="h-4 w-4" />
                Voyage recap to signal
              </div>

              <div className="border-t border-white/10">
                {demoFlow.map((item) => (
                  <FlowPoint key={item.label} {...item} />
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-[26px] border border-white/10 bg-black/20">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="text-sm font-semibold text-white">Demo preview</div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/38">
                    Assistive output
                  </div>
                </div>
                <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="border-b border-white/10 px-5 py-5 lg:border-b-0 lg:border-r">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                      Input
                    </div>
                    <div className="mt-4 space-y-3 text-sm leading-7 text-white/58">
                      <div>Owner: Northshore Bulk Pte. Ltd.</div>
                      <div>Charterer: Golden Delta Foods</div>
                      <div>Loadport: Novorise</div>
                      <div>Disport: Southbay</div>
                      <div>Deadline: 15 business days after discharge.</div>
                    </div>
                  </div>
                  <div className="px-5 py-5">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">
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
            </div>
          </section>

          <section
            id="proof"
            className="grid gap-12 border-t border-white/10 pb-8 pt-20 lg:grid-cols-[0.78fr_1.22fr]"
          >
            <div>
              <SectionLabel>Proof</SectionLabel>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl">
                The trust layer
                <br />
                stays <AccentWord>visible</AccentWord>
                .
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-white/66 sm:text-lg">
                Visitors should be able to verify the project without getting lost
                in repo structure. The essentials are linked here in one cleaner
                stream.
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
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl">
                Build the public face
                <br />
                before the <AccentWord tone="warm">sprawl</AccentWord>
                .
              </h2>
            </div>

            <div>
              {roadmapRows.map((row) => (
                <RoadmapRow key={row.step} {...row} />
              ))}
            </div>
          </section>

          <section className="relative mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,9,17,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(4,5,12,0.46)] sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_26%,rgba(255,149,116,0.09),transparent_20%),radial-gradient(circle_at_78%_72%,rgba(96,116,255,0.12),transparent_24%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#ffb29a]">
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
                  Open demo
                </PrimaryAction>
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
