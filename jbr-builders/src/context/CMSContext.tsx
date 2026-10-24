import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  CompanySettingsCMS,
  ServiceItemCMS,
  ProjectItemCMS,
  GalleryItemCMS,
  TeamMemberCMS,
  InternMemberCMS,
  InternshipProgramCMS,
  HomepageContentCMS,
  PublicContentPayload,
} from '../types/cms';
import { COMPANY_INFO } from '../data/company';
import { PROPOSED_SERVICES } from '../data/services';
import { GALLERY_PROJECTS } from '../data/projects';
import { EMPLOYEES, INTERNS, INTERNSHIP_PROGRAM } from '../data/team';
import { isFirebaseConfigured } from '../lib/firebase';
import {
  employeeService,
  galleryService,
  projectService,
  aboutService,
  checkAndSeedInitialData,
  type AboutContentCMS,
} from '../lib/firestoreService';

interface CMSContextType {
  company: CompanySettingsCMS;
  aboutContent: AboutContentCMS | null;
  services: ServiceItemCMS[];
  projects: ProjectItemCMS[];
  gallery: GalleryItemCMS[];
  team: TeamMemberCMS[];
  interns: InternMemberCMS[];
  internshipProgram: InternshipProgramCMS;
  homepage: HomepageContentCMS;
  loading: boolean;
  refreshContent: () => Promise<void>;
  submitInquiry: (data: { name: string; phone: string; email?: string; service?: string; message: string }) => Promise<{ success: boolean; message: string }>;
}

