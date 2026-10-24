import type {
  TeamMemberCMS,
  ServiceItemCMS,
  ProjectItemCMS,
  GalleryItemCMS,
  InternMemberCMS,
  CompanySettingsCMS,
  HomepageContentCMS,
  InternshipProgramCMS,
  AuditLogCMS,
} from '../../types/cms';
import { isFirebaseConfigured } from '../../lib/firebase';
import {
  employeeService,
  galleryService,
  projectService,
  aboutService,
} from '../../lib/firestoreService';

const TOKEN_KEY = 'jbr_admin_token';
const USER_KEY = 'jbr_admin_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): any {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: any) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, error: 'Failed to parse response' }));

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredAuth();
    }
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const adminApi = {
  // Authentication
  async login(username: string, password: string, rememberMe = false) {
    const res = await request<{ success: boolean; token: string; user: any }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, rememberMe }),
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  async verifySession() {
    return request<{ success: boolean; user: any }>('/api/admin/me');
  },

  async logout() {
    try {
      await request('/api/admin/logout', { method: 'POST' });
    } finally {
      clearStoredAuth();
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return request<{ success: boolean; message: string }>('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Dashboard Stats
  async getStats() {
    return request<{ success: boolean; data: any }>('/api/admin/stats');
  },

  // Media Upload (Cloudinary with server-side signing & local fallback)
  async uploadFile(
    file: File,
    folder: 'about' | 'employees' | 'gallery' | 'projects' = 'gallery'
  ): Promise<{ success: boolean; url: string; secureUrl: string; publicId: string; assetId: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await request<{
            success: boolean;
            url: string;
            secureUrl: string;
            publicId: string;
            assetId: string;
            filename: string;
          }>('/api/admin/upload', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              mimeType: file.type,
              base64Data,
              folder,
            }),
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file for upload'));
      reader.readAsDataURL(file);
    });
  },

  // Media Delete (Cloudinary)
  async deleteMedia(publicId: string): Promise<{ success: boolean; message?: string }> {
    return request<{ success: boolean; message?: string }>('/api/admin/media/delete', {
      method: 'POST',
      body: JSON.stringify({ publicId }),
    });
  },

  // ---------------------------------------------------------
  // MODULE A: TEAM & EMPLOYEES (Connected to Firestore)
  // ---------------------------------------------------------
  async getTeam() {
    if (isFirebaseConfigured()) {
      try {
        const data = await employeeService.getAll();
        if (data.length > 0) {
          return { success: true, data };
        }
      } catch (err) {
        console.warn('Firestore fetch failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: TeamMemberCMS[] }>('/api/admin/team');
  },

  async createTeamMember(member: Partial<TeamMemberCMS>) {
    if (isFirebaseConfigured()) {
      try {
        const created = await employeeService.create(member);
        return { success: true, data: created };
      } catch (err) {
        console.warn('Firestore create failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: TeamMemberCMS }>('/api/admin/team', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  },

  async updateTeamMember(id: string, member: Partial<TeamMemberCMS>) {
    if (isFirebaseConfigured()) {
      try {
        await employeeService.update(id, member);
        return { success: true, data: { ...member, id } as TeamMemberCMS };
      } catch (err) {
        console.warn('Firestore update failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: TeamMemberCMS }>(`/api/admin/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    });
  },

  async deleteTeamMember(id: string) {
    if (isFirebaseConfigured()) {
      try {
        await employeeService.delete(id);
        return { success: true, message: 'Deleted successfully from Firestore' };
      } catch (err) {
        console.warn('Firestore delete failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; message: string }>(`/api/admin/team/${id}`, {
      method: 'DELETE',
    });
  },

  async reorderTeam(ids: string[]) {
    if (isFirebaseConfigured()) {
      try {
        await employeeService.reorder(ids);
        return { success: true, message: 'Reordered in Firestore' };
      } catch (err) {
        console.warn('Firestore reorder failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; message: string }>('/api/admin/team/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
  },

  // ---------------------------------------------------------
  // MODULE B: GALLERY MANAGEMENT (Connected to Firestore)
  // ---------------------------------------------------------
  async getGallery() {
    if (isFirebaseConfigured()) {
      try {
        const data = await galleryService.getAll();
        if (data.length > 0) {
          return { success: true, data };
        }
      } catch (err) {
        console.warn('Firestore gallery fetch failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: GalleryItemCMS[] }>('/api/admin/gallery');
  },

  async createGalleryItem(item: Partial<GalleryItemCMS>) {
    if (isFirebaseConfigured()) {
      try {
        const created = await galleryService.create(item);
        return { success: true, data: created };
      } catch (err) {
        console.warn('Firestore gallery create failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: GalleryItemCMS }>('/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItemCMS>) {
    if (isFirebaseConfigured()) {
      try {
        await galleryService.update(id, item);
        return { success: true, data: { ...item, id } as GalleryItemCMS };
      } catch (err) {
        console.warn('Firestore gallery update failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: GalleryItemCMS }>(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },

  async deleteGalleryItem(id: string) {
    if (isFirebaseConfigured()) {
      try {
        await galleryService.delete(id);
        return { success: true, message: 'Deleted gallery item from Firestore' };
      } catch (err) {
        console.warn('Firestore gallery delete failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; message: string }>(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
    });
  },

  async reorderGallery(ids: string[]) {
    if (isFirebaseConfigured()) {
      try {
        await galleryService.reorder(ids);
        return { success: true, message: 'Reordered gallery in Firestore' };
      } catch (err) {
        console.warn('Firestore gallery reorder failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; message: string }>('/api/admin/gallery/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
  },

  // ---------------------------------------------------------
  // MODULE C: PROJECTS MANAGEMENT (Connected to Firestore)
  // ---------------------------------------------------------
  async getProjects() {
    if (isFirebaseConfigured()) {
      try {
        const data = await projectService.getAll();
        if (data.length > 0) {
          return { success: true, data };
        }
      } catch (err) {
        console.warn('Firestore projects fetch failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: ProjectItemCMS[] }>('/api/admin/projects');
  },

  async createProject(project: Partial<ProjectItemCMS>) {
    if (isFirebaseConfigured()) {
      try {
        const created = await projectService.create(project);
        return { success: true, data: created };
      } catch (err) {
        console.warn('Firestore project create failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: ProjectItemCMS }>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  async updateProject(id: string, project: Partial<ProjectItemCMS>) {
    if (isFirebaseConfigured()) {
      try {
        await projectService.update(id, project);
        return { success: true, data: { ...project, id } as ProjectItemCMS };
      } catch (err) {
        console.warn('Firestore project update failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: ProjectItemCMS }>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },

  async deleteProject(id: string) {
    if (isFirebaseConfigured()) {
      try {
        await projectService.delete(id);
        return { success: true, message: 'Deleted project from Firestore' };
      } catch (err) {
        console.warn('Firestore project delete failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; message: string }>(`/api/admin/projects/${id}`, {
      method: 'DELETE',
    });
  },

  async reorderProjects(ids: string[]) {
    if (isFirebaseConfigured()) {
      try {
        await projectService.reorder(ids);
        return { success: true, message: 'Reordered projects in Firestore' };
      } catch (err) {
        console.warn('Firestore project reorder failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; message: string }>('/api/admin/projects/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
  },

  // ---------------------------------------------------------
  // COMPANY & ABOUT US (Connected to Firestore)
  // ---------------------------------------------------------
  async getCompany() {
    if (isFirebaseConfigured()) {
      try {
        const data = await aboutService.getCompanySettings();
        if (data) {
          return { success: true, data };
        }
      } catch (err) {
        console.warn('Firestore company fetch failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: CompanySettingsCMS }>('/api/admin/company');
  },

  async updateCompany(company: Partial<CompanySettingsCMS>) {
    if (isFirebaseConfigured()) {
      try {
        await aboutService.saveCompanySettings(company);
        return { success: true, data: company as CompanySettingsCMS };
      } catch (err) {
        console.warn('Firestore company save failed, falling back to API:', err);
      }
    }
    return request<{ success: boolean; data: CompanySettingsCMS }>('/api/admin/company', {
      method: 'PUT',
      body: JSON.stringify(company),
    });
  },

  // Services
  async getServices() {
    return request<{ success: boolean; data: ServiceItemCMS[] }>('/api/admin/services');
  },
  async createService(service: Partial<ServiceItemCMS>) {
    return request<{ success: boolean; data: ServiceItemCMS }>('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  },
  async updateService(id: string, service: Partial<ServiceItemCMS>) {
    return request<{ success: boolean; data: ServiceItemCMS }>(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  },
  async deleteService(id: string) {
    return request<{ success: boolean; message: string }>(`/api/admin/services/${id}`, {
      method: 'DELETE',
    });
  },
  async reorderServices(ids: string[]) {
    return request<{ success: boolean; message: string }>('/api/admin/services/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
  },

  // Homepage
  async getHomepage() {
    return request<{ success: boolean; data: HomepageContentCMS }>('/api/admin/homepage');
  },
  async updateHomepage(homepage: Partial<HomepageContentCMS>) {
    return request<{ success: boolean; data: HomepageContentCMS }>('/api/admin/homepage', {
      method: 'PUT',
      body: JSON.stringify(homepage),
    });
  },

  // Internships
  async getInternships() {
    return request<{
      success: boolean;
      data: {
        program: InternshipProgramCMS;
        interns: InternMemberCMS[];
      };
    }>('/api/admin/internships');
  },
  async updateInternshipProgram(program: Partial<InternshipProgramCMS>) {
    return request<{ success: boolean; data: InternshipProgramCMS }>('/api/admin/internships/program', {
      method: 'PUT',
      body: JSON.stringify(program),
    });
  },
  async createIntern(intern: Partial<InternMemberCMS>) {
    return request<{ success: boolean; data: InternMemberCMS }>('/api/admin/internships/interns', {
      method: 'POST',
      body: JSON.stringify(intern),
    });
  },
  async updateIntern(id: string, intern: Partial<InternMemberCMS>) {
    return request<{ success: boolean; data: InternMemberCMS }>(`/api/admin/internships/interns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(intern),
    });
  },
  async deleteIntern(id: string) {
    return request<{ success: boolean; message: string }>(`/api/admin/internships/interns/${id}`, {
      method: 'DELETE',
    });
  },

  // Inquiries
  async getInquiries() {
    return request<{ success: boolean; data: any[] }>('/api/admin/inquiries');
  },
  async updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'resolved') {
    return request<{ success: boolean; data: any }>(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Audit Logs
  async getAuditLogs() {
    return request<{ success: boolean; data: AuditLogCMS[] }>('/api/admin/audit-logs');
  },
};
