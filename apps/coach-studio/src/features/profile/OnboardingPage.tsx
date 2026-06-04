import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field } from '../../components/Field';
import { useAuth } from '../auth/AuthProvider';
import { profileService } from '../../services/profileService';

export function OnboardingPage() {
  const { session, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.user.id) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await profileService.saveProfile(
        {
          id: session.user.id,
          fullName,
          businessName,
          logoPath: null,
        },
        logoFile,
      );
      await refreshProfile();
      navigate('/clientes');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-card">
        <p className="eyebrow">Onboarding del entrenador</p>
        <h1>Configura tu perfil profesional</h1>
        <p>Estos datos se usarán en la vista imprimible y en la identidad de tu panel.</p>

        <form className="grid-form" onSubmit={handleSubmit}>
          <Field label="Nombre" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          <Field label="Nombre comercial" value={businessName} onChange={(event) => setBusinessName(event.target.value)} required />
          <label className="field">
            <span>Logo</span>
            <input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)} />
            <small>Opcional en la primera configuración, recomendable para el PDF.</small>
          </label>
          {error ? <p className="error-text form-message">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar perfil PT'}
          </button>
        </form>
      </div>
    </div>
  );
}
