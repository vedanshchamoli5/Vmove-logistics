import React from 'react';
import { QuoteForm } from '../components/website/QuoteForm';
import { Phone, MessageSquare, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface QuotePageProps {
  onNavigate: (path: string) => void;
}

export const QuotePage: React.FC<QuotePageProps> = () => {
  return (
    <main className="bg-slate-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Context & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3 py-1 rounded-full">
                Fast Commercial Quotation
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-3 leading-tight">
                Request a Dedicated Freight Quote
              </h1>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Provide your freight specifications below. Our operations desk will analyze the route, verify partner fleet availability, and issue a transparent itemized quotation.
              </p>
            </div>

            {/* Direct contact shortcuts */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Prefer Speaking Directly?
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Freight Operations Desk:</span>
                  <a
                    href="tel:+917906308640"
                    className="text-base font-extrabold text-brand-navy hover:text-brand-orange transition-colors"
                  >
                    +91 7906308640
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">WhatsApp Desk:</span>
                  <a
                    href="https://wa.me/917906308640?text=Hi%20Vmove%20Logistics%2C%20I%20need%20a%20freight%20rate%20estimate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-700 hover:underline"
                  >
                    Chat with Us at 7906308640
                  </a>
                </div>
              </div>
            </div>

            {/* What Happens Next Card */}
            <div className="p-6 bg-brand-navy text-white rounded-xl border border-brand-navy-light space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-orange flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>What Happens After Submission?</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange font-bold">1.</span>
                  <span>Your enquiry is logged with a unique reference number (e.g. <code>VM-ENQ-XXXX</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange font-bold">2.</span>
                  <span>Our desk checks verified carrier availability and current diesel corridor indices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange font-bold">3.</span>
                  <span>We contact you with a formal quote including base freight, GST, and delivery SLA.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <QuoteForm />
          </div>
        </div>
      </div>
    </main>
  );
};
