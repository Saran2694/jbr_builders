import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Layers,
  Image as ImageIcon,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../components/Toast';

export const AdminDashboard: React.FC = () => {
  const { user } = useAdminAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, inqRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getInquiries(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (inqRes.success) setInquiries(inqRes.data);
    } catch (err: any) {
      showToast(err.message || 'Failed loading dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'contacted' | 'resolved') => {
    try {
      const res = await adminApi.updateInquiryStatus(id, status);
      if (res.success) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        showToast('Inquiry status updated', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed updating status', 'error');
    }
  };

  const statCards = [
    {
      title: 'Active Team & Staff',
      count: stats?.teamCount ?? 5,
      subtext: `${stats?.publishedTeamCount ?? 5} Published publicly`,
      icon: Users,
      color: 'from-blue-600 to-indigo-700',
      link: '/admin/team',
    },
    {
      title: 'Services Managed',
      count: stats?.servicesCount ?? 6,
      subtext: 'Core construction offerings',
      icon: Briefcase,
      color: 'from-sky-500 to-blue-600',
      link: '/admin/services',
    },
    {
      title: 'Projects Portfolio',
      count: stats?.projectsCount ?? 4,
      subtext: 'Completed architectural works',
      icon: Layers,
      color: 'from-teal-500 to-emerald-600',
      link: '/admin/projects',
    },
    {
      title: 'Gallery Media',
      count: stats?.galleryCount ?? 4,
      subtext: 'Uploaded & external photos',
      icon: ImageIcon,
      color: 'from-cyan-500 to-blue-700',
      link: '/admin/gallery',
    },
    {
      title: 'Interns & Students',
      count: stats?.internsCount ?? 4,
      subtext: 'Active training roster',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-600',
      link: '/admin/internships',
    },
    {
      title: 'Client Inquiries',
      count: inquiries.length,
      subtext: `${inquiries.filter(i => i.status === 'new').length} New inquiries`,
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-600',
      link: '#inquiries',
    },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07172A] via-[#0E2E52] to-[#123B68] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Content Management System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Manage website content, update employee profiles, curate gallery photographs, and adjust company settings with instant live updates on the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/gallery"
              className="px-4 py-2.5 rounded-xl bg-[#2468A6] hover:bg-[#1E588D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Manage Gallery</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="group p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.count}</div>
                <div className="flex items-center justify-between mt-2 text-xs font-medium text-slate-500">
                  <span>{card.subtext}</span>
                  <span className="text-[#2468A6] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Manage <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Lower Dashboard Sections: Recent Inquiries & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="inquiries">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Recent Client Inquiries & Consultations
              </h3>
              <p className="text-xs text-slate-500">Leads captured from the public contact forms & estimate modal</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#EBF4FC] text-[#123B68] border border-[#2468A6]/20">
              {inquiries.length} Total
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">No inquiries received yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Customer requests from the website will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{inq.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#123B68]/10 text-[#123B68] font-bold">
                        {inq.service}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : inq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {inq.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      📞 <a href={`tel:${inq.phone}`} className="hover:text-[#2468A6]">{inq.phone}</a>
                      {inq.email && <span className="ml-3">✉️ {inq.email}</span>}
                    </div>
                    {inq.message && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-2">"{inq.message}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq.id, inq.status === 'resolved' ? 'new' : 'resolved')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                        inq.status === 'resolved'
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      {inq.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                    </button>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)}%2C%20thank%20you%20for%20contacting%20JBR%20Builders.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-[11px] font-bold bg-[#2468A6] text-white hover:bg-[#1E588D] rounded-lg transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Activity & System Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Recent CMS Modifications
            </h3>
            <div className="space-y-3">
              {(stats?.recentAuditLogs || []).map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="p-1.5 rounded-lg bg-[#123B68]/10 text-[#123B68] shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800 truncate">{log.action}</div>
                    <div className="text-[11px] text-slate-500 truncate">{log.details || log.entity}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleTimeString()} by {log.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CMS Action Shortcuts */}
          <div className="bg-gradient-to-br from-[#EBF4FC] to-white rounded-3xl border border-[#2468A6]/20 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-[#123B68] uppercase tracking-wider mb-3">
              Quick Management Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/admin/team" className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#2468A6] font-bold text-slate-700 hover:text-[#123B68] transition-colors text-center shadow-2xs">
                + Add Employee
              </Link>
              <Link to="/admin/gallery" className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#2468A6] font-bold text-slate-700 hover:text-[#123B68] transition-colors text-center shadow-2xs">
                + Upload Photo
              </Link>
              <Link to="/admin/services" className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#2468A6] font-bold text-slate-700 hover:text-[#123B68] transition-colors text-center shadow-2xs">
                + Add Service
              </Link>
              <Link to="/admin/company" className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#2468A6] font-bold text-slate-700 hover:text-[#123B68] transition-colors text-center shadow-2xs">
                Edit Contacts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
