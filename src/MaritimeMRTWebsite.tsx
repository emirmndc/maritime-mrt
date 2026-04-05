import React from "react";

export default function MaritimeMRTWebsite() {
  const docs = [
    { label: "Whitepaper v1.5", href: "/docs/MARITIME_MRT_Whitepaper_v1.5.pdf" },
    { label: "Roadmap v1.5", href: "/docs/MRT_Payment_Rail_Roadmap_v1.5.pdf" },
    { label: "Verification", href: "/docs/VERIFICATION.pdf" },
    { label: "Wallet Proofs", href: "/docs/WALLET_PROOFS.pdf" },
    { label: "Transparency", href: "/docs/TRANSPARENCY.pdf" },
    { label: "Tokenomics", href: "/docs/TOKENOMICS.pdf" },
    { label: "Security", href: "/docs/SECURITY.pdf" },
    { label: "How to Buy", href: "/docs/HOW_TO_BUY_MRT.pdf" },
  ];

  const liveNow = [
    "Verified ERC-20 token on Polygon",
    "Public wallet disclosures and project documentation",
    "Open market access and public pair visibility",
    "A narrower credibility-first project surface",
  ];

  const notLiveYet = [
    "No live mainnet settlement workflow",
    "No production evidence network",
    "No automated release system",
    "Utility remains roadmap until separately demonstrated",
  ];

  const workflow = [
    {
      number: "01",
      title: "Deal Ledger",
      text: "One shared timeline for a single bounded operational case.",
    },
    {
      number: "02",
      title: "Evidence Vault",
      text: "Structured document intake with references and review status.",
    },
    {
      number: "03",
      title: "Disputed Portion Vault",
      text: "Neutral handling for only the disputed amount, not the full flow.",
    },
    {
      number: "04",
      title: "Settlement Workflow",
      text: "Proposal, counter, review window, and controlled execution path.",
    },
  ];

  return (
    <div
      className="min-h-screen overflow-hidden bg-[#06070b] text-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div className="relative">
        <BackgroundLayer />

        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-base font-semibold">
              M
            </div>

            <div>
              <div className="text-[15px] font-semibold tracking-[0.28em] text-white/95">
                MARITIME
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.34em] text-white/45">
                MRT / Polygon
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-10 text-[15px] text-white/76 md:flex">
            <a href="#live" className="transition hover:text-white">
              Live Now
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#demo" className="transition hover:text-white">
              Demo
            </a>
            <a href="#docs" className="transition hover:text-white">
              Docs
            </a>
          </nav>

          <a
            href="#demo"
            className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-black transition hover:opacity-92"
          >
            View Demo
          </a>
        </header>

        <main>
          <section className="relative z-20 mx-auto max-w-6xl px-6 pb-20 pt-10 text-center md:px-8 md:pb-28 md:pt-16">
            <div className="mx-auto max-w-4xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[11px] uppercase tracking-[0.34em] text-white/58 backdrop-blur-sm">
                Token layer is live. Utility layer is not yet deployed.
              </div>

              <h1
                className="mt-10 text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl md:text-7xl lg:text-[88px]"
                style={{
                  fontFamily:
                    '"Arial Black", Inter, ui-sans-serif, system-ui, sans-serif',
                }}
              >
                One clear
                <br />
                workflow proof
                <br />
                for shipping
              </h1>

              <p
                className="mx-auto mt-8 max-w-3xl text-[20px] leading-9 text-white/72"
                style={{
                  fontFamily:
                    'Georgia, "Times New Roman", serif',
                }}
              >
                Shipping settlements still move through emails, PDF attachments,
                spreadsheet logic, and delayed approvals. MRT narrows the surface:
                transparent token infrastructure now, one inspectable Port Cost
                Vault workflow proof next.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="#demo"
                  className="inline-flex min-w-[210px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] px-6 py-4 text-[16px] font-medium text-white transition hover:bg-white/[0.12]"
                >
                  Open workflow demo
                </a>
                <a
                  href="#docs"
                  className="inline-flex min-w-[210px] items-center justify-center rounded-2xl bg-white px-6 py-4 text-[16px] font-semibold text-black transition hover:opacity-92"
                >
                  Read core documents
                </a>
              </div>
            </div>
          </section>

          <section
            id="demo"
            className="relative z-20 mx-auto max-w-7xl px-4 pb-10 md:px-8"
          >
            <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-6 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md md:px-8 md:py-9">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.34em] text-white/42">
                    Bounded workflow proof
                  </div>
                  <h2 className="mt-3 text-[40px] font-semibold tracking-[-0.05em] text-white">
                    Port Cost Vault Case
                  </h2>
                </div>

                <div className="rounded-full border border-emerald-400/18 bg-emerald-400/8 px-4 py-2 text-[14px] font-medium text-emerald-200">
                  Demo Scenario
                </div>
              </div>

              <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[28px] border border-white/10 bg-black/14 p-6">
                  <div className="text-[12px] uppercase tracking-[0.34em] text-white/42">
                    Case summary
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <DataPill label="Vessel" value="M/V North Passage" />
                    <DataPill label="Port" value="Samsun" />
                    <DataPill label="Status" value="Review window" />
                  </div>

                  <div className="mt-8 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
                    <div>
                      <div className="text-[15px] text-white/52">Disputed amount</div>
                      <div className="mt-3 text-[52px] font-semibold tracking-[-0.05em]">
                        $3,850
                      </div>
                      <div className="mt-5 h-[10px] w-[150px] overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,#63d9ff,#bf6dff)]" />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <p
                        className="max-w-md text-[18px] leading-8 text-white/56"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        Accepted amount continues separately. Only the disputed
                        portion is isolated for neutral handling.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/14 p-6">
                  <div className="text-[12px] uppercase tracking-[0.34em] text-white/42">
                    Evidence status
                  </div>

                  <div className="mt-6 space-y-4">
                    <EvidenceLine name="DA request" status="Submitted" />
                    <EvidenceLine name="Final invoice" status="Submitted" />
                    <EvidenceLine name="Agent support email" status="Reviewed" />
                    <EvidenceLine name="Approval note" status="Pending" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="live"
            className="relative z-20 mx-auto max-w-6xl px-6 py-16 md:px-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SimpleSection title="What is live now" items={liveNow} dot="bg-cyan-300" />
              <SimpleSection
                title="What is not live yet"
                items={notLiveYet}
                dot="bg-fuchsia-300"
              />
            </div>
          </section>

          <section
            id="workflow"
            className="relative z-20 mx-auto max-w-6xl px-6 py-8 md:px-8 md:py-12"
          >
            <div className="max-w-3xl">
              <div className="text-[12px] uppercase tracking-[0.34em] text-white/42">
                First workflow architecture
              </div>
              <h2 className="mt-4 text-[44px] font-semibold tracking-[-0.05em]">
                Narrower scope.
                <br />
                Cleaner proof.
              </h2>
              <p
                className="mt-6 max-w-2xl text-[19px] leading-8 text-white/64"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                The first public demo should not feel like a giant platform. It
                should read like one operational case with a visible ledger,
                evidence path, disputed portion logic, and controlled settlement
                sequence.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {workflow.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5"
                >
                  <div className="text-[12px] uppercase tracking-[0.32em] text-white/36">
                    {item.number}
                  </div>
                  <div className="mt-4 text-[26px] font-semibold tracking-[-0.04em]">
                    {item.title}
                  </div>
                  <p
                    className="mt-3 text-[16px] leading-7 text-white/60"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative z-20 mx-auto max-w-6xl px-6 py-16 md:px-8">
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <MinimalPanel title="Why Port Cost Vault first">
                <p
                  className="text-[18px] leading-8 text-white/64"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  It is operationally concrete, easier to simulate, and narrow
                  enough to inspect without pretending the entire settlement
                  stack already exists.
                </p>
              </MinimalPanel>

              <MinimalPanel title="Demo walkthrough">
                <div className="grid gap-3 sm:grid-cols-2">
                  <StepRow
                    number="01"
                    title="Advance recorded"
                    text="Port cost request enters the ledger."
                  />
                  <StepRow
                    number="02"
                    title="Invoice submitted"
                    text="Documents enter the evidence path."
                  />
                  <StepRow
                    number="03"
                    title="Partial acceptance"
                    text="Accepted and disputed amounts separate."
                  />
                  <StepRow
                    number="04"
                    title="Review window"
                    text="Proposal, counter, and controlled next step."
                  />
                </div>
              </MinimalPanel>
            </div>
          </section>

          <section
            id="docs"
            className="relative z-20 mx-auto max-w-7xl px-6 pb-20 pt-8 md:px-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[12px] uppercase tracking-[0.34em] text-white/42">
                  Public proofs
                </div>
                <h2 className="mt-4 text-[44px] font-semibold tracking-[-0.05em]">
                  Read the core surface
                </h2>
              </div>

              <p
                className="max-w-xl text-[18px] leading-8 text-white/60"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Transparent token infrastructure now. Bounded workflow proof next.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {docs.map((doc) => (
                <a
                  key={doc.label}
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-[24px] border border-white/10 bg-white/[0.025] p-6 transition hover:border-white/18 hover:bg-white/[0.04]"
                >
                  <div className="text-[12px] uppercase tracking-[0.34em] text-white/38">
                    Document
                  </div>
                  <div className="mt-6 text-[22px] font-semibold tracking-[-0.04em] text-white">
                    {doc.label}
                  </div>
                  <div className="mt-8 text-[16px] text-white/58 transition group-hover:text-white/82">
                    Open
                  </div>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function BackgroundLayer() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#07080c,#05060a)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(rgba(255,255,255,0.85)_0.55px,transparent_0.55px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute left-1/2 top-[420px] h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(182,104,255,0.22),rgba(133,195,255,0.16),transparent_68%)] blur-[70px]" />
      <div className="pointer-events-none absolute left-1/2 top-[560px] h-[240px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(163,218,255,0.85),rgba(163,218,255,0.18),transparent_74%)] blur-[34px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#06070b] to-transparent" />
    </>
  );
}

function SimpleSection({
  title,
  items,
  dot,
}: {
  title: string;
  items: string[];
  dot: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-7">
      <div className="text-[12px] uppercase tracking-[0.34em] text-white/40">
        Section
      </div>
      <h3 className="mt-4 text-[32px] font-semibold tracking-[-0.04em]">{title}</h3>

      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className={`mt-2 h-2 w-2 rounded-full ${dot}`} />
            <span
              className="text-[18px] leading-8 text-white/64"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MinimalPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-7">
      <div className="text-[12px] uppercase tracking-[0.34em] text-white/40">
        Section
      </div>
      <h3 className="mt-4 text-[32px] font-semibold tracking-[-0.04em]">{title}</h3>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function DataPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.02] px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.32em] text-white/38">
        {label}
      </div>
      <div className="mt-4 text-[18px] font-medium text-white/92">{value}</div>
    </div>
  );
}

function EvidenceLine({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/[0.02] px-5 py-4">
      <span className="text-[18px] text-white/90">{name}</span>
      <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white/72">
        {status}
      </span>
    </div>
  );
}

function StepRow({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[11px] uppercase tracking-[0.32em] text-white/36">
        {number}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-white">
        {title}
      </div>
      <p
        className="mt-2 text-[16px] leading-7 text-white/58"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {text}
      </p>
    </div>
  );
}
