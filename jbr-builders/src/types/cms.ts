// Comprehensive CMS Data Models for JBR Builders

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface OfficeLocationCMS {
  id: string;
  type: string; // e.g., 'Head Office', 'Branch Office'
  address: string;
  city: string;
  state: string;
  pincode: string;
  mapsUrl?: string;
  isPrimary?: boolean;
}

export interface CompanySettingsCMS {
  name: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  phone: string;
  phoneRaw: string;
  whatsappNumber: string;
  whatsappUrl: string;
  defaultWhatsappMessage: string;
  email: string;
  offices: OfficeLocationCMS[];
  workingHours: string;
  logoUrl: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  updatedAt: string;
}

export interface ServiceItemCMS {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  image?: string;
  displayOrder: number;
  published: boolean;
  quoteSubject?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItemCMS {
  id: string;
  title: string;
  category: string;
  categoryTag: 'exterior' | 'interior' | 'office' | 'handover';
  imageSrc: string;
  additionalImages?: string[];
  aspectRatio: 'landscape' | 'portrait' | 'square';
  description: string;
  location?: string;
  year?: string;
  displayOrder: number;
  published: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItemCMS {
  id: string;
  title: string;
  category: string;
  categoryTag: 'exterior' | 'interior' | 'office' | 'handover';
  imageSrc: string; // Can be persistent /uploads/... or external https://...
  isExternal: boolean;
  altText: string;
  caption?: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  isFeatured: boolean;
  published: boolean;
  displayOrder: number;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberCMS {
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
  isLeadership: boolean;
  featuredInSpotlight: boolean;
  published: boolean;
  displayOrder: number;
  socials?: {
    linkedin?: string;
    email?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InternMemberCMS {
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
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface InternshipTrainingModule {
  title: string;
  desc: string;
}

export interface InternshipProgramCMS {
  title: string;
  tagline: string;
  description: string;
  eligibility: string[];
  modules: InternshipTrainingModule[];
  benefits: string[];
  defaultWhatsappTemplate: string;
  published: boolean;
  updatedAt: string;
}

export interface CounterStatCMS {
  id: string;
  value: string;
  label: string;
  subtext?: string;
}

export interface WhyChooseUsItemCMS {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HomepageContentCMS {
  heroBadge: string;
  heroHeadline: string;
  heroSubtext: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  stats: CounterStatCMS[];
  whyChooseUs: WhyChooseUsItemCMS[];
  aboutPreview: {
    badge: string;
    heading: string;
    description: string;
    experienceYears: string;
  };
  sectionVisibility: {
    hero: boolean;
    teamSpotlight: boolean;
    about: boolean;
    services: boolean;
    projects: boolean;
    whyChooseUs: boolean;
    contact: boolean;
  };
  updatedAt: string;
}

export interface AuditLogCMS {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  timestamp: string;
  user: string;
  details?: string;
}

export interface PublicContentPayload {
  company: CompanySettingsCMS;
  services: ServiceItemCMS[];
  projects: ProjectItemCMS[];
  gallery: GalleryItemCMS[];
  team: TeamMemberCMS[];
  interns: InternMemberCMS[];
  internshipProgram: InternshipProgramCMS;
  homepage: HomepageContentCMS;
}
