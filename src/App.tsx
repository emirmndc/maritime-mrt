import { useEffect, useState } from "react";
import MaritimeMRTWebsite from "./MaritimeMRTWebsite";
import { TryDemoPage } from "./app/TryDemoPage";
import { appRoutes, type AppRoute } from "./app/router";

const legacyDemoRoutes = new Set([
  "/app",
  "/app/try-demo",
  "/app/generated-dashboard",
  "/app/voyages",
  "/app/settlement",
]);

function normalizeRoute(pathname: string): AppRoute {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/demo") {
    return "/demo";
  }

  if (legacyDemoRoutes.has(path)) {
    return "/demo";
  }

  return "/";
}

function App() {
  const [route, setRoute] = useState<AppRoute>(() => normalizeRoute(window.location.pathname));

  useEffect(() => {
    const handleRouteChange = () => setRoute(normalizeRoute(window.location.pathname));

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("app:navigate", handleRouteChange as EventListener);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("app:navigate", handleRouteChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    if (currentPath !== route) {
      window.history.replaceState({}, "", route);
    }

    document.title = appRoutes[route].title;
  }, [route]);

  if (route === "/demo") {
    return <TryDemoPage />;
  }

  return <MaritimeMRTWebsite />;
}

export default App;
