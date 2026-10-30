import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <main className="bg-white">
      {/* Header Banner */}
      <section className="bg-brand-navy text-white py-16 lg:py-20 border-b-4 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-white/10 px-3 py-1 rounded-full">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              Contact Vmove Logistics
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Reach our commercial and operations team for lane enquiries, rate negotiations, or corporate logistics partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-2xl font-extrabold text-brand-navy">
                Corporate Communications
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Whether you have an immediate spot FTL requirement or wish to discuss long-term contracted freight management, our team is directly accessible.
              </p>

              <div className="space-y-4 pt-2">
                {/* Phone Card */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100/70 text-brand-orange flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      Commercial &amp; Operations Phone
                    </span>
                    <a
                      href="tel:+917906308640"
                      className="text-lg font-extrabold text-brand-navy hover:text-brand-orange transition-colors"
                    >
                      +91 7906308640
                    </a>
                    <p className="text-[11px] text-slate-500 mt-0.5">Direct line to dispatch coordinators</p>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-800 font-semibold block uppercase">
                      WhatsApp Quick Chat
                    </span>
                    <a
                      href="https://wa.me/917906308640?text=Hi%20Vmove%20Logistics%2C%20I%20have%20an%20enquiry"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-emerald-700 hover:underline"
                    >
                      Connect on WhatsApp (+91 7906308640)
                    </a>
                    <p className="text-[11px] text-emerald-700/80 mt-0.5">Fast response for route feasibility</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-brand-navy flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      Email Inquiries
                    </span>
                    <a
                      href="mailto:contact@vmovelogistics.com"
                      className="text-sm font-bold text-brand-navy hover:text-brand-orange"
                    >
                      contact@vmovelogistics.com
                    </a>
                    <p className="text-[11px] text-slate-500 mt-0.5">Billing &amp; procurement communications</p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-brand-navy flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      Corporate Address
                    </span>
                    <p className="text-xs font-medium text-slate-800 mt-0.5">
                      [Registered Office Address Placeholder, Industrial Logistics Zone, India]
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">CIN / GSTIN: [Placeholder info on file]</p>
                  </div>
                </div>

                {/* Hours Card */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-brand-navy flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      Working Hours
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      Mon – Sat: 09:00 AM – 07:00 PM IST
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      24/7 Operations Desk active for live road transit
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form & Map Placeholder */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-xl border border-slate-200 shadow-premium p-6 sm:p-8">
                <h3 className="text-xl font-bold text-brand-navy mb-2">
                  Send a General Message
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mb-6">
                  For freight quotes, please use our dedicated <span className="font-semibold text-brand-orange">Get a Quote</span> page. For other queries, submit the form below.
                </p>

                {submitted ? (
                  <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="text-lg font-bold text-brand-navy">Message Received</h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Thank you for contacting Vmove Logistics. Our team will review your message and reply promptly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-3 px-4 py-2 rounded bg-brand-navy text-white text-xs font-semibold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Contact Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Subject / Inquiry Type
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Transporter Onboarding / Billing"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Message / Query *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Please describe your enquiry in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-md bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-navy-light transition-all shadow-sm"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Map Placeholder Card */}
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50">
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-brand-orange" />
                    <span>Regional Operating Base (India)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Location Placeholder</span>
                </div>
                <div className="h-64 bg-slate-200 relative flex items-center justify-center p-6 text-center">
                  {/* Stylized map graphic */}
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center mx-auto shadow-md">
                      <MapPin className="w-6 h-6 text-brand-orange" />
                    </div>
                    <p className="text-xs font-bold text-brand-navy">Vmove Logistics Operating Hubs</p>
                    <p className="text-[11px] text-slate-500 max-w-sm">
                      Interactive Google Maps API embed placeholder. Operations coordinated across Western, Northern, and Southern freight centers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
