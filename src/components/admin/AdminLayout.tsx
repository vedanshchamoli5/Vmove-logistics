import React, { useState, useEffect, useRef } from 'react';
import { AdminUser } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';
import { db } from '../../lib/db';
import { hasPermission, getRoleDisplayName } from '../../lib/rbac';
import { LanguageSelector } from '../common/LanguageSelector';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Users,
  Truck,
  PackageCheck,
  CreditCard,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'enquiries'
  | 'quotations'
  | 'customers'
  | 'transporters'
  | 'bookings'
  | 'payments'
  | 'audit';

interface AdminLayoutProps {
  currentUser: AdminUser;
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onBackToWebsite: () => void;
  children: React.ReactNode;
  newEnquiryCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  currentTab,
  onTabChange,
  onLogout,
  onBackToWebsite,
  children,
  newEnquiryCount = 0,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [demoResetModal, setDemoResetModal] = useState(false);

  // Inactivity session timer (15 minutes threshold, warning at 14 minutes)
  const [idleWarning, setIdleWarning] = useState(false);
  const [idleRemaining, setIdleRemaining] = useState(60);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (idleWarning) {
        setIdleWarning(false);
        setIdleRemaining(60);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Periodic check every 5 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const warningThreshold = 14 * 60 * 1000; // 14 mins
      const logoutThreshold = 15 * 60 * 1000; // 15 mins

      if (elapsed >= logoutThreshold) {
        clearInterval(interval);
        onLogout();
      } else if (elapsed >= warningThreshold) {
        setIdleWarning(true);
        const remaining = Math.max(0, Math.ceil((logoutThreshold - elapsed) / 1000));
        setIdleRemaining(remaining);
      } else {
        setIdleWarning(false);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [idleWarning, onLogout]);

  // All navigation items with RBAC permissions
  const allNavItems = [
    {
      id: 'overview' as const,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      allowed: hasPermission(currentUser.role, 'view_dashboard_kpis'),
    },
    {
      id: 'enquiries' as const,
      label: 'Freight Enquiries',
      icon: Inbox,
      badge: newEnquiryCount,
      allowed: hasPermission(currentUser.role, 'view_enquiries'),
    },
    {
      id: 'quotations' as const,
      label: 'Quotations Management',
      icon: FileText,
      allowed: hasPermission(currentUser.role, 'view_quotations'),
    },
    {
      id: 'bookings' as const,
      label: 'Bookings & Tracking',
      icon: PackageCheck,
      allowed: hasPermission(currentUser.role, 'manage_bookings'),
    },
    {
      id: 'customers' as const,
      label: 'Customer Directory',
      icon: Users,
      allowed: hasPermission(currentUser.role, 'manage_customers'),
    },
    {
      id: 'transporters' as const,
      label: 'Transporters Directory',
      icon: Truck,
      allowed: hasPermission(currentUser.role, 'manage_transporters'),
    },
    {
      id: 'payments' as const,
      label: 'Operational Payments',
      icon: CreditCard,
      allowed: hasPermission(currentUser.role, 'manage_payments'),
    },
    {
      id: 'audit' as const,
      label: 'Audit Logs & DB Tools',
      icon: ShieldCheck,
      allowed: hasPermission(currentUser.role, 'view_audit_logs'),
    },
  ];

  const navItems = allNavItems.filter((item) => item.allowed);

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setMobileSidebarOpen(false);
  };

  const handleResetDemo = () => {
    if (!hasPermission(currentUser.role, 'manage_system_reset')) {
      alert('Permission Denied: System reset requires SUPER_ADMIN authorization.');
      return;
    }
    db.resetToDemoData();
    setDemoResetModal(false);
    window.location.reload();
  };

  const handleClearDemo = () => {
    if (!hasPermission(currentUser.role, 'manage_system_reset')) {
      alert('Permission Denied: Database wipe requires SUPER_ADMIN authorization.');
      return;
    }
    db.clearAllData();
    setDemoResetModal(false);
    window.location.reload();
  };

  const canResetSystem = hasPermission(currentUser.role, 'manage_system_reset');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Inactivity Security Warning Modal */}
      {idleWarning && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-300 max-w-md w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Security Inactivity Warning</h3>
            <p className="text-xs text-slate-600">
              No activity detected on your session. For data security, your administrative access will automatically lock in:
            </p>
            <div className="text-3xl font-mono font-extrabold text-amber-600">
              {idleRemaining}s
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-1/2 py-2 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign Out Now
              </button>
              <button
                type="button"
                onClick={() => {
                  lastActivityRef.current = Date.now();
                  setIdleWarning(false);
                }}
                className="w-1/2 py-2 px-3 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold shadow"
              >
                Keep Working
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-brand-navy text-white h-16 border-b border-brand-navy-light px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10 text-slate-300"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-brand-navy font-bold flex items-center justify-center text-sm shadow">
              <span>V</span>
              <span className="text-brand-orange">M</span>
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">
                VMOVE LOGISTICS
              </span>
              <span className="hidden sm:inline-block text-[11px] text-brand-orange font-semibold tracking-wider uppercase ml-2 px-2 py-0.5 rounded bg-white/10">
                Operations Desk
              </span>
            </div>
          </div>
        </div>

        {/* Right side status, LanguageSelector, & user profile */}
        <div className="flex items-center gap-3">
          {/* Admin Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector compact />
          </div>

          {/* DB mode indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] text-slate-300">
            <Database className="w-3.5 h-3.5 text-brand-orange" />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Encrypted Storage'}</span>
          </div>

          <button
            onClick={onBackToWebsite}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/10 text-xs text-slate-300 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* User info & RBAC badge */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-500/30">
                {getRoleDisplayName(currentUser.role)}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-md hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
              title="Sign Out (End Secure Session)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between shrink-0 shadow-sm">
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 flex items-center justify-between">
              <span>Management Modules</span>
              <span className="text-[9px] text-slate-400">RBAC Active</span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-brand-navy'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-orange' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-orange text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Tools */}
          <div className="p-4 border-t border-slate-200 space-y-2">
            {canResetSystem ? (
              <button
                onClick={() => setDemoResetModal(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-orange" />
                <span>Reset / Clear Demo Data</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-[10px] text-slate-500">
                Data reset restricted to Super Admin
              </div>
            )}
            <div className="px-3 py-1 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Vmove Security Hardened</span>
              <span>2026</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[80%] bg-white h-full flex flex-col justify-between shadow-2xl p-4 z-50">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
                  <div>
                    <span className="font-bold text-sm text-brand-navy block">Operations Menu</span>
                    <span className="text-[10px] text-brand-orange font-semibold">
                      {getRoleDisplayName(currentUser.role)}
                    </span>
                  </div>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="py-2">
                  <LanguageSelector compact={false} />
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-navy text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-brand-navy'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-orange' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-orange text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={onBackToWebsite}
                  className="w-full flex items-center justify-center gap-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Return to Website</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-1 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-md"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Super Admin Reset Modal */}
      {demoResetModal && canResetSystem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-brand-orange">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Database Tools (Super Admin)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have authorized system administration privileges. You can refresh mock records or wipe test data for benchmark verification.
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleResetDemo}
                className="w-full py-2.5 px-4 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-brand-orange" />
                <span>Reset to Standard Indian Logistics Seed Data</span>
              </button>
              <button
                type="button"
                onClick={handleClearDemo}
                className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Clear All Records (Empty System Test)</span>
              </button>
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setDemoResetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
