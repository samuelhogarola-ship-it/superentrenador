export interface LegalContent {
  appName: string;
  legalTitle: string;
  ownerName: string;
  ownerNif: {
    type: 'image';
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  ownerAddress: string;
  contactEmail: string;
  siteUrl: {
    type: 'link';
    href: string;
    label: string;
  };
  lastUpdated: string;
  labels: Record<string, string>;
  extraSections: Array<{
    id?: string;
    title: string;
    paragraphs?: string[];
    items?: string[];
    link?: {
      href: string;
      label: string;
    };
  }>;
}

export const superentrenadorLegalContent: LegalContent = {
  appName: 'Superentrenador · by Personal Trainer Fuengirola',
  legalTitle: 'Información Legal',
  ownerName: 'Sofia Sorvali',
  ownerNif: {
    type: 'image',
    src: '/legal-owner-nie.webp',
    width: 172,
    height: 58,
    alt: 'Documento identificativo',
  },
  ownerAddress: 'Calle Narciso 5',
  contactEmail: 'sport.massage.fuengirola@gmail.com',
  siteUrl: {
    type: 'link',
    href: 'https://app.superentrenador.com',
    label: 'https://app.superentrenador.com',
  },
  lastUpdated: 'mayo de 2026',
  labels: {
    updated: 'Última actualización',
    siteOwnerTitle: 'Titular provisional del sitio web',
    ownerName: 'Nombre o razon social',
    ownerNif: 'NIF/CIF',
    ownerAddress: 'Domicilio',
    contactEmail: 'Email de contacto',
    siteUrl: 'Sitio web',
    purposeTitle: 'Objeto',
    purposeBody:
      'Este sitio web ofrece información sobre los servicios y la actividad profesional de {appName}.',
    termsTitle: 'Condiciones de uso',
    termsBody1:
      'El acceso a este sitio atribuye la condición de usuario e implica la aceptación de las condiciones de uso vigentes en cada momento.',
    termsBody2:
      'La persona titular podrá actualizar, modificar o retirar contenidos y servicios del sitio web cuando lo considere necesario.',
    intellectualPropertyTitle: 'Propiedad intelectual e industrial',
    intellectualPropertyBody1:
      'Los contenidos, textos, imágenes, diseño y demás elementos del sitio están protegidos por la normativa aplicable en materia de propiedad intelectual e industrial.',
    intellectualPropertyBody2:
      'No se autoriza su reproduccion, distribucion o transformacion sin permiso previo, salvo en los casos legalmente permitidos.',
    liabilityTitle: 'Responsabilidad',
    liabilityBody:
      'La persona titular no se responsabiliza de un uso indebido de los contenidos del sitio ni de daños derivados del acceso o uso de la web cuando no le sean legalmente imputables.',
  },
  extraSections: [
    {
      id: 'cookies',
      title: 'Cookies',
      paragraphs: [
        'Esta app utiliza cookies técnicas o almacenamiento local estrictamente necesario para recordar preferencias básicas como el tema visual o la elección del banner de cookies.',
        'En esta fase no se cargan herramientas de analítica ni cookies de marketing.',
      ],
    },
    {
      id: 'temporary-owner',
      title: 'Titular provisional',
      paragraphs: [
        'Los datos legales mostrados en esta versión se reutilizan temporalmente desde la web actual mientras se define la entidad final de Superentrenador.',
      ],
    },
    {
      id: 'development',
      title: 'Desarrollo y mantenimiento',
      paragraphs: ['Aplicación desarrollada y mantenida por Web Fuengirola Studio.'],
      link: { href: 'https://webfuengirola.com', label: 'https://webfuengirola.com' },
    },
  ],
};
