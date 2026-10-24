import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  X,
  MapPin,
  Calendar,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { ProjectItemCMS } from '../../types/cms';
import { MediaUploader } from '../components/MediaUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export const AdminProjectsPage: React.FC = () => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<ProjectItemCMS[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItemCMS> | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ProjectItemCMS | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categories = [
    { tag: 'exterior', label: 'Exterior & Architecture' },
    { tag: 'handover', label: 'Handover & Celebrations' },
    { tag: 'interior', label: 'Interior & Finishes' },
    { tag: 'office', label: 'Office & Facilities' },
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProjects();
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed loading projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      category: 'Residential Architecture',
      categoryTag: 'exterior',
      imageSrc: '',
      additionalImages: [],
      aspectRatio: 'landscape',
      description: '',
      location: 'Tuticorin',
      year: String(new Date().getFullYear()),
      isFeatured: true,
      published: true,
      displayOrder: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItemCMS) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title?.trim() || !editingProject.imageSrc) {
      showToast('Project title and cover photo are required.', 'error');
      return;
    }

    setModalSaving(true);
    try {
      if (editingProject.id && projects.some(p => p.id === editingProject.id)) {
        // Edit existing
        const res = await adminApi.updateProject(editingProject.id, editingProject);
        if (res.success) {
          setProjects(prev => prev.map(p => p.id === editingProject.id ? res.data : p));
          showToast('Project updated successfully', 'success');
        }
      } else {
        // Create new
        const res = await adminApi.createProject(editingProject);
        if (res.success) {
          setProjects(prev => [...prev, res.data]);
          showToast('Project created successfully', 'success');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving project', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleTogglePublished = async (project: ProjectItemCMS) => {
    try {
      const updated = { ...project, published: !project.published };
      const res = await adminApi.updateProject(project.id, updated);
      if (res.success) {
        setProjects(prev => prev.map(p => p.id === project.id ? res.data : p));
        showToast(`${project.title} visibility updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating project', 'error');
    }
  };

  const handleToggleFeatured = async (project: ProjectItemCMS) => {
    try {
      const updated = { ...project, isFeatured: !project.isFeatured };
      const res = await adminApi.updateProject(project.id, updated);
      if (res.success) {
        setProjects(prev => prev.map(p => p.id === project.id ? res.data : p));
        showToast(`${project.title} featured status updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating project', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminApi.deleteProject(deleteTarget.id);
      if (res.success) {
        setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
        showToast('Project deleted permanently', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting project', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setProjects(newProjects);
    try {
      await adminApi.reorderProjects(newProjects.map(p => p.id));
      showToast('Projects reordered', 'success');
    } catch {
      showToast('Failed to save order', 'error');
      fetchProjects();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Project Portfolio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage completed construction works, architectural elevations, and key handovers.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
          <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No projects added yet</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add New Project" to add your first portfolio item.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Cover & Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location / Year</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {projects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Order Controls */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-slate-500 w-4 text-center">{idx + 1}</span>
                        <button
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === projects.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Cover & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.imageSrc}
                          alt={project.title}
                          className="w-14 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as any).src = '/images/project-residential-elevation.jpg';
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-sm">{project.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">{project.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#123B68] text-[10px] font-bold">
                        {project.category}
                      </span>
                    </td>

                    {/* Location & Year */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-600 font-medium">
                        {project.location || 'Tamil Nadu'} {project.year ? `(${project.year})` : ''}
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          project.isFeatured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={project.isFeatured ? 'Featured on Home Page' : 'Click to feature on Home'}
                      >
                        <Star className={`w-4 h-4 ${project.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(project)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          project.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {project.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{project.published ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 text-slate-500 hover:text-[#123B68] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingProject.id ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure project details, cover photograph, and categorization</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Media Uploader */}
              <MediaUploader
                label="Cover Image *"
                value={editingProject.imageSrc || ''}
                folder="projects"
                assetId={(editingProject as any).imageAssetId || (editingProject as any).cloudinaryPublicId}
                onChange={(url, _isExt, assetId) => setEditingProject(prev => ({
                  ...prev!,
                  imageSrc: url,
                  ...(assetId ? { imageAssetId: assetId, cloudinaryPublicId: assetId } : {}),
                }))}
                aspectRatioHint="Landscape 16:9 or Portrait 3:4"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject(prev => ({ ...prev!, title: e.target.value }))}
                  placeholder="e.g. Modern Residential Elevation & Architectural Lighting"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category Label</label>
                  <input
                    type="text"
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject(prev => ({ ...prev!, category: e.target.value }))}
                    placeholder="e.g. Residential Architecture"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category Filter Tag</label>
                  <select
                    value={editingProject.categoryTag || 'exterior'}
                    onChange={(e) => setEditingProject(prev => ({ ...prev!, categoryTag: e.target.value as any }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6] bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.tag} value={c.tag}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Aspect Ratio</label>
                  <select
                    value={editingProject.aspectRatio || 'landscape'}
                    onChange={(e) => setEditingProject(prev => ({ ...prev!, aspectRatio: e.target.value as any }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6] bg-white"
                  >
                    <option value="landscape">Landscape (Horizontal)</option>
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject(prev => ({ ...prev!, location: e.target.value }))}
                    placeholder="e.g. Tuticorin"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject(prev => ({ ...prev!, year: e.target.value }))}
                    placeholder="e.g. 2025"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject(prev => ({ ...prev!, description: e.target.value }))}
                  placeholder="Architectural view, materials used, client celebration details..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured || false}
                    onChange={(e) => setEditingProject(prev => ({ ...prev!, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProject.published !== false}
                    onChange={(e) => setEditingProject(prev => ({ ...prev!, published: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Publish to Public Website</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#123B68] hover:bg-[#0E2E52] rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {modalSaving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Project Portfolio Item"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will remove the project from both the Home and Projects pages.`}
        confirmLabel="Delete Project"
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
