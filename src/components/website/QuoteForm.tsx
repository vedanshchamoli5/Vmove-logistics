import React, { useState } from 'react';
import { db } from '../../lib/db';
import { rateLimiter } from '../../lib/rateLimiter';
import { generateReference } from '../../lib/utils';
import { Enquiry } from '../../types/database';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageSquare,
  Truck,
  MapPin,
  User,
} from 'lucide-react';

interface QuoteFormProps {
  onSuccessNavigate?: () => void;
  compact?: boolean;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ compact = false }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    customer_name: '',
    company_name: '',
    mobile: '',
    email: '',
    pickup_city: '',
    destination_city: '',
    material_description: '',
    approximate_weight: '',
    pickup_date: '',
    vehicle_preference: '',
    loading_requirements: '',
    additional_instructions: '',
    honeypot: '',
  });

  const [formLoadTime] = useState<number>(Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [copied, setCopied] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const vehicleOptions = [
    '32ft Multi-Axle Container (14 - 18 MT)',
    '32ft Single-Axle Container (7 - 9 MT)',
    '24ft Container (6 - 8 MT)',
    '20ft Container (6 - 7 MT)',
    '19ft Closed / Container Body (5 - 7 MT)',
    '14ft Eicher Open / Container (3.5 - 4 MT)',
    'Tata 407 / Equivalent (2 - 2.5 MT)',
    '40ft High Bed Trailer (22 - 30 MT)',
    'Open Body Heavy Truck',
    'Open to Recommendation based on Cargo',
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer / Contact name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!rateLimiter.validateIndianMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.pickup_city.trim()) {
      newErrors.pickup_city = 'Pickup city / location is required';
    }

    if (!formData.destination_city.trim()) {
      newErrors.destination_city = 'Destination city / location is required';
    }

    if (!formData.material_description.trim()) {
      newErrors.material_description = 'Description of goods / material is required';
    }

    if (!formData.approximate_weight.trim()) {
      newErrors.approximate_weight = 'Approximate weight (e.g., 8 MT, 12 Tonnes) is required';
    }

    if (!formData.pickup_date) {
      newErrors.pickup_date = 'Required pickup date is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    // 1. Anti-bot honeypot check
    if (!rateLimiter.isHoneypotClean(formData.honeypot)) {
      console.warn('Bot submission trapped via honeypot.');
      return;
    }

    // 2. Minimum submission time protection (at least 1.8 seconds)
    if (Date.now() - formLoadTime < 1800) {
      setRateLimitError('Submission was received too quickly. Please review your details and submit again.');
      return;
    }

    // 3. Rate limiting check
    const rateCheck = rateLimiter.canSubmit();
    if (!rateCheck.allowed) {
      setRateLimitError(rateCheck.reason || 'Submission rate limit reached. Please call 7906308640 directly.');
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reference_no = generateReference('VM-ENQ');

      const enquiryData = {
        reference_no,
        customer_name: formData.customer_name.trim(),
        company_name: formData.company_name.trim() || undefined,
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
        pickup_city: formData.pickup_city.trim(),
        destination_city: formData.destination_city.trim(),
        material_description: formData.material_description.trim(),
        approximate_weight: formData.approximate_weight.trim(),
        pickup_date: formData.pickup_date,
        vehicle_preference: formData.vehicle_preference || undefined,
        loading_requirements: formData.loading_requirements.trim() || undefined,
        additional_instructions: formData.additional_instructions.trim() || undefined,
        status: 'New' as const,
        internal_notes: 'Submitted via Public Freight Quote Portal.',
      };

      const saved = await db.createEnquiry(enquiryData);
      rateLimiter.recordSubmission();

      console.info(`[ADMIN NOTIFICATION STUB] New Freight Enquiry received: ${saved.reference_no} from ${saved.customer_name} (${saved.mobile}).`);
      setSubmittedEnquiry(saved);
    } catch (err) {
      console.error('Error creating freight enquiry:', err);
      setRateLimitError('An unexpected error occurred while saving your enquiry. Please call our team at 7906308640.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (submittedEnquiry) {
      navigator.clipboard.writeText(submittedEnquiry.reference_no);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setSubmittedEnquiry(null);
    setFormData({
      customer_name: '',
      company_name: '',
      mobile: '',
      email: '',
      pickup_city: '',
      destination_city: '',
      material_description: '',
      approximate_weight: '',
      pickup_date: '',
      vehicle_preference: '',
      loading_requirements: '',
      additional_instructions: '',
      honeypot: '',
    });
    setErrors({});
  };

  // SUCCESS CONFIRMATION STATE
  if (submittedEnquiry) {
    const whatsappText = encodeURIComponent(
      `Hi Vmove Logistics, I just submitted freight enquiry ref *${submittedEnquiry.reference_no}* for route ${submittedEnquiry.pickup_city} to ${submittedEnquiry.destination_city} (${submittedEnquiry.approximate_weight}). Please provide your best quote.`
    );

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-premium p-6 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
          {t('brand.tagline')}
        </span>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
          {t('form.successTitle')}
        </h3>

        <p className="text-slate-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
          {t('form.successDesc')}
        </p>

        {/* Reference Number Card */}
        <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-md mx-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
            {t('form.uniqueRef')}
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-brand-navy tracking-wider">
              {submittedEnquiry.reference_no}
            </span>
            <button
              onClick={copyReference}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
              title="Copy Reference"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          {copied && <span className="text-xs text-emerald-600 mt-1 block">{t('form.copied')}</span>}
        </div>

        {/* Summary Details */}
        <div className="max-w-md mx-auto bg-slate-50/70 rounded-lg p-4 text-left text-xs space-y-2 border border-slate-200/80 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Route:</span>
            <span className="font-semibold text-slate-800">{submittedEnquiry.pickup_city} &rarr; {submittedEnquiry.destination_city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Cargo:</span>
            <span className="font-semibold text-slate-800">{submittedEnquiry.material_description} ({submittedEnquiry.approximate_weight})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Date:</span>
            <span className="font-semibold text-slate-800">{submittedEnquiry.pickup_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Contact:</span>
            <span className="font-semibold text-slate-800">{submittedEnquiry.customer_name} ({submittedEnquiry.mobile})</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <a
            href={`https://wa.me/917906308640?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1EBE5D] transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('form.fastTrackWhatsApp')}</span>
          </a>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-100 transition-colors"
          >
            {t('form.another')}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-6">
          Direct Operations Desk: <a href="tel:+917906308640" className="text-brand-orange font-semibold underline">+91 7906308640</a>
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-premium p-6 sm:p-8 ${compact ? 'max-w-2xl mx-auto' : ''}`}>
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Truck className="w-4 h-4" />
          <span>{t('form.badge')}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-brand-navy">
          {t('form.title')}
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          {t('form.desc')}
        </p>
      </div>

      {rateLimitError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>{rateLimitError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Anti-spam honeypot (visually hidden) */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="vmove_security_token"
            value={formData.honeypot}
            onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* SECTION 1: CONTACT DETAILS */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-navy" />
            <span>{t('form.shipperSection')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Verma"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-md border ${
                  errors.customer_name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
              />
              {errors.customer_name && <p className="text-[11px] text-red-600 mt-1">{errors.customer_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.company')} <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Industries Pvt Ltd"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.mobile')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-500 font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className={`w-full pl-11 pr-3.5 py-2.5 text-sm rounded-md border ${
                    errors.mobile ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
                />
              </div>
              {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.email')} <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="procurement@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-md border ${
                  errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 2: ROUTE & CARGO */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-navy" />
            <span>{t('form.routeSection')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.pickup')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, Bhosari MIDC"
                value={formData.pickup_city}
                onChange={(e) => setFormData({ ...formData, pickup_city: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-md border ${
                  errors.pickup_city ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
              />
              {errors.pickup_city && <p className="text-[11px] text-red-600 mt-1">{errors.pickup_city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.destination')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, Peenya"
                value={formData.destination_city}
                onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-md border ${
                  errors.destination_city ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
              />
              {errors.destination_city && <p className="text-[11px] text-red-600 mt-1">{errors.destination_city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.material')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Industrial Pumps / Automotive Spares"
                value={formData.material_description}
                onChange={(e) => setFormData({ ...formData, material_description: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-md border ${
                  errors.material_description ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
              />
              {errors.material_description && <p className="text-[11px] text-red-600 mt-1">{errors.material_description}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.weight')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 9.5 MT or 250 Pallets"
                value={formData.approximate_weight}
                onChange={(e) => setFormData({ ...formData, approximate_weight: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-md border ${
                  errors.approximate_weight ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
              />
              {errors.approximate_weight && <p className="text-[11px] text-red-600 mt-1">{errors.approximate_weight}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.pickupDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.pickup_date}
                onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm rounded-md border ${
                  errors.pickup_date ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange`}
              />
              {errors.pickup_date && <p className="text-[11px] text-red-600 mt-1">{errors.pickup_date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.vehiclePref')} <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                value={formData.vehicle_preference}
                onChange={(e) => setFormData({ ...formData, vehicle_preference: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              >
                <option value="">Select Vehicle Type</option>
                {vehicleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: LOADING & SPECIAL INSTRUCTIONS */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.loading')} <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Side-loading forklift, dock"
                value={formData.loading_requirements}
                onChange={(e) => setFormData({ ...formData, loading_requirements: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('form.instructions')} <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tarpaulin required, gate timing"
                value={formData.additional_instructions}
                onChange={(e) => setFormData({ ...formData, additional_instructions: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-md bg-brand-orange text-white font-bold text-sm tracking-wide uppercase hover:bg-brand-orange-hover transition-all shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('form.submitting')}</span>
              </span>
            ) : (
              <>
                <span>{t('form.submit')}</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            {t('brand.operations')} <a href="tel:+917906308640" className="text-brand-orange font-semibold hover:underline">+91 7906308640</a>
          </p>
        </div>
      </form>
    </div>
  );
};
