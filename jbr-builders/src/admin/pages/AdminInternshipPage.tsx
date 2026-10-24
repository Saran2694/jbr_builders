import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Save,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  MessageCircle,
  BookOpen,
  Award,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { InternMemberCMS, InternshipProgramCMS } from '../../types/cms';
import { MediaUploader } from '../components/MediaUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export const AdminInternshipPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'program' | 'roster'>('roster');

  const [program, setProgram] = useState<InternshipProgramCMS | null>(null);
  const [interns, setInterns] = useState<InternMemberCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProgram, setSavingProgram] = useState(false);

  // Intern Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState<Partial<InternMemberCMS> | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<InternMemberCMS | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchInternshipData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInternships();
      if (res.success && res.data) {
        setProgram(res.data.program);
        setInterns(res.data.interns || []);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed loading internship data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternshipData();
  }, []);

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    setSavingProgram(true);
    try {
      const res = await adminApi.updateInternshipProgram(program);
      if (res.success) {
        setProgram(res.data);
        showToast('Internship program syllabus & settings saved', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving program settings', 'error');
    } finally {
      setSavingProgram(false);
    }
  };

  const handleOpenAddIntern = () => {
    setEditingIntern({
      name: '',
      role: 'Graduate Civil Engineering Intern',
      institution: '',
      degree: 'B.E. Civil Engineering',
      duration: '3 Months',
      mentor: 'Er. M. Rajesh',
      focusArea: 'Site Leveling & Reinforcement Checks',
      learningHighlights: [''],
      status: 'Active Intern',
      image: '/images/team/intern-harish-kumar.jpg',
      published: true,
      displayOrder: interns.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditIntern = (intern: InternMemberCMS) => {
    setEditingIntern({ ...intern });
    setIsModalOpen(true);
  };

  const handleSaveIntern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIntern || !editingIntern.name?.trim()) {
      showToast('Intern student name is required.', 'error');
      return;
    }

    setModalSaving(true);
    try {
      const payload: Partial<InternMemberCMS> = {
        ...editingIntern,
        learningHighlights: (editingIntern.learningHighlights || []).filter(h => h.trim().length > 0),
      };

      if (editingIntern.id && interns.some(i => i.id === editingIntern.id)) {
        // Edit existing
        const res = await adminApi.updateIntern(editingIntern.id, payload);
        if (res.success) {
          setInterns(prev => prev.map(i => i.id === editingIntern.id ? res.data : i));
          showToast('Intern profile updated successfully', 'success');
        }
      } else {
        // Create new
        const res = await adminApi.createIntern(payload);
        if (res.success) {
          setInterns(prev => [...prev, res.data]);
          showToast('Intern added to roster', 'success');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving intern profile', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleTogglePublished = async (intern: InternMemberCMS) => {
    try {
      const updated = { ...intern, published: !intern.published };
      const res = await adminApi.updateIntern(intern.id, updated);
      if (res.success) {
        setInterns(prev => prev.map(i => i.id === intern.id ? res.data : i));
        showToast(`${intern.name} status updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed updating status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminApi.deleteIntern(deleteTarget.id);
      if (res.success) {
        setInterns(prev => prev.filter(i => i.id !== deleteTarget.id));
        showToast('Intern removed from roster', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting intern profile', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  if (loading || !program) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Internship Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Internship Hub & Roster</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage civil engineering & architecture training curriculum, student profiles, and WhatsApp templates.
          </p>
        </div>

        {activeTab === 'roster' && (
          <button
            onClick={handleOpenAddIntern}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Intern</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs max-w-sm">
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'roster' ? 'bg-[#123B68] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Interns Roster ({interns.length})
        </button>
        <button
          onClick={() => setActiveTab('program')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'program' ? 'bg-[#123B68] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Program & Syllabus
        </button>
      </div>

      {/* TAB 1: INTERNS ROSTER */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">College & Degree</th>
                  <th className="py-3.5 px-4">Mentor & Focus Area</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Live</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {interns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={intern.image}
                          alt={intern.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as any).src = '/images/team/intern-harish-kumar.jpg';
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900">{intern.name}</div>
                          <div className="text-[11px] text-slate-500">{intern.duration}</div>
                        </div>
                      </div>
                    </td>

                    {/* College & Degree */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 line-clamp-1 max-w-xs">{intern.institution}</div>
                        <div className="text-[11px] text-slate-500">{intern.degree}</div>
                      </div>
                    </td>

                    {/* Mentor & Focus Area */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-slate-800 font-medium">Mentor: {intern.mentor}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{intern.focusArea}</div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          intern.status === 'PPO Offered'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : intern.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {intern.status}
                      </span>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(intern)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          intern.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {intern.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{intern.published ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditIntern(intern)}
                          className="p-1.5 text-slate-500 hover:text-[#123B68] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit intern profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(intern)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete intern profile"
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

      {/* TAB 2: PROGRAM & SYLLABUS */}
      {activeTab === 'program' && (
        <form onSubmit={handleSaveProgram} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              General Program Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Program Title</label>
              <input
                type="text"
                value={program.title}
                onChange={(e) => setProgram({ ...program, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={program.tagline}
                onChange={(e) => setProgram({ ...program, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={program.description}
                onChange={(e) => setProgram({ ...program, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                WhatsApp Application Template
              </label>
              <textarea
                rows={4}
                value={program.defaultWhatsappTemplate}
                onChange={(e) => setProgram({ ...program, defaultWhatsappTemplate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6] font-mono text-[11px]"
              />
              <p className="text-[11px] text-slate-400 mt-1">Pre-filled message when a student clicks "Apply for Internship via WhatsApp"</p>
            </div>
          </div>

          {/* 4 Core Modules */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              4 Core Training Syllabus Modules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.modules.map((mod, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-[#123B68] uppercase">Module 0{i + 1}</div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const updated = [...program.modules];
                        updated[i] = { ...updated[i], title: e.target.value };
                        setProgram({ ...program, modules: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Curriculum Details</label>
                    <textarea
                      rows={2}
                      value={mod.desc}
                      onChange={(e) => {
                        const updated = [...program.modules];
                        updated[i] = { ...updated[i], desc: e.target.value };
                        setProgram({ ...program, modules: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="submit"
              disabled={savingProgram}
              className="px-6 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingProgram ? 'Saving...' : 'Save Program Syllabus'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Intern Add/Edit Modal */}
      {isModalOpen && editingIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingIntern.id ? 'Edit Intern Profile' : 'Add New Student Intern'}
                  </h3>
                  <p className="text-xs text-slate-500">Document student engineer, institution, mentor, and training highlights</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveIntern} className="flex-1 overflow-y-auto p-6 space-y-5">
              <MediaUploader
                label="Student Photograph *"
                value={editingIntern.image || ''}
                onChange={(url) => setEditingIntern(prev => ({ ...prev!, image: url }))}
                aspectRatioHint="Square 1:1"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={editingIntern.name || ''}
                    onChange={(e) => setEditingIntern(prev => ({ ...prev!, name: e.target.value }))}
                    placeholder="e.g. S. Harish Kumar"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={editingIntern.status || 'Active Intern'}
                    onChange={(e) => setEditingIntern(prev => ({ ...prev!, status: e.target.value as any }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6] bg-white"
                  >
                    <option value="Active Intern">Active Intern</option>
                    <option value="PPO Offered">PPO Offered (Job Pre-Placement)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institution / College</label>
                  <input
                    type="text"
                    value={editingIntern.institution || ''}
                    onChange={(e) => setEditingIntern(prev => ({ ...prev!, institution: e.target.value }))}
                    placeholder="e.g. Government College of Engineering, Tirunelveli"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree & Year</label>
                  <input
                    type="text"
                    value={editingIntern.degree || ''}
                    onChange={(e) => setEditingIntern(prev => ({ ...prev!, degree: e.target.value }))}
                    placeholder="e.g. B.E. Civil Engineering (Final Year)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Mentor</label>
                  <input
                    type="text"
                    value={editingIntern.mentor || ''}
                    onChange={(e) => setEditingIntern(prev => ({ ...prev!, mentor: e.target.value }))}
                    placeholder="e.g. Er. M. Rajesh"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingIntern.duration || ''}
                    onChange={(e) => setEditingIntern(prev => ({ ...prev!, duration: e.target.value }))}
                    placeholder="e.g. 6 Months (Jan 2026 - Jun 2026)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Focus Area</label>
                <input
                  type="text"
                  value={editingIntern.focusArea || ''}
                  onChange={(e) => setEditingIntern(prev => ({ ...prev!, focusArea: e.target.value }))}
                  placeholder="e.g. Site Leveling, Shuttering Verification & Reinforcement Checks"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              {/* Learning Highlights */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Learning Highlights</label>
                  <button
                    type="button"
                    onClick={() => setEditingIntern(prev => ({
                      ...prev!,
                      learningHighlights: [...(prev?.learningHighlights || []), ''],
                    }))}
                    className="text-[11px] font-bold text-[#2468A6] hover:underline"
                  >
                    + Add Highlight
                  </button>
                </div>
                <div className="space-y-2">
                  {(editingIntern.learningHighlights || []).map((highlight, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => {
                          const updated = [...(editingIntern.learningHighlights || [])];
                          updated[idx] = e.target.value;
                          setEditingIntern(prev => ({ ...prev!, learningHighlights: updated }));
                        }}
                        placeholder={`Highlight #${idx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingIntern.learningHighlights || []).filter((_, i) => i !== idx);
                          setEditingIntern(prev => ({ ...prev!, learningHighlights: updated }));
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Published Toggle */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingIntern.published !== false}
                    onChange={(e) => setEditingIntern(prev => ({ ...prev!, published: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Show profile publicly on About Page → Internships</span>
                </label>
              </div>

              {/* Modal Buttons */}
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
                  className="px-5 py-2 text-xs font-bold text-white bg-[#123B68] hover:bg-[#0E2E52] rounded-xl shadow-md disabled:opacity-50"
                >
                  {modalSaving ? 'Saving...' : 'Save Intern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Intern Profile"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from the internship roster?`}
        confirmLabel="Delete Intern"
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
