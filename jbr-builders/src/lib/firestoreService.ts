import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type {
  TeamMemberCMS,
  GalleryItemCMS,
  ProjectItemCMS,
  CompanySettingsCMS,
} from '../types/cms';
import { EMPLOYEES } from '../data/team';
import { GALLERY_PROJECTS } from '../data/projects';
import { COMPANY_INFO } from '../data/company';

// Collection Names
export const COLLECTIONS = {
  SITE_CONTENT: 'siteContent',
  EMPLOYEES: 'employees',
  GALLERY: 'gallery',
  PROJECTS: 'projects',
} as const;

export interface AboutContentCMS {
  badge: string;
  heading: string;
  description: string;
  story: string;
  experienceYears: string;
  mission: string;
  vision: string;
  coreValues: Array<{ title: string; description: string; icon?: string }>;
  videoUrl?: string;
  updatedAt?: string;
}

// -------------------------------------------------------------
// MODULE A: ABOUT US & EMPLOYEES
// -------------------------------------------------------------

export const aboutService = {
  async getAboutContent(): Promise<AboutContentCMS | null> {
    if (!isFirebaseConfigured()) return null;
    try {
      const docRef = doc(db, COLLECTIONS.SITE_CONTENT, 'about');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as AboutContentCMS;
      }
      return null;
    } catch (err) {
      console.error('Error fetching about content from Firestore:', err);
      return null;
    }
  },

  async saveAboutContent(data: Partial<AboutContentCMS>): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not yet configured. Please supply valid Firebase credentials in .env');
    }
    const docRef = doc(db, COLLECTIONS.SITE_CONTENT, 'about');
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  },

  async getCompanySettings(): Promise<CompanySettingsCMS | null> {
    if (!isFirebaseConfigured()) return null;
    try {
      const docRef = doc(db, COLLECTIONS.SITE_CONTENT, 'company');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as CompanySettingsCMS;
      }
      return null;
    } catch (err) {
      console.error('Error fetching company settings from Firestore:', err);
      return null;
    }
  },

  async saveCompanySettings(data: Partial<CompanySettingsCMS>): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not yet configured. Please supply valid Firebase credentials in .env');
    }
    const docRef = doc(db, COLLECTIONS.SITE_CONTENT, 'company');
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  },
};

