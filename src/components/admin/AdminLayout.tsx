import React, { useState } from 'react';
import { AdminUser } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';
import { db } from '../../lib/db';
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
  AlertTriangle
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

  const navItems = [
    { id: 'overview' as const, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'enquiries' as const, label: 'Freight Enquiries', icon: Inbox, badge: newEnquiryCount },
    { id: 'quotations' as const, label: 'Quotations Management', icon: FileText },
    { id: 'bookings' as const, label: 'Bookings & Tracking', icon: PackageCheck },
    { id: 'customers' as const, label: 'Customer Directory', icon: Users },
    { id: 'transporters' as const, label: 'Transporters Directory', icon: Truck },
    { id: 'payments' as const, label: 'Operational Payments', icon: CreditCard },
    { id: 'audit' as const, label: 'Audit Logs & DB Tools', icon: ShieldCheck },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setMobileSidebarOpen(false);
  };

  const handleResetDemo = () => {
    db.resetToDemoData();
    setDemoResetModal(false);
    window.location.reload();
  };

  const handleClearDemo = () => {
    db.clearAllData();
    setDemoResetModal(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
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

        {/* Right side status & user profile */}
        <div className="flex items-center gap-3">
          {/* DB mode indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] text-slate-300">
            <Database className="w-3.5 h-3.5 text-brand-orange" />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Storage DB'}</span>
          </div>

          <button
            onClick={onBackToWebsite}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/10 text-xs text-slate-300 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-brand-orange uppercase font-semibold">
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-md hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
              title="Sign Out"
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
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Management Modules
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
            <button
              onClick={() => setDemoResetModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-brand-orange" />
              <span>Reset / Clear Demo Data</span>
            </button>
            <div className="px-3 py-1 text-[10px] text-slate-400">
              Vmove Admin v1.0 &bull; 2026
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
                  <span className="font-bold text-sm text-brand-navy">Operations Menu</span>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                        isActive
                          ? 'bg-brand-navy text-white'
                          : 'text-slate-700 hover:bg-slate-100'
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

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Demo Data Management Modal */}
      {demoResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Demo Data Operations</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              As required by enterprise specifications, demo records are clearly segregated and can be reset or wiped clean at any time.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleResetDemo}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-orange" />
                <span>Reload Indian Logistics Demo Seed Data</span>
              </button>

              <button
                onClick={handleClearDemo}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wipe All Demo Data (Clean Empty Database)</span>
              </button>

              <button
                onClick={() => setDemoResetModal(false)}
                className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
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
