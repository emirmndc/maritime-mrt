export default function MaritimeMRTWebsite() {
  const docs = [
    { label: "Whitepaper v1.5", href: "/docs/MARITIME_MRT_Whitepaper_v1.5.pdf" },
    { label: "Roadmap v1.5", href: "/docs/MRT_Payment_Rail_Roadmap_v1.5.pdf" },
    { label: "Verification", href: "/docs/VERIFICATION.pdf" },
    { label: "Wallet Proofs", href: "/docs/WALLET_PROOFS.pdf" },
  ];

  return (
    <div
      className="min-h-screen bg-[#06070b] text-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <img
            src="/maritime-logo.png"
            alt=""
            aria-hidden="true"
            className="h-11 w-11 rounded-full object-cover shrink-0"
          />

          <div className="leading-none">
            <div className="text-[15px] font-semibold tracking-[0.28em] text-white/95">
              MARITIME
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.30em] text-white/50">
              MRT / Polygon
            </div>
          </div>
        </div>

        <a
          href="#docs"
          className="rounded-full bg-white px-5 py-2 text-black transition hover:opacity-90"
        >
          Docs
        </a>
      </header>

      <main className="px-6 pt-16 text-center">
        <h1
          className="mx-auto max-w-5xl text-5xl font-black tracking-[-0.05em] sm:text-6xl md:text-7xl"
          style={{
            fontFamily:
              '"Arial Black", Inter, ui-sans-serif, system-ui, sans-serif',
          }}
        >
          One clear workflow proof for shipping
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Shipping still runs on emails, PDFs, and spreadsheets. MRT focuses on
          one inspectable workflow instead of pretending to solve everything at once.
        </p>
      </main>

      <section
        id="docs"
        className="mx-auto grid max-w-6xl gap-4 px-6 py-20 md:grid-cols-2 lg:grid-cols-4"
      >
        {docs.map((doc) => (
          <a
            key={doc.label}
            href={doc.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 p-6 transition hover:bg-white/5"
          >
            <div className="text-xs uppercase tracking-[0.24em] text-white/40">
              Document
            </div>
            <div className="mt-4 text-lg font-semibold">{doc.label}</div>
            <div className="mt-6 text-white/60">Open</div>
          </a>
        ))}
      </section>
    </div>
  );
}
