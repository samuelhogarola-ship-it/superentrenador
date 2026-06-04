import { useState } from 'react';
import { Field } from '../../components/Field';
import { useAuth } from '../auth/AuthProvider';
import { profileService } from '../../services/profileService';

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [businessName, setBusinessName] = useState(profile?.businessName ?? '');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!profile) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await profileService.saveProfile(
      { id: profile.id, fullName, businessName, logoPath: profile.logoPath },
      logoFile,
    );
    await refreshProfile();
    setMessage('Perfil actualizado.');
  };

  return (
    <div className="stack-lg">
      <header className="page-header">
        <div>
          <p className="eyebrow">Perfil PT</p>
          <h1>Marca y configuracion del entrenador</h1>
        </div>
      </header>

      <form className="page-card grid-form" onSubmit={handleSubmit}>
        <Field label="Nombre" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        <Field label="Nombre comercial" value={businessName} onChange={(event) => setBusinessName(event.target.value)} required />
        <label className="field">
          <span>Actualizar logo</span>
          <input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)} />
        </label>
        {message ? <p className="success-text form-message">{message}</p> : null}
        <button className="primary-button" type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}
