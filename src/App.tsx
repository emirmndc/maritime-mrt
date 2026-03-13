import { useEffect, useMemo, useState } from "react";
import MaritimeMRTWebsite from "./MaritimeMRTWebsite";
import { AppHomePage } from "./app/AppHomePage";
import { DemoVoyagePage } from "./app/DemoVoyagePage";
import { VoyageListPage } from "./app/VoyageListPage";
import { appRoutes, type AppRoute } from "./app/router";

function getCurrentRoute(): AppRoute {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/app") {
    return "/app";
  }

  if (path === "/app/voyages") {
    return "/app/voyages";
  }

  if (path.startsWith("/app/voyages/demo")) {
    return "/app/voyages/demo";
  }

  return "/";
}

function App() {
  const [route, setRoute] = useState<AppRoute>(() => getCurrentRoute());

  useEffect(() => {
    const handleRouteChange = () => setRoute(getCurrentRoute());

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("app:navigate", handleRouteChange as EventListener);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("app:navigate", handleRouteChange as EventListener);
    };
  }, []);

  const page = useMemo(() => {
    switch (route) {
      case "/app":
        return <AppHomePage />;
      case "/app/voyages":
        return <VoyageListPage />;
      case "/app/voyages/demo":
        return <DemoVoyagePage />;
      default:
        return <MaritimeMRTWebsite />;
    }
  }, [route]);

  useEffect(() => {
    document.title = appRoutes[route].title;
  }, [route]);

  return page;
}

export default App;
