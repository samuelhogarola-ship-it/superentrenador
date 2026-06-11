import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoutes } from "./routes/AdminRoutes";
import { CoachRoutes } from "./routes/CoachRoutes";
import { MarketplaceRoutes } from "./routes/MarketplaceRoutes";

export default function App() {
  return (
    <Routes>
      <MarketplaceRoutes />
      <CoachRoutes />
      <AdminRoutes />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
