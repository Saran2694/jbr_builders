import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Image,
  Home,
  GraduationCap,
  Building,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAdminAuth();

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Team & Staff', path: '/admin/team', icon: Users },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Projects', path: '/admin/projects', icon: Layers },
    { name: 'Gallery Management', path: '/admin/gallery', icon: Image, badge: 'Priority' },
    { name: 'Homepage Content', path: '/admin/homepage', icon: Home },
    { name: 'Internship Hub', path: '/admin/internships', icon: GraduationCap },
    { name: 'Company & Offices', path: '/admin/company', icon: Building },
    { name: 'Account & Security', path: '/admin/security', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#07172A] text-white flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-white/95 shadow-sm">
              <img src="/images/jbr-logo.jpg" alt="JBR Builders" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">JBR Builders</h2>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#2468A6]/30 text-cyan-300 border border-[#2468A6]/40 uppercase">
                Content CMS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            CMS Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Live site link */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all group"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>View Live Public Site</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 text-xs text-slate-300">
              <div className="w-8 h-8 rounded-full bg-[#2468A6] flex items-center justify-center font-bold text-white uppercase text-xs shrink-0">
                {user.username.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white truncate">{user.username}</div>
                <div className="text-[11px] text-slate-400 capitalize">{user.role}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
