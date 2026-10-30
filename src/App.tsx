import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';

// Language Context
import { LanguageProvider } from './i18n/LanguageContext';

// Public Pages (Immediate render)
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { NetworkPage } from './pages/NetworkPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';

// Admin Types & Components (Code-Split / Lazy-Loaded to optimize initial bundle)
import type { AdminTab } from './components/admin/AdminLayout';
import { authService, AdminUser } from './lib/auth';
import { db } from './lib/db';
import { Enquiry, Quotation } from './types/database';

const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminLogin = lazy(() =>
  import('./components/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const DashboardOverview = lazy(() =>
  import('./components/admin/DashboardOverview').then((m) => ({ default: m.DashboardOverview }))
);
const EnquiryManagement = lazy(() =>
  import('./components/admin/EnquiryManagement').then((m) => ({ default: m.EnquiryManagement }))
);
const QuotationManagement = lazy(() =>
  import('./components/admin/QuotationManagement').then((m) => ({ default: m.QuotationManagement }))
);
const BookingManagement = lazy(() =>
  import('./components/admin/BookingManagement').then((m) => ({ default: m.BookingManagement }))
);
const CustomerManagement = lazy(() =>
  import('./components/admin/CustomerManagement').then((m) => ({ default: m.CustomerManagement }))
);
const TransporterManagement = lazy(() =>
  import('./components/admin/TransporterManagement').then((m) => ({ default: m.TransporterManagement }))
);
const PaymentManagement = lazy(() =>
  import('./components/admin/PaymentManagement').then((m) => ({ default: m.PaymentManagement }))
);
const AuditLogsView = lazy(() =>
  import('./components/admin/AuditLogsView').then((m) => ({ default: m.AuditLogsView }))
);

const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
    <div className="w-14 h-14 rounded-2xl bg-brand-navy border-2 border-brand-orange text-brand-orange flex items-center justify-center font-bold text-2xl shadow-xl animate-pulse mb-3">
      <span>V</span>
      <span className="text-white">M</span>
    </div>
    <div className="text-white text-xs font-bold tracking-widest uppercase animate-pulse">
      Loading Secure Operations Desk...
    </div>
    <div className="text-slate-500 text-[11px] mt-1">
      Vmove Logistics Enterprise IAM
    </div>
  </div>
);

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        return window.location.hash.replace('#', '') || '/';
      }
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => authService.getCurrentUser());
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [newEnquiryCount, setNewEnquiryCount] = useState<number>(0);

  // Cross-module action state
  const [enquiryForQuote, setEnquiryForQuote] = useState<Enquiry | null>(null);
  const [quoteToConvert, setQuoteToConvert] = useState<Quotation | null>(null);

  // Sync hash and pushState
  useEffect(() => {
    const handleNavigationSync = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPath(hash);
      } else if (window.location.pathname) {
        setCurrentPath(window.location.pathname);
      }
    };

    window.addEventListener('hashchange', handleNavigationSync);
    window.addEventListener('popstate', handleNavigationSync);
    return () => {
      window.removeEventListener('hashchange', handleNavigationSync);
      window.removeEventListener('popstate', handleNavigationSync);
    };
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '#' + path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    async function checkNew() {
      try {
        const enqs = await db.getEnquiries();
        const count = enqs.filter((e) => e.status === 'New').length;
        setNewEnquiryCount(count);
      } catch (e) {
        console.warn('Could not fetch new enquiry count', e);
      }
    }
    checkNew();
  }, [currentPath, adminTab]);

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    navigateTo('/admin');
  };

  const handleLogout = async () => {
    await authService.signOut();
    setAdminUser(null);
    navigateTo('/admin');
  };

  const handleCreateQuoteFromEnquiry = (enquiry: Enquiry) => {
    setEnquiryForQuote(enquiry);
    setAdminTab('quotations');
  };

  const handleConvertToBooking = (quote: Quotation) => {
    setQuoteToConvert(quote);
    setAdminTab('bookings');
  };

  // --------------------------------------------------------------------------
  // ADMIN PORTAL ROUTE (Lazy Loaded with Suspense)
  // --------------------------------------------------------------------------
  if (currentPath.startsWith('/admin')) {
    if (!adminUser) {
      return (
        <Suspense fallback={<AdminLoadingFallback />}>
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToWebsite={() => navigateTo('/')}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<AdminLoadingFallback />}>
        <AdminLayout
          currentUser={adminUser}
          currentTab={adminTab}
          onTabChange={setAdminTab}
          onLogout={handleLogout}
          onBackToWebsite={() => navigateTo('/')}
          newEnquiryCount={newEnquiryCount}
        >
          {adminTab === 'overview' && (
            <DashboardOverview onNavigateTab={setAdminTab} />
          )}

          {adminTab === 'enquiries' && (
            <EnquiryManagement
              onCreateQuoteFromEnquiry={handleCreateQuoteFromEnquiry}
            />
          )}

          {adminTab === 'quotations' && (
            <QuotationManagement
              initialEnquiryForQuote={enquiryForQuote}
              onClearInitialEnquiry={() => setEnquiryForQuote(null)}
              onConvertToBooking={handleConvertToBooking}
            />
          )}

          {adminTab === 'bookings' && (
            <BookingManagement initialQuoteToConvert={quoteToConvert} />
          )}

          {adminTab === 'customers' && <CustomerManagement />}

          {adminTab === 'transporters' && <TransporterManagement />}

          {adminTab === 'payments' && <PaymentManagement />}

          {adminTab === 'audit' && <AuditLogsView />}
        </AdminLayout>
      </Suspense>
    );
  }

  // --------------------------------------------------------------------------
  // PUBLIC WEBSITE ROUTES
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-orange selection:text-white">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        isAdminLoggedIn={Boolean(adminUser)}
      />

      <div className="flex-1">
        {currentPath === '/' && <HomePage onNavigate={navigateTo} />}
        {currentPath === '/about' && <AboutPage onNavigate={navigateTo} />}
        {currentPath === '/services' && <ServicesPage onNavigate={navigateTo} />}
        {currentPath === '/network' && <NetworkPage onNavigate={navigateTo} />}
        {currentPath === '/quote' && <QuotePage onNavigate={navigateTo} />}
        {currentPath === '/contact' && <ContactPage />}
      </div>

      <Footer onNavigate={navigateTo} />
      <WhatsAppButton />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
