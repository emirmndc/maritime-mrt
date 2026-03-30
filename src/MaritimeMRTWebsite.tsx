import React from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
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
  { label: "Token layer", value: "Live on Polygon PoS" },
  { label: "Workflow layer", value: "Not deployed" },
  { label: "First proof", value: "Port Cost Vault" },
  { label: "Product posture", value: "Narrow workflow proof" },
];

const liveItems = [
  "MRT token on Polygon PoS",
  "Verified contract and public wallet disclosure",
  "Fixed supply with no admin mint, pause, or blacklist",
  "Public documentation for scope, verification, and trust",
];

const notLiveItems = [
  "No mainnet settlement workflow",
  "No live evidence network",
  "No automated production dispute release",
  "No finished multi-module maritime operating system",
];

const trustRegister = [
  {
    code: "TR-01",
    title: "Contract verification",
    text: "The live token contract is publicly verifiable and meant to be inspected, not merely asserted.",
    href: externalLinks.polygonscan,
  },
  {
    code: "TR-02",
    title: "Wallet disclosure",
    text: "Official wallet roles and custody context are disclosed in published materials.",
    href: documentLinks.wallets,
  },
  {
    code: "TR-03",
    title: "Fixed supply",
    text: "Supply is fixed at deployment with no later mint path.",
    href: documentLinks.tokenomics,
  },
  {
    code: "TR-04",
    title: "No admin controls",
    text: "No tax, no pause, no blacklist, and no token-level intervention logic.",
    href: documentLinks.security,
  },
];

const workflowRegister = [
  {
    step: "01",
    title: "Deal Ledger",
    text: "Hold recap context, parties, route, and amount basis inside one inspectable case record.",
  },
  {
    step: "02",
    title: "Evidence Vault",
    text: "Take in uploaded files with uploader role, document type, timestamp, and package linkage.",
    },
  {
    step: "03",
    title: "Disputed Portion Vault",
    text: "Separate admitted payable amount from the disputed remainder instead of treating all exposure as one block.",
  },
  {
    step: "04",
    title: "Settlement Workflow",
    text: "Move toward an exportable case file for review, not a finished automated dispute network.",
  },
];

const documentRegister = [
  {
    code: "DOC-01",
    title: "Whitepaper",
    text: "Project scope, token layer, and product boundary.",
    href: documentLinks.whitepaper,
  },
  {
    code: "DOC-02",
    title: "Roadmap",
    text: "Narrow workflow proof direction and staged logic.",
    href: documentLinks.roadmap,
  },
  {
    code: "DOC-03",
    title: "Verification",
    text: "Trust-layer references and verification method.",
    href: documentLinks.verification,
  },
  {
    code: "DOC-04",
    title: "Transparency",
    text: "What is live, what is not, and how the project should be read.",
    href: documentLinks.transparency,
  },
  {
    code: "DOC-05",
    title: "Security",
    text: "Token-level security posture and control boundaries.",
    href: documentLinks.security,
  },
  {
    code: "DOC-06",
    title: "Wallet proofs",
    text: "Wallet roles and disclosure stance.",
    href: documentLinks.wallets,
  },
];

const secondaryLinks = [
  { label: "Tokenomics", href: documentLinks.tokenomics },
  { label: "Network strategy", href: documentLinks.networkStrategy },
  { label: "How to buy", href: documentLinks.howToBuy },
  { label: "GitHub", href: externalLinks.github },
  { label: "Trade MRT", href: externalLinks.quickswap },
];

function MaritimeLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#365f8a" />
      <path
        fill="#F3F4F6"
        d="M25 24h16l10 28 9-28h16v52H64V47l-8 23H45l-8-23v29H25z"
      />
    </svg>
  );
}

function Section({
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
      <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="max-w-md">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8eb9e7]">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white md:text-[2.4rem] md:leading-[1.04]">
            {title}
          </h2>
          {description ? <p className="mt-4 text-base leading-7 text-white/64">{description}</p> : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function HeaderLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="transition hover:text-white">
      {label}
    </a>
  );
}

