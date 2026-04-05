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
      {/* HEADER */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <img
            src="/maritime.png"
            alt="MARITIME"
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <div className="text-[15px] font-semibold tracking-[0.28em]">
              MARITIME
            </div>
            <div className="text-[11px] text-white/50">
              MRT / Polygon
            </div>
          </div>
        </div>

        <a
          href="#docs"
          className="rounded-full bg-white px-5 py-2 text-black"
        >
          Docs
        </a>
      </header>

      {/* HERO */}
      <main className="text-center px-6 pt-16">
        <h1
          className="text-6xl font-bold tracking-tight"
          style={{
            fontFamily:
              '"Arial Black", Inter, ui-sans-serif, system-ui, sans-serif',
          }}
        >
          One clear workflow proof for shipping
        </h1>

        <p
          className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-8"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Shipping still runs on emails, PDFs, and spreadsheets. MRT focuses on
          one inspectable workflow instead of pretending to solve everything at once.
        </p>
      </main>

      {/* DOCS */}
      <section
        id="docs"
        className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {docs.map((doc) => (
          <a
            key={doc.label}
            href={doc.href}
            target="_blank"
            rel="noreferrer"
            className="border border-white/10 rounded-xl p-6 hover:bg-white/5 transition"
          >
            <div className="text-xs text-white/40">DOCUMENT</div>
            <div className="mt-4 text-lg font-semibold">{doc.label}</div>
            <div className="mt-6 text-white/60">Open</div>
          </a>
        ))}
      </section>
    </div>
  );
}
