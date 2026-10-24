import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password, rememberMe);
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07172A] via-[#0E2E52] to-[#123B68] flex items-center justify-center p-4 selection:bg-[#2468A6] selection:text-white">
      {/* Ambient background blur elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2468A6]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 sm:p-10">
          {/* Logo & Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-2.5 rounded-2xl bg-white shadow-md border border-slate-100 mb-4">
              <img
                src="/images/jbr-logo.jpg"
                alt="JBR Builders"
                className="h-12 w-auto object-contain mx-auto"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FC] text-[#123B68] text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-[#2468A6]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>Administrative CMS Portal</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#123B68] tracking-tight">Sign In to Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">Authorized company administrators and managers only</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or admin@jbrbuilders.in"
                  disabled={loading}
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2468A6] focus:bg-white text-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  disabled={loading}
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2468A6] focus:bg-white text-slate-900 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6] border-slate-300"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] text-slate-400">Encrypted JWT Session</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#123B68]/30 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access CMS Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Setup Hint Box */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#123B68]">
              <Sparkles className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>Initial Administrator Credentials</span>
            </div>
            <div className="font-mono text-[10px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
              Username: <span className="font-bold text-[#123B68]">admin</span> | Password: <span className="font-bold text-[#123B68]">AdminPassword123!</span>
            </div>
            <p className="text-[10px] text-slate-400">
              You can change this password anytime inside CMS → Account & Security.
            </p>
          </div>
        </div>

        {/* Back to public website */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Back to public website</span>
          </a>
        </div>
      </div>
    </div>
  );
};
