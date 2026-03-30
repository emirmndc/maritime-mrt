import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, CircleDashed, Clock3, ShieldAlert } from "lucide-react";
import { navigateTo, type AppRoute } from "./router";
import type { TaskStatus } from "./types";

export function AppShell({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1016] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <header className="sticky top-3 z-30 rounded-xl border border-white/8 bg-[#0f151d]/94 px-4 py-4 shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button className="flex items-center gap-3 text-left" onClick={() => navigateTo("/")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#101a24] text-[#9fc8f7]">
                <MaritimeMark className="h-8 w-8" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  MARITIME
                </div>
                <div className="mt-1 text-base font-semibold tracking-[0.14em] text-white">
                  Workflow App
                </div>
              </div>
            </button>
            <nav className="flex flex-wrap gap-2 text-sm text-white/68">
              <NavButton route="/app">App Home</NavButton>
              <NavButton route="/app/try-demo">Try Demo</NavButton>
              <NavButton route="/app/generated-dashboard">Case Review</NavButton>
              <NavButton route="/app/settlement">Settlement</NavButton>
            </nav>
          </div>
        </header>

        <main className="pb-16 pt-10">
          <div className="mb-8 max-w-4xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8eb9e7]">
              {eyebrow}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/66 md:text-lg md:leading-8">
              {description}
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function MaritimeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#2f5f96" />
      <path
        fill="#F5F7FA"
        d="M21 24h20l13 38 14-38h20v52H73V45L61 74H47L35 45v31H21z"
      />
    </svg>
  );
}

export function NavButton({ route, children }: { route: AppRoute; children: ReactNode }) {
  return (
    <button
      className="rounded-lg border border-white/8 bg-[#121922] px-3 py-2 transition hover:border-white/14 hover:bg-[#151e29] hover:text-white"
      onClick={() => navigateTo(route)}
    >
      {children}
    </button>
  );
}

export function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/8 bg-[#111821] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] md:p-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CTAButton({ route, children }: { route: AppRoute; children: ReactNode }) {
  return (
    <button
      onClick={() => navigateTo(route)}
      className="inline-flex items-center gap-2 rounded-lg border border-[#3f6893] bg-[#4b7dad] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5589bc]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export function StatusPill({ status }: { status: TaskStatus | string }) {
  const map = {
    pending: { icon: Clock3, label: "Pending", tone: "text-amber-200 bg-amber-500/10 border-amber-400/20" },
    ready: { icon: CheckCircle2, label: "Ready", tone: "text-sky-200 bg-sky-500/10 border-sky-400/20" },
    active: { icon: CircleDashed, label: "Active", tone: "text-violet-200 bg-violet-500/10 border-violet-400/20" },
    complete: { icon: CheckCircle2, label: "Complete", tone: "text-emerald-200 bg-emerald-500/10 border-emerald-400/20" },
  } as const;

  const entry = map[status as keyof typeof map] ?? {
    icon: ShieldAlert,
    label: status,
    tone: "text-white bg-white/8 border-white/12",
  };
  const Icon = entry.icon;

  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold ${entry.tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {entry.label}
    </span>
  );
}
