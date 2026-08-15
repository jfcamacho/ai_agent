import { CompanyCandidate } from '../types/index.js';

export const B2B_LATAM_REPOSITORY: CompanyCandidate[] = [
  {
    id: 'comp_clara_mx',
    name: 'Clara México',
    legalName: 'Clara Card Technologies S.A.P.I. de C.V.',
    domain: 'clara.com',
    website: 'https://www.clara.com',
    industry: 'Fintech',
    subIndustry: 'Corporate Cards & Spend Management',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 650,
    estimatedUserBase: '10,000+ empresas activas',
    businessModel: 'B2B2C',
    description: 'Plataforma líder de gestión de gasto corporativo y tarjetas empresariales para medianas y grandes empresas en América Latina.',
    productsAndServices: ['Tarjetas de crédito corporativas', 'Software de control de gastos', 'Pago de servicios y facturación'],
    insuranceAffinityCategory: 'EMBEDDED_INSURANCE',
    decisionMakers: [
      {
        name: 'Diego González',
        role: 'VP of Strategic Partnerships & Growth',
        department: 'Alianzas Estratégicas',
        linkedinUrl: 'https://linkedin.com/in/diego-gonzalez-clara',
        email: 'd.gonzalez@clara.com',
        confidenceScore: 0.94,
        isVerified: true
      },
      {
        name: 'Mariana Silva',
        role: 'Chief Product Officer (CPO)',
        department: 'Producto',
        linkedinUrl: 'https://linkedin.com/in/mariana-silva-cpo',
        email: 'm.silva@clara.com',
        confidenceScore: 0.88,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'EXPANSION',
        title: 'Lanzamiento de módulo de beneficios para empleados ejecutivos',
        description: 'Clara anunció su nuevo ecosistema de beneficios integrados para tarjetahabientes corporativos.',
        dateObserved: '2026-07-20',
        sourceUrl: 'https://eleconomista.com.mx/fintech/clara-nuevos-beneficios',
        relevanceScore: 0.95
      },
      {
        type: 'FUNDING',
        title: 'Cierre de ronda de financiamiento Serie C',
        description: 'Expansión de capacidades tecnológicas y alianzas en México y Colombia.',
        dateObserved: '2026-06-12',
        sourceUrl: 'https://techcrunch.com/clara-funding',
        relevanceScore: 0.85
      }
    ],
    sources: [
      { name: 'Directorio Fintech México 2026', url: 'https://fintechmexico.org/directory', retrievedAt: '2026-08-10' },
      { name: 'Crunchbase Enterprise Intelligence', url: 'https://crunchbase.com/organization/clara', retrievedAt: '2026-08-12' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_minu_mx',
    name: 'Minu',
    legalName: 'Minu HR Solutions S.A.P.I. de C.V.',
    domain: 'minu.mx',
    website: 'https://www.minu.mx',
    industry: 'HR Tech',
    subIndustry: 'Employee Benefits & Salario On-Demand',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 220,
    estimatedUserBase: '500,000+ colaboradores corporativos',
    businessModel: 'B2B2C',
    description: 'Plataforma integral de bienestar financiero y beneficios para colaboradores en empresas líderes en México.',
    productsAndServices: ['Salario on-demand', 'Plan de ahorro y educación financiera', 'Marketplace de beneficios laborales'],
    insuranceAffinityCategory: 'PAYROLL_BENEFITS',
    decisionMakers: [
      {
        name: 'Carlos Morales',
        role: 'Director de Alianzas Corporativas y Seguros',
        department: 'Alianzas y Producto',
        linkedinUrl: 'https://linkedin.com/in/carlos-morales-minu',
        email: 'carlos.morales@minu.mx',
        confidenceScore: 0.96,
        isVerified: true
      },
      {
        name: 'Andrea Ruiz',
        role: 'Head of Business Development',
        department: 'Ventas y Expansión',
        linkedinUrl: 'https://linkedin.com/in/andrea-ruiz-minu',
        email: 'andrea.ruiz@minu.mx',
        confidenceScore: 0.91,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'PRODUCT_LAUNCH',
        title: 'Apertura de vertical de microseguros de salud y vida para empleados',
        description: 'Búsqueda activa de brokers digitales e insurtechs para robustecer la oferta de protección médica accesible.',
        dateObserved: '2026-08-01',
        sourceUrl: 'https://expansion.mx/empresas/minu-bienestar-laboral',
        relevanceScore: 0.98
      }
    ],
    sources: [
      { name: 'Asociación Mexicana de Recursos Humanos (AMEDIRH)', url: 'https://amedirh.com.mx/innovacion', retrievedAt: '2026-08-11' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_stori_mx',
    name: 'Stori Card',
    legalName: 'Stori Tech México S.A. de C.V.',
    domain: 'storicard.com',
    website: 'https://www.storicard.com',
    industry: 'Fintech',
    subIndustry: 'Credit Cards & Financial Inclusion',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 800,
    estimatedUserBase: '3,000,000+ tarjetahabientes',
    businessModel: 'B2B2C',
    description: 'Unicornio Fintech enfocado en inclusión financiera que emite tarjetas de crédito y cuentas de depósito digitales de alto rendimiento en México.',
    productsAndServices: ['Tarjeta de crédito Stori', 'Stori Cuenta+ (Ahorro)', 'Seguros integrados'],
    insuranceAffinityCategory: 'EMBEDDED_INSURANCE',
    decisionMakers: [
      {
        name: 'Alejandro Valenzuela',
        role: 'Head of Strategic Alliances & Ancillary Revenue',
        department: 'Alianzas y Crecimiento',
        linkedinUrl: 'https://linkedin.com/in/alejandro-valenzuela-stori',
        email: 'a.valenzuela@storicard.com',
        confidenceScore: 0.93,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'INCLUSION_STRATEGY',
        title: 'Búsqueda de seguros de protección de saldo y asistencia médica para usuarios Stori',
        description: 'Interés público en incorporar pólizas de microseguros de bajo costo para su base de 3 millones de usuarios.',
        dateObserved: '2026-08-05',
        sourceUrl: 'https://forbes.com.mx/stori-inclusion-financiera-seguros',
        relevanceScore: 0.96
      }
    ],
    sources: [
      { name: 'Comisión Nacional Bancaria y de Valores (CNBV)', url: 'https://cnbv.gob.mx', retrievedAt: '2026-08-12' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_rappi_mx',
    name: 'Rappi México',
    legalName: 'Rappi Technologies México S. de R.L. de C.V.',
    domain: 'rappi.com.mx',
    website: 'https://www.rappi.com.mx',
    industry: 'Retail & E-commerce',
    subIndustry: 'SuperApp, Quick Commerce & Delivery',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 2500,
    estimatedUserBase: '6,000,000+ usuarios y 60,000 repartidores',
    businessModel: 'B2B2C',
    description: 'La SuperApp líder en América Latina que conecta a millones de comensales, compradores, repartidores independientes y comercios aliados.',
    productsAndServices: ['Rappi Turbo (Entregas 10 min)', 'RappiCard', 'Marketplace de restaurantes y farmacias'],
    insuranceAffinityCategory: 'GIG_ECONOMY_PROTECTION',
    decisionMakers: [
      {
        name: 'Rodrigo Arévalo',
        role: 'VP of Commercial Monetization & Financial Services',
        department: 'Nuevos Negocios',
        linkedinUrl: 'https://linkedin.com/in/rodrigo-arevalo-rappi',
        email: 'rodrigo.arevalo@rappi.com',
        confidenceScore: 0.95,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'GIG_PROTECTION',
        title: 'Programa de protección y cobertura integral de accidentes para repartidores (Rappitenderos)',
        description: 'Licitación abierta de esquemas de seguros de salud, accidentes y desempleo temporal para su flota de reparto.',
        dateObserved: '2026-07-25',
        sourceUrl: 'https://expansion.mx/empresas/rappi-cobertura-repartidores',
        relevanceScore: 0.97
      }
    ],
    sources: [
      { name: 'Asociación Mexicana de Venta Online (AMVO)', url: 'https://amvo.org.mx', retrievedAt: '2026-08-04' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_worky_mx',
    name: 'Worky.mx',
    legalName: 'Worky RRHH S.A.P.I. de C.V.',
    domain: 'worky.mx',
    website: 'https://www.worky.mx',
    industry: 'HR Tech',
    subIndustry: 'Payroll Software & HR Management',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 120,
    estimatedUserBase: '400+ empresas medianas y PyMEs',
    businessModel: 'B2B2C',
    description: 'Software todo-en-uno de Recursos Humanos y nómina para empresas en crecimiento en México.',
    productsAndServices: ['Cálculo y dispersión de nómina', 'Control de asistencias', 'Módulo de beneficios para empleados'],
    insuranceAffinityCategory: 'PAYROLL_BENEFITS',
    decisionMakers: [
      {
        name: 'Maya Dadoo',
        role: 'CEO & Co-founder',
        department: 'Dirección General',
        linkedinUrl: 'https://linkedin.com/in/maya-dadoo-worky',
        email: 'maya@worky.mx',
        confidenceScore: 0.92,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'PAYROLL_INSURANCE',
        title: 'Lanzamiento de módulo de seguro de gastos médicos mayores con descuento vía nómina',
        description: 'Worky busca partners brokers con tecnología API para que las PyMEs contraten seguros para su plantilla en 2 clics.',
        dateObserved: '2026-08-08',
        sourceUrl: 'https://eleconomista.com.mx/tecnologia/worky-beneficios-pyme',
        relevanceScore: 0.94
      }
    ],
    sources: [
      { name: 'AMEDIRH Directorio Tecnológico', url: 'https://amedirh.com.mx', retrievedAt: '2026-08-09' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_konfio_mx',
    name: 'Konfío',
    legalName: 'Red Amigo DAL S.A.P.I. de C.V. SOFOM E.N.R.',
    domain: 'konfio.mx',
    website: 'https://www.konfio.mx',
    industry: 'Fintech',
    subIndustry: 'SME Lending, Payments & ERP Management',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 750,
    estimatedUserBase: '60,000+ pequeñas y medianas empresas',
    businessModel: 'B2B2C',
    description: 'Plataforma líder en tecnología financiera y software de gestión empresarial para impulsar el crecimiento de las PyMEs en México.',
    productsAndServices: ['Crédito empresarial ágil', 'Tarjetas empresariales', 'Gestión de facturación y pagos'],
    insuranceAffinityCategory: 'SME_COMMERCIAL',
    decisionMakers: [
      {
        name: 'David Arana',
        role: 'CEO & Founder',
        department: 'Dirección General',
        linkedinUrl: 'https://linkedin.com/in/david-arana-konfio',
        email: 'david.arana@konfio.mx',
        confidenceScore: 0.91,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'SME_PACKAGES',
        title: 'Estrategia de protección comercial y cobertura contra siniestros para negocios acreditados',
        description: 'Evaluación de pólizas multirriesgo para negocios PyME integradas al financiamiento de Konfío.',
        dateObserved: '2026-07-18',
        sourceUrl: 'https://milenio.com/negocios/konfio-pymes-seguros-multirriesgo',
        relevanceScore: 0.93
      }
    ],
    sources: [
      { name: 'Comisión Nacional Bancaria y de Valores (CNBV)', url: 'https://cnbv.gob.mx', retrievedAt: '2026-08-07' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_doctoralia_mx',
    name: 'Doctoralia México',
    legalName: 'Docplanner México S.A.P.I. de C.V.',
    domain: 'doctoralia.com.mx',
    website: 'https://www.doctoralia.com.mx',
    industry: 'HealthTech',
    subIndustry: 'Digital Health & Telemedicine',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 350,
    estimatedUserBase: '5,000,000+ pacientes y 80,000 médicos',
    businessModel: 'B2B2C',
    description: 'La plataforma líder en salud digital que conecta a profesionales médicos con pacientes en todo México.',
    productsAndServices: ['Directorio médico certificado', 'Software de gestión de consultorios', 'Telemedicina y recetas digitales'],
    insuranceAffinityCategory: 'EMBEDDED_INSURANCE',
    decisionMakers: [
      {
        name: 'Guillermo Garza',
        role: 'Director of Strategic Alliances & Healthcare Partnerships',
        department: 'Alianzas y Red Médica',
        linkedinUrl: 'https://linkedin.com/in/guillermo-garza-doctoralia',
        email: 'guillermo.garza@doctoralia.com',
        confidenceScore: 0.95,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'HEALTH_INTEGRATION',
        title: 'Integración de seguros de salud ambulatoria y telemedicina directa con aseguradoras',
        description: 'Doctoralia planea ofrecer planes de salud preventiva y cobertura de consultas a los usuarios que agendan citas en su portal.',
        dateObserved: '2026-08-06',
        sourceUrl: 'https://saludigital.mx/doctoralia-seguros-medicos',
        relevanceScore: 0.96
      }
    ],
    sources: [
      { name: 'Secretaría de Salud / COFEPRIS', url: 'https://gob.mx/salud', retrievedAt: '2026-08-08' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_kueski_mx',
    name: 'Kueski',
    legalName: 'Kueski S.A.P.I. de C.V. SOFOM E.N.R.',
    domain: 'kueski.com',
    website: 'https://www.kueski.com',
    industry: 'Fintech',
    subIndustry: 'Buy Now Pay Later (BNPL) & Consumer Credit',
    headquarters: 'Guadalajara, Jalisco',
    country: 'México',
    estimatedEmployees: 900,
    estimatedUserBase: '2,500,000+ usuarios registrados',
    businessModel: 'B2B2C',
    description: 'La plataforma BNPL y de crédito en línea más grande de México, conectando a millones de compradores con miles de comercios aliados.',
    productsAndServices: ['Kueski Pay (BNPL)', 'Préstamos personales digitales', 'Red de comercios afiliados'],
    insuranceAffinityCategory: 'EMBEDDED_INSURANCE',
    decisionMakers: [
      {
        name: 'Fernanda Ortiz',
        role: 'Head of Strategic Partnerships & Merchant Solutions',
        department: 'Alianzas B2B2C',
        linkedinUrl: 'https://linkedin.com/in/fernanda-ortiz-kueski',
        email: 'fernanda.ortiz@kueski.com',
        confidenceScore: 0.93,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'CHECKOUT_INNOVATION',
        title: 'Integración de seguros embebidos en el checkout de compras a crédito',
        description: 'Interés público en ofrecer seguro de desempleo, protección de compras y vida en el flujo de Kueski Pay.',
        dateObserved: '2026-07-28',
        sourceUrl: 'https://forbes.com.mx/kueski-nuevos-servicios-financieros',
        relevanceScore: 0.97
      }
    ],
    sources: [
      { name: 'Registro Fintech CNBV / Condusef', url: 'https://condusef.gob.mx', retrievedAt: '2026-08-05' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_kavak_mx',
    name: 'Kavak',
    legalName: 'UCar Tecnología S.A.P.I. de C.V.',
    domain: 'kavak.com',
    website: 'https://www.kavak.com',
    industry: 'Mobility & Automotive',
    subIndustry: 'Auto Marketplace & Financing',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 3200,
    estimatedUserBase: '500,000+ autos comercializados',
    businessModel: 'B2C',
    description: 'Unicornio mexicano de compra, venta y financiamiento de vehículos seminuevos con cobertura nacional.',
    productsAndServices: ['Compra-venta de autos', 'Kavak Capital (Financiamiento)', 'Garantías mecánicas'],
    insuranceAffinityCategory: 'EMBEDDED_INSURANCE',
    decisionMakers: [
      {
        name: 'Roberto Vaca',
        role: 'VP of Ancillary Products & Financial Services',
        department: 'Financiamiento y Seguros',
        linkedinUrl: 'https://linkedin.com/in/roberto-vaca-kavak',
        email: 'roberto.vaca@kavak.com',
        confidenceScore: 0.90,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'ECOSYSTEM_EXPANSION',
        title: 'Renovación del marketplace de pólizas de auto e indemnización rápida',
        description: 'Ampliación de opciones de aseguramiento digital al momento de adquirir financiamiento automotriz.',
        dateObserved: '2026-07-15',
        sourceUrl: 'https://milenio.com/negocios/kavak-seguros-automotrices',
        relevanceScore: 0.92
      }
    ],
    sources: [
      { name: 'Asociación Mexicana de Venta Online (AMVO)', url: 'https://amvo.org.mx', retrievedAt: '2026-08-01' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_justo_mx',
    name: 'Jüsto',
    legalName: 'Jüsto S.A.P.I. de C.V.',
    domain: 'justo.mx',
    website: 'https://www.justo.mx',
    industry: 'Retail & E-commerce',
    subIndustry: 'Online Supermarket & Delivery',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 1800,
    estimatedUserBase: '1,000,000+ usuarios activos',
    businessModel: 'B2C',
    description: 'Supermercado 100% digital líder en México con logística propia y tecnología para entrega a domicilio.',
    productsAndServices: ['E-commerce de alimentos y perecederos', 'Club Jüsto Prime', 'Red de repartidores y centros logísticos'],
    insuranceAffinityCategory: 'GIG_ECONOMY_PROTECTION',
    decisionMakers: [
      {
        name: 'Sofia Mendoza',
        role: 'Head of Loyalty & Monetization Partnerships',
        department: 'Crecimiento y Monetización',
        linkedinUrl: 'https://linkedin.com/in/sofia-mendoza-justo',
        email: 'sofia.mendoza@justo.mx',
        confidenceScore: 0.89,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'LOYALTY_PROGRAM',
        title: 'Evolución del programa Prime con seguros de protección familiar y hogar',
        description: 'Exploración de beneficios de alto valor para fidelizar a los clientes recurrentes de su membresía premium.',
        dateObserved: '2026-08-03',
        sourceUrl: 'https://retailers.mx/justo-prime-beneficios',
        relevanceScore: 0.88
      }
    ],
    sources: [
      { name: 'Reporte de E-commerce México 2026', url: 'https://amvo.org.mx/reporte-2026', retrievedAt: '2026-08-09' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_clip_mx',
    name: 'Clip',
    legalName: 'PayClip S. de R.L. de C.V.',
    domain: 'clip.mx',
    website: 'https://www.clip.mx',
    industry: 'Fintech',
    subIndustry: 'Payments & Merchant Financial Services',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 1100,
    estimatedUserBase: '800,000+ comercios y PyMEs afiliadas',
    businessModel: 'B2B2C',
    description: 'Plataforma líder de soluciones de pago y servicios financieros para micro, pequeñas y medianas empresas en México.',
    productsAndServices: ['Terminales de cobro punto de venta', 'Préstamos para negocios', 'Catálogo digital y links de pago'],
    insuranceAffinityCategory: 'SME_COMMERCIAL',
    decisionMakers: [
      {
        name: 'Mauricio Peralta',
        role: 'Director of Merchant Value-Added Services',
        department: 'Servicios de Valor Agregado',
        linkedinUrl: 'https://linkedin.com/in/mauricio-peralta-clip',
        email: 'mauricio.peralta@clip.mx',
        confidenceScore: 0.95,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'SME_PROTECTION',
        title: 'Interés en pólizas para negocios y responsabilidad civil para comercios Clip',
        description: 'Estrategia para ofrecer microseguros contra robo y daños materiales a los comercios que utilizan sus terminales.',
        dateObserved: '2026-07-30',
        sourceUrl: 'https://eleconomista.com.mx/clip-pymes-seguros',
        relevanceScore: 0.96
      }
    ],
    sources: [
      { name: 'Cámara Nacional de Comercio (CONCANACO)', url: 'https://concanaco.com.mx', retrievedAt: '2026-08-02' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'comp_pulpo_mx',
    name: 'Pulpo WMS',
    legalName: 'Pulpo Logistics Software S.A.P.I.',
    domain: 'pulpo.co',
    website: 'https://www.pulpo.co',
    industry: 'Logistics Tech',
    subIndustry: 'Warehouse Management & Fleet Tech',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 140,
    estimatedUserBase: '300+ centros logísticos',
    businessModel: 'B2B',
    description: 'Software en la nube para optimización y gestión de almacenes e inventarios para operadores logísticos y distribuidores.',
    productsAndServices: ['Warehouse Management System (WMS)', 'Control de rutas y carga', 'Integraciones ERP'],
    insuranceAffinityCategory: 'SME_COMMERCIAL',
    decisionMakers: [
      {
        name: 'Gabriel Lozano',
        role: 'Head of Commercial Alliances',
        department: 'Alianzas B2B',
        linkedinUrl: 'https://linkedin.com/in/gabriel-lozano-pulpo',
        email: 'gabriel.lozano@pulpo.co',
        confidenceScore: 0.86,
        isVerified: true
      }
    ],
    signals: [
      {
        type: 'LOGISTICS_INSURANCE',
        title: 'Búsqueda de cobertura de mercancías y transporte de carga integrada',
        description: 'Demanda de sus clientes de almacén para asegurar inventario en tránsito desde la plataforma.',
        dateObserved: '2026-06-25',
        sourceUrl: 'https://t21.com.mx/logistica/pulpo-seguros-carga',
        relevanceScore: 0.89
      }
    ],
    sources: [
      { name: 'Asociación Mexicana de Logística', url: 'https://logistica.org.mx', retrievedAt: '2026-08-08' }
    ],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: '2026-08-14T08:00:00Z'
  }
];
