import React from 'react';
import { Truck, Navigation, Layers, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ContactCTASection } from '../components/website/ContactCTASection';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const vehicleMatrix = [
    { type: '32ft Multi-Axle Container (MXL)', payload: '14 – 18 MT', volume: '1900 – 2100 cu ft', ideal: 'FMCG, White Goods, Light Industrial Machinery, Packaging rolls' },
    { type: '32ft Single-Axle Container (SXL)', payload: '7 – 9 MT', volume: '1800 cu ft', ideal: 'Automotive Components, Electronics, Textile Bales, Volumetric Cargo' },
    { type: '20ft / 24ft Closed Container', payload: '6 – 8 MT', volume: '1100 – 1300 cu ft', ideal: 'Intermediate industrial loads, Palletized chemical drums, Auto parts' },
    { type: '14ft / 19ft Open Body & Closed', payload: '3.5 – 7 MT', volume: 'Varies', ideal: 'Regional arterial feeds, Local industrial cluster transfers, Fabrications' },
    { type: '40ft High Bed / Semi-Low Trailer', payload: '22 – 30 MT', volume: 'Heavy Payload', ideal: 'Steel coils, Heavy engineering fabrications, Project machinery' },
  ];

  return (
    <main className="bg-white">
      {/* Header Banner */}
      <section className="bg-brand-navy text-white py-16 lg:py-20 border-b-4 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-white/10 px-3 py-1 rounded-full">
              B2B Freight Portfolio
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              Operational Logistics Services
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Vmove Logistics specializes in dedicated road transport and freight management for Indian enterprises. Every service is backed by verified fleet partnerships, itemized billing, and dedicated operational supervision.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Service 1: FTL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 p-8 sm:p-10 rounded-2xl border border-slate-200">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-orange-100 text-brand-orange text-xs font-bold uppercase">
                <Truck className="w-3.5 h-3.5" />
                <span>Primary Offering</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                1. Full Truck Load (FTL) Transportation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our Full Truck Load service provides dedicated, non-stop point-to-point transportation directly from your manufacturing plant or distribution center to the consignee destination. Because your cargo has sole occupancy of the vehicle, you benefit from direct transit speed without handling damage or multi-stop delays.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>32ft MXL &amp; SXL waterproof containers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>20ft &amp; 24ft intermediate container trucks</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Open-body heavy commercial vehicles</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Verified driver documentation &amp; RC compliance</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Ready to move a load?</span>
              <p className="text-sm font-bold text-brand-navy mt-1 mb-4">Get custom FTL lane rates</p>
              <button
                onClick={() => onNavigate('/quote')}
                className="w-full py-2.5 px-4 rounded bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors shadow-sm"
              >
                Request FTL Quote
              </button>
            </div>
          </div>

          {/* Service 2: Road Transportation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 p-8 sm:p-10 rounded-2xl border border-slate-200">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-200 text-slate-800 text-xs font-bold uppercase">
                <Navigation className="w-3.5 h-3.5 text-brand-orange" />
                <span>Interstate Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                2. Dedicated Interstate Road Transportation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We operate disciplined road transit across India’s core industrial highways, including the Western Freight Corridor (Delhi–Mumbai), Southern Arterial Belt (Pune–Bengaluru–Chennai), and Central Manufacturing corridors. We prioritize punctual placement windows and structured driver rest compliance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Pre-screened vehicle roadworthiness</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>National All-India Tourist/Goods permits</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Structured highway checkpoint updates</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Strict cargo lashing &amp; tarpaulin norms</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Corridor enquiry?</span>
              <p className="text-sm font-bold text-brand-navy mt-1 mb-4">Direct Operations Desk</p>
              <a
                href="tel:+917906308640"
                className="w-full py-2.5 px-4 rounded bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors"
              >
                Call +91 7906308640
              </a>
            </div>
          </div>

          {/* Service 3: Freight Management */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 p-8 sm:p-10 rounded-2xl border border-slate-200">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-200 text-slate-800 text-xs font-bold uppercase">
                <Layers className="w-3.5 h-3.5 text-brand-orange" />
                <span>Supply Chain Coordination</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                3. Freight Management &amp; Dispatch Governance
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                For commercial clients with recurring dispatch schedules, Vmove Logistics functions as an extension of your logistics department. We benchmark carrier spot and contract rates, supervise dispatch schedules, monitor E-way bill validity, and secure timely physical POD return for prompt billing cycles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Centralized booking and dispatch coordination</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>E-way bill and GST compliance oversight</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Electronic &amp; physical POD reconciliation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Monthly consolidated freight reporting</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Corporate Procurement?</span>
              <p className="text-sm font-bold text-brand-navy mt-1 mb-4">Discuss contracted freight</p>
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full py-2.5 px-4 rounded border border-slate-300 hover:bg-slate-50 text-brand-navy text-xs font-bold transition-colors"
              >
                Schedule Corporate Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet & Vehicle Matrix */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full">
              Standard Partner Vehicle Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-3">
              Fleet Vehicle Configuration Guide
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Our verified partner network provides a diverse selection of truck bodies and capacities suited for standard commercial cargo:
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-brand-navy text-white text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Vehicle Specification</th>
                  <th className="py-3.5 px-4">Payload Capacity</th>
                  <th className="py-3.5 px-4">Volumetric Space</th>
                  <th className="py-3.5 px-4">Typical Cargo Applications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vehicleMatrix.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy">{v.type}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{v.payload}</td>
                    <td className="py-3.5 px-4 text-slate-600">{v.volume}</td>
                    <td className="py-3.5 px-4 text-slate-600">{v.ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ContactCTASection onNavigate={onNavigate} />
    </main>
  );
};
