import React, { useState, useEffect } from 'react';
import { Building, Save, Phone, Mail, Clock, MapPin, Globe, Sparkles } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { CompanySettingsCMS } from '../../types/cms';
import { MediaUploader } from '../components/MediaUploader';
import { useToast } from '../components/Toast';

export const AdminCompanyPage: React.FC = () => {
  const { showToast } = useToast();
  const [company, setCompany] = useState<CompanySettingsCMS | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCompany();
      if (res.success && res.data) {
        setCompany(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed loading company settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    try {
      const res = await adminApi.updateCompany(company);
      if (res.success) {
        setCompany(res.data);
        showToast('Company profile and offices updated successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating company settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !company) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Company Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Company & Office Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate branding, WhatsApp configuration, contact details, and dual office locations.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand Information */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Corporate Identity</h3>
              <p className="text-xs text-slate-500">Official name, tagline, and brand emblem</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Corporate Tagline / Slogan</label>
                <input
                  type="text"
                  value={company.tagline}
                  onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Working Hours</label>
                <input
                  type="text"
                  value={company.workingHours}
                  onChange={(e) => setCompany({ ...company, workingHours: e.target.value })}
                  placeholder="e.g. Monday - Saturday: 9:00 AM - 7:00 PM"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>
            </div>

            <div>
              <MediaUploader
                label="Official Company Logo"
                value={company.logoUrl}
                onChange={(url) => setCompany({ ...company, logoUrl: url })}
                aspectRatioHint="Recommended: Transparent PNG or Clean JPG"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & WhatsApp Channels */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Telephony & WhatsApp Integration</h3>
              <p className="text-xs text-slate-500">Contact buttons, floating action trigger, and click-to-chat links</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Display Phone Number</label>
              <input
                type="text"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                placeholder="+91 97917 10655"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Raw Phone (for tel: link)</label>
              <input
                type="text"
                value={company.phoneRaw}
                onChange={(e) => setCompany({ ...company, phoneRaw: e.target.value })}
                placeholder="+919791710655"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Email</label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                placeholder="jbrbuilders15@gmail.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={company.whatsappNumber}
                onChange={(e) => {
                  const num = e.target.value;
                  const text = encodeURIComponent(company.defaultWhatsappMessage || 'Hello JBR Builders');
                  setCompany({
                    ...company,
                    whatsappNumber: num,
                    whatsappUrl: `https://wa.me/${num}?text=${text}`,
                  });
                }}
                placeholder="919791710655"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Default WhatsApp Message Template</label>
              <input
                type="text"
                value={company.defaultWhatsappMessage}
                onChange={(e) => {
                  const msg = e.target.value;
                  const text = encodeURIComponent(msg);
                  setCompany({
                    ...company,
                    defaultWhatsappMessage: msg,
                    whatsappUrl: `https://wa.me/${company.whatsappNumber}?text=${text}`,
                  });
                }}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>
          </div>
        </div>

        {/* Dual Office Locations (Tuticorin Head Office & Tirunelveli Branch) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Dual Office Locations</h3>
              <p className="text-xs text-slate-500">
                Addresses displayed on Contact page, inline cards, and public website footer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {company.offices.map((office, idx) => (
              <div key={office.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#123B68] uppercase">{office.type}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${office.isPrimary ? 'bg-[#123B68] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {office.isPrimary ? 'Headquarters' : 'Branch Office'}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Office Type Label</label>
                  <input
                    type="text"
                    value={office.type}
                    onChange={(e) => {
                      const updated = [...company.offices];
                      updated[idx] = { ...updated[idx], type: e.target.value };
                      setCompany({ ...company, offices: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Street Address</label>
                  <textarea
                    rows={2}
                    value={office.address}
                    onChange={(e) => {
                      const updated = [...company.offices];
                      updated[idx] = { ...updated[idx], address: e.target.value };
                      setCompany({ ...company, offices: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      value={office.city}
                      onChange={(e) => {
                        const updated = [...company.offices];
                        updated[idx] = { ...updated[idx], city: e.target.value };
                        setCompany({ ...company, offices: updated });
                      }}
                      className="w-full px-2.5 py-1 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      value={office.state}
                      onChange={(e) => {
                        const updated = [...company.offices];
                        updated[idx] = { ...updated[idx], state: e.target.value };
                        setCompany({ ...company, offices: updated });
                      }}
                      className="w-full px-2.5 py-1 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={office.pincode}
                      onChange={(e) => {
                        const updated = [...company.offices];
                        updated[idx] = { ...updated[idx], pincode: e.target.value };
                        setCompany({ ...company, offices: updated });
                      }}
                      className="w-full px-2.5 py-1 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Google Maps Link</label>
                  <input
                    type="url"
                    value={office.mapsUrl || ''}
                    onChange={(e) => {
                      const updated = [...company.offices];
                      updated[idx] = { ...updated[idx], mapsUrl: e.target.value };
                      setCompany({ ...company, offices: updated });
                    }}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Social Media Handles</h3>
              <p className="text-xs text-slate-500">Public profile links shown in footer and contact sections</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={company.socialLinks?.linkedin || ''}
                onChange={(e) => setCompany({
                  ...company,
                  socialLinks: { ...company.socialLinks, linkedin: e.target.value },
                })}
                placeholder="https://linkedin.com/company/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facebook URL</label>
              <input
                type="url"
                value={company.socialLinks?.facebook || ''}
                onChange={(e) => setCompany({
                  ...company,
                  socialLinks: { ...company.socialLinks, facebook: e.target.value },
                })}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instagram URL</label>
              <input
                type="url"
                value={company.socialLinks?.instagram || ''}
                onChange={(e) => setCompany({
                  ...company,
                  socialLinks: { ...company.socialLinks, instagram: e.target.value },
                })}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Company Information</span>
          </button>
        </div>
      </form>
    </div>
  );
};
