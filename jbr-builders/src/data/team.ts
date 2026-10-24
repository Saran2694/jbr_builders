export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  qualification: string;
  experience: string;
  location: string;
  specialization: string;
  bio: string;
  responsibilities: string[];
  keyProjects: string[];
  image: string;
  quote?: string;
  isLeadership?: boolean;
  socials?: {
    linkedin?: string;
    email?: string;
    phone?: string;
  };
}

export interface InternMember {
  id: string;
  name: string;
  role: string;
  institution: string;
  degree: string;
  duration: string;
  mentor: string;
  focusArea: string;
  learningHighlights: string[];
  status: 'Active Intern' | 'Completed' | 'PPO Offered';
  image: string;
}

export const EMPLOYEES: TeamMember[] = [
  {
    id: 'emp-1',
    name: ' J Bharath',
    role: 'Founder & Principal Architect',
    department: 'Executive Leadership & Engineering',
    qualification: 'B.Arch, B.E. Civil, Council of Architecture Reg.',
    experience: '16+ Years Experience',
    location: 'Headquarters: Tuticorin',
    specialization: 'Architectural Master Planning, Structural Integrity & Turnkey Execution',
    bio: 'Founder and visionary architect driving JBR Builders with relentless focus on design excellence and construction rigor. Spearheads large-scale residential landmarks across South Tamil Nadu.',
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
    quote: 'Bringing architectural dreams into reality through a lot of passion, structural rigor, and client dedication.',
    isLeadership: true,
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'manoj@jbrbuilders.in',
      phone: '+919791710655',
    },
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
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'karthick@jbrbuilders.in',
      phone: '+919791710655',
    },
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
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'muthuraj@jbrbuilders.in',
      phone: '+919791710655',
    },
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
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'rajapandi@jbrbuilders.in',
      phone: '+919791710655',
    },
  },
];

export const INTERNS: InternMember[] = [];

export const INTERNSHIP_PROGRAM = {
  title: 'JBR Builders Internship Program',
  tagline: 'Civil Engineering & Architectural Ground Training',
  description: '',
  eligibility: [],
  modules: [],
  benefits: [],
};
