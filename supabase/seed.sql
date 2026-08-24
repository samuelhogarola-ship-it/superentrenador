-- Seed data matching the local demo fallback (src/lib/marketplace-data.ts).
-- Safe to re-run: uses upsert on primary/unique keys.

insert into public.cities (slug, name, region, country, hero_title, intro, seo_description)
values
  (
    'almeria',
    'Almería',
    'Almería',
    'España',
    'Entrenadores personales en Almería',
    'Compara entrenadores personales en Almería para fuerza, pérdida de grasa, salud y seguimiento online con perfiles preparados para captar demanda local.',
    'Encuentra entrenadores personales en Almería por especialidad, modalidad, experiencia y precio antes de desbloquear el contacto.'
  ),
  (
    'cadiz',
    'Cádiz',
    'Cádiz',
    'España',
    'Entrenadores personales en Cádiz',
    'Marketplace de entrenadores personales en Cádiz con fichas claras para comparar objetivos, modalidades y experiencia antes de contactar.',
    'Compara entrenadores personales en Cádiz por especialidad, experiencia, valoración y formato de entrenamiento.'
  ),
  (
    'cordoba',
    'Córdoba',
    'Córdoba',
    'España',
    'Entrenadores personales en Córdoba',
    'Descubre entrenadores personales en Córdoba con perfiles pensados para decisiones rápidas: objetivo, experiencia, precio y modalidad.',
    'Encuentra entrenadores personales en Córdoba para entrenamiento presencial, online o híbrido con contacto protegido.'
  ),
  (
    'fuengirola',
    'Fuengirola',
    'Málaga',
    'España',
    'Entrenadores personales en Fuengirola',
    'Descubre entrenadores revisados para recomposición corporal, fuerza, pérdida de grasa y entrenamiento online o presencial.',
    'Marketplace de entrenadores personales en Fuengirola con perfiles públicos, especialidades y contacto protegido tras registro.'
  ),
  (
    'granada',
    'Granada',
    'Granada',
    'España',
    'Entrenadores personales en Granada',
    'Perfiles de entrenadores personales en Granada para comparar fuerza, recomposición corporal, rendimiento y planes online o presenciales.',
    'Marketplace de entrenadores personales en Granada con perfiles indexables, especialidades y contacto tras registro.'
  ),
  (
    'huelva',
    'Huelva',
    'Huelva',
    'España',
    'Entrenadores personales en Huelva',
    'Encuentra entrenadores personales en Huelva con una experiencia de búsqueda simple, local y centrada en objetivos reales.',
    'Compara entrenadores personales en Huelva por objetivo, modalidad, precio de entrada y experiencia profesional.'
  ),
  (
    'jaen',
    'Jaén',
    'Jaén',
    'España',
    'Entrenadores personales en Jaén',
    'Landings locales para entrenadores personales en Jaén con estructura SEO y perfiles comparables para captar demanda cercana.',
    'Encuentra entrenadores personales en Jaén para fuerza, salud, pérdida de grasa y entrenamiento online o presencial.'
  ),
  (
    'jerez',
    'Jerez',
    'Cádiz',
    'España',
    'Entrenadores personales en Jerez',
    'Compara entrenadores personales en Jerez por especialidad, experiencia y modalidad antes de iniciar una conversación.',
    'Marketplace de entrenadores personales en Jerez con perfiles públicos, contacto protegido y estructura SEO local.'
  ),
  (
    'malaga',
    'Málaga',
    'Málaga',
    'España',
    'Entrenadores personales en Málaga',
    'Perfiles públicos indexables para captar demanda local y conectar con entrenadores que trabajan presencialmente y online.',
    'Compara entrenadores personales en Málaga por especialidad, experiencia y formato de servicio antes de desbloquear el contacto.'
  ),
  (
    'marbella',
    'Marbella',
    'Málaga',
    'España',
    'Entrenadores personales en Marbella',
    'Perfiles premium de entrenadores personales en Marbella para comparar servicios presenciales, online e híbridos con criterio.',
    'Encuentra entrenadores personales en Marbella por especialidad, valoración, experiencia y precio desde el marketplace.'
  ),
  (
    'madrid',
    'Madrid',
    'Comunidad de Madrid',
    'España',
    'Entrenadores personales en Madrid',
    'Ciudad preparada para escalar el marketplace con perfiles indexables por barrio, objetivo y modalidad de entrenamiento.',
    'Marketplace SEO de entrenadores personales en Madrid con perfiles públicos optimizados para buscadores y captación premium.'
  ),
  (
    'sevilla',
    'Sevilla',
    'Sevilla',
    'España',
    'Entrenadores personales en Sevilla',
    'Marketplace de entrenadores personales en Sevilla con perfiles comparables para fuerza, salud, estética y seguimiento online.',
    'Compara entrenadores personales en Sevilla por especialidad, experiencia, modalidad y precio de entrada.'
  ),
  (
    'torremolinos',
    'Torremolinos',
    'Málaga',
    'España',
    'Entrenadores personales en Torremolinos',
    'Encuentra entrenadores personales en Torremolinos con fichas claras, contacto protegido y cobertura local conectada con Málaga.',
    'Marketplace de entrenadores personales en Torremolinos para comparar servicios presenciales, online e híbridos.'
  )
on conflict (slug) do update set
  name = excluded.name,
  region = excluded.region,
  country = excluded.country,
  hero_title = excluded.hero_title,
  intro = excluded.intro,
  seo_description = excluded.seo_description;

DELETE FROM public.trainer_profiles
WHERE is_demo = true
  AND slug <> 'samuel-entrenador-personal-fuengirola';

insert into public.trainer_profiles (
  slug, display_name, city_slug, headline, short_bio, long_bio, specialties,
  verified, years_experience, rating, reviews_count, price_from, modalities, languages,
  hidden_contact_hint, is_published, review_status, is_demo
)
values
  (
    'samuel-entrenador-personal-fuengirola',
    'Samuel Irongar',
    'fuengirola',
    'Viking Fitness: entrenador personal en Fuengirola para fuerza, recomposición y hábitos reales.',
    'Samuel Irongar dirige Viking Fitness en Fuengirola con sesiones presenciales y seguimiento online para personas que quieren entrenar con estructura.',
    'Viking Fitness nace para ayudar a personas de Fuengirola y alrededores a entrenar con un plan claro, medible y sostenible. Trabajo fuerza, recomposición corporal, pérdida de grasa y mejora de hábitos con sesiones presenciales, planificación online y revisiones periódicas.',
    array['Fuerza', 'Recomposición corporal', 'Pérdida de grasa', 'Hábitos saludables', 'Seguimiento online'],
    true, 7, 5.0, 12, 50, array['Presencial', 'Online'], array['Español', 'Inglés'],
    'Contacta con Viking Fitness desde una cuenta protegida para consultar disponibilidad presencial u online.',
    true, 'approved', true
  )
on conflict (slug) do update set
  display_name = excluded.display_name,
  city_slug = excluded.city_slug,
  headline = excluded.headline,
  short_bio = excluded.short_bio,
  long_bio = excluded.long_bio,
  specialties = excluded.specialties,
  verified = excluded.verified,
  years_experience = excluded.years_experience,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  price_from = excluded.price_from,
  modalities = excluded.modalities,
  languages = excluded.languages,
  hidden_contact_hint = excluded.hidden_contact_hint,
  is_published = excluded.is_published,
  review_status = excluded.review_status,
  is_demo = excluded.is_demo;
