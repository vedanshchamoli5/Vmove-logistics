import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-8 border-t-4 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-700/60">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-lg text-brand-navy">
                <span>V</span>
                <span className="text-brand-orange">M</span>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  VMOVE <span className="font-light text-slate-300">LOGISTICS</span>
                </span>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-brand-orange">
                  {t('brand.tagline')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t('hero.desc')}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('brand.verifiedModel')}</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t('footer.servicesTitle')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('services.ftlTitle')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('services.roadTitle')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('services.mgmtTitle')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/network')}
                  className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('nav.network')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/quote')}
                  className="text-brand-orange hover:underline font-semibold flex items-center gap-1.5 mt-2"
                >
                  <ArrowRight className="w-3 h-3 text-brand-orange" />
                  <span>{t('nav.quote')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t('footer.companyTitle')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-brand-orange transition-colors">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-brand-orange transition-colors">
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/network')} className="hover:text-brand-orange transition-colors">
                  {t('nav.network')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-brand-orange transition-colors">
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-slate-400 hover:text-white transition-colors">
                  {t('nav.admin')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t('footer.contactTitle')}
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">{t('brand.operations')}</span>
                  <a href="tel:+917906308640" className="font-semibold text-white hover:text-brand-orange transition-colors">
                    +91 7906308640
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">General Freight Inquiries:</span>
                  <a href="mailto:contact@vmovelogistics.com" className="hover:text-white transition-colors">
                    contact@vmovelogistics.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Office Address:</span>
                  <p className="text-slate-400">
                    [Office Address Placeholder, Industrial Logistics Zone, India]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Business Hours:</span>
                  <p>{t('footer.hours')}</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">{t('footer.support247')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Vmove Logistics. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>CIN: [Registration Placeholder]</span>
            <span>•</span>
            <span>GSTIN: [GSTIN Placeholder]</span>
            <span>•</span>
            <span>{t('brand.verifiedModel')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
