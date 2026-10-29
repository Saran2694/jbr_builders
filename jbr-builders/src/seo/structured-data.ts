import { COMPANY_INFO } from '../data/company';

/**
 * Organization schema for JBR Builders
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JBR Builders',
    url: 'https://jbrbuilders.in',
    logo: 'https://jbrbuilders.in/images/jbr-logo.jpg',
    description:
      'JBR Builders is a construction company offering residential and commercial building services, turnkey construction, and architectural planning in Tirunelveli and Tuticorin (Thoothukudi), Tamil Nadu.',
    telephone: COMPANY_INFO.phoneRaw,
    email: COMPANY_INFO.email,
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: '4/89/9, Palai Main Road, Pudukottai',
        addressLocality: 'Tuticorin',
        addressRegion: 'Tamil Nadu',
        postalCode: '628103',
        addressCountry: 'IN',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '7/9, Pearl Avenue, K.T.C. Nagar',
        addressLocality: 'Tirunelveli',
        addressRegion: 'Tamil Nadu',
        postalCode: '627011',
        addressCountry: 'IN',
      },
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Tirunelveli',
        containedInPlace: { '@type': 'State', name: 'Tamil Nadu' },
      },
      {
        '@type': 'City',
        name: 'Tuticorin',
        alternateName: 'Thoothukudi',
        containedInPlace: { '@type': 'State', name: 'Tamil Nadu' },
      },
    ],
    knowsAbout: [
      'Residential Construction',
      'Commercial Construction',
      'Building Planning & Design',
      'Renovation & Remodeling',
      'Project Management',
      'Turnkey Construction Solutions',
    ],
  };
}

/**
 * WebSite schema
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JBR Builders',
    url: 'https://jbrbuilders.in',
    description:
      'Official website of JBR Builders — construction company in Tirunelveli and Tuticorin, Tamil Nadu.',
    publisher: {
      '@type': 'Organization',
      name: 'JBR Builders',
    },
  };
}

/**
 * LocalBusiness schema (GeneralContractor) for head office
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'JBR Builders',
    url: 'https://jbrbuilders.in',
    logo: 'https://jbrbuilders.in/images/jbr-logo.jpg',
    image: 'https://jbrbuilders.in/images/project-residential-elevation.jpg',
    telephone: COMPANY_INFO.phoneRaw,
    email: COMPANY_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4/89/9, Palai Main Road, Pudukottai',
      addressLocality: 'Tuticorin',
      addressRegion: 'Tamil Nadu',
      postalCode: '628103',
      addressCountry: 'IN',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    areaServed: [
      { '@type': 'City', name: 'Tirunelveli' },
      { '@type': 'City', name: 'Tuticorin' },
      { '@type': 'State', name: 'Tamil Nadu' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Construction Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Residential Construction',
            description:
              'Custom individual homes, villas, and residential developments with structural precision.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Commercial Construction',
            description:
              'Offices, retail showrooms, and commercial structures built to code.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Turnkey Construction Solutions',
            description:
              'End-to-end building services from blueprints to key handover.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Building Planning & Design',
            description:
              'Architectural layouts, 3D elevations, and structural drawings.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Renovation & Remodeling',
            description:
              'Structural repairs, exterior modernization, and interior reconfiguration.',
          },
        },
      ],
    },
  };
}

/**
 * BreadcrumbList schema generator
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Service schema generator
 */
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: 'JBR Builders',
      url: 'https://jbrbuilders.in',
    },
    areaServed: [
      { '@type': 'City', name: 'Tirunelveli' },
      { '@type': 'City', name: 'Tuticorin' },
    ],
  };
}

/**
 * FAQPage schema generator
 */
export function getFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

