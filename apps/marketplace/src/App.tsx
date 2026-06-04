import { Navigate, Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { ClientAppPage } from "./pages/ClientAppPage";
import { LandingPage } from "./pages/LandingPage";
import { PtDashboardPage } from "./pages/PtDashboardPage";
import { TrainerProfilePage } from "./pages/TrainerProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/trainers/:slug" element={<TrainerProfilePage />} />
      <Route path="/app/pt" element={<PtDashboardPage />} />
      <Route path="/app/client" element={<ClientAppPage />} />
      <Route path="/app/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