function QuietExternal({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function RegisterRow({
  code,
  title,
  text,
  href,
}: {
  code: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid gap-3 border-t border-white/8 py-4 first:border-t-0 first:pt-0 md:grid-cols-[90px_1fr_auto]"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">{code}</div>
      <div>
        <div className="text-base font-semibold text-white">{title}</div>
        <div className="mt-2 max-w-2xl text-sm leading-7 text-white/64">{text}</div>
      </div>
      <div className="text-sm text-white/48">Open</div>
    </a>
  );
}

function BoundaryBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "live" | "not-live";
}) {
  return (
    <div className="border border-white/8 bg-[#0f161e] p-5">
      <div className={["text-xs font-semibold uppercase tracking-[0.24em]", tone === "live" ? "text-[#9bbddf]" : "text-white/50"].join(" ")}>
        {title}
      </div>
      <div className="mt-4 space-y-3 text-sm leading-7 text-white/74">
        {items.map((item) => (
          <div key={item} className="border-t border-white/8 pt-3 first:border-t-0 first:pt-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid gap-3 border-t border-white/8 py-4 first:border-t-0 first:pt-0 md:grid-cols-[70px_1fr]">
      <div className="text-sm font-semibold tracking-[0.2em] text-[#8eb9e7]">{step}</div>
      <div>
        <div className="text-base font-semibold text-white">{title}</div>
        <div className="mt-2 max-w-2xl text-sm leading-7 text-white/64">{text}</div>
      </div>
    </div>
  );
}

export default function MaritimeMRTWebsite() {
  return (
    <div className="min-h-screen bg-[#0a1016] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <header className="sticky top-3 z-30 border border-white/8 bg-[#0d141b]/94 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-[#0d141b]/88">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-[#101922] text-[#90b6d9]">
                <MaritimeLogo className="h-8 w-8" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  MARITIME
                </div>
                <div className="mt-1 text-base font-semibold tracking-[0.12em] text-white">MRT</div>
              </div>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-white/60">
              <HeaderLink href="#scope" label="Scope" />
              <HeaderLink href="#trust" label="Trust" />
              <HeaderLink href="#workflow" label="Workflow" />
              <HeaderLink href="#documents" label="Documents" />
              <button type="button" onClick={() => navigateTo("/app")} className="transition hover:text-white">
                App
              </button>
            </nav>
          </div>
        </header>

        <main className="pb-20 pt-10">
          <section className="border-t border-white/8 pt-8">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="max-w-4xl">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8eb9e7]">
                  Public token layer
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl lg:text-[4.6rem] lg:leading-[0.98]">
                  Token live. Case-workflow proof next.
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/66">
                  MARITIME (MRT) is a live Polygon token with a public trust layer. The product
                  surface should be read narrowly: one maritime workflow proof around Port Cost
                  Vault, evidence discipline, disputed remainder handling, and exportable case-file
                  logic.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo("/app")}
                    className="inline-flex items-center gap-2 border border-[#567189] bg-[#51697f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c768d]"
                  >
                    Open App
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href={documentLinks.whitepaper}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 bg-[#111821] px-4 py-2.5 text-sm font-semibold text-white/82 transition hover:border-white/18 hover:bg-[#151d27] hover:text-white"
                  >
                    Read Whitepaper
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="border border-white/8 bg-[#0f161e] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/44">
                  Current reading
                </div>
                <div className="mt-4 space-y-3">
                  {quickFacts.map((item) => (
                    <div key={item.label} className="border-t border-white/8 pt-3 first:border-t-0 first:pt-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">
                        {item.label}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white/90">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Section
            id="scope"
            eyebrow="What Is Live / What Is Not"
            title="This is a narrow proof surface, not a finished platform."
            description="The token layer is real. The workflow layer remains a bounded proof with an explicit boundary."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <BoundaryBlock title="Live now" items={liveItems} tone="live" />
              <BoundaryBlock title="Not live" items={notLiveItems} tone="not-live" />
            </div>
          </Section>

          <Section
            id="trust"
            eyebrow="Trust Layer"
            title="Trust comes from verification, disclosure, and hard limits."
            description="The public layer should be inspectable. It should not imply that the utility network already exists."
          >
            <div className="border border-white/8 bg-[#0f161e] p-5">
              {trustRegister.map((item) => (
                <RegisterRow key={item.code} {...item} />
              ))}
            </div>
          </Section>

          <Section
            id="workflow"
            eyebrow="Workflow Proof"
            title="The first proof should behave like a case workflow."
            description="Port Cost Vault is the preferred first test case: DA advance, invoice review, partial approval, disputed remainder, and case-file assembly."
          >
            <div className="border border-white/8 bg-[#0f161e] p-5">
              {workflowRegister.map((item) => (
                <WorkflowStep key={item.step} {...item} />
              ))}
              <div className="mt-5 border border-[#40586d] bg-[#101922] p-5 text-sm leading-7 text-white/70">
                Port Cost Vault should read as a serious operational proof: port cost backup,
                invoice review, admitted payable amount, disputed remainder, linked evidence, and a
                clean package that can move into settlement review.
              </div>
            </div>
          </Section>

          <Section
            id="documents"
            eyebrow="Documents"
            title="Documents stay accessible without turning the site into a document portal."
            description="Core references remain close at hand. Secondary materials stay available, but quieter."
          >
            <div className="space-y-5">
              <div className="border border-white/8 bg-[#0f161e] p-5">
                {documentRegister.map((item) => (
                  <RegisterRow key={item.code} {...item} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/8 pt-4">
                {secondaryLinks.map((item) => (
                  <QuietExternal key={item.label} href={item.href} label={item.label} />
                ))}
              </div>
            </div>
          </Section>

          <Section
            eyebrow="Final Boundary"
            title="Open the current proof with the right expectation."
            description="MARITIME does not present a live settlement network here. It presents a live token layer and a narrow case-workflow direction under proof."
          >
            <div className="border border-white/8 bg-[#0f161e] p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-4 text-sm leading-7 text-white/68">
                  <p>
                    Read the site as a public trust layer plus a bounded workflow proof. Open the
                    app to inspect the current case-review surface. Use the documents to verify what
                    exists and what does not.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    <QuietExternal href={externalLinks.polygonscan} label="View contract" />
                    <QuietExternal href={documentLinks.roadmap} label="Read roadmap" />
                    <QuietExternal href={externalLinks.quickswap} label="Trade MRT" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo("/app")}
                    className="inline-flex items-center gap-2 border border-[#567189] bg-[#51697f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c768d]"
                  >
                    Open App
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href={documentLinks.roadmap}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 bg-[#111821] px-4 py-2.5 text-sm font-semibold text-white/82 transition hover:border-white/18 hover:bg-[#151d27] hover:text-white"
                  >
                    Read Docs
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
