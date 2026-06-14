import { Route } from "react-router-dom";
import { AdminStateProvider } from "../admin/context/AdminStateContext";
import { AdminPage } from "../admin/pages/AdminPage";

export function AdminRoutes() {
  return (
    <Route
      path="/app/admin"
      element={
        <AdminStateProvider>
          <AdminPage />
        </AdminStateProvider>
      }
    />
  );
}
