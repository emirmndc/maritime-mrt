import MaritimeMRTWebsite from "./MaritimeMRTWebsite";
import AppHomePage from "./app/AppHomePage";
import GeneratedDashboardPage from "./app/GeneratedDashboardPage";
import SettlementWorkflowPage from "./app/SettlementWorkflowPage";
import TryDemoPage from "./app/TryDemoPage";
import VoyageListPage from "./app/VoyageListPage";

export default function App() {
  const path = window.location.pathname;

  if (path === "/app") return <AppHomePage />;
  if (path === "/app/generated-dashboard") return <GeneratedDashboardPage />;
  if (path === "/app/settlement") return <SettlementWorkflowPage />;
  if (path === "/app/try-demo") return <TryDemoPage />;
  if (path === "/app/voyages") return <VoyageListPage />;

  return <MaritimeMRTWebsite />;
}
