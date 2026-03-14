export const appRoutes = {
  "/": { title: "MARITIME MRT" },
  "/app": { title: "MARITIME App" },
  "/app/try-demo": { title: "Try Demo | MARITIME App" },
  "/app/voyages": { title: "Voyages | MARITIME App" },
  "/app/voyages/demo": { title: "Demo Voyage | MARITIME App" },
} as const;

export type AppRoute = keyof typeof appRoutes;

export function navigateTo(path: AppRoute) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }

  window.dispatchEvent(new Event("app:navigate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
