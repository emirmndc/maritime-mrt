import { AppShell, Surface } from "./ui";

export function TryDemoPage() {
  return (
    <AppShell
      eyebrow="Interactive Demo"
      title="Recap to dashboard demo."
      description="Paste a voyage recap and see how the system could turn it into an operational dashboard. This is an experimental demo."
    >
      <div className="grid gap-5">
        <Surface>
          <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">Experimental demo</div>
          <h2 className="mt-3 text-2xl font-bold">Paste voyage recap</h2>
          <p className="mt-3 text-white/68">
            This will become the playground where users test recap text before a full product workflow is connected.
          </p>
        </Surface>
      </div>
    </AppShell>
  );
}
