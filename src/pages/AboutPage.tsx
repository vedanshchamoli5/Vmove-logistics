import React from 'react';
import { ShieldCheck, Target, Eye, Compass, CheckCircle2, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { ContactCTASection } from '../components/website/ContactCTASection';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
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
              Corporate Overview
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              About Vmove Logistics
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Founded as a modern Indian B2B logistics enterprise committed to bringing professional governance, carrier transparency, and disciplined road transport execution to commercial supply chains.
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
                An Agile, Verified Partner-Powered Transportation Model
              </h2>
              <p>
                <strong>Vmove Logistics</strong> was established with a clear objective: to address the chronic unpredictability, lack of carrier accountability, and opaque pricing that frequently plague mid-sized and enterprise B2B road freight in India.
              </p>
              <p>
                Rather than tying capital into an owned vehicle fleet, we operate an <em>asset-light, partner-driven transportation model</em>. We cultivate direct, audited relationships with verified third-party fleet operators and independent truck owners across major industrial corridors.
              </p>
              <p>
                This agile structure enables us to provide our clients with customized vehicle configurations—from 32ft multi-axle containers to 14ft local transfer trucks—without fleet limitations, while enforcing rigorous transit safety and SLA compliance on every load.
              </p>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-brand-navy border-b border-slate-200 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-orange" />
                <span>Our Operational Identity</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Business Model:</strong> Asset-light freight management via verified transportation partners</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Target Sector:</strong> B2B manufacturing, automotive, engineering, and packaging industries</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Primary Focus:</strong> Dedicated Full Truck Load (FTL) and interstate highway freight</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Headquarters Desk:</strong> India [Official Registered Office Placeholder]</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-xs text-slate-500 block mb-1">Direct Operations Desk:</span>
                <a href="tel:+917906308640" className="text-base font-extrabold text-brand-navy hover:text-brand-orange">
                  +91 7906308640
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-orange-100/70 text-brand-orange flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To simplify commercial road transportation across India by delivering transparent, dependable, and meticulously managed freight solutions that empower manufacturers and enterprises to move their cargo with absolute confidence.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-brand-navy/10 text-brand-navy flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To establish Vmove Logistics as India’s most dependable and transparent asset-light freight management partner, recognized for exceptional carrier partner vetting, operational integrity, and responsive customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full">
              Guiding Principles
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
              Core Operational Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-200 bg-white hover:border-brand-navy/30 hover:shadow-subtle transition-all">
                <div className="text-brand-orange font-bold text-sm mb-2">0{i + 1}.</div>
                <h4 className="text-base font-bold text-brand-navy mb-2">{v.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTASection onNavigate={onNavigate} />
    </main>
  );
};
