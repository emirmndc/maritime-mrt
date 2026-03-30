import React from "react";
import {
  ArrowRight,
  ExternalLink,
  FileStack,
  FolderOpenDot,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { navigateTo } from "./app/router";

const externalLinks = {
  quickswap:
    "https://dapp.quickswap.exchange/swap/best/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  polygonscan:
    "https://polygonscan.com/token/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE",
  github: "https://github.com/maritime-mrt/maritime-mrt",
};

const documentLinks = {
  whitepaper: "/docs/MARITIME_MRT_Whitepaper_v1.4_clean-1.pdf",
  roadmap: "/docs/MRT_Payment_Rail_Roadmap_v0.4_REWRITE.pdf",
  security: "/docs/SECURITY.pdf",
  transparency: "/docs/TRANSPARENCY.pdf",
  verification: "/docs/VERIFICATION.pdf",
  wallets: "/docs/WALLET_PROOFS.pdf",
  tokenomics: "/docs/TOKENOMICS.pdf",
  networkStrategy: "/docs/NETWORK_STRATEGY.pdf",
  howToBuy: "/docs/HOW_TO_BUY_MRT.pdf",
};

const quickFacts = [
  { label: "Network", value: "Polygon PoS" },
  { label: "Contract", value: "Live and verified" },
  { label: "Utility", value: "Not deployed" },
  { label: "First proof", value: "Port Cost Vault" },
];

const liveItems = [
  "MRT token on Polygon PoS",
  "Verified contract and public wallet disclosure",
  "Fixed supply with no admin mint, pause, or blacklist",
  "Public document set for scope, verification, and trust",
];

const notLiveItems = [
  "No mainnet settlement workflow",
  "No live evidence network",
  "No production dispute release rail",
  "No broad multi-module maritime platform",
];

const trustItems = [
  {
    title: "Contract verification",
    text: "Exact-match verification is published so the live token layer is inspectable.",
    href: externalLinks.polygonscan,
  },
  {
    title: "Wallet disclosure",
    text: "Official wallets and usage notes are public, not implied.",
    href: documentLinks.wallets,
  },
  {
    title: "Fixed supply",
    text: "100,000,000 MRT fixed at deployment with no later mint path.",
    href: documentLinks.tokenomics,
  },
  {
    title: "No admin controls",
    text: "No tax, no pause, no blacklist, and no token-level intervention logic.",
    href: documentLinks.security,
  },
];

const workflowItems = [
  {
    title: "Deal Ledger",
    text: "Capture the recap context, counterparties, route, and amount basis in one inspectable case.",
  },
  {
    title: "Evidence Vault",
    text: "Take in supporting files with uploader role, type, timestamp, and package linkage.",
  },
  {
    title: "Disputed Portion Vault",
    text: "Separate admitted payable value from the disputed remainder instead of pretending the whole amount is in play.",
  },
  {
    title: "Settlement Workflow",
    text: "Move toward an exportable case file, not a fully automated production network.",
  },
];

const documentItems = [
  {
    title: "Whitepaper",
    text: "Project scope, token layer, and product boundary.",
    href: documentLinks.whitepaper,
  },
  {
    title: "Roadmap",
    text: "Narrow workflow proof direction and staged product logic.",
    href: documentLinks.roadmap,
  },
  {
    title: "Verification",
    text: "Verification method and trust-layer references.",
    href: documentLinks.verification,
  },
  {
    title: "Transparency",
    text: "What is live, what is not, and how the project is presented.",
    href: documentLinks.transparency,
  },
  {
    title: "Security",
    text: "Token-level security posture and control boundaries.",
    href: documentLinks.security,
  },
  {
    title: "Wallet proofs",
    text: "Published wallet roles and disclosure stance.",
    href: documentLinks.wallets,
  },
];

const secondaryDocs = [
  { label: "Tokenomics", href: documentLinks.tokenomics },
  { label: "Network strategy", href: documentLinks.networkStrategy },
  { label: "How to buy", href: documentLinks.howToBuy },
  { label: "GitHub", href: externalLinks.github },
];

function MaritimeLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#2f5f96" />
      <path
        fill="#F3F4F6"
        d="M25 24h16l10 28 9-28h16v52H64V47l-8 23H45l-8-23v29H25z"
      />
    </svg>
  );
}

function SiteSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-white/8 py-14 first:border-t-0 first:pt-10 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="max-w-md">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8eb9e7]">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-white/64">{description}</p>
          ) : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function PrimaryAction({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => navigateTo("/app")}
      className="inline-flex items-center gap-2 rounded-lg border border-[#3f6893] bg-[#4b7dad] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5589bc]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function SecondaryAction({
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
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#111821] px-4 py-2.5 text-sm font-semibold text-white/82 transition hover:border-white/18 hover:bg-[#151d27] hover:text-white"
    >
      {children}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

function QuietLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-white/58 transition hover:text-white"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function FactItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/8 pt-3 first:border-t-0 first:pt-0">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}

function BoundaryList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "live" | "not-live";
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#111821] p-5">
      <div
        className={[
          "text-xs font-semibold uppercase tracking-[0.24em]",
          tone === "live" ? "text-[#9fc8f7]" : "text-white/55",
        ].join(" ")}
      >
        {title}
      </div>
      <div className="mt-4 space-y-3 text-sm leading-7 text-white/76">
        {items.map((item) => (
          <div key={item} className="border-t border-white/8 pt-3 first:border-t-0 first:pt-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustRow({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-start justify-between gap-4 border-t border-white/8 py-4 first:border-t-0 first:pt-0 last:pb-0"
    >
      <div>
        <div className="text-base font-semibold text-white">{title}</div>
        <div className="mt-2 max-w-2xl text-sm leading-7 text-white/64">{text}</div>
      </div>
      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-white/42" />
    </a>
  );
}

function WorkflowCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#111821] p-5">
      <div className="text-base font-semibold text-white">{title}</div>
      <div className="mt-3 text-sm leading-7 text-white/66">{text}</div>
    </div>
  );
}

