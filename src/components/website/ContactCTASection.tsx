import React from 'react';
import { Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface ContactCTASectionProps {
  onNavigate: (path: string) => void;
}

export const ContactCTASection: React.FC<ContactCTASectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="bg-brand-navy py-16 relative overflow-hidden text-white border-y border-brand-navy-light">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-white/10 px-3 py-1 rounded-full inline-block">
              {t('cta.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {t('cta.title')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t('cta.desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <a
              href="tel:+917906308640"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-brand-orange text-white text-sm font-bold tracking-wide uppercase hover:bg-brand-orange-hover transition-all shadow-md active:scale-[0.99]"
            >
              <Phone className="w-4 h-4" />
              <span>{t('cta.call')}</span>
            </a>

            <a
              href="https://wa.me/917906308640?text=Hi%20Vmove%20Logistics%2C%20I%20have%20an%20urgent%20freight%20enquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1EBE5D] transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('cta.whatsapp')}</span>
            </a>

            <button
              onClick={() => onNavigate('/quote')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
            >
              <span>{t('cta.quote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