// Fallback Default State based on existing TypeScript static data
const defaultCompany: CompanySettingsCMS = {
  name: COMPANY_INFO.name,
  tagline: COMPANY_INFO.tagline,
  heroHeadline: COMPANY_INFO.heroHeadline,
  heroSubtext: COMPANY_INFO.heroSubtext,
  phone: COMPANY_INFO.phone,
  phoneRaw: COMPANY_INFO.phoneRaw,
  whatsappNumber: COMPANY_INFO.whatsappNumber,
  whatsappUrl: COMPANY_INFO.whatsappUrl,
  defaultWhatsappMessage: "Hello JBR Builders, I would like to inquire about your construction services.",
  email: COMPANY_INFO.email,
  offices: COMPANY_INFO.offices.map((o, idx) => ({
    id: `office-${idx + 1}`,
    type: o.type,
    address: o.address,
    city: o.city,
    state: o.state,
    pincode: o.pincode,
    isPrimary: idx === 0,
  })),
  workingHours: COMPANY_INFO.workingHours,
  logoUrl: COMPANY_INFO.logoUrl,
  socialLinks: {
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
  updatedAt: new Date().toISOString(),
};

const defaultServices: ServiceItemCMS[] = PROPOSED_SERVICES.map((s, idx) => ({
  id: s.id,
  title: s.title,
  description: s.description,
  iconName: s.iconName,
  features: s.features,
  displayOrder: idx + 1,
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const defaultProjects: ProjectItemCMS[] = GALLERY_PROJECTS.map((p, idx) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  categoryTag: p.categoryTag,
  imageSrc: p.imageSrc,
  aspectRatio: p.aspectRatio as any,
  description: p.description,
  displayOrder: idx + 1,
  published: true,
  isFeatured: idx < 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const defaultGallery: GalleryItemCMS[] = GALLERY_PROJECTS.map((p, idx) => ({
  id: `gal-${p.id}`,
  title: p.title,
  category: p.category,
  categoryTag: p.categoryTag,
  imageSrc: p.imageSrc,
  isExternal: false,
  altText: p.title,
  caption: p.description,
  aspectRatio: p.aspectRatio as any,
  isFeatured: idx < 3,
  published: true,
  displayOrder: idx + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const defaultTeam: TeamMemberCMS[] = EMPLOYEES.map((e, idx) => ({
  ...e,
  isLeadership: Boolean(e.isLeadership),
  featuredInSpotlight: Boolean(e.isLeadership),
  published: true,
  displayOrder: idx + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const defaultInterns: InternMemberCMS[] = INTERNS.map((i, idx) => ({
  ...i,
  published: true,
  displayOrder: idx + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const defaultInternshipProgram: InternshipProgramCMS = {
  ...INTERNSHIP_PROGRAM,
  defaultWhatsappTemplate:
    'Hello JBR Builders,\nI am a Civil Engineering / Architecture student interested in applying for your practical site Internship Program.\n\nName:\nCollege:\nDegree & Year of Study:\nPreferred Duration (1/3/6 Months):\nCity / Location:',
  published: true,
  updatedAt: new Date().toISOString(),
};

const defaultHomepage: HomepageContentCMS = {
  heroBadge: 'LISTEN BETTER • PLAN BETTER • BUILD BETTER',
  heroHeadline: 'Building Your Vision. Creating Your Future.',
  heroSubtext: 'Quality construction, thoughtful planning, and reliable building solutions tailored to your needs.',
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

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<CompanySettingsCMS>(defaultCompany);
  const [services, setServices] = useState<ServiceItemCMS[]>(defaultServices);
  const [projects, setProjects] = useState<ProjectItemCMS[]>(defaultProjects);
  const [gallery, setGallery] = useState<GalleryItemCMS[]>(defaultGallery);
  const [team, setTeam] = useState<TeamMemberCMS[]>(defaultTeam);
  const [interns, setInterns] = useState<InternMemberCMS[]>(defaultInterns);
  const [internshipProgram, setInternshipProgram] = useState<InternshipProgramCMS>(defaultInternshipProgram);
  const [homepage, setHomepage] = useState<HomepageContentCMS>(defaultHomepage);
  const [aboutContent, setAboutContent] = useState<AboutContentCMS | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchContent = useCallback(async () => {
    try {
      if (isFirebaseConfigured()) {
        // Automatically check and seed Firestore with existing data if empty
        await checkAndSeedInitialData();

        const [firestoreEmployees, firestoreGallery, firestoreProjects, firestoreAbout, firestoreCompany] =
          await Promise.all([
            employeeService.getAll(),
            galleryService.getAll(),
            projectService.getAll(),
            aboutService.getAboutContent(),
            aboutService.getCompanySettings(),
          ]);

        if (firestoreEmployees.length > 0) setTeam(firestoreEmployees);
        if (firestoreGallery.length > 0) setGallery(firestoreGallery);
        if (firestoreProjects.length > 0) setProjects(firestoreProjects);
        if (firestoreAbout) setAboutContent(firestoreAbout);
        if (firestoreCompany) setCompany(firestoreCompany);
      }

      // Also try API for other modules or when running local server
      const response = await fetch('/api/public/content').catch(() => null);
      if (response && response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const data: PublicContentPayload = json.data;
          if (data.company && !isFirebaseConfigured()) setCompany(data.company);
          if (Array.isArray(data.services) && data.services.length > 0) setServices(data.services);
          if (Array.isArray(data.projects) && data.projects.length > 0 && !isFirebaseConfigured()) setProjects(data.projects);
          if (Array.isArray(data.gallery) && data.gallery.length > 0 && !isFirebaseConfigured()) setGallery(data.gallery);
          if (Array.isArray(data.team) && data.team.length > 0 && !isFirebaseConfigured()) setTeam(data.team);
          if (Array.isArray(data.interns) && data.interns.length > 0) setInterns(data.interns);
          if (data.internshipProgram) setInternshipProgram(data.internshipProgram);
          if (data.homepage) setHomepage(data.homepage);
        }
      }
    } catch (err) {
      console.warn('Error synchronizing CMS content, retaining current state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const submitInquiry = async (data: { name: string; phone: string; email?: string; service?: string; message: string }) => {
    try {
      const res = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.error || 'Failed to submit inquiry' };
      }
      return { success: true, message: json.message || 'Inquiry submitted successfully!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error submitting inquiry.' };
    }
  };

  return (
    <CMSContext.Provider
      value={{
        company,
        aboutContent,
        services,
        projects,
        gallery,
        team,
        interns,
        internshipProgram,
        homepage,
        loading,
        refreshContent: fetchContent,
        submitInquiry,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