function DocumentTile({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-xl border border-white/8 bg-[#111821] p-5 transition hover:border-white/14 hover:bg-[#141d27]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-base font-semibold text-white">{title}</div>
        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-white/42" />
      </div>
      <div className="mt-3 text-sm leading-7 text-white/64">{text}</div>
    </a>
  );
}

export default function MaritimeMRTWebsite() {
  return (
    <div className="min-h-screen bg-[#0b1016] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <header className="sticky top-3 z-30 rounded-xl border border-white/8 bg-[#0f151d]/94 px-4 py-4 shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#101a24] text-[#9fc8f7]">
                <MaritimeLogo className="h-8 w-8" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  MARITIME
                </div>
                <div className="mt-1 text-base font-semibold tracking-[0.14em] text-white">
                  MRT
                </div>
              </div>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-white/62">
              <a href="#scope" className="transition hover:text-white">
                Scope
              </a>
              <a href="#trust" className="transition hover:text-white">
                Trust
              </a>
              <a href="#workflow" className="transition hover:text-white">
                Workflow
              </a>
              <a href="#documents" className="transition hover:text-white">
                Documents
              </a>
              <button type="button" onClick={() => navigateTo("/app")} className="transition hover:text-white">
                App
              </button>
            </nav>
          </div>
        </header>

        <main className="pb-20 pt-10">
          <section className="border-t border-white/8 pt-10">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-4xl">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8eb9e7]">
                  Token layer live
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
                  Token live. Workflow proof next.
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/66">
                  MARITIME (MRT) is a live Polygon token with a public trust layer. The near-term
                  product goal is one narrow maritime workflow proof centered on Port Cost Vault,
                  evidence intake, disputed remainder control, and an exportable case file.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryAction>Open App</PrimaryAction>
                  <SecondaryAction href={documentLinks.whitepaper}>Read Whitepaper</SecondaryAction>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {quickFacts.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/8 bg-[#111821] p-5">
                    <FactItem label={item.label} value={item.value} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <SiteSection
            id="scope"
            eyebrow="What Is Live / What Is Not"
            title="The product should be read as a narrow proof, not a finished platform."
            description="The token layer is real. The workflow layer is still a bounded v1.5 proof."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <BoundaryList title="Live now" items={liveItems} tone="live" />
              <BoundaryList title="Not live" items={notLiveItems} tone="not-live" />
            </div>
          </SiteSection>

          <SiteSection
            id="trust"
            eyebrow="Trust Layer"
            title="Trust is carried by verification, disclosure, and hard limits."
            description="This is a public trust surface, not a claim that the workflow network is already deployed."
          >
            <div className="rounded-xl border border-white/8 bg-[#111821] p-5">
              <div className="mb-5 flex items-center gap-3 text-white">
                <ShieldCheck className="h-5 w-5 text-[#8eb9e7]" />
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
                  Verification points
                </div>
              </div>
              <div>
                {trustItems.map((item) => (
                  <TrustRow key={item.title} {...item} />
                ))}
              </div>
            </div>
          </SiteSection>

          <SiteSection
            id="workflow"
            eyebrow="Workflow Proof"
            title="The first proof should feel like a case workflow, not a broad maritime platform."
            description="Port Cost Vault is the preferred first test case: DA advance, invoice review, partial approval, disputed remainder, and exportable case assembly."
          >
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {workflowItems.map((item) => (
                  <WorkflowCard key={item.title} {...item} />
                ))}
              </div>
              <div className="rounded-xl border border-[#365272] bg-[#101821] p-5">
                <div className="flex items-center gap-3 text-[#9fc8f7]">
                  <Scale className="h-5 w-5" />
                  <div className="text-sm font-semibold uppercase tracking-[0.22em]">
                    Port Cost Vault first
                  </div>
                </div>
                <div className="mt-4 text-sm leading-7 text-white/70">
                  The preferred first operational proof is not a universal claims engine. It is a
                  narrower maritime case: port cost backup, invoice review, admitted payable
                  portion, disputed remainder, linked evidence, and a clean case file that can be
                  exported for review.
                </div>
              </div>
            </div>
          </SiteSection>

          <SiteSection
            id="documents"
            eyebrow="Documents"
            title="The document layer should stay accessible without taking over the whole site."
            description="Core documents stay one click away. Secondary references remain available, but quieter."
          >
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {documentItems.map((item) => (
                  <DocumentTile key={item.title} {...item} />
                ))}
              </div>
              <div className="rounded-xl border border-white/8 bg-[#111821] p-5">
                <div className="flex items-center gap-3 text-white">
                  <FolderOpenDot className="h-5 w-5 text-[#8eb9e7]" />
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
                    Secondary library
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {secondaryDocs.map((item) => (
                    <QuietLink key={item.label} href={item.href} label={item.label} />
                  ))}
                </div>
              </div>
            </div>
          </SiteSection>

          <SiteSection
            eyebrow="Final Boundary"
            title="Open the current proof surface with the right expectations."
            description="This site does not present a live settlement network. It presents a live token layer and a narrow workflow direction under active proof."
          >
            <div className="rounded-xl border border-white/8 bg-[#111821] p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-4 text-sm leading-7 text-white/68">
                  <div className="flex items-center gap-3 text-white">
                    <FileStack className="h-5 w-5 text-[#8eb9e7]" />
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
                      Current reading
                    </div>
                  </div>
                  <p>
                    Use the app to inspect the current workflow proof. Use the documents to verify
                    scope and trust claims. Treat MRT market access as a separate live layer, not
                    proof that workflow utility is already deployed.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    <QuietLink href={externalLinks.quickswap} label="Trade MRT" />
                    <QuietLink href={externalLinks.polygonscan} label="View contract" />
                    <QuietLink href={documentLinks.roadmap} label="Read roadmap" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <PrimaryAction>Open App</PrimaryAction>
                  <SecondaryAction href={documentLinks.roadmap}>Read Docs</SecondaryAction>
                </div>
              </div>
            </div>
          </SiteSection>
        </main>
      </div>
    </div>
  );
}
