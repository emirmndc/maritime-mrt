export const appRoutes = {
  "/": { title: "MARITIME | Polygon maritime signal layer" },
  "/demo": { title: "MARITIME Demo | Voyage recap to signal" },
  "/off-hire-demo": { title: "MARITIME Demo | Owner-charterer deduction rail" },
  "/app": { title: "MARITIME Demo | Voyage recap to signal" },
  "/app/try-demo": { title: "MARITIME Demo | Voyage recap to signal" },
  "/app/generated-dashboard": { title: "MARITIME Demo | Voyage recap to signal" },
  "/app/voyages": { title: "MARITIME Demo | Voyage recap to signal" },
  "/app/settlement": { title: "MARITIME Demo | Voyage recap to signal" },
} as const;

export type AppRoute = keyof typeof appRoutes;

export function navigateTo(path: AppRoute) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }

  window.dispatchEvent(new Event("app:navigate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
