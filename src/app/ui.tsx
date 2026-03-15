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
    <div className="min-h-screen bg-[#04070b] text-white">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 lg:px-10">
        <header className="sticky top-4 z-30 rounded-[28px] border border-white/10 bg-[#050913]/80 px-5 py-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.34)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button className="flex items-center gap-3 text-left" onClick={() => navigateTo("/")}>
              <div className="flex items-center gap-4">
                <MaritimeLogo className="h-12 w-12 shrink-0 drop-shadow-[0_0_24px_rgba(51,115,183,0.18)]" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.34em] text-white/45">MARITIME</div>
                  <div className="mt-1 text-lg font-bold tracking-[0.18em] text-white">Workflow App</div>
                </div>
              </div>
            </button>

            <nav className="flex flex-wrap gap-3 text-sm text-white/70">
              <NavButton route="/app">App Home</NavButton>
              <NavButton route="/app/try-demo">Try Demo</NavButton>
              <NavButton route="/app/voyages">Voyages</NavButton>
            </nav>
          </div>
        </header>

        <main className="pb-16 pt-12">
          <div className="mb-10 max-w-4xl">
            <div className="text-[12px] font-bold uppercase tracking-[0.38em] text-[#88c4ff]">{eyebrow}</div>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70 md:text-[22px] md:leading-9">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function MaritimeLogo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <img
      src="/maritime-logo.png"
      alt="MARITIME logo"
      className={className}
    />
  );
}

export function NavButton({ route, children }: { route: AppRoute; children: ReactNode }) {
  return (
    <button
      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition hover:border-[#4f97e8]/35 hover:bg-white/[0.06]"
      onClick={() => navigateTo(route)}
    >
      {children}
    </button>
  );
}

export function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(9,19,33,0.82))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]",
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
      className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export function StatusPill({ status }: { status: TaskStatus | string }) {
  const map = {
    pending: { icon: Clock3, label: "Pending", tone: "text-amber-300 bg-amber-500/10 border-amber-400/20" },
    ready: { icon: CheckCircle2, label: "Ready", tone: "text-sky-300 bg-sky-500/10 border-sky-400/20" },
    active: { icon: CircleDashed, label: "Active", tone: "text-violet-300 bg-violet-500/10 border-violet-400/20" },
    complete: { icon: CheckCircle2, label: "Complete", tone: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20" },
  } as const;

  const entry = map[status as keyof typeof map] ?? {
    icon: ShieldAlert,
    label: status,
    tone: "text-white bg-white/10 border-white/15",
  };
  const Icon = entry.icon;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${entry.tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {entry.label}
    </span>
  );
}
