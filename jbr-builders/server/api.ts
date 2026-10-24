import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import contactHandler from '../api/contact';
import {
  getDatabase,
  saveDatabase,
  addAuditLog,
} from './db';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  isCloudinaryConfigured,
  type ValidCloudinaryFolder,
} from './cloudinary';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  signToken,
  verifyToken,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  type TokenPayload,
} from './auth';
import type {
  TeamMemberCMS,
  ServiceItemCMS,
  ProjectItemCMS,
  GalleryItemCMS,
  InternMemberCMS,
  CompanySettingsCMS,
  HomepageContentCMS,
  InternshipProgramCMS,
} from '../src/types/cms';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Helper to send JSON responses
function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Helper to send Error responses
function sendError(res: ServerResponse, statusCode: number, message: string) {
  sendJson(res, statusCode, { success: false, error: message });
}

// Helper to parse JSON request body
async function parseJsonBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // 15MB limit for JSON bodies (supports base64 image uploads)
      if (body.length > 15 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!body) resolve({} as T);
        else resolve(JSON.parse(body) as T);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

// Helper to extract authenticated user from Authorization header
function authenticateRequest(req: IncomingMessage): TokenPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Main API Dispatcher function
export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method?.toUpperCase() || 'GET';

  // Only handle /api/* requests
  if (!pathname.startsWith('/api/')) {
    return false;
  }

  // Set standard CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  try {
    // ==========================================
    // 1. PUBLIC ENDPOINTS (No Auth Required)
    // ==========================================

    // Resend Contact & Quote Email Dispatcher
    if (pathname === '/api/contact' && (method === 'POST' || method === 'OPTIONS')) {
      await contactHandler(req, res);
      return true;
    }

    // Consolidated public content bundle (for instant frontend hydration)
    if (pathname === '/api/public/content' && method === 'GET') {
      const db = getDatabase();
      const payload = {
        company: db.company,
        services: db.services.filter(s => s.published !== false).sort((a, b) => a.displayOrder - b.displayOrder),
        projects: db.projects.filter(p => p.published !== false).sort((a, b) => a.displayOrder - b.displayOrder),
        gallery: db.gallery.filter(g => g.published !== false).sort((a, b) => a.displayOrder - b.displayOrder),
        team: db.team.filter(t => t.published !== false).sort((a, b) => a.displayOrder - b.displayOrder),
        interns: db.interns.filter(i => i.published !== false).sort((a, b) => a.displayOrder - b.displayOrder),
        internshipProgram: db.internshipProgram,
        homepage: db.homepage,
      };
      sendJson(res, 200, { success: true, data: payload });
      return true;
    }

    if (pathname === '/api/public/company' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.company });
      return true;
    }

    if (pathname === '/api/public/services' && method === 'GET') {
      const db = getDatabase();
      const active = db.services.filter(s => s.published !== false).sort((a, b) => a.displayOrder - b.displayOrder);
      sendJson(res, 200, { success: true, data: active });
      return true;
    }

    if (pathname === '/api/public/projects' && method === 'GET') {
      const db = getDatabase();
      const active = db.projects.filter(p => p.published !== false).sort((a, b) => a.displayOrder - b.displayOrder);
      sendJson(res, 200, { success: true, data: active });
      return true;
    }

    if (pathname === '/api/public/gallery' && method === 'GET') {
      const db = getDatabase();
      const active = db.gallery.filter(g => g.published !== false).sort((a, b) => a.displayOrder - b.displayOrder);
      sendJson(res, 200, { success: true, data: active });
      return true;
    }

    if (pathname === '/api/public/team' && method === 'GET') {
      const db = getDatabase();
      const active = db.team.filter(t => t.published !== false).sort((a, b) => a.displayOrder - b.displayOrder);
      sendJson(res, 200, { success: true, data: active });
      return true;
    }

    if (pathname === '/api/public/internships' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, {
        success: true,
        data: {
          program: db.internshipProgram,
          interns: db.interns.filter(i => i.published !== false).sort((a, b) => a.displayOrder - b.displayOrder),
        }
      });
      return true;
    }

    if (pathname === '/api/public/homepage' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.homepage });
      return true;
    }

    // Public inquiry submission (Contact form & Quote consultation)
    if (pathname === '/api/public/inquiry' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.name || !body.phone) {
        sendError(res, 400, 'Name and phone number are required.');
        return true;
      }
      const db = getDatabase();
      const newInquiry = {
        id: `inq-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: String(body.email || '').trim(),
        service: String(body.service || 'General Inquiry').trim(),
        message: String(body.message || '').trim(),
        createdAt: new Date().toISOString(),
        status: 'new' as const,
      };
      db.inquiries.unshift(newInquiry);
      saveDatabase(db);
      sendJson(res, 201, { success: true, message: 'Inquiry received successfully.', inquiryId: newInquiry.id });
      return true;
    }

    // ==========================================
    // 2. ADMIN AUTHENTICATION
    // ==========================================

    // Admin Login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      const body = await parseJsonBody(req);
      const username = String(body.username || '').trim();
      const password = String(body.password || '');
      const rememberMe = Boolean(body.rememberMe);

      if (!username || !password) {
        sendError(res, 400, 'Username and password are required.');
        return true;
      }

      // Check Rate Limit
      const rateCheck = checkRateLimit(`${ip}:${username}`);
      if (!rateCheck.allowed) {
        sendError(res, 429, `Too many failed login attempts. Please wait ${rateCheck.waitMinutes} minutes before trying again.`);
        return true;
      }

      const db = getDatabase();
      const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase());

      if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
        recordFailedAttempt(`${ip}:${username}`);
        sendError(res, 401, 'Invalid username or password.');
        return true;
      }

      // Successful login
      resetRateLimit(`${ip}:${username}`);
      user.lastLogin = new Date().toISOString();
      saveDatabase(db);

      // 7 days token for remember me, 24 hours otherwise
      const expiresIn = rememberMe ? 7 * 24 * 3600 : 24 * 3600;
      const token = signToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      }, expiresIn);

      addAuditLog('LOGIN', 'USER', user.id, user.username, `Successful login from ${ip}`);

      sendJson(res, 200, {
        success: true,
        message: 'Authentication successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        }
      });
      return true;
    }

    // Admin Session Verify
    if (pathname === '/api/admin/me' && method === 'GET') {
      const auth = authenticateRequest(req);
      if (!auth) {
        sendError(res, 401, 'Unauthorized session. Please log in.');
        return true;
      }
      const db = getDatabase();
      const user = db.users.find(u => u.id === auth.userId);
      if (!user) {
        sendError(res, 401, 'User account no longer exists.');
        return true;
      }
      sendJson(res, 200, {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        }
      });
      return true;
    }

    // Admin Logout
    if (pathname === '/api/admin/logout' && method === 'POST') {
      const auth = authenticateRequest(req);
      if (auth) {
        addAuditLog('LOGOUT', 'USER', auth.userId, auth.username, 'Admin logged out');
      }
      sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
      return true;
    }

    // Admin Change Password
    if (pathname === '/api/admin/change-password' && method === 'POST') {
      const auth = authenticateRequest(req);
      if (!auth) {
        sendError(res, 401, 'Unauthorized');
        return true;
      }
      const body = await parseJsonBody(req);
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        sendError(res, 400, 'Current and new passwords are required.');
        return true;
      }
      if (newPassword.length < 8) {
        sendError(res, 400, 'New password must be at least 8 characters long.');
        return true;
      }

      const db = getDatabase();
      const user = db.users.find(u => u.id === auth.userId);
      if (!user) {
        sendError(res, 404, 'User not found.');
        return true;
      }

      if (!verifyPassword(currentPassword, user.passwordHash, user.salt)) {
        sendError(res, 400, 'Current password is incorrect.');
        return true;
      }

      const newSalt = generateSalt();
      user.salt = newSalt;
      user.passwordHash = hashPassword(newPassword, newSalt);
      saveDatabase(db);

      addAuditLog('CHANGE_PASSWORD', 'USER', user.id, user.username, 'Password updated');
      sendJson(res, 200, { success: true, message: 'Password updated successfully.' });
      return true;
    }

    // ==========================================
    // 3. PROTECTED ADMIN CMS ENDPOINTS
    // ==========================================

    // Ensure all endpoints below require valid admin token
    const authUser = authenticateRequest(req);
    if (!authUser) {
      sendError(res, 401, 'Unauthorized access. Authentication token required.');
      return true;
    }

    // ------------------------------------------
    // A. Dashboard Statistics & Overview
    // ------------------------------------------
    if (pathname === '/api/admin/stats' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, {
        success: true,
        data: {
          teamCount: db.team.length,
          publishedTeamCount: db.team.filter(t => t.published).length,
          servicesCount: db.services.length,
          projectsCount: db.projects.length,
          galleryCount: db.gallery.length,
          internsCount: db.interns.length,
          inquiriesCount: db.inquiries.length,
          newInquiriesCount: db.inquiries.filter(i => i.status === 'new').length,
          recentAuditLogs: db.auditLogs.slice(0, 5),
        }
      });
      return true;
    }

    // ------------------------------------------
    // B. Media Upload & Management (Cloudinary)
    // ------------------------------------------
    if (pathname === '/api/admin/upload' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { filename, base64Data, mimeType, folder = 'gallery' } = body;

      if (!base64Data) {
        sendError(res, 400, 'Invalid file payload: base64Data is required.');
        return true;
      }

      // Check if Cloudinary is configured
      if (isCloudinaryConfigured()) {
        try {
          const targetFolder = (['about', 'employees', 'gallery', 'projects'].includes(folder)
            ? folder
            : 'gallery') as ValidCloudinaryFolder;

          const cloudResult = await uploadImageToCloudinary(base64Data, targetFolder);
          addAuditLog(
            'UPLOAD_MEDIA',
            'CLOUDINARY',
            cloudResult.publicId,
            authUser.username,
            `Uploaded ${filename || cloudResult.publicId} to ${targetFolder}`
          );

          sendJson(res, 201, {
            success: true,
            url: cloudResult.secureUrl,
            secureUrl: cloudResult.secureUrl,
            publicId: cloudResult.publicId,
            assetId: cloudResult.assetId,
            filename: cloudResult.publicId,
            size: cloudResult.bytes,
          });
          return true;
        } catch (cloudErr: any) {
          console.error('Cloudinary upload error:', cloudErr);
          sendError(res, 500, `Cloudinary upload failed: ${cloudErr.message}`);
          return true;
        }
      }

      // Fallback to local storage if Cloudinary credentials are not yet configured in local dev
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const fileBuffer = Buffer.from(cleanBase64, 'base64');

      if (fileBuffer.length > 10 * 1024 * 1024) {
        sendError(res, 400, 'File exceeds maximum 10MB limit.');
        return true;
      }

      let ext = '.jpg';
      if (mimeType?.includes('png')) ext = '.png';
      else if (mimeType?.includes('webp')) ext = '.webp';

      const uniqueName = `upload-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
      const destPath = path.join(UPLOADS_DIR, uniqueName);

      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      fs.writeFileSync(destPath, fileBuffer);

      const publicUrl = `/uploads/${uniqueName}`;
      addAuditLog('UPLOAD_MEDIA', 'LOCAL_STORAGE', uniqueName, authUser.username, `Uploaded ${filename || uniqueName}`);

      sendJson(res, 201, {
        success: true,
        url: publicUrl,
        secureUrl: publicUrl,
        publicId: uniqueName,
        assetId: uniqueName,
        filename: uniqueName,
        size: fileBuffer.length,
      });
      return true;
    }

    // Media Deletion Handler (Cloudinary)
    if (pathname === '/api/admin/media/delete' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { publicId } = body;

      if (!publicId) {
        sendError(res, 400, 'publicId is required to delete media.');
        return true;
      }

      if (isCloudinaryConfigured()) {
        try {
          const deleteRes = await deleteImageFromCloudinary(publicId);
          addAuditLog('DELETE_MEDIA', 'CLOUDINARY', publicId, authUser.username, `Deleted Cloudinary asset ${publicId}`);
          sendJson(res, 200, { success: true, result: deleteRes.result });
          return true;
        } catch (err: any) {
          console.error('Cloudinary delete error:', err);
          sendError(res, 500, `Failed to delete from Cloudinary: ${err.message}`);
          return true;
        }
      }

      // Local fallback removal
      const localPath = path.join(UPLOADS_DIR, publicId);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      sendJson(res, 200, { success: true, message: 'Local media removed' });
      return true;
    }

    // ------------------------------------------
    // C. Team & Employee Management
    // ------------------------------------------
    if (pathname === '/api/admin/team' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.team.sort((a, b) => a.displayOrder - b.displayOrder) });
      return true;
    }

    if (pathname === '/api/admin/team' && method === 'POST') {
      const body = await parseJsonBody<Partial<TeamMemberCMS>>(req);
      if (!body.name || !body.role) {
        sendError(res, 400, 'Name and role are required for team members.');
        return true;
      }
      const db = getDatabase();
      const newMember: TeamMemberCMS = {
        id: `emp-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
        name: body.name.trim(),
        role: body.role.trim(),
        department: body.department || 'Civil Engineering & Site Operations',
        qualification: body.qualification || '',
        experience: body.experience || '',
        location: body.location || 'Headquarters: Tuticorin',
        specialization: body.specialization || '',
        bio: body.bio || '',
        responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
        keyProjects: Array.isArray(body.keyProjects) ? body.keyProjects : [],
        image: body.image || '/images/team/founder.jpeg',
        quote: body.quote || '',
        isLeadership: Boolean(body.isLeadership),
        featuredInSpotlight: Boolean(body.featuredInSpotlight),
        published: body.published !== false,
        displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : db.team.length + 1,
        socials: body.socials || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.team.push(newMember);
      saveDatabase(db);
      addAuditLog('CREATE_TEAM_MEMBER', 'TEAM', newMember.id, authUser.username, `Added ${newMember.name}`);
      sendJson(res, 201, { success: true, data: newMember });
      return true;
    }

    if (pathname.startsWith('/api/admin/team/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/team/', '');
      const body = await parseJsonBody<Partial<TeamMemberCMS>>(req);
      const db = getDatabase();
      const index = db.team.findIndex(t => t.id === id);
      if (index === -1) {
        sendError(res, 404, 'Team member not found.');
        return true;
      }
      db.team[index] = {
        ...db.team[index],
        ...body,
        id, // preserve ID
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_TEAM_MEMBER', 'TEAM', id, authUser.username, `Updated ${db.team[index].name}`);
      sendJson(res, 200, { success: true, data: db.team[index] });
      return true;
    }

    if (pathname.startsWith('/api/admin/team/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/team/', '');
      const db = getDatabase();
      const member = db.team.find(t => t.id === id);
      if (!member) {
        sendError(res, 404, 'Team member not found.');
        return true;
      }
      db.team = db.team.filter(t => t.id !== id);
      saveDatabase(db);
      addAuditLog('DELETE_TEAM_MEMBER', 'TEAM', id, authUser.username, `Deleted ${member.name}`);
      sendJson(res, 200, { success: true, message: 'Team member deleted successfully.' });
      return true;
    }

    if (pathname === '/api/admin/team/reorder' && method === 'PATCH') {
      const body = await parseJsonBody<{ ids: string[] }>(req);
      if (!Array.isArray(body.ids)) {
        sendError(res, 400, 'Array of IDs required for reordering.');
        return true;
      }
      const db = getDatabase();
      body.ids.forEach((id, idx) => {
        const item = db.team.find(t => t.id === id);
        if (item) item.displayOrder = idx + 1;
      });
      saveDatabase(db);
      sendJson(res, 200, { success: true, message: 'Team reordered successfully.' });
      return true;
    }

    // ------------------------------------------
    // D. Services Management
    // ------------------------------------------
    if (pathname === '/api/admin/services' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.services.sort((a, b) => a.displayOrder - b.displayOrder) });
      return true;
    }

    if (pathname === '/api/admin/services' && method === 'POST') {
      const body = await parseJsonBody<Partial<ServiceItemCMS>>(req);
      if (!body.title) {
        sendError(res, 400, 'Service title is required.');
        return true;
      }
      const db = getDatabase();
      const slug = body.id || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newService: ServiceItemCMS = {
        id: slug || `service-${Date.now()}`,
        title: body.title.trim(),
        description: body.description || '',
        iconName: body.iconName || 'Building2',
        features: Array.isArray(body.features) ? body.features : [],
        image: body.image || '',
        displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : db.services.length + 1,
        published: body.published !== false,
        quoteSubject: body.quoteSubject || body.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.services.push(newService);
      saveDatabase(db);
      addAuditLog('CREATE_SERVICE', 'SERVICE', newService.id, authUser.username, `Added ${newService.title}`);
      sendJson(res, 201, { success: true, data: newService });
      return true;
    }

    if (pathname.startsWith('/api/admin/services/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/services/', '');
      const body = await parseJsonBody<Partial<ServiceItemCMS>>(req);
      const db = getDatabase();
      const index = db.services.findIndex(s => s.id === id);
      if (index === -1) {
        sendError(res, 404, 'Service not found.');
        return true;
      }
      db.services[index] = {
        ...db.services[index],
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_SERVICE', 'SERVICE', id, authUser.username, `Updated ${db.services[index].title}`);
      sendJson(res, 200, { success: true, data: db.services[index] });
      return true;
    }

    if (pathname.startsWith('/api/admin/services/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/services/', '');
      const db = getDatabase();
      const service = db.services.find(s => s.id === id);
      if (!service) {
        sendError(res, 404, 'Service not found.');
        return true;
      }
      db.services = db.services.filter(s => s.id !== id);
      saveDatabase(db);
      addAuditLog('DELETE_SERVICE', 'SERVICE', id, authUser.username, `Deleted ${service.title}`);
      sendJson(res, 200, { success: true, message: 'Service deleted successfully.' });
      return true;
    }

    if (pathname === '/api/admin/services/reorder' && method === 'PATCH') {
      const body = await parseJsonBody<{ ids: string[] }>(req);
      if (!Array.isArray(body.ids)) {
        sendError(res, 400, 'Array of IDs required.');
        return true;
      }
      const db = getDatabase();
      body.ids.forEach((id, idx) => {
        const item = db.services.find(s => s.id === id);
        if (item) item.displayOrder = idx + 1;
      });
      saveDatabase(db);
      sendJson(res, 200, { success: true, message: 'Services reordered successfully.' });
      return true;
    }

    // ------------------------------------------
    // E. Projects Portfolio Management
    // ------------------------------------------
    if (pathname === '/api/admin/projects' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.projects.sort((a, b) => a.displayOrder - b.displayOrder) });
      return true;
    }

    if (pathname === '/api/admin/projects' && method === 'POST') {
      const body = await parseJsonBody<Partial<ProjectItemCMS>>(req);
      if (!body.title || !body.imageSrc) {
        sendError(res, 400, 'Title and cover image are required for projects.');
        return true;
      }
      const db = getDatabase();
      const slug = body.id || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProject: ProjectItemCMS = {
        id: slug || `project-${Date.now()}`,
        title: body.title.trim(),
        category: body.category || 'Residential Architecture',
        categoryTag: (body.categoryTag as any) || 'exterior',
        imageSrc: body.imageSrc,
        additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages : [],
        aspectRatio: (body.aspectRatio as any) || 'landscape',
        description: body.description || '',
        location: body.location || 'Tuticorin',
        year: body.year || String(new Date().getFullYear()),
        displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : db.projects.length + 1,
        published: body.published !== false,
        isFeatured: Boolean(body.isFeatured),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.projects.push(newProject);
      saveDatabase(db);
      addAuditLog('CREATE_PROJECT', 'PROJECT', newProject.id, authUser.username, `Added ${newProject.title}`);
      sendJson(res, 201, { success: true, data: newProject });
      return true;
    }

    if (pathname.startsWith('/api/admin/projects/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/projects/', '');
      const body = await parseJsonBody<Partial<ProjectItemCMS>>(req);
      const db = getDatabase();
      const index = db.projects.findIndex(p => p.id === id);
      if (index === -1) {
        sendError(res, 404, 'Project not found.');
        return true;
      }
      db.projects[index] = {
        ...db.projects[index],
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_PROJECT', 'PROJECT', id, authUser.username, `Updated ${db.projects[index].title}`);
      sendJson(res, 200, { success: true, data: db.projects[index] });
      return true;
    }

    if (pathname.startsWith('/api/admin/projects/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/projects/', '');
      const db = getDatabase();
      const project = db.projects.find(p => p.id === id);
      if (!project) {
        sendError(res, 404, 'Project not found.');
        return true;
      }
      db.projects = db.projects.filter(p => p.id !== id);
      saveDatabase(db);
      addAuditLog('DELETE_PROJECT', 'PROJECT', id, authUser.username, `Deleted ${project.title}`);
      sendJson(res, 200, { success: true, message: 'Project deleted successfully.' });
      return true;
    }

    if (pathname === '/api/admin/projects/reorder' && method === 'PATCH') {
      const body = await parseJsonBody<{ ids: string[] }>(req);
      if (!Array.isArray(body.ids)) {
        sendError(res, 400, 'Array of IDs required.');
        return true;
      }
      const db = getDatabase();
      body.ids.forEach((id, idx) => {
        const item = db.projects.find(p => p.id === id);
        if (item) item.displayOrder = idx + 1;
      });
      saveDatabase(db);
      sendJson(res, 200, { success: true, message: 'Projects reordered successfully.' });
      return true;
    }

    // ------------------------------------------
    // F. Gallery Management (Priority Feature)
    // ------------------------------------------
    if (pathname === '/api/admin/gallery' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.gallery.sort((a, b) => a.displayOrder - b.displayOrder) });
      return true;
    }

    if (pathname === '/api/admin/gallery' && method === 'POST') {
      const body = await parseJsonBody<Partial<GalleryItemCMS>>(req);
      if (!body.imageSrc) {
        sendError(res, 400, 'Image source (uploaded or external URL) is required.');
        return true;
      }

      const isExternal = Boolean(body.isExternal || body.imageSrc.startsWith('http://') || body.imageSrc.startsWith('https://'));

      const db = getDatabase();
      const newGalleryItem: GalleryItemCMS = {
        id: `gallery-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
        title: body.title?.trim() || 'Construction Gallery Photo',
        category: body.category || 'Exterior & Architecture',
        categoryTag: (body.categoryTag as any) || 'exterior',
        imageSrc: body.imageSrc,
        isExternal,
        altText: body.altText || body.title || 'JBR Builders construction project photo',
        caption: body.caption || '',
        aspectRatio: (body.aspectRatio as any) || 'landscape',
        isFeatured: Boolean(body.isFeatured),
        published: body.published !== false,
        displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : db.gallery.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.gallery.push(newGalleryItem);
      saveDatabase(db);
      addAuditLog('CREATE_GALLERY_ITEM', 'GALLERY', newGalleryItem.id, authUser.username, `Added gallery image: ${newGalleryItem.title}`);
      sendJson(res, 201, { success: true, data: newGalleryItem });
      return true;
    }

    if (pathname.startsWith('/api/admin/gallery/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/gallery/', '');
      const body = await parseJsonBody<Partial<GalleryItemCMS>>(req);
      const db = getDatabase();
      const index = db.gallery.findIndex(g => g.id === id);
      if (index === -1) {
        sendError(res, 404, 'Gallery item not found.');
        return true;
      }
      db.gallery[index] = {
        ...db.gallery[index],
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_GALLERY_ITEM', 'GALLERY', id, authUser.username, `Updated gallery image: ${db.gallery[index].title}`);
      sendJson(res, 200, { success: true, data: db.gallery[index] });
      return true;
    }

    if (pathname.startsWith('/api/admin/gallery/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/gallery/', '');
      const db = getDatabase();
      const item = db.gallery.find(g => g.id === id);
      if (!item) {
        sendError(res, 404, 'Gallery item not found.');
        return true;
      }
      db.gallery = db.gallery.filter(g => g.id !== id);
      saveDatabase(db);
      addAuditLog('DELETE_GALLERY_ITEM', 'GALLERY', id, authUser.username, `Deleted gallery item: ${item.title}`);
      sendJson(res, 200, { success: true, message: 'Gallery item deleted successfully.' });
      return true;
    }

    if (pathname === '/api/admin/gallery/reorder' && method === 'PATCH') {
      const body = await parseJsonBody<{ ids: string[] }>(req);
      if (!Array.isArray(body.ids)) {
        sendError(res, 400, 'Array of IDs required.');
        return true;
      }
      const db = getDatabase();
      body.ids.forEach((id, idx) => {
        const item = db.gallery.find(g => g.id === id);
        if (item) item.displayOrder = idx + 1;
      });
      saveDatabase(db);
      sendJson(res, 200, { success: true, message: 'Gallery items reordered successfully.' });
      return true;
    }

    // ------------------------------------------
    // G. Homepage Content Management
    // ------------------------------------------
    if (pathname === '/api/admin/homepage' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.homepage });
      return true;
    }

    if (pathname === '/api/admin/homepage' && method === 'PUT') {
      const body = await parseJsonBody<Partial<HomepageContentCMS>>(req);
      const db = getDatabase();
      db.homepage = {
        ...db.homepage,
        ...body,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_HOMEPAGE', 'HOMEPAGE', 'main', authUser.username, 'Homepage content modified');
      sendJson(res, 200, { success: true, data: db.homepage });
      return true;
    }

    // ------------------------------------------
    // H. Internship Management
    // ------------------------------------------
    if (pathname === '/api/admin/internships' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, {
        success: true,
        data: {
          program: db.internshipProgram,
          interns: db.interns.sort((a, b) => a.displayOrder - b.displayOrder),
        }
      });
      return true;
    }

    if (pathname === '/api/admin/internships/program' && method === 'PUT') {
      const body = await parseJsonBody<Partial<InternshipProgramCMS>>(req);
      const db = getDatabase();
      db.internshipProgram = {
        ...db.internshipProgram,
        ...body,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_INTERNSHIP_PROGRAM', 'INTERNSHIP', 'program', authUser.username, 'Updated internship program syllabus/details');
      sendJson(res, 200, { success: true, data: db.internshipProgram });
      return true;
    }

    if (pathname === '/api/admin/internships/interns' && method === 'POST') {
      const body = await parseJsonBody<Partial<InternMemberCMS>>(req);
      if (!body.name || !body.role) {
        sendError(res, 400, 'Intern name and role are required.');
        return true;
      }
      const db = getDatabase();
      const newIntern: InternMemberCMS = {
        id: `intern-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
        name: body.name.trim(),
        role: body.role.trim(),
        institution: body.institution || '',
        degree: body.degree || '',
        duration: body.duration || '',
        mentor: body.mentor || '',
        focusArea: body.focusArea || '',
        learningHighlights: Array.isArray(body.learningHighlights) ? body.learningHighlights : [],
        status: (body.status as any) || 'Active Intern',
        image: body.image || '/images/team/intern-harish-kumar.jpg',
        published: body.published !== false,
        displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : db.interns.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.interns.push(newIntern);
      saveDatabase(db);
      addAuditLog('CREATE_INTERN', 'INTERNSHIP', newIntern.id, authUser.username, `Added intern: ${newIntern.name}`);
      sendJson(res, 201, { success: true, data: newIntern });
      return true;
    }

    if (pathname.startsWith('/api/admin/internships/interns/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/internships/interns/', '');
      const body = await parseJsonBody<Partial<InternMemberCMS>>(req);
      const db = getDatabase();
      const index = db.interns.findIndex(i => i.id === id);
      if (index === -1) {
        sendError(res, 404, 'Intern profile not found.');
        return true;
      }
      db.interns[index] = {
        ...db.interns[index],
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_INTERN', 'INTERNSHIP', id, authUser.username, `Updated intern: ${db.interns[index].name}`);
      sendJson(res, 200, { success: true, data: db.interns[index] });
      return true;
    }

    if (pathname.startsWith('/api/admin/internships/interns/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/internships/interns/', '');
      const db = getDatabase();
      const intern = db.interns.find(i => i.id === id);
      if (!intern) {
        sendError(res, 404, 'Intern profile not found.');
        return true;
      }
      db.interns = db.interns.filter(i => i.id !== id);
      saveDatabase(db);
      addAuditLog('DELETE_INTERN', 'INTERNSHIP', id, authUser.username, `Deleted intern: ${intern.name}`);
      sendJson(res, 200, { success: true, message: 'Intern profile deleted successfully.' });
      return true;
    }

    // ------------------------------------------
    // I. Company & Contact Settings
    // ------------------------------------------
    if (pathname === '/api/admin/company' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.company });
      return true;
    }

    if (pathname === '/api/admin/company' && method === 'PUT') {
      const body = await parseJsonBody<Partial<CompanySettingsCMS>>(req);
      const db = getDatabase();
      db.company = {
        ...db.company,
        ...body,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(db);
      addAuditLog('UPDATE_COMPANY_SETTINGS', 'COMPANY', 'settings', authUser.username, 'Updated company profile, offices or contacts');
      sendJson(res, 200, { success: true, data: db.company });
      return true;
    }

    // ------------------------------------------
    // J. Inquiries & Lead Management
    // ------------------------------------------
    if (pathname === '/api/admin/inquiries' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.inquiries });
      return true;
    }

    if (pathname.startsWith('/api/admin/inquiries/') && method === 'PATCH') {
      const id = pathname.replace('/api/admin/inquiries/', '');
      const body = await parseJsonBody<{ status: 'new' | 'contacted' | 'resolved' }>(req);
      const db = getDatabase();
      const inq = db.inquiries.find(i => i.id === id);
      if (!inq) {
        sendError(res, 404, 'Inquiry not found.');
        return true;
      }
      if (body.status) inq.status = body.status;
      saveDatabase(db);
      sendJson(res, 200, { success: true, data: inq });
      return true;
    }

    // ------------------------------------------
    // K. Audit Logs
    // ------------------------------------------
    if (pathname === '/api/admin/audit-logs' && method === 'GET') {
      const db = getDatabase();
      sendJson(res, 200, { success: true, data: db.auditLogs });
      return true;
    }

    // Unmatched API endpoint
    sendError(res, 404, `API route ${method} ${pathname} not found.`);
    return true;
  } catch (err: any) {
    console.error('API Error:', err);
    sendError(res, 500, err?.message || 'Internal server error');
    return true;
  }
}
