import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ToastProvider } from './Toast';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Loading state while checking token
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#123B68] flex items-center justify-center shadow-lg animate-pulse">
            <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-xs font-bold text-[#123B68] uppercase tracking-wider">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Redirect to /admin/login if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Get current section title based on pathname
  const getSectionTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/team')) return 'Team & Staff Management';
    if (path.includes('/admin/services')) return 'Services Management';
    if (path.includes('/admin/projects')) return 'Projects Portfolio';
    if (path.includes('/admin/gallery')) return 'Gallery & Media Management';
    if (path.includes('/admin/homepage')) return 'Homepage Content Editor';
    if (path.includes('/admin/internships')) return 'Internship Hub & Students';
    if (path.includes('/admin/company')) return 'Company Profile & Offices';
    if (path.includes('/admin/security')) return 'Account & Security';
    return 'CMS Dashboard Overview';
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={getSectionTitle()} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};
