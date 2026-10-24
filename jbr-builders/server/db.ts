import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { generateSalt, hashPassword } from './auth';
import type {
  AdminUser,
  CompanySettingsCMS,
  ServiceItemCMS,
  ProjectItemCMS,
  GalleryItemCMS,
  TeamMemberCMS,
  InternMemberCMS,
  InternshipProgramCMS,
  HomepageContentCMS,
  AuditLogCMS,
} from '../src/types/cms';

export interface DatabaseSchema {
  version: number;
  users: AdminUser[];
  company: CompanySettingsCMS;
  services: ServiceItemCMS[];
  projects: ProjectItemCMS[];
  gallery: GalleryItemCMS[];
  team: TeamMemberCMS[];
  interns: InternMemberCMS[];
  internshipProgram: InternshipProgramCMS;
  homepage: HomepageContentCMS;
  auditLogs: AuditLogCMS[];
  inquiries: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    service: string;
    message: string;
    createdAt: string;
    status: 'new' | 'contacted' | 'resolved';
  }>;
}

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'cms-database.json');
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads');

// Ensure directories exist
function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// Initial Data Seeder (Uses existing project data)
function getInitialSeedData(): DatabaseSchema {
  const adminSalt = generateSalt();
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPassword123!';
  const defaultAdmin: AdminUser = {
    id: 'admin-super-1',
    username: 'admin',
    email: 'admin@jbrbuilders.in',
    passwordHash: hashPassword(defaultPassword, adminSalt),
    salt: adminSalt,
    role: 'superadmin',
    createdAt: new Date().toISOString(),
  };

  const company: CompanySettingsCMS = {
    name: "JBR Builders",
    tagline: "LISTEN BETTER - PLAN BETTER - BUILD BETTER",
    heroHeadline: "Building Your Vision. Creating Your Future.",
    heroSubtext: "Quality construction, thoughtful planning, and reliable building solutions tailored to your needs.",
    phone: "+91 97917 10655",
    phoneRaw: "+919791710655",
    whatsappNumber: "919791710655",
    whatsappUrl: "https://wa.me/919791710655?text=Hello%20JBR%20Builders%2C%20I%20would%20like%20to%20inquire%20about%20your%20construction%20services.",
    defaultWhatsappMessage: "Hello JBR Builders, I would like to inquire about your construction services.",
    email: "jbrbuilders15@gmail.com",
    offices: [
      {
        id: "tuticorin-head-office",
        type: "Head Office",
        address: "4/89/9, Palai Main Road, Pudukottai, Tuticorin, Tamil Nadu.",
        city: "Tuticorin",
        state: "Tamil Nadu",
        pincode: "628103",
        mapsUrl: "https://maps.google.com/?q=Pudukottai+Tuticorin",
        isPrimary: true,
      },
      {
        id: "tirunelveli-branch-office",
        type: "Branch Office",
        address: "7/9, Pearl Avenue, K.T.C. Nagar, Tirunelveli, Tamil Nadu.",
        city: "Tirunelveli",
        state: "Tamil Nadu",
        pincode: "627011",
        mapsUrl: "https://maps.google.com/?q=KTC+Nagar+Tirunelveli",
        isPrimary: false,
      }
    ],
    workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM",
    logoUrl: "/images/jbr-logo.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
    updatedAt: new Date().toISOString(),
  };

  const services: ServiceItemCMS[] = [
    {
      id: "residential-construction",
      title: "Residential Construction",
      description: "Custom individual homes, villas, and residential developments engineered with durable materials, structural precision, and modern living aesthetics.",
      iconName: "Home",
      features: [
        "Custom floor plans & structural execution",
        "Foundation to roof finishing",
        "High-grade masonry & reinforced concrete",
        "Timely milestone completions"
      ],
      displayOrder: 1,
      published: true,
      quoteSubject: "Residential Construction",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "commercial-construction",
      title: "Commercial Construction",
      description: "Functional and robust commercial spaces, office premises, retail showrooms, and business structures built to meet commercial building codes.",
      iconName: "Building2",
      features: [
        "Office buildings & business spaces",
        "Structural engineering compliance",
        "Modern utility & infrastructure integration",
        "High-traffic durability specifications"
      ],
      displayOrder: 2,
      published: true,
      quoteSubject: "Commercial Construction",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "building-planning-design",
      title: "Building Planning & Design",
      description: "Architectural layouts, functional space planning, structural drawings, and elevation design aligned with municipal guidelines and practical utility.",
      iconName: "Compass",
      features: [
        "2D floor layouts & architectural plans",
        "3D elevation perspectives",
        "Structural calculation & civil planning",
        "Optimal ventilation & natural lighting"
      ],
      displayOrder: 3,
      published: true,
      quoteSubject: "Building Planning & Design",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "renovation-remodeling",
      title: "Renovation & Remodeling",
      description: "Upgrading existing structures, structural repairs, exterior face-lifts, interior layout reconfigurations, and modern aesthetic enhancements.",
      iconName: "Wrench",
      features: [
        "Interior spatial reconfiguration",
        "Facade & elevation modernization",
        "Wall finishing, tiling & structural repair",
        "False ceiling & lighting upgrades"
      ],
      displayOrder: 4,
      published: true,
      quoteSubject: "Renovation & Remodeling",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "project-management",
      title: "Project Management",
      description: "End-to-end site coordination, quality audits, material procurement scheduling, and rigorous timeline supervision on site.",
      iconName: "ClipboardCheck",
      features: [
        "On-site civil supervisor oversight",
        "Strict material quality verification",
        "Stage-by-stage progress reporting",
        "Transparent timeline tracking"
      ],
      displayOrder: 5,
      published: true,
      quoteSubject: "Project Management",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "turnkey-solutions",
      title: "Turnkey Construction Solutions",
      description: "Comprehensive end-to-end building services from conceptual blueprints, material supply, and civil execution to complete key handover.",
      iconName: "KeyRound",
      features: [
        "Single-point accountability",
        "Material procurement & civil engineering",
        "Plumbing, electrical & finishing works",
        "Ready-to-move-in key delivery"
      ],
      displayOrder: 6,
      published: true,
      quoteSubject: "Turnkey Construction Solutions",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const projects: ProjectItemCMS[] = [
    {
      id: "residential-elevation",
      title: "Modern Residential Elevation & Architectural Lighting",
      category: "Residential Architecture",
      categoryTag: "exterior",
      imageSrc: "/images/project-residential-elevation.jpg",
      additionalImages: [],
      aspectRatio: "portrait",
      description: "Architectural night view of a completed multi-storey residence highlighting facade lighting, decorative balcony, stone cladding, and welcoming entrance arch.",
      location: "Tuticorin",
      year: "2025",
      displayOrder: 1,
      published: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "key-handover",
      title: "Completed Residence Key Handover Ceremony",
      category: "Project Handover",
      categoryTag: "handover",
      imageSrc: "/images/project-key-handover.jpg",
      additionalImages: [],
      aspectRatio: "landscape",
      description: "Traditional housewarming and ceremonial key handover celebration marking the successful completion of a residential building with the client family.",
      location: "Tirunelveli",
      year: "2025",
      displayOrder: 2,
      published: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "office-front",
      title: "JBR Builders Office Entrance & Consultation Space",
      category: "Corporate & Office",
      categoryTag: "office",
      imageSrc: "/images/office-entrance.jpg",
      additionalImages: [],
      aspectRatio: "landscape",
      description: "Office entrance with custom glass doors and official JBR Builders branding, serving clients for planning, consultation, and project coordination.",
      location: "Tuticorin",
      year: "2024",
      displayOrder: 3,
      published: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "interior-ceiling",
      title: "Artistic Sky & Cloud False Ceiling Finishing",
      category: "Interior Finishes",
      categoryTag: "interior",
      imageSrc: "/images/interior-ceiling-design.jpg",
      additionalImages: [],
      aspectRatio: "portrait",
      description: "Specialized interior false ceiling execution featuring custom sky-and-cloud artistic detailing paired with modern recessed and ambient lighting.",
      location: "Tuticorin",
      year: "2025",
      displayOrder: 4,
      published: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const gallery: GalleryItemCMS[] = [
    {
      id: "gallery-1",
      title: "Modern Residential Elevation & Architectural Lighting",
      category: "Residential Architecture",
      categoryTag: "exterior",
      imageSrc: "/images/project-residential-elevation.jpg",
      isExternal: false,
      altText: "Modern residential elevation in Tuticorin with facade lighting",
      caption: "Exterior night elevation featuring balcony stone cladding and ambient lighting.",
      aspectRatio: "portrait",
      isFeatured: true,
      published: true,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gallery-2",
      title: "Completed Residence Key Handover Ceremony",
      category: "Project Handover",
      categoryTag: "handover",
      imageSrc: "/images/project-key-handover.jpg",
      isExternal: false,
      altText: "Ceremonial key handover to happy homeowners",
      caption: "Housewarming ceremony celebrating milestone completion.",
      aspectRatio: "landscape",
      isFeatured: true,
      published: true,
      displayOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gallery-3",
      title: "JBR Builders Office Entrance & Consultation Space",
      category: "Corporate & Office",
      categoryTag: "office",
      imageSrc: "/images/office-entrance.jpg",
      isExternal: false,
      altText: "JBR Builders official headquarters entrance",
      caption: "Consultation and civil planning front office in Tuticorin.",
      aspectRatio: "landscape",
      isFeatured: false,
      published: true,
      displayOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gallery-4",
      title: "Artistic Sky & Cloud False Ceiling Finishing",
      category: "Interior Finishes",
      categoryTag: "interior",
      imageSrc: "/images/interior-ceiling-design.jpg",
      isExternal: false,
      altText: "Custom cloud and sky ceiling finish with lighting",
      caption: "Bespoke ambient false ceiling execution for living lounge.",
      aspectRatio: "portrait",
      isFeatured: true,
      published: true,
      displayOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const team: TeamMemberCMS[] = [
    {
      id: 'emp-1',
      name: 'J Bharath',
      role: 'Founder & Principal Architect',
      department: 'Executive Leadership & Engineering',
      qualification: 'B.Arch, B.E. Civil, Council of Architecture Reg.',
      experience: '16+ Years Experience',
      location: 'Headquarters: Tuticorin',
      specialization: 'Architectural Master Planning, Structural Integrity & Turnkey Execution',
      bio: 'Founder and visionary architect driving JBR Builders with relentless focus on design excellence and construction rigor. Spearheads large-scale residential and commercial landmarks across South Tamil Nadu.',
      responsibilities: [
        'Master architectural conceptualization & structural approvals',
        'Client architectural consultation & high-value contract finalization',
        'Quality assurance oversight across all active sites in Tuticorin & Tirunelveli',
      ],
      keyProjects: [
        'Multi-Storey Residential Elevations in Tuticorin',
        'Commercial Complex & Showrooms in Tirunelveli',
        'Luxury Independent Turnkey Villas',
      ],
      image: '/images/team/founder.jpeg',
      quote: 'Bringing architectural dreams into reality through a lot of passion and dedication.',
      isLeadership: true,
      featuredInSpotlight: true,
      published: true,
      displayOrder: 1,
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'manoj@jbrbuilders.in',
        phone: '+919791710655',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp-2',
      name: 'Karthick',
      role: 'Civil Engineer',
      department: 'Civil Engineering & Site Operations',
      qualification: 'B.E. Civil Engineering',
      experience: '12+ Years Experience',
      location: 'Tuticorin & Tirunelveli',
      specialization: 'RCC Detailing, Concrete Quality Assurance & Structural Execution',
      bio: 'Experienced Civil Engineer overseeing structural design integrity, foundation concrete testing, and on-site engineering operations for high-durability residential and commercial construction.',
      responsibilities: [
        'Structural engineering analysis conforming to Indian Standard Codes',
        'Foundation depth engineering and concrete grade validation on site',
        'Technical site audits and reinforcement rebar verification',
      ],
      keyProjects: [
        'Multi-Storey Duplex Residential Frameworks',
        'Commercial Complex Heavy Span Beams',
        'Turnkey Residential Villa Handover Projects',
      ],
      image: '/images/team/engnier.jpeg',
      quote: 'Engineering precision and steadfast structural safety are the bedrock of every landmark we build.',
      isLeadership: true,
      featuredInSpotlight: true,
      published: true,
      displayOrder: 2,
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'karthick@jbrbuilders.in',
        phone: '+919791710655',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp-3',
      name: 'V Nattar muthuraj',
      role: 'Architect',
      department: 'Architecture & Spatial Planning',
      qualification: 'B.Arch, Council of Architecture Reg.',
      experience: '10+ Years Experience',
      location: 'Design Studio: Tuticorin',
      specialization: 'Contemporary Elevations, 3D Spatial Planning & Facade Engineering',
      bio: 'Creative Architect leading contemporary elevation blueprints, climate-responsive envelope modeling, and client 3D walkthrough visualizations with signature spatial harmony.',
      responsibilities: [
        'Architectural elevation design and facade lighting integration',
        'Detailed floor plan drafting and local municipal approval compliance',
        'On-site design consistency audits during finishing stages',
      ],
      keyProjects: [
        'Modern Elevation Villa Showcase in Tuticorin',
        'Contemporary Duplex Residences',
        'Architectural Consultation Studio',
      ],
      image: '/images/team/arcitectmuthu.jpeg',
      quote: 'Every elevation must tell a unique story while honoring natural daylight, ventilation, and structural harmony.',
      isLeadership: true,
      featuredInSpotlight: true,
      published: true,
      displayOrder: 3,
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'muthuraj@jbrbuilders.in',
        phone: '+919791710655',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp-4',
      name: 'J Rajapandi',
      role: 'Site Supervisor',
      department: 'Civil Engineering & Site Operations',
      qualification: 'DCE, Senior Site Supervisor',
      experience: '14+ Years Site Experience',
      location: 'Tuticorin Project Sites',
      specialization: 'Ground Execution, Masonry & Bar Bending Supervision, Safety Protocols',
      bio: 'Direct ground commander ensuring building blueprints are executed millimeter-accurate on site with strict adherence to safety protocols and concrete curing schedules.',
      responsibilities: [
        'Daily site supervision of masonry, shuttering, and bar bending work',
        'Vendor material delivery checks against grade specifications',
        'Ensuring zero-compromise execution at every construction milestone',
      ],
      keyProjects: [
        'Residential Villa Turnkey Ground Construction',
        'Compound Wall & Foundation Pile Projects',
        'Key Handover Residence Milestones',
      ],
      image: '/images/team/sitesuperviser.jpeg',
      quote: 'True architectural quality is forged through daily vigilance and disciplined on-site craftsmanship.',
      isLeadership: false,
      featuredInSpotlight: true,
      published: true,
      displayOrder: 4,
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'rajapandi@jbrbuilders.in',
        phone: '+919791710655',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const interns: InternMemberCMS[] = [];

  const internshipProgram: InternshipProgramCMS = {
    title: 'JBR Builders Internship Program',
    tagline: '',
    description: '',
    eligibility: [],
    modules: [],
    benefits: [],
    defaultWhatsappTemplate: '',
    published: false,
    updatedAt: new Date().toISOString(),
  };

  const homepage: HomepageContentCMS = {
    heroBadge: 'LISTEN BETTER • PLAN BETTER • BUILD BETTER',
    heroHeadline: 'Building Your Vision. Creating Your Future.',
    heroSubtext: 'Quality construction, thoughtful planning, and reliable building solutions tailored to your needs across Tuticorin & Tirunelveli.',
    heroCtaText: 'Request Project Consultation',
    heroSecondaryCtaText: 'Explore Project Portfolio',
    stats: [
      { id: 'stat-1', value: '16+', label: 'Years Experience', subtext: 'Serving South Tamil Nadu' },
      { id: 'stat-2', value: '250+', label: 'Projects Delivered', subtext: 'Residential & Commercial' },
      { id: 'stat-3', value: '100%', label: 'Quality Assured', subtext: 'IS Code Compliance' },
      { id: 'stat-4', value: '50+', label: 'Master Craftsmen', subtext: 'Engineers & Supervisors' },
    ],
    whyChooseUs: [
      {
        id: 'why-1',
        title: 'Seismic Structural Compliance',
        description: 'Engineered with licensed RCC frames, high-grade steel, and certified cement mix designs built for longevity.',
        icon: 'ShieldCheck',
      },
      {
        id: 'why-2',
        title: 'Transparent Itemized BOQ',
        description: 'Crystal-clear line-by-line material specifications with zero surprise charges or unverified markups.',
        icon: 'ClipboardCheck',
      },
      {
        id: 'why-3',
        title: 'Milestone Timely Handover',
        description: 'Disciplined stage-by-stage scheduling with digital updates and strict adherence to handover dates.',
        icon: 'Calendar',
      },
      {
        id: 'why-4',
        title: 'Single-Point Accountability',
        description: 'From 3D elevations and municipal permits to interior joinery and key delivery under one roof.',
        icon: 'KeyRound',
      },
    ],
    aboutPreview: {
      badge: 'Company Profile & People',
      heading: 'Over 16 Years of Civil Engineering Excellence',
      description: 'At JBR Builders, we believe great architecture begins with deep listening. We translate personal aspirations and business goals into durable physical structures.',
      experienceYears: '16+',
    },
    sectionVisibility: {
      hero: true,
      teamSpotlight: true,
      about: true,
      services: true,
      projects: true,
      whyChooseUs: true,
      contact: true,
    },
    updatedAt: new Date().toISOString(),
  };

  const auditLogs: AuditLogCMS[] = [
    {
      id: 'log-initial',
      action: 'SYSTEM_SEED',
      entity: 'DATABASE',
      timestamp: new Date().toISOString(),
      user: 'SYSTEM',
      details: 'Initial database seeded successfully with existing website data.',
    }
  ];

  return {
    version: 1,
    users: [defaultAdmin],
    company,
    services,
    projects,
    gallery,
    team,
    interns,
    internshipProgram,
    homepage,
    auditLogs,
    inquiries: [],
  };
}

// In-memory cache synced atomically with disk
let dbCache: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  ensureDirs();

  if (dbCache) {
    return dbCache;
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialSeedData();
    saveDatabase(initial);
    dbCache = initial;
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbCache = JSON.parse(raw);
    return dbCache!;
  } catch (err) {
    console.error('Failed reading database file, re-initializing seed data:', err);
    const initial = getInitialSeedData();
    saveDatabase(initial);
    dbCache = initial;
    return initial;
  }
}

// Atomic file write using temporary file + rename
export function saveDatabase(data: DatabaseSchema): void {
  ensureDirs();
  const tmpFile = `${DB_FILE}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
    dbCache = data;
  } catch (err) {
    if (fs.existsSync(tmpFile)) {
      try { fs.unlinkSync(tmpFile); } catch {}
    }
    console.error('Error writing database atomically:', err);
    throw err;
  }
}

// Audit Logger helper
export function addAuditLog(action: string, entity: string, entityId: string | undefined, user: string, details?: string) {
  const db = getDatabase();
  const log: AuditLogCMS = {
    id: `log-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    user,
    details,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs.pop(); // Keep last 500 logs
  }
  saveDatabase(db);
}
