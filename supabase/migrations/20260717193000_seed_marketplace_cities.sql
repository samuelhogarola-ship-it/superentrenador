-- Ensure trainer onboarding can save profiles immediately.
-- trainer_profiles.city_slug references public.cities(slug), so the city catalog
-- must exist before trainers start submitting profiles from /mi-perfil.

INSERT INTO public.cities (slug, name, region, country, hero_title, intro, seo_description)
VALUES
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
    'Marketplace de entrenadores personales en Granada con perfiles claros, especialidades visibles y contacto tras registro.'
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
    'Encuentra entrenadores personales en Jaén con perfiles comparables por objetivo, modalidad, experiencia y precio.',
    'Encuentra entrenadores personales en Jaén para fuerza, salud, pérdida de grasa y entrenamiento online o presencial.'
  ),
  (
    'jerez',
    'Jerez',
    'Cádiz',
    'España',
    'Entrenadores personales en Jerez',
    'Compara entrenadores personales en Jerez por especialidad, experiencia y modalidad antes de iniciar una conversación.',
    'Marketplace de entrenadores personales en Jerez con perfiles públicos, contacto protegido y búsqueda por ciudad.'
  ),
  (
    'malaga',
    'Málaga',
    'Málaga',
    'España',
    'Entrenadores personales en Málaga',
    'Compara perfiles públicos de entrenadores que trabajan presencialmente, online o con planes híbridos en Málaga.',
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
    'Ciudad preparada para ampliar el marketplace con perfiles por barrio, objetivo y modalidad de entrenamiento.',
    'Marketplace de entrenadores personales en Madrid con perfiles públicos claros y experiencia de búsqueda premium.'
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  region = EXCLUDED.region,
  country = EXCLUDED.country,
  hero_title = EXCLUDED.hero_title,
  intro = EXCLUDED.intro,
  seo_description = EXCLUDED.seo_description;
