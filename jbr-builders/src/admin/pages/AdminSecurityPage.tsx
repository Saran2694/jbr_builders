import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, KeyRound, Clock, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../components/Toast';

export const AdminSecurityPage: React.FC = () => {
  const { user } = useAdminAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await adminApi.getAuditLogs();
      if (res.success && Array.isArray(res.data)) {
        setAuditLogs(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill all password fields.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await adminApi.changePassword(currentPassword, newPassword);
      if (res.success) {
        showToast('Administrator password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchLogs();
      }
    } catch (err: any) {
      showToast(err.message || 'Error changing password', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Account & Security</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage administrator credentials, change passwords, and inspect security audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Password Update & Profile */}
        <div className="lg:col-span-6 space-y-6">
          {/* Admin Profile Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Active Admin Profile</h3>
                <p className="text-xs text-slate-500">Authenticated user session information</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Username</span>
                <div className="font-bold text-slate-900 mt-0.5">{user?.username}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Role</span>
                <div className="font-bold text-[#123B68] capitalize mt-0.5">{user?.role}</div>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Official Email</span>
                <div className="font-bold text-slate-900 mt-0.5">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Change Password</h3>
                <p className="text-xs text-slate-500">Secure PBKDF2 cryptographic password updating</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter existing password"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Security Audit Logs */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
            <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Security & Action Audit Logs</h3>
              <p className="text-xs text-slate-500">Immutable trail of administrative updates and system events</p>
            </div>
          </div>

          {loadingLogs ? (
            <div className="py-12 flex justify-center">
              <span className="w-6 h-6 border-2 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
            </div>
          ) : auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No logs recorded yet.</p>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 flex-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-3">
                  <div className="p-1 rounded-md bg-[#123B68]/10 text-[#123B68] mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{log.details || log.entity}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">By user: <span className="font-semibold text-slate-700">{log.user}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
