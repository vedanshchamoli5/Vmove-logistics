import React from 'react';
import { ArrowRight, Phone, ShieldCheck, CheckCircle, Truck } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-b from-brand-navy-dark via-brand-navy to-brand-navy-light text-white overflow-hidden py-20 lg:py-28">
      {/* Background geometric accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Message */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-brand-orange text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              <span>{t('hero.badge')}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                {t('hero.title1')} <br />
                <span className="text-brand-orange">{t('hero.title2')}</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-slate-300">
                {t('brand.tagline')}
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {t('hero.desc')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/quote')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-brand-orange text-white text-sm font-bold tracking-wide uppercase hover:bg-brand-orange-hover shadow-lg hover:shadow-xl transition-all"
              >
                <span>{t('hero.quoteBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+917906308640"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-orange" />
                <span>{t('hero.callBtn')}</span>
              </a>
            </div>

            {/* Credibility highlights */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">{t('hero.feature1')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">{t('hero.feature2')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">{t('hero.feature3')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Corporate Freight Card / Metric Visualizer */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-white/30 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t('hero.activeTitle')}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-brand-orange bg-orange-50 px-2 py-0.5 rounded">
                  B2B Road Freight
                </span>
              </div>

              {/* Corridor snapshot */}
              <div className="py-5 space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>{t('hero.lane1')}</span>
                    <span className="text-emerald-600 font-bold">Standard SLA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-brand-navy">
                    <span>Delhi NCR</span>
                    <div className="flex items-center px-2">
                      <div className="h-0.5 w-12 bg-slate-300 relative">
                        <Truck className="w-3.5 h-3.5 text-brand-orange absolute -top-1.5 left-1/2 -translate-x-1/2" />
                      </div>
                    </div>
                    <span>Mumbai / JNPT</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    32ft MXL Container &bull; 48-60 Hrs Transit
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>{t('hero.lane2')}</span>
                    <span className="text-emerald-600 font-bold">Standard SLA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-brand-navy">
                    <span>Pune MIDC</span>
                    <div className="flex items-center px-2">
                      <div className="h-0.5 w-12 bg-slate-300 relative">
                        <Truck className="w-3.5 h-3.5 text-brand-orange absolute -top-1.5 left-1/2 -translate-x-1/2" />
                      </div>
                    </div>
                    <span>Bengaluru / Peenya</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    32ft SXL Container &bull; 24-30 Hrs Transit
                  </p>
                </div>
              </div>

              {/* Service pledge card */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">{t('brand.operations')}</span>
                  <a href="tel:+917906308640" className="text-sm font-extrabold text-brand-navy hover:text-brand-orange">
                    +91 7906308640
                  </a>
                </div>
                <button
                  onClick={() => onNavigate('/quote')}
                  className="px-4 py-2 rounded bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors"
                >
                  {t('nav.quote')} &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
