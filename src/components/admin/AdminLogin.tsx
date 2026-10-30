import React, { useState } from 'react';
import { authService, AdminUser } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Database, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, error: authError } = await authService.signIn(email, password);
      if (authError || !user) {
        setError(authError || 'Authentication failed. Please verify credentials.');
      } else {
        onLoginSuccess(user);
      }
    } catch {
      setError('An error occurred during authentication. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden relative z-10">
        {/* Header Bar */}
        <div className="bg-brand-navy p-6 text-white text-center border-b-4 border-brand-orange">
          <div className="w-12 h-12 rounded-xl bg-white text-brand-navy flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-md">
            <span>V</span>
            <span className="text-brand-orange">M</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">VMOVE LOGISTICS</h2>
          <p className="text-xs text-brand-orange font-semibold tracking-wider uppercase mt-0.5">
            Operations &amp; Admin Portal
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3 text-brand-orange" />
            <span>Authorized Personnel Only</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorized Staff Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@vmovelogistics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-md bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-brand-orange" />
                </>
              )}
            </button>
          </form>

          {/* Preset testing credentials badge */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Default Operational Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin@vmovelogistics.com', 'admin123')}
                className="p-2 text-left rounded border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <span className="font-bold text-brand-navy block">Admin Role</span>
                <span className="text-[10px] text-slate-500 font-mono">admin@vmovelogistics.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill('ops@vmovelogistics.com', 'ops123')}
                className="p-2 text-left rounded border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <span className="font-bold text-brand-navy block">Operations Role</span>
                <span className="text-[10px] text-slate-500 font-mono">ops@vmovelogistics.com</span>
              </button>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Backend Mode: {isSupabaseConfigured ? 'Live Supabase Connected' : 'Local Storage Engine (Supabase Schema Ready)'}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToWebsite}
              className="text-xs font-semibold text-slate-500 hover:text-brand-orange transition-colors"
            >
              &larr; Return to Public Website
            </button>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-6 text-center">
        Unrestricted public admin registration is disabled as per enterprise security policy.
      </p>
    </div>
  );
};
