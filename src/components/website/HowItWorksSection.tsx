import React from 'react';
import { ClipboardList, Calculator, Truck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      step: '01',
      title: t('how.step1Title'),
      desc: t('how.step1Desc'),
      icon: ClipboardList,
    },
    {
      step: '02',
      title: t('how.step2Title'),
      desc: t('how.step2Desc'),
      icon: Calculator,
    },
    {
      step: '03',
      title: t('how.step3Title'),
      desc: t('how.step3Desc'),
      icon: Truck,
    },
    {
      step: '04',
      title: t('how.step4Title'),
      desc: t('how.step4Desc'),
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3 py-1 rounded-full">
            {t('how.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3">
            {t('how.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('how.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative group hover:shadow-subtle transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center font-bold text-sm">
                    <Icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-brand-orange/40 transition-colors font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-brand-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
