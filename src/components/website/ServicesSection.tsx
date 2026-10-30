import React from 'react';
import { Truck, Navigation, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface ServicesSectionProps {
  onNavigate: (path: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const activeServices = [
    {
      id: 'ftl',
      title: t('services.ftlTitle'),
      badge: 'Core Service',
      icon: Truck,
      description: t('services.ftlDesc'),
      features: [
        '32ft MXL & SXL closed container fleet',
        '20ft & 24ft intermediate payload trucks',
        'Open body trucks for heavy industrial freight',
        'Direct consignor-to-consignee road transit',
      ],
      suitableFor: 'Manufacturing, Automotive, Engineering, Consumer Goods, Packaging',
    },
    {
      id: 'road',
      title: t('services.roadTitle'),
      badge: 'Interstate Corridors',
      icon: Navigation,
      description: t('services.roadDesc'),
      features: [
        'Coverage across primary western, northern, & southern routes',
        'Vetted driver documentation and valid national permits',
        'Strict highway safety protocols and transit coordination',
        'Structured transit checkpoints and milestone reporting',
      ],
      suitableFor: 'Raw Materials, Machinery, Industrial Equipment, Steel & Metal Goods',
    },
    {
      id: 'freight-mgmt',
      title: t('services.mgmtTitle'),
      badge: 'Operational Value',
      icon: Layers,
      description: t('services.mgmtDesc'),
      features: [
        'Single point of operational contact',
        'Competitive carrier rate benchmarking',
        'Electronic documentation and GST/E-way compliance',
        'Physical and electronic Proof of Delivery (POD) processing',
      ],
      suitableFor: 'Supply Chain Heads, Plant Dispatch Managers, Procurement Teams',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3 py-1 rounded-full">
            {t('services.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3">
            {t('services.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('services.desc')}
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-7 shadow-sm hover:shadow-premium hover:border-brand-navy/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 text-brand-navy group-hover:bg-brand-orange group-hover:text-white transition-colors flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy mb-3">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Key Capabilities:
                    </h4>
                    <ul className="space-y-1.5">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 mb-3">
                    <strong className="text-slate-700">Cargo:</strong> {service.suitableFor}
                  </div>
                  <button
                    onClick={() => onNavigate('/quote')}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-slate-100 hover:bg-brand-navy hover:text-white text-brand-navy text-xs font-bold transition-all"
                  >
                    <span>{t('services.quoteBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