export const employeeService = {
  async getAll(onlyActive = false): Promise<TeamMemberCMS[]> {
    if (!isFirebaseConfigured()) return [];
    try {
      const colRef = collection(db, COLLECTIONS.EMPLOYEES);
      let q = query(colRef, orderBy('displayOrder', 'asc'));
      if (onlyActive) {
        q = query(colRef, where('published', '==', true), orderBy('displayOrder', 'asc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<TeamMemberCMS, 'id'>),
      }));
    } catch (err) {
      console.error('Error fetching employees from Firestore:', err);
      return [];
    }
  },

  async getById(id: string): Promise<TeamMemberCMS | null> {
    if (!isFirebaseConfigured()) return null;
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<TeamMemberCMS, 'id'>) };
  },

  async create(employee: Omit<TeamMemberCMS, 'id'> | Partial<TeamMemberCMS>): Promise<TeamMemberCMS> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const colRef = collection(db, COLLECTIONS.EMPLOYEES);
    const now = new Date().toISOString();
    const newDoc = {
      ...employee,
      published: employee.published ?? true,
      displayOrder: employee.displayOrder ?? 99,
      createdAt: now,
      updatedAt: now,
    };
    const res = await addDoc(colRef, newDoc);
    return { id: res.id, ...newDoc } as TeamMemberCMS;
  },

  async update(id: string, data: Partial<TeamMemberCMS>): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
    const cleanData = { ...data };
    delete (cleanData as any).id;
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
    await deleteDoc(docRef);
  },

  async reorder(orderedIds: string[]): Promise<void> {
    if (!isFirebaseConfigured()) return;
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
      batch.update(docRef, { displayOrder: index + 1, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  },
};

// -------------------------------------------------------------
// MODULE B: GALLERY MANAGEMENT
// -------------------------------------------------------------

export const galleryService = {
  async getAll(onlyPublished = false): Promise<GalleryItemCMS[]> {
    if (!isFirebaseConfigured()) return [];
    try {
      const colRef = collection(db, COLLECTIONS.GALLERY);
      let q = query(colRef, orderBy('displayOrder', 'asc'));
      if (onlyPublished) {
        q = query(colRef, where('published', '==', true), orderBy('displayOrder', 'asc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GalleryItemCMS, 'id'>),
      }));
    } catch (err) {
      console.error('Error fetching gallery from Firestore:', err);
      return [];
    }
  },

  async create(item: Omit<GalleryItemCMS, 'id'> | Partial<GalleryItemCMS>): Promise<GalleryItemCMS> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const colRef = collection(db, COLLECTIONS.GALLERY);
    const now = new Date().toISOString();
    const newDoc = {
      ...item,
      published: item.published ?? true,
      displayOrder: item.displayOrder ?? 99,
      createdAt: now,
      updatedAt: now,
    };
    const res = await addDoc(colRef, newDoc);
    return { id: res.id, ...newDoc } as GalleryItemCMS;
  },

  async update(id: string, data: Partial<GalleryItemCMS>): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    const cleanData = { ...data };
    delete (cleanData as any).id;
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    await deleteDoc(docRef);
  },

  async reorder(orderedIds: string[]): Promise<void> {
    if (!isFirebaseConfigured()) return;
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      const docRef = doc(db, COLLECTIONS.GALLERY, id);
      batch.update(docRef, { displayOrder: index + 1, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  },
};

// -------------------------------------------------------------
// MODULE C: PROJECTS MANAGEMENT
// -------------------------------------------------------------

export const projectService = {
  async getAll(onlyPublished = false): Promise<ProjectItemCMS[]> {
    if (!isFirebaseConfigured()) return [];
    try {
      const colRef = collection(db, COLLECTIONS.PROJECTS);
      let q = query(colRef, orderBy('displayOrder', 'asc'));
      if (onlyPublished) {
        q = query(colRef, where('published', '==', true), orderBy('displayOrder', 'asc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ProjectItemCMS, 'id'>),
      }));
    } catch (err) {
      console.error('Error fetching projects from Firestore:', err);
      return [];
    }
  },

  async getHomepageProjects(limitCount = 3): Promise<ProjectItemCMS[]> {
    const all = await this.getAll(true);
    return all.slice(0, limitCount);
  },

  async create(project: Omit<ProjectItemCMS, 'id'> | Partial<ProjectItemCMS>): Promise<ProjectItemCMS> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const colRef = collection(db, COLLECTIONS.PROJECTS);
    const now = new Date().toISOString();
    const newDoc = {
      ...project,
      published: project.published ?? true,
      isFeatured: project.isFeatured ?? false,
      displayOrder: project.displayOrder ?? 99,
      createdAt: now,
      updatedAt: now,
    };
    const res = await addDoc(colRef, newDoc);
    return { id: res.id, ...newDoc } as ProjectItemCMS;
  },

  async update(id: string, data: Partial<ProjectItemCMS>): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    const cleanData = { ...data };
    delete (cleanData as any).id;
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.');
    }
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await deleteDoc(docRef);
  },

  async reorder(orderedIds: string[]): Promise<void> {
    if (!isFirebaseConfigured()) return;
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      const docRef = doc(db, COLLECTIONS.PROJECTS, id);
      batch.update(docRef, { displayOrder: index + 1, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  },
};

// -------------------------------------------------------------
// SAFE INITIAL DATA MIGRATION & SEEDING HELPER
// Preserves existing application data by populating Firestore
// if collections are empty.
// -------------------------------------------------------------

export async function checkAndSeedInitialData(): Promise<{ seeded: boolean; details: Record<string, number> }> {
  if (!isFirebaseConfigured()) {
    return { seeded: false, details: {} };
  }

  const results: Record<string, number> = {};

  try {
    // 1. Check Employees
    const empSnap = await getDocs(collection(db, COLLECTIONS.EMPLOYEES));
    if (empSnap.empty && EMPLOYEES.length > 0) {
      const batch = writeBatch(db);
      EMPLOYEES.forEach((emp, index) => {
        const docRef = doc(collection(db, COLLECTIONS.EMPLOYEES));
        batch.set(docRef, {
          ...emp,
          published: true,
          displayOrder: index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      results.employees = EMPLOYEES.length;
    }

    // 2. Check Gallery
    const galSnap = await getDocs(collection(db, COLLECTIONS.GALLERY));
    if (galSnap.empty && GALLERY_PROJECTS.length > 0) {
      const batch = writeBatch(db);
      GALLERY_PROJECTS.forEach((item, index) => {
        const docRef = doc(collection(db, COLLECTIONS.GALLERY));
        batch.set(docRef, {
          title: item.title,
          category: item.category,
          categoryTag: item.categoryTag,
          imageSrc: item.imageSrc,
          isExternal: false,
          altText: item.title,
          caption: item.description,
          aspectRatio: item.aspectRatio || 'landscape',
          isFeatured: index < 3,
          published: true,
          displayOrder: index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      results.gallery = GALLERY_PROJECTS.length;
    }

    // 3. Check Projects
    const projSnap = await getDocs(collection(db, COLLECTIONS.PROJECTS));
    if (projSnap.empty && GALLERY_PROJECTS.length > 0) {
      const batch = writeBatch(db);
      GALLERY_PROJECTS.forEach((proj, index) => {
        const docRef = doc(collection(db, COLLECTIONS.PROJECTS));
        batch.set(docRef, {
          title: proj.title,
          category: proj.category,
          categoryTag: proj.categoryTag,
          imageSrc: proj.imageSrc,
          aspectRatio: proj.aspectRatio || 'landscape',
          description: proj.description,
          location: 'Tuticorin',
          year: '2024',
          displayOrder: index + 1,
          published: true,
          isFeatured: index < 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      results.projects = GALLERY_PROJECTS.length;
    }

    // 4. Check Site Content: About & Company
    const aboutSnap = await getDoc(doc(db, COLLECTIONS.SITE_CONTENT, 'about'));
    if (!aboutSnap.exists()) {
      await setDoc(doc(db, COLLECTIONS.SITE_CONTENT, 'about'), {
        badge: 'Company Profile & People',
        heading: 'Over 16 Years of Civil Engineering Excellence',
        description:
          'At JBR Builders, we believe great architecture begins with deep listening. We translate personal aspirations and business goals into durable physical structures.',
        story:
          'Founded in Tuticorin, JBR Builders has grown into a leading civil engineering and architectural firm in South Tamil Nadu, dedicated to quality, durability, and on-time handover.',
        experienceYears: '16+',
        mission: 'Deliver precision-engineered structures with transparent costs and strict building code compliance.',
        vision: 'Be South Tamil Nadu’s most dependable civil contracting and architectural design partner.',
        coreValues: [
          { title: 'Structural Integrity', description: 'IS-standard RCC designs and grade-tested materials.' },
          { title: 'Transparency', description: 'Itemized BOQ with zero hidden costs.' },
          { title: 'Timely Handover', description: 'Disciplined stage-by-stage construction schedules.' },
        ],
        updatedAt: new Date().toISOString(),
      });
      results.about = 1;
    }

    const companySnap = await getDoc(doc(db, COLLECTIONS.SITE_CONTENT, 'company'));
    if (!companySnap.exists()) {
      await setDoc(doc(db, COLLECTIONS.SITE_CONTENT, 'company'), {
        ...COMPANY_INFO,
        offices: COMPANY_INFO.offices.map((o, idx) => ({
          id: `office-${idx + 1}`,
          ...o,
          isPrimary: idx === 0,
        })),
        updatedAt: new Date().toISOString(),
      });
      results.company = 1;
    }

    return {
      seeded: Object.keys(results).length > 0,
      details: results,
    };
  } catch (err) {
    console.error('Failed to run initial Firestore seed migration:', err);
    return { seeded: false, details: results };
  }
}
