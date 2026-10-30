import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';

// Language Context
import { LanguageProvider } from './i18n/LanguageContext';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { NetworkPage } from './pages/NetworkPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { EnquiryManagement } from './components/admin/EnquiryManagement';
import { QuotationManagement } from './components/admin/QuotationManagement';
import { BookingManagement } from './components/admin/BookingManagement';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { TransporterManagement } from './components/admin/TransporterManagement';
import { PaymentManagement } from './components/admin/PaymentManagement';
import { AuditLogsView } from './components/admin/AuditLogsView';

// Auth and DB
import { authService, AdminUser } from './lib/auth';
import { db } from './lib/db';
import { Enquiry, Quotation } from './types/database';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => authService.getCurrentUser());
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [newEnquiryCount, setNewEnquiryCount] = useState<number>(0);

  // Cross-module action state
  const [enquiryForQuote, setEnquiryForQuote] = useState<Enquiry | null>(null);
  const [quoteToConvert, setQuoteToConvert] = useState<Quotation | null>(null);

  // Sync hash with path
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
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
  // ADMIN PORTAL ROUTE
  // --------------------------------------------------------------------------
  if (currentPath.startsWith('/admin')) {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentUser={adminUser}
        currentTab={adminTab}
        onTabChange={setAdminTab}
        onLogout={handleLogout}
        onBackToWebsite={() => navigateTo('/')}
        newEnquiryCount={newEnquiryCount}
      >
        {adminTab === 'overview' && (
          <DashboardOverview
            onNavigateTab={setAdminTab}
          />
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
          <BookingManagement
            initialQuoteToConvert={quoteToConvert}
          />
        )}

        {adminTab === 'customers' && <CustomerManagement />}

        {adminTab === 'transporters' && <TransporterManagement />}

        {adminTab === 'payments' && <PaymentManagement />}

        {adminTab === 'audit' && <AuditLogsView />}
      </AdminLayout>
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
