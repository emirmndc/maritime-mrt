export default function MaritimeLanding() {
  const docs = [
    { label: "Whitepaper v1.5", href: "#" },
    { label: "Roadmap v1.5", href: "#" },
    { label: "Verification", href: "#" },
    { label: "Wallet Proofs", href: "#" },
  ];

  const workflow = [
    {
      title: "Deal Ledger",
      text: "One shared case timeline for a single operational dispute scenario.",
    },
    {
      title: "Evidence Vault",
      text: "Structured evidence intake with review states and clean case references.",
    },
    {
      title: "Disputed Portion Vault",
      text: "Neutral handling for only the disputed amount, not the full payment flow.",
    },
    {
      title: "Settlement Workflow",
      text: "Proposal, counter, review window, and controlled execution path.",
    },
  ];

  const liveNow = [
    "Verified ERC-20 token on Polygon",
    "Public documentation and wallet disclosures",
    "Open market access and pair visibility",
    "Credibility-first project surface",
  ];

  const notLiveYet = [
    "No live mainnet settlement workflow",
    "No production evidence network",
    "No automated release system",
    "Utility remains roadmap until separately demonstrated",
  ];

  return (
    <div className="min-h-screen bg-[#05060a] text-white overflow-hidden">
      <div className="relative">
        <BackgroundGlow />

        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold tracking-[0.2em]">
              M
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.28em] text-white/95">MARITIME</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">MRT / Polygon</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#live" className="transition hover:text-white">Live Now</a>
            <a href="#workflow" className="transition hover:text-white">Workflow</a>
            <a href="#demo" className="transition hover:text-white">Demo</a>
            <a href="#docs" className="transition hover:text-white">Docs</a>
          </nav>

          <a
            href="#demo"
            className="rounded-full border border-white/15 bg-white px-5 py-2 text-sm font-medium text-black transition hover:opacity-90"
          >
            View Demo
          </a>
        </header>

        <main>
          <section className="relative z-20 mx-auto max-w-6xl px-6 pb-20 pt-8 text-center md:px-8 md:pb-28 md:pt-14">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-white/60 backdrop-blur-sm">
                Token layer is live. Utility layer is not yet deployed.
              </div>

              <h1 className="text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[86px]">
                One clear
                <br />
                workflow proof
                <br />
                for shipping
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
                Shipping settlements still move through emails, PDFs, spreadsheets, and delayed approvals.
                MRT is narrowing the surface: a transparent token layer today, and one inspectable Port Cost Vault workflow proof next.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#demo"
                  className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/14"
                >
                  Open workflow demo
                </a>
                <a
                  href="#docs"
                  className="inline-flex min-w-[190px] items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Read core documents
                </a>
              </div>
            </div>

            <div className="relative mx-auto mt-16 max-w-5xl">
              <div className="absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 rounded-full bg-fuchsia-500/30 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/3 rounded-full bg-cyan-300/15 blur-3xl" />

              <div className="relative rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-6">
                <div className="rounded-[26px] border border-white/8 bg-[#090b12]/90 p-5 md:p-7">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.3em] text-white/45">Bounded workflow proof</div>
                      <div className="mt-2 text-xl font-semibold tracking-[-0.03em]">Port Cost Vault Case</div>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      Demo Scenario
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 text-left">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">Case summary</div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <Stat label="Vessel" value="M/V North Passage" />
                        <Stat label="Port" value="Samsun" />
                        <Stat label="Status" value="Review window" />
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span>Disputed amount</span>
                          <span>Neutral handling target</span>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-3">
                          <div className="text-3xl font-bold tracking-[-0.04em]">$3,850</div>
                          <div className="text-right text-xs text-white/45">Accepted amount continues separately.<br />Only the disputed portion is isolated.</div>
                        </div>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
                          <div className="h-full w-[26%] rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 text-left">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">Evidence status</div>
                      <div className="mt-4 space-y-3">
                        <EvidenceRow name="DA request" status="Submitted" />
                        <EvidenceRow name="Final invoice" status="Submitted" />
                        <EvidenceRow name="Agent support email" status="Reviewed" />
                        <EvidenceRow name="Approval note" status="Pending" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="live" className="relative z-20 mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-2 md:px-8 md:py-10">
            <Card title="What is live now">
              <ul className="space-y-3 text-sm leading-6 text-white/70">
                {liveNow.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="What is not live yet">
              <ul className="space-y-3 text-sm leading-6 text-white/70">
                {notLiveYet.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section id="workflow" className="relative z-20 mx-auto max-w-6xl px-6 py-14 md:px-8">
            <div className="max-w-3xl">
              <div className="text-[11px] uppercase tracking-[0.32em] text-white/45">First workflow architecture</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] md:text-5xl">
                Narrower scope.
                <br />
                Cleaner proof.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
                The first public demo should not look like a giant platform. It should behave like one operational case with a visible ledger, evidence path, disputed portion logic, and controlled settlement sequence.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {workflow.map((item, idx) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
                >
                  <div className="text-xs font-medium uppercase tracking-[0.28em] text-white/38">0{idx + 1}</div>
                  <div className="mt-4 text-xl font-semibold tracking-[-0.03em]">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-white/65">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="demo" className="relative z-20 mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-16">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card title="Why Port Cost Vault first">
                <div className="space-y-4 text-sm leading-6 text-white/70">
                  <p>It is operationally concrete, easier to simulate, and narrow enough to inspect without pretending the entire settlement stack already exists.</p>
                  <p>The goal is not to replace charter parties or arbitration. The goal is to structure one case clearly enough that outsiders can understand the evidence path and the disputed portion handling logic.</p>
                </div>
              </Card>

              <Card title="Demo walkthrough">
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniStep number="01" title="Advance recorded" text="Port cost request enters the case ledger." />
                  <MiniStep number="02" title="Invoice submitted" text="Supporting documents enter the evidence flow." />
                  <MiniStep number="03" title="Partial acceptance" text="Accepted and disputed portions are separated." />
                  <MiniStep number="04" title="Review window" text="Proposal, counter, and controlled resolution path." />
                </div>
              </Card>
            </div>
          </section>

          <section id="docs" className="relative z-20 mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.32em] text-white/45">Public proofs</div>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] md:text-5xl">Read the core surface</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/62">
                The public site should make the distinction clear: transparent token infrastructure now, bounded workflow proof next.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {docs.map((doc) => (
                <a
                  key={doc.label}
                  href={doc.href}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.06]"
                >
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/38">Document</div>
                  <div className="mt-3 text-lg font-semibold tracking-[-0.03em]">{doc.label}</div>
                  <div className="mt-4 text-sm text-white/52">Open</div>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(to_bottom,#06070b,#040509)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute left-1/2 top-[440px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/40 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-[520px] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-200/70 blur-[18px]" />
      <div className="pointer-events-none absolute left-[-8%] top-[22%] h-44 w-44 rounded-full border border-white/6 bg-white/[0.02]" />
      <div className="pointer-events-none absolute right-[-5%] top-[30%] h-40 w-40 rounded-full border border-white/6 bg-white/[0.02]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#05060a] to-transparent" />
    </>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-7">
      <div className="text-[11px] uppercase tracking-[0.28em] text-white/40">Section</div>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-[0.24em] text-white/40">{label}</div>
      <div className="mt-2 text-sm font-medium text-white/90">{value}</div>
    </div>
  );
}

function EvidenceRow({ name, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
      <span className="text-sm text-white/82">{name}</span>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/62">{status}</span>
    </div>
  );
}

function MiniStep({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <div className="text-[10px] uppercase tracking-[0.26em] text-white/36">{number}</div>
      <div className="mt-3 text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
    </div>
  );
}
