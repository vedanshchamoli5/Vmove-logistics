import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();

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
              {t('contact.badge', 'Get In Touch')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              {t('contact.title', 'Contact Vmove Logistics')}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              {t('contact.desc', 'Reach our commercial and operations team for lane enquiries, rate negotiations, or corporate logistics partnerships.')}
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
                {t('contact.badge', 'Corporate Communications')}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Whether you have an immediate spot FTL requirement or wish to discuss long-term contracted freight management, our team is directly accessible.
              </p>

              <div className="space-y-4 pt-2">
                {/* Phone Card */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-orange shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      {t('contact.phoneTitle', 'Operations Desk')}
                    </h4>
                    <a
                      href="tel:+917906308640"
                      className="text-base sm:text-lg font-bold text-brand-navy hover:text-brand-orange transition-colors block mt-0.5"
                    >
                      +91 7906308640
                    </a>
                    <span className="text-xs text-slate-500">Direct Operations &amp; Dispatch Line</span>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-orange shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      {t('contact.emailTitle', 'Commercial Enquiries')}
                    </h4>
                    <a
                      href="mailto:operations@vmovelogistics.com"
                      className="text-sm sm:text-base font-bold text-brand-navy hover:text-brand-orange transition-colors block mt-0.5"
                    >
                      operations@vmovelogistics.com
                    </a>
                    <span className="text-xs text-slate-500">Official Freight Despatch &amp; RFQs</span>
                  </div>
                </div>

                {/* WhatsApp Quick Link */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                      WhatsApp Quick Desk
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 mb-2">
                      Instant response for corridor availability and truck placement.
                    </p>
                    <a
                      href="https://wa.me/917906308640?text=Hello%20Vmove%20Logistics%2C%20I%20would%20like%20to%20enquire%20about%20freight%20transportation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat on WhatsApp (+91 7906308640)
                    </a>
                  </div>
                </div>

                {/* Office Placeholder */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-orange shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      {t('contact.officeTitle', 'Registered Office')}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                      Vmove Logistics Commercial Hub
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sector 18, Commercial Belt, Gurugram / Delhi NCR &bull; India
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-orange shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      {t('contact.hoursTitle', 'Operating Hours')}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
                      Monday &ndash; Saturday: 09:00 AM &ndash; 07:00 PM IST
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      24/7 Operations Desk available for active, in-transit consignments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Direct Inquiries
                </span>
                <h3 className="text-2xl font-extrabold text-brand-navy mt-1 mb-2">
                  {t('contact.formTitle', 'Send Operational Message')}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mb-8 leading-relaxed">
                  {t('contact.formDesc', 'Submit an enquiry or question regarding lane operations.')}
                </p>

                {submitted ? (
                  <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-900">
                      {t('contact.sentTitle', 'Message Dispatched')}
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                      {t('contact.sentDesc', 'Thank you for reaching out. A Vmove logistics coordinator will respond shortly.')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
                      }}
                      className="inline-block mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          {t('contact.name', 'Your Name')} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          {t('contact.phone', 'Phone Number')} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@company.com"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          {t('contact.subject', 'Subject / Corridor')}
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g. Delhi - Mumbai Monthly Requirement"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        {t('contact.message', 'Message / Inquiry')} <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Detail your transport requirement, cargo weight, and frequency..."
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-brand-orange" />
                      <span>{isSubmitting ? 'Sending...' : t('contact.send', 'Send Message')}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
