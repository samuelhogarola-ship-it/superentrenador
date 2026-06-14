import { Route } from "react-router-dom";
import { CoachStateProvider } from "../coach/context/CoachStateContext";
import { ClientAppPage } from "../coach/pages/ClientAppPage";
import { PtDashboardPage } from "../coach/pages/PtDashboardPage";

export function CoachRoutes() {
  return (
    <>
      <Route
        path="/app/pt"
        element={
          <CoachStateProvider>
            <PtDashboardPage />
          </CoachStateProvider>
        }
      />
      <Route
        path="/app/client"
        element={
          <CoachStateProvider>
            <ClientAppPage />
          </CoachStateProvider>
        }
      />
    </>
  );
}
