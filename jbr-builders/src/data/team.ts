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
    name: 'Manoj Neerajakshalu',
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

export const INTERNS: InternMember[] = [
  {
    id: 'intern-1',
    name: 'S. Harish Kumar',
    role: 'Graduate Civil Engineering Intern',
    institution: 'Government College of Engineering, Tirunelveli',
    degree: 'B.E. Civil Engineering (Final Year)',
    duration: '6 Months (Jan 2026 - Jun 2026)',
    mentor: 'Karthick (Civil Engineer)',
    focusArea: 'Site Leveling, Shuttering Verification & Reinforcement Checks',
    learningHighlights: [
      'Conducted on-site slump cone tests for M25 grade concrete on residential slabs',
      'Verified rebar spacing and lap length against structural detailing drawings',
      'Assisted senior engineers during client key handover inspection checklists',
    ],
    status: 'Active Intern',
    image: '/images/team/intern-harish-kumar.jpg',
  },
  {
    id: 'intern-2',
    name: 'V. Nivetha',
    role: 'Architectural Drafting & 3D Modeling Intern',
    institution: 'Anna University Regional Campus, Tirunelveli',
    degree: 'B.Arch (4th Year)',
    duration: '3 Months (Nov 2025 - Jan 2026)',
    mentor: 'V Nattar muthuraj (Architect)',
    focusArea: 'AutoCAD Working Drawings, 3D Elevation Modeling & Material Mapping',
    learningHighlights: [
      'Developed 3D exterior facade renders using modern parametric panels',
      'Created detailed electrical and plumbing conduit layout blueprints',
      'Participated in direct client consultation sessions for floor plan personalization',
    ],
    status: 'PPO Offered',
    image: '/images/team/intern-nivetha.jpg',
  },
  {
    id: 'intern-3',
    name: 'A. Mohammed Farooq',
    role: 'Civil Site Trainee',
    institution: 'National Engineering College (NEC), Kovilpatti',
    degree: 'B.E. Civil Engineering',
    duration: '3 Months (Feb 2026 - Apr 2026)',
    mentor: 'Karthick (Civil Engineer)',
    focusArea: 'Total Station Survey, Excavation Monitoring & Quality Control',
    learningHighlights: [
      'Hands-on experience with Total Station equipment for boundary demarcations',
      'Daily site dairy logging and progress documentation in Tuticorin projects',
      'Studied soil test reports for pile foundation depth calculations',
    ],
    status: 'Active Intern',
    image: '/images/team/intern-farooq.jpg',
  },
  {
    id: 'intern-4',
    name: 'R. Kavinraj',
    role: 'Structural Detailing Intern',
    institution: 'St. Xavier’s Catholic College of Engineering, Nagercoil',
    degree: 'B.E. Civil Engineering (2025 Batch)',
    duration: '6 Months (Completed Dec 2025)',
    mentor: 'Manoj Neerajakshalu (Founder-Principal Architect)',
    focusArea: 'RCC Beam & Column Reinforcement Scheduling',
    learningHighlights: [
      'Prepared bar bending schedules (BBS) for 2 multi-storey residential projects',
      'Gained deep familiarity with IS 456:2000 and IS 13920 seismic detailing codes',
      'Successfully transitioned to Junior Project Associate at JBR Builders',
    ],
    status: 'Completed',
    image: '/images/team/intern-kavinraj.jpg',
  },
];

export const INTERNSHIP_PROGRAM = {
  title: 'JBR Builders Civil Engineering & Architectural Internship Program',
  tagline: 'Bridging Academic Theory with Real-World Ground Construction',
  description:
    'We actively nurture the next generation of civil engineers, architects, and structural designers from colleges across Tamil Nadu. Our internships provide genuine hard-hat site exposure, mentor-guided responsibility, and pathways to full-time engineering careers.',
  eligibility: [
    'Students pursuing Diploma / B.E. / B.Tech / M.Tech in Civil Engineering',
    'Architecture students (B.Arch) seeking practical working drawing & 3D elevation exposure',
    'Minimum 6.5 CGPA with a genuine passion for on-site structural works',
  ],
  modules: [
    {
      title: 'Site Execution & Surveying',
      desc: 'Hands-on training with Total Station, optical levels, excavation alignment, and foundation marking.',
    },
    {
      title: 'Concrete Technology & QA/QC',
      desc: 'Live testing of concrete slump, cube compressive strength, aggregate testing, and curing verification.',
    },
    {
      title: 'Bar Bending & Structural Detailing',
      desc: 'Understanding structural blueprints, rebar ties, hook angles, lap lengths, and BBS calculation.',
    },
    {
      title: 'Estimation & Quantity Surveying',
      desc: 'Learning material takeoff, rate analysis, labor productivity tracking, and site cost management.',
    },
  ],
  benefits: [
    'Official Internship Certificate & Performance Letter from JBR Builders',
    'Direct mentorship from licensed engineers with 10+ years experience',
    'Pre-Placement Offer (PPO) opportunities for outstanding performers',
    'Safety gear (Hard-hat, high-vis jacket, tape measures) provided on site',
  ],
};
