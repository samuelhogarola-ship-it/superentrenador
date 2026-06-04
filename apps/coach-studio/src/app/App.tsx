import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ConfigNotice } from '../components/ConfigNotice';
import { useAuth } from '../features/auth/AuthProvider';
import { ClientDetailPage } from '../features/clients/ClientDetailPage';
import { ClientFormPage } from '../features/clients/ClientFormPage';
import { ClientsPage } from '../features/clients/ClientsPage';
import { LoginPage } from '../features/auth/LoginPage';
import { HowItWorksPage } from '../features/auth/HowItWorksPage';
import { LegalPage } from '../features/legal/LegalPage';
import { PlanEditorPage } from '../features/plans/PlanEditorPage';
import { PrintPlanPage } from '../features/plans/PrintPlanPage';
import { OnboardingPage } from '../features/profile/OnboardingPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { TemplatesPage } from '../features/plans/TemplatesPage';
import { PublicLayout } from '../components/PublicLayout';

function ProtectedRoutes() {
  const { session, loading, profile, isDemoMode } = useAuth();

  if (loading) {
    return <div className="page-center">Cargando Superentrenador...</div>;
  }

  if (!session && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <AppShell>
      <ConfigNotice />
      <Routes>
        <Route path="/clientes" element={<ClientsPage />} />
        <Route path="/clientes/nuevo" element={<ClientFormPage />} />
        <Route path="/clientes/:clientId" element={<ClientDetailPage />} />
        <Route path="/clientes/:clientId/editar" element={<ClientFormPage />} />
        <Route path="/clientes/:clientId/rutina" element={<PlanEditorPage />} />
        <Route path="/clientes/:clientId/imprimir" element={<PrintPlanPage />} />
        <Route path="/plantillas" element={<TemplatesPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/clientes" replace />} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  const { session, profile, isDemoMode } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          session || isDemoMode ? (
            <Navigate to={profile ? '/clientes' : '/onboarding'} replace />
          ) : (
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          )
        }
      />
      <Route
        path="/como-funciona"
        element={
          <PublicLayout>
            <HowItWorksPage />
          </PublicLayout>
        }
      />
      <Route
        path="/legal"
        element={
          <PublicLayout>
            <LegalPage />
          </PublicLayout>
        }
      />
      <Route path="/onboarding" element={session || isDemoMode ? <OnboardingPage /> : <Navigate to="/login" replace />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}
