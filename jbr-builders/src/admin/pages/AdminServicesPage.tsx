import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { ServiceItemCMS } from '../../types/cms';
import { IconPicker, AVAILABLE_ICONS } from '../components/IconPicker';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export const AdminServicesPage: React.FC = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState<ServiceItemCMS[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceItemCMS> | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ServiceItemCMS | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getServices();
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed loading services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService({
      title: '',
      id: '',
      description: '',
      iconName: 'Building2',
      features: [''],
      quoteSubject: '',
      published: true,
      displayOrder: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceItemCMS) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title?.trim()) {
      showToast('Service title is required.', 'error');
      return;
    }

    setModalSaving(true);
    try {
      const payload: Partial<ServiceItemCMS> = {
        ...editingService,
        features: (editingService.features || []).filter(f => f.trim().length > 0),
        quoteSubject: editingService.quoteSubject?.trim() || editingService.title?.trim(),
      };

      if (editingService.id && services.some(s => s.id === editingService.id)) {
        // Edit existing
        const res = await adminApi.updateService(editingService.id, payload);
        if (res.success) {
          setServices(prev => prev.map(s => s.id === editingService.id ? res.data : s));
          showToast('Service updated successfully', 'success');
        }
      } else {
        // Create new
        const res = await adminApi.createService(payload);
        if (res.success) {
          setServices(prev => [...prev, res.data]);
          showToast('Service created successfully', 'success');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving service', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleTogglePublished = async (service: ServiceItemCMS) => {
    try {
      const updated = { ...service, published: !service.published };
      const res = await adminApi.updateService(service.id, updated);
      if (res.success) {
        setServices(prev => prev.map(s => s.id === service.id ? res.data : s));
        showToast(`${service.title} visibility updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating service', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminApi.deleteService(deleteTarget.id);
      if (res.success) {
        setServices(prev => prev.filter(s => s.id !== deleteTarget.id));
        showToast('Service deleted permanently', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting service', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const newServices = [...services];
    const temp = newServices[index];
    newServices[index] = newServices[targetIndex];
    newServices[targetIndex] = temp;

    setServices(newServices);
    try {
      await adminApi.reorderServices(newServices.map(s => s.id));
      showToast('Services reordered', 'success');
    } catch {
      showToast('Failed to save order', 'error');
      fetchServices();
    }
  };

  const getIconComponent = (iconName: string) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    return found ? found.Icon : Briefcase;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Construction Services</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public construction offerings, itemized feature bullets, quote subjects, and icons.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
          <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No services configured</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add New Service" to create your first offering.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Icon & Service Title</th>
                  <th className="py-3.5 px-4">Features & Scope</th>
                  <th className="py-3.5 px-4">Quote Subject</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {services.map((service, idx) => {
                  const Icon = getIconComponent(service.iconName);
                  return (
                    <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
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
                            disabled={idx === services.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Icon & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#EBF4FC] text-[#2468A6] flex items-center justify-center shrink-0 border border-[#2468A6]/20">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{service.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">{service.description}</div>
                          </div>
                        </div>
                      </td>

                      {/* Features */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                          {service.features.length} Features
                        </span>
                      </td>

                      {/* Quote Subject */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-[#123B68]">
                          {service.quoteSubject || service.title}
                        </span>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleTogglePublished(service)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            service.published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {service.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{service.published ? 'Live' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(service)}
                            className="p-1.5 text-slate-500 hover:text-[#123B68] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit service"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(service)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingService.id && services.some(s => s.id === editingService.id)
                      ? 'Edit Service Offering'
                      : 'Add New Service Offering'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure public service cards, icons, and quotation subjects</p>
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
            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService(prev => ({ ...prev!, title: e.target.value }))}
                    placeholder="e.g. Turnkey Construction Solutions"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quote Subject Label</label>
                  <input
                    type="text"
                    value={editingService.quoteSubject || ''}
                    onChange={(e) => setEditingService(prev => ({ ...prev!, quoteSubject: e.target.value }))}
                    placeholder="Preselected label in consultation modal"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService(prev => ({ ...prev!, description: e.target.value }))}
                  placeholder="Clear description of this construction offering..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              {/* Icon Picker */}
              <IconPicker
                value={editingService.iconName || 'Building2'}
                onChange={(iconName) => setEditingService(prev => ({ ...prev!, iconName }))}
              />

              {/* Feature Points */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Service Feature Bullets</label>
                  <button
                    type="button"
                    onClick={() => setEditingService(prev => ({
                      ...prev!,
                      features: [...(prev?.features || []), ''],
                    }))}
                    className="text-[11px] font-bold text-[#2468A6] hover:underline cursor-pointer"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {(editingService.features || []).map((feat, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...(editingService.features || [])];
                          updated[i] = e.target.value;
                          setEditingService(prev => ({ ...prev!, features: updated }));
                        }}
                        placeholder={`Feature #${i + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingService.features || []).filter((_, idx) => idx !== i);
                          setEditingService(prev => ({ ...prev!, features: updated }));
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
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingService.published !== false}
                    onChange={(e) => setEditingService(prev => ({ ...prev!, published: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Published on public website (Home & Services pages)</span>
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
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Construction Service"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will remove the service card from both the Home and Services pages.`}
        confirmLabel="Delete Service"
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
