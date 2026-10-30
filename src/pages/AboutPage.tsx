import React from 'react';
import { ShieldCheck, Target, Eye, Compass, CheckCircle2, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { ContactCTASection } from '../components/website/ContactCTASection';
import { useTranslation } from '../i18n/LanguageContext';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const values = [
    {
      title: 'Operational Accountability',
      desc: 'We assume single-window responsibility for every booked load, ensuring clear communications from placement through to POD.',
    },
    {
      title: 'Carrier Rigour & Compliance',
      desc: 'We rigorously audit every transporter partner for legal registration, RTO fitness certificates, and national highway permits.',
    },
    {
      title: 'Commercial Transparency',
      desc: 'We provide itemized, honest freight rates without hidden surcharges, transit detention surprises, or confusing billing clauses.',
    },
    {
      title: 'Disciplined Execution',
      desc: 'Logistics succeeds on punctuality and adherence. We keep shippers informed with factual milestone tracking rather than false assurances.',
    },
  ];

  return (
    <main className="bg-white">
      {/* Page Header Banner */}
      <section className="bg-brand-navy text-white py-16 lg:py-20 border-b-4 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-white/10 px-3 py-1 rounded-full">
              {t('about.badge', 'Corporate Overview')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              {t('about.title', 'About Vmove Logistics')}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              {t('about.desc', 'Founded as a modern Indian B2B logistics enterprise committed to bringing professional governance, carrier transparency, and disciplined road transport execution to commercial supply chains.')}
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Our Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy leading-tight">
                {t('about.foundationTitle', 'An Agile, Verified Partner-Powered Transportation Model')}
              </h2>
              <p>
                <strong>Vmove Logistics</strong> was established with a clear objective: to address the chronic unpredictability, lack of carrier accountability, and opaque pricing that frequently plague mid-sized and enterprise B2B road freight in India.
              </p>
              <p>
                Rather than owning an unwieldy proprietary fleet of vehicles, we operate as an <strong>asset-light, highly disciplined logistics coordinator</strong>. We aggregate, vet, and contractually manage an expansive network of verified third-party fleet owners, regional transport operators, and dedicated container truck operators.
              </p>
              <div className="p-4 bg-slate-50 border-l-4 border-brand-orange rounded-r-lg text-xs sm:text-sm text-slate-600">
                <span className="font-bold text-brand-navy block mb-1">Commercial Transparency Note</span>
                Every vehicle deployed under the Vmove Logistics umbrella is sourced through audited, statutory-compliant partner carriers who have undergone strict verification for vehicle registration, permit validity, insurance, and driver authentication.
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-orange" />
                  Our Operational Tenets
                </h3>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>100% Verified Partners:</strong> No unverified sub-broker arrangements.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Full Statutory Adherence:</strong> E-Way bill reconciliation, valid national permits, and fitness.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Transparent Surcharges:</strong> Clearly structured loading, unloading, and detention protocols.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Direct Accountability:</strong> We act as your single commercial and operational point of contact.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-brand-orange mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">
                {t('about.missionTitle', 'Our Mission')}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('about.missionDesc', 'To deliver dependable, transparent, and technology-enabled freight transportation for Indian commerce by combining verified partner capacities with single-window accountability.')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-navy mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">
                {t('about.visionTitle', 'Our Vision')}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('about.visionDesc', "To become India's most trusted commercial road transport partner, recognized for uncompromising integrity, driver safety, and reliable highway delivery.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy mt-2">
              Our Core Operating Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 hover:border-brand-navy/30 transition-all shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-brand-navy/5 text-brand-navy font-bold flex items-center justify-center text-sm mb-4">
                  0{i + 1}
                </div>
                <h4 className="font-bold text-brand-navy text-base mb-2">{v.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTASection onNavigate={onNavigate} />
    </main>
  );
};
