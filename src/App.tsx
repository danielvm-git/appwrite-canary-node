import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ConsoleLayout } from "./pages/ConsoleLayout";
import { LandingPage } from "./pages/LandingPage";
import { OverviewPage } from "./pages/OverviewPage";
import { AuthPage } from "./pages/AuthPage";
import { DatabasePage } from "./pages/DatabasePage";
import { StoragePage } from "./pages/StoragePage";
import { StubPage } from "./pages/StubPage";
import { SitesPage } from "./pages/SitesPage";
import { SettingsPage } from "./pages/SettingsPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/console" element={<ConsoleLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="database" element={<DatabasePage />} />
          <Route path="storage" element={<StoragePage />} />
          <Route path="messaging" element={<StubPage title="Messaging" hint="Configure SMTP on the Appwrite instance." />} />
          <Route path="functions" element={<StubPage title="Functions" hint="Go canary will use Appwrite Functions." />} />
          <Route path="sites" element={<SitesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}