import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Shield,
  ArrowUp,
  ArrowDown,
  X,
  Check,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { TeamMemberCMS } from '../../types/cms';
import { MediaUploader } from '../components/MediaUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export const AdminTeamPage: React.FC = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMemberCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMemberCMS> | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberCMS | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const departments = [
    'all',
    'Executive Leadership & Engineering',
    'Civil Engineering & Site Operations',
    'Architecture & Spatial Planning',
    'Tendering & Contracts',
  ];

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTeam();
      if (res.success && Array.isArray(res.data)) {
        setTeam(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load team', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenAddModal = () => {
    setEditingMember({
      name: '',
      role: '',
      department: 'Civil Engineering & Site Operations',
      qualification: '',
      experience: '',
      location: 'Tuticorin',
      specialization: '',
      bio: '',
      responsibilities: [''],
      keyProjects: [''],
      image: '/images/team/founder.jpeg',
      quote: '',
      isLeadership: false,
      featuredInSpotlight: false,
      published: true,
      displayOrder: team.length + 1,
      socials: { linkedin: '', email: '', phone: '' },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMemberCMS) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name?.trim() || !editingMember.role?.trim()) {
      showToast('Name and designation are required.', 'error');
      return;
    }

    setModalSaving(true);
    try {
      // Filter out empty bullet points
      const payload: Partial<TeamMemberCMS> = {
        ...editingMember,
        responsibilities: (editingMember.responsibilities || []).filter(r => r.trim().length > 0),
        keyProjects: (editingMember.keyProjects || []).filter(p => p.trim().length > 0),
      };

      if (editingMember.id) {
        // Edit existing
        const res = await adminApi.updateTeamMember(editingMember.id, payload);
        if (res.success) {
          setTeam(prev => prev.map(m => m.id === editingMember.id ? res.data : m));
          showToast('Team member updated successfully', 'success');
        }
      } else {
        // Create new
        const res = await adminApi.createTeamMember(payload);
        if (res.success) {
          setTeam(prev => [...prev, res.data]);
          showToast('New team member added successfully', 'success');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving team member', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleTogglePublished = async (member: TeamMemberCMS) => {
    try {
      const updated = { ...member, published: !member.published };
      const res = await adminApi.updateTeamMember(member.id, updated);
      if (res.success) {
        setTeam(prev => prev.map(m => m.id === member.id ? res.data : m));
        showToast(`${member.name} visibility updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating visibility', 'error');
    }
  };

  const handleToggleSpotlight = async (member: TeamMemberCMS) => {
    try {
      const updated = { ...member, featuredInSpotlight: !member.featuredInSpotlight };
      const res = await adminApi.updateTeamMember(member.id, updated);
      if (res.success) {
        setTeam(prev => prev.map(m => m.id === member.id ? res.data : m));
        showToast(`${member.name} spotlight status updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating spotlight', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminApi.deleteTeamMember(deleteTarget.id);
      if (res.success) {
        setTeam(prev => prev.filter(m => m.id !== deleteTarget.id));
        showToast('Team member deleted permanently', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting member', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const newTeam = [...team];
    const temp = newTeam[index];
    newTeam[index] = newTeam[targetIndex];
    newTeam[targetIndex] = temp;

    setTeam(newTeam);
    try {
      await adminApi.reorderTeam(newTeam.map(t => t.id));
      showToast('Order updated', 'success');
    } catch {
      showToast('Failed to save order', 'error');
      fetchTeam(); // rollback
    }
  };

  // Filtered list
  const filteredTeam = team.filter((m) => {
    const matchesDept = selectedDept === 'all' || m.department === selectedDept;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.specialization.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Team & Staff Profiles</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company workers, engineers, architects, and spotlight leadership displayed on the About page.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, designation, specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2468A6] bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-[#123B68] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
          <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading team roster...</p>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No team members match your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or add a new team profile.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Department & Details</th>
                  <th className="py-3.5 px-4 text-center">Spotlight</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTeam.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
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
                          disabled={idx === team.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Member Photo & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as any).src = '/images/team/founder.jpeg';
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900">{member.name}</div>
                          <div className="text-[11px] text-slate-500">{member.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Qualifications */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#EBF4FC] text-[#123B68] text-[10px] font-bold">
                          {member.department}
                        </span>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {member.qualification || member.specialization}
                        </div>
                      </div>
                    </td>

                    {/* Spotlight Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleSpotlight(member)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          member.featuredInSpotlight
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={member.featuredInSpotlight ? 'Featured on Home Spotlight' : 'Click to feature on Home'}
                      >
                        <Star className={`w-4 h-4 ${member.featuredInSpotlight ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(member)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          member.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {member.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{member.published ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className="p-1.5 text-slate-500 hover:text-[#123B68] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit member profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(member)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete profile"
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

      {/* Edit / Add Modal */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingMember.id ? 'Edit Team Profile' : 'Add New Team Member'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure public profile details, photograph, and role</p>
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
            <form onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Profile Photograph Uploader */}
              <MediaUploader
                label="Profile Photograph"
                value={editingMember.image || ''}
                folder="employees"
                assetId={(editingMember as any).imageAssetId}
                onChange={(url, _isExternal, assetId) =>
                  setEditingMember(prev => ({
                    ...prev!,
                    image: url,
                    ...(assetId ? { imageAssetId: assetId } : {}),
                  }))
                }
                aspectRatioHint="Square 1:1 or Portrait 3:4"
              />

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, name: e.target.value }))}
                    placeholder="e.g. Er. M. Rajesh"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.role || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, role: e.target.value }))}
                    placeholder="e.g. Senior Site Execution Engineer"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                  <select
                    value={editingMember.department}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, department: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6] bg-white"
                  >
                    {departments.filter(d => d !== 'all').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={editingMember.qualification || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, qualification: e.target.value }))}
                    placeholder="e.g. B.Arch, B.E. Civil, Council Reg."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience</label>
                  <input
                    type="text"
                    value={editingMember.experience || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, experience: e.target.value }))}
                    placeholder="e.g. 10+ Years Experience"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Office / Location</label>
                  <input
                    type="text"
                    value={editingMember.location || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, location: e.target.value }))}
                    placeholder="e.g. Tuticorin Project Sites"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization</label>
                <input
                  type="text"
                  value={editingMember.specialization || ''}
                  onChange={(e) => setEditingMember(prev => ({ ...prev!, specialization: e.target.value }))}
                  placeholder="e.g. RCC Detailing, Seismic Load Resistance & Structural Analysis"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember(prev => ({ ...prev!, bio: e.target.value }))}
                  placeholder="Brief description of experience and contribution..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Key Responsibilities</label>
                  <button
                    type="button"
                    onClick={() => setEditingMember(prev => ({
                      ...prev!,
                      responsibilities: [...(prev?.responsibilities || []), ''],
                    }))}
                    className="text-[11px] font-bold text-[#2468A6] hover:underline cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {(editingMember.responsibilities || []).map((resp, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => {
                          const updated = [...(editingMember.responsibilities || [])];
                          updated[i] = e.target.value;
                          setEditingMember(prev => ({ ...prev!, responsibilities: updated }));
                        }}
                        placeholder={`Responsibility #${i + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingMember.responsibilities || []).filter((_, idx) => idx !== i);
                          setEditingMember(prev => ({ ...prev!, responsibilities: updated }));
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingMember.isLeadership || false}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, isLeadership: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Executive Leadership</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingMember.featuredInSpotlight || false}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, featuredInSpotlight: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Spotlight on Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingMember.published !== false}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, published: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Public Visibility</span>
                </label>
              </div>

              {/* Modal Footer Buttons */}
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
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Permanently Delete Team Profile"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone and will remove their profile from the public About and Leadership sections.`}
        confirmLabel="Delete Member"
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
