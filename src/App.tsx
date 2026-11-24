import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./pages/AppLayout";
import { AccountPage } from "./pages/AccountPage";
import { LandingPage } from "./pages/LandingPage";
import { ListsPage } from "./pages/ListsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { TasksPage } from "./pages/TasksPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/console/*" element={<Navigate to="/tasks" replace />} />
        <Route element={<AppLayout />}>
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/new" element={<TaskDetailPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="lists" element={<ListsPage />} />
          <Route path="lists/:listId" element={<TasksPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}