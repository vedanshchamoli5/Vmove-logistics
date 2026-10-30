import React, { useState } from 'react';
import { Navigation, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface NetworkSectionProps {
  onNavigate?: (path: string) => void;
}

export const NetworkSection: React.FC<NetworkSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'west' | 'north' | 'south'>('all');

  const corridors = [
    {
      id: 'del-mum',
      region: 'north',
      route: 'Delhi NCR — Mumbai Corridor',
      hubs: 'Gurugram, Manesar, Jaipur, Ahmedabad, Bhiwandi, JNPT',
      transitTime: '48 - 60 Hours',
      vehicleTypes: '32ft MXL/SXL Containers, 20ft Containers',
      cargoCategory: 'Automotive Spares, Consumer Electronics, FMCG, Engineering Goods',
      status: 'Active Primary Corridor',
    },
    {
      id: 'pune-blr',
      region: 'west',
      route: 'Pune (MIDC) — Bengaluru (Peenya / Hosur)',
      hubs: 'Bhosari, Chakan, Kolhapur, Belagavi, Hubballi, Peenya',
      transitTime: '24 - 30 Hours',
      vehicleTypes: '19ft Closed, 32ft SXL Container, 14ft Open',
      cargoCategory: 'Machined Castings, Auto Components, Industrial Cables',
      status: 'Active Primary Corridor',
    },
    {
      id: 'mum-hyd',
      region: 'west',
      route: 'Mumbai / Pune — Hyderabad Belt',
      hubs: 'Navi Mumbai, Solapur, Hyderabad, Medchal, Patancheru',
      transitTime: '20 - 28 Hours',
      vehicleTypes: '20ft Container, 32ft MXL',
      cargoCategory: 'Pharma Packaging, General Cargo, Heavy Machinery',
      status: 'Active Primary Corridor',
    },
    {
      id: 'guj-mum',
      region: 'west',
      route: 'Gujarat Industrial Belt — Maharashtra',
      hubs: 'Ahmedabad, Vadodara, Surat, Vapi, Mumbai',
      transitTime: '14 - 20 Hours',
      vehicleTypes: '14ft, 19ft, 32ft SXL',
      cargoCategory: 'Textiles, Dyes & Chemicals, Plastic Polymers',
      status: 'Active Primary Corridor',
    },
    {
      id: 'chn-blr',
      region: 'south',
      route: 'Chennai — Bengaluru Expressway Corridor',
      hubs: 'Ambattur, Sriperumbudur, Ranipet, Hosur, Bengaluru',
      transitTime: '10 - 14 Hours',
      vehicleTypes: '14ft Open, 20ft Container, 32ft SXL',
      cargoCategory: 'Electronic Sub-assemblies, Hardware, Precision Tools',
      status: 'Active Primary Corridor',
    },
    {
      id: 'ind-ahd',
      region: 'north',
      route: 'Indore / Central India — Western Hubs',
      hubs: 'Pithampur, Indore, Ujjain, Godhra, Ahmedabad',
      transitTime: '18 - 24 Hours',
      vehicleTypes: '32ft MXL Container, Open Body Trucks',
      cargoCategory: 'Agro Packaging, Pharma Intermediate, Engineering Spares',
      status: 'Active Primary Corridor',
    },
  ];

  const filtered = selectedRegion === 'all'
    ? corridors
    : corridors.filter(c => c.region === selectedRegion);

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full">
            {t('network.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3">
            {t('network.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('network.desc')}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left">
            <span>
              <strong>Operational Transparency:</strong> {t('network.transparencyNotice')}
            </span>
          </div>
        </div>

        {/* Region filter tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedRegion === 'all' ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              {t('network.all')}
            </button>
            <button
              onClick={() => setSelectedRegion('west')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedRegion === 'west' ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              {t('network.west')}
            </button>
            <button
              onClick={() => setSelectedRegion('north')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedRegion === 'north' ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              {t('network.north')}
            </button>
            <button
              onClick={() => setSelectedRegion('south')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedRegion === 'south' ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              {t('network.south')}
            </button>
          </div>
        </div>

        {/* Corridors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-premium hover:border-brand-navy/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.status}
                  </span>
                  <span className="text-xs font-semibold text-brand-orange">
                    {item.transitTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>{item.route}</span>
                </h3>

                <div className="space-y-2 text-xs text-slate-600 my-4">
                  <div>
                    <span className="font-semibold text-slate-700 block">Transit Hubs:</span>
                    <span className="text-slate-500">{item.hubs}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Fleet Types:</span>
                    <span className="text-slate-500">{item.vehicleTypes}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Cargo Handled:</span>
                    <span className="text-slate-500">{item.cargoCategory}</span>
                  </div>
                </div>
              </div>

              {onNavigate && (
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('/quote')}
                    className="w-full flex items-center justify-center gap-1 text-xs font-bold text-brand-navy hover:text-brand-orange transition-colors"
                  >
                    <span>{t('network.enquire')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
