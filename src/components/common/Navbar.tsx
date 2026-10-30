import React, { useState } from 'react';
import { Phone, MessageSquare, Shield, Menu, X, ArrowRight, Truck } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.network'), path: '/network' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top utility bar */}
      <div className="bg-brand-navy text-slate-300 text-xs py-2 px-4 border-b border-brand-navy-light/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <span>{t('brand.operations')}</span>
              <a href="tel:+917906308640" className="font-semibold text-white hover:text-brand-orange transition-colors">
                +91 7906308640
              </a>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:inline-block text-slate-300">
              {t('brand.subtext')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Multilingual Selector */}
            <LanguageSelector compact />

            <span className="text-slate-600">|</span>

            <a
              href="https://wa.me/917906308640?text=Hello%20Vmove%20Logistics%2C%20I%20would%20like%20to%20enquire%20about%20freight%20transportation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav.whatsapp')}</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            <span className="text-slate-600">|</span>

            <button
              onClick={() => handleNav('/admin')}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              title="Secure Operations Portal"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAdminLoggedIn ? t('nav.admin') : t('nav.login')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-11 h-11 rounded-lg bg-brand-navy flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-brand-navy-light transition-colors border border-slate-700">
              <span className="text-white">V</span>
              <span className="text-brand-orange -ml-0.5">M</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-brand-navy font-sans">
                  VMOVE
                </span>
                <span className="text-2xl font-light text-slate-600">LOGISTICS</span>
              </div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-brand-orange">
                {t('brand.tagline')}
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-sm font-semibold transition-colors py-2 relative ${
                    isActive
                      ? 'text-brand-orange'
                      : 'text-slate-700 hover:text-brand-navy'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => handleNav('/quote')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-hover transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <span>{t('nav.quote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNav('/quote')}
              className="px-3 py-1.5 rounded bg-brand-orange text-white text-xs font-semibold"
            >
              {t('nav.quote').split(' ')[0]}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-brand-navy hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          {/* Mobile Language Selector */}
          <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Language / भाषा:</span>
            <LanguageSelector />
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-brand-orange'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-brand-navy'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => handleNav('/quote')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-brand-orange text-white font-semibold text-sm shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>{t('nav.quote')}</span>
            </button>
            <a
              href="tel:+917906308640"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-slate-300 text-slate-800 font-medium text-sm hover:bg-slate-50"
            >
              <Phone className="w-4 h-4 text-brand-orange" />
              <span>Call +91 7906308640</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
