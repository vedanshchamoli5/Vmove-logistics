import React from 'react';
import { NetworkSection } from '../components/website/NetworkSection';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileCheck, Truck } from 'lucide-react';
import { ContactCTASection } from '../components/website/ContactCTASection';

interface NetworkPageProps {
  onNavigate: (path: string) => void;
}

export const NetworkPage: React.FC<NetworkPageProps> = ({ onNavigate }) => {
  const verificationSteps = [
    { title: 'RC & RTO Fitness Check', desc: 'Valid registration certificate, mandatory mechanical fitness certification, and non-expired state pollution certificates verified through national transport databases.' },
    { title: 'National & State Permits', desc: 'Verification of All-India Goods Carriage Permits and valid interstate taxation authorizations to eliminate route border detentions.' },
    { title: 'Driver Identity & License Audit', desc: 'Commercial heavy vehicle driver license validation, active phone linkage, and background checks prior to load handover.' },
    { title: 'Cargo Safety & Lashing Standards', desc: 'Inspection of container seal integrity, waterproof tarpaulins, side-railing locks, and cargo strapping hardware.' },
  ];

  return (
    <main className="bg-white">
      {/* Header Banner */}
      <section className="bg-brand-navy text-white py-16 lg:py-20 border-b-4 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-white/10 px-3 py-1 rounded-full">
              Route Coverage &amp; Governance
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              Our Serviceable Network
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Vmove Logistics coordinates commercial freight along high-capacity Indian manufacturing arteries. We prioritize dependable operational execution over unverified nationwide claims.
            </p>
          </div>
        </div>
      </section>

      {/* Network Corridors Explorer */}
      <NetworkSection onNavigate={onNavigate} />

      {/* Carrier Partner Verification Standards */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3 py-1 rounded-full">
              Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-3">
              How We Audit &amp; Verify Transportation Partners
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Because Vmove Logistics operates via partner fleets, our carrier vetting protocol is the cornerstone of our service quality. We never compromise on legal and mechanical standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationSteps.map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-brand-navy text-brand-orange flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-brand-navy">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-brand-orange shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-navy">Are you an established transporter with verified vehicles?</h4>
                <p className="text-xs text-slate-500">Contact our fleet onboarding team at 7906308640 to register your operating lanes.</p>
              </div>
            </div>
            <a
              href="tel:+917906308640"
              className="px-5 py-2.5 rounded bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors shrink-0"
            >
              Fleet Onboarding Desk
            </a>
          </div>
        </div>
      </section>

      <ContactCTASection onNavigate={onNavigate} />
    </main>
  );
};
