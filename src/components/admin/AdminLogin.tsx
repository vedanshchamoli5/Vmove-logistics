import React, { useState, useEffect } from 'react';
import { authService, AdminUser } from '../../lib/auth';
import { getRoleDisplayName } from '../../lib/rbac';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [email, setEmail] = useState('admin@vmovelogistics.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA / TOTP Stage
  const [mfaStage, setMfaStage] = useState(false);
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Lockout countdown
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Check lockout on email change or mount
  useEffect(() => {
    const status = authService.checkLockoutStatus(email);
    if (status.isLocked) {
      setLockoutSeconds(status.waitSeconds);
    } else {
      setLockoutSeconds(0);
    }
  }, [email]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Handle Step 1: Password submit
  const handlePrimarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authService.validatePrimaryCredentials(email, password);

      if (!result.success || !result.user) {
        setError(result.error || 'Authentication failed. Please verify credentials.');
        const status = authService.checkLockoutStatus(email);
        if (status.isLocked) {
          setLockoutSeconds(status.waitSeconds);
        }
      } else {
        // Successful primary credentials; proceed to MFA
        setPendingUser(result.user);
        setTotpSecret(result.totpSecret || authService.getUserTOTPSecret(result.user.email));
        setMfaStage(true);
      }
    } catch {
      setError('An error occurred during authentication. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2: TOTP submit
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await authService.verifyMfaAndCompleteLogin(pendingUser, totpCode);
      if (!result.success || !result.user) {
        setError(result.error || 'Invalid TOTP code.');
      } else {
        onLoginSuccess(result.user);
      }
    } catch {
      setError('An error occurred while verifying two-factor code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleFillLiveCode = () => {
    if (pendingUser) {
      const liveCode = authService.getLiveDemoTOTP(pendingUser.email);
      setTotpCode(liveCode);
    }
  };

  const handleQuickRoleSelect = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
    setMfaStage(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative font-sans">
      {/* Background glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden relative z-10">
        {/* Header Bar */}
        <div className="bg-brand-navy p-6 text-white text-center border-b-4 border-brand-orange relative">
          <div className="w-12 h-12 rounded-xl bg-white text-brand-navy flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-md">
            <span>V</span>
            <span className="text-brand-orange">M</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">VMOVE LOGISTICS</h2>
          <p className="text-xs text-brand-orange font-semibold tracking-wider uppercase mt-0.5">
            Enterprise Security Portal • Phishing-Resistant MFA
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3 text-brand-orange" />
            <span>Strict Role-Based Access Control</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {lockoutSeconds > 0 && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Account Temporarily Locked</span>
                <span>
                  Multiple failed attempts detected. Progressive security lockout active. You may retry in{' '}
                  <strong className="font-mono text-rose-700">{lockoutSeconds}s</strong>.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!mfaStage ? (
            /* STEP 1: PASSWORD FORM */
            <form onSubmit={handlePrimarySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Personnel Email
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
                    disabled={lockoutSeconds > 0 || isLoading}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange disabled:bg-slate-100"
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
                    disabled={lockoutSeconds > 0 || isLoading}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange disabled:bg-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || lockoutSeconds > 0}
                className="w-full mt-2 py-3 px-4 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : 'Verify Password & Proceed to 2FA'}</span>
                <ArrowRight className="w-4 h-4 text-brand-orange" />
              </button>
            </form>
          ) : (
            /* STEP 2: TOTP MFA CHALLENGE */
            <form onSubmit={handleMfaSubmit} className="space-y-5 animate-in fade-in">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Authenticating User:</span>
                  <span className="font-bold text-brand-navy">{pendingUser?.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-500 font-medium">Assigned Role:</span>
                  <span className="font-semibold text-brand-orange">
                    {pendingUser ? getRoleDisplayName(pendingUser.role) : ''}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Two-Factor Authentication (TOTP) Code
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Enter the 6-digit verification code from your Google Authenticator or Microsoft Authenticator app.
                </p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <KeyRound className="w-4 h-4 text-brand-orange" />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3.5 py-3 text-lg font-mono tracking-widest text-center rounded-lg border-2 border-brand-orange/60 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Demonstrator & Auditor Assist Box */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-amber-900 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Security Testing &amp; Enrolment Key
                  </span>
                  <button
                    type="button"
                    onClick={handleFillLiveCode}
                    className="text-brand-orange hover:text-amber-800 font-bold underline cursor-pointer"
                  >
                    Auto-Fill Current TOTP
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-amber-200 font-mono text-[11px] text-slate-700">
                  <span className="truncate">{totpSecret}</span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="ml-2 text-slate-400 hover:text-slate-600 shrink-0"
                    title="Copy Base32 Secret"
                  >
                    {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMfaStage(false);
                    setTotpCode('');
                    setError(null);
                  }}
                  className="w-1/3 py-2.5 px-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading || totpCode.length !== 6}
                  className="w-2/3 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify TOTP & Enter'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Role Switching Shortcut for Security Audits */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              Quick Role Testing Profiles (RBAC Demo)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('superadmin@vmovelogistics.com', 'super123')}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-left border border-slate-200"
              >
                <div className="font-bold text-purple-700">SUPER_ADMIN</div>
                <div className="text-[9px] text-slate-500">superadmin@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('admin@vmovelogistics.com', 'admin123')}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-left border border-slate-200"
              >
                <div className="font-bold text-brand-navy">ADMIN</div>
                <div className="text-[9px] text-slate-500">admin@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('ops@vmovelogistics.com', 'ops123')}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-left border border-slate-200"
              >
                <div className="font-bold text-blue-700">OPERATIONS</div>
                <div className="text-[9px] text-slate-500">ops@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('finance@vmovelogistics.com', 'fin123')}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-left border border-slate-200"
              >
                <div className="font-bold text-emerald-700">FINANCE</div>
                <div className="text-[9px] text-slate-500">finance@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('sales@vmovelogistics.com', 'sales123')}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-left border border-slate-200"
              >
                <div className="font-bold text-amber-700">SALES</div>
                <div className="text-[9px] text-slate-500">sales@...</div>
              </button>

              <button
                type="button"
                onClick={onBackToWebsite}
                className="p-1.5 rounded bg-orange-50 hover:bg-orange-100 text-brand-orange text-center font-bold border border-orange-200 flex items-center justify-center gap-1"
              >
                <span>&larr; Website</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <p>Strictly for verified Vmove Logistics operational coordinators and administrators.</p>
        </div>
      </div>
    </div>
  );
};
