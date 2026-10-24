import React, { useState, useEffect } from 'react';
import { Home, Save, Sparkles, Layers, ShieldCheck, Check, RotateCcw } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { HomepageContentCMS } from '../../types/cms';
import { useToast } from '../components/Toast';

export const AdminHomePage: React.FC = () => {
  const { showToast } = useToast();
  const [homepage, setHomepage] = useState<HomepageContentCMS | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchHomepage = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getHomepage();
      if (res.success && res.data) {
        setHomepage(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed loading homepage content', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepage();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepage) return;

    setSaving(true);
    try {
      const res = await adminApi.updateHomepage(homepage);
      if (res.success) {
        setHomepage(res.data);
        showToast('Homepage content updated successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving homepage content', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !homepage) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Homepage Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Homepage Content Editor</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify hero copy, counters, Why Choose Us pillars, and toggle section visibility without altering the design.
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
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Hero Banner Content */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Hero Section Content</h3>
              <p className="text-xs text-slate-500">The premier visual statement displayed at the top of the homepage</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Top Slogan / Pill Badge</label>
              <input
                type="text"
                value={homepage.heroBadge || ''}
                onChange={(e) => setHomepage({ ...homepage, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Main Hero Headline</label>
              <input
                type="text"
                value={homepage.heroHeadline || ''}
                onChange={(e) => setHomepage({ ...homepage, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6] font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Subtext Description</label>
              <textarea
                rows={2}
                value={homepage.heroSubtext || ''}
                onChange={(e) => setHomepage({ ...homepage, heroSubtext: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={homepage.heroCtaText || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroCtaText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary CTA Button Text</label>
                <input
                  type="text"
                  value={homepage.heroSecondaryCtaText || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroSecondaryCtaText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Achievement Counters / Statistics */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Achievement Counters & Metrics</h3>
              <p className="text-xs text-slate-500">Live statistics chips highlighting company track record</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {homepage.stats.map((stat, i) => (
              <div key={stat.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-[11px] font-bold text-[#123B68] uppercase">Counter #{i + 1}</div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Value (e.g. 16+)</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...homepage.stats];
                      updated[i] = { ...updated[i], value: e.target.value };
                      setHomepage({ ...homepage, stats: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...homepage.stats];
                      updated[i] = { ...updated[i], label: e.target.value };
                      setHomepage({ ...homepage, stats: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtext</label>
                  <input
                    type="text"
                    value={stat.subtext || ''}
                    onChange={(e) => {
                      const updated = [...homepage.stats];
                      updated[i] = { ...updated[i], subtext: e.target.value };
                      setHomepage({ ...homepage, stats: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6] bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Choose Us */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Why Choose Us Pillars</h3>
              <p className="text-xs text-slate-500">Core differentiators displayed on the homepage guarantee section</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {homepage.whyChooseUs.map((item, i) => (
              <div key={item.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-[11px] font-bold text-[#123B68] uppercase">Pillar #{i + 1}</div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...homepage.whyChooseUs];
                      updated[i] = { ...updated[i], title: e.target.value };
                      setHomepage({ ...homepage, whyChooseUs: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...homepage.whyChooseUs];
                      updated[i] = { ...updated[i], description: e.target.value };
                      setHomepage({ ...homepage, whyChooseUs: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6] bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Public Section Visibility Toggles */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Homepage Section Visibility</h3>
              <p className="text-xs text-slate-500">Toggle public visibility of individual homepage blocks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(homepage.sectionVisibility).map(([key, val]) => (
              <label
                key={key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <span className="text-xs font-bold text-slate-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')} Section
                </span>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) => {
                    setHomepage({
                      ...homepage,
                      sectionVisibility: {
                        ...homepage.sectionVisibility,
                        [key]: e.target.checked,
                      },
                    });
                  }}
                  className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="flex items-center justify-end gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
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
            <span>Save All Homepage Content</span>
          </button>
        </div>
      </form>
    </div>
  );
};
