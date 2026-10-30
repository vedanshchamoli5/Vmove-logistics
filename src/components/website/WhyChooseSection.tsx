import React from 'react';
import { ShieldCheck, FileSpreadsheet, UserCheck, Award, Clock } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export const WhyChooseSection: React.FC = () => {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: ShieldCheck,
      title: t('why.reason1Title'),
      description: t('why.reason1Desc'),
    },
    {
      icon: FileSpreadsheet,
      title: t('why.reason2Title'),
      description: t('why.reason2Desc'),
    },
    {
      icon: UserCheck,
      title: t('why.reason3Title'),
      description: t('why.reason3Desc'),
    },
    {
      icon: Clock,
      title: t('why.reason4Title'),
      description: t('why.reason4Desc'),
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full">
              {t('why.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy leading-tight">
              {t('why.title')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t('why.desc')}
            </p>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-brand-navy font-bold text-sm">
                <Award className="w-5 h-5 text-brand-orange" />
                <span>Our Operational Standard</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "We do not promise owned thousands of trucks we don't have. Instead, we guarantee rigorous carrier due diligence, transparent freight rates, and single-window accountability on every single trip."
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-slate-200 bg-white hover:border-brand-navy/30 hover:shadow-subtle transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-100/70 text-brand-orange flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-brand-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
