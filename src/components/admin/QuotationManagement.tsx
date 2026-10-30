import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { authService } from '../../lib/auth';
import { hasPermission } from '../../lib/rbac';
import { Quotation, QuotationStatus, Enquiry, Customer } from '../../types/database';
import { formatINR, formatDate, generateReference, calculateQuoteContribution } from '../../lib/utils';
import { generateCustomerQuotationPDF } from '../../lib/pdfGenerator';
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  PackageCheck,
  TrendingUp,
  Percent,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

interface QuotationManagementProps {
  initialEnquiryForQuote?: Enquiry | null;
  onClearInitialEnquiry?: () => void;
  onConvertToBooking?: (quote: Quotation) => void;
}

export const QuotationManagement: React.FC<QuotationManagementProps> = ({
  initialEnquiryForQuote,
  onClearInitialEnquiry,
  onConvertToBooking,
}) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const currentUser = authService.getCurrentUser();
  const canViewMargins = currentUser ? hasPermission(currentUser.role, 'view_internal_margins') : true;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    enquiry_id: '',
    customer_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_location: '',
    destination: '',
    vehicle_type: '32ft Multi-Axle Container (14 - 18 MT)',
    material: '',
    weight: '',
    customer_freight: 45000,
    transporter_cost: 38000,
    other_direct_costs: 1500,
    gst_rate: 5.0,
    payment_terms: 'Immediate on delivery / POD',
    validity_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    special_conditions: 'Rate includes standard transit coverage. 24 hours free loading and 24 hours free unloading at destinations.',
    status: 'Sent' as QuotationStatus,
  });

  const loadData = async () => {
    const [quotes, custList] = await Promise.all([db.getQuotations(), db.getCustomers()]);
    setQuotations(quotes);
    setCustomers(custList);
  };

  useEffect(() => {
    loadData();
  }, []);

  // When triggered from Enquiry with pre-filled enquiry data
  useEffect(() => {
    if (initialEnquiryForQuote) {
      setFormData((prev) => ({
        ...prev,
        enquiry_id: initialEnquiryForQuote.id,
        customer_name: initialEnquiryForQuote.company_name
          ? `${initialEnquiryForQuote.customer_name} (${initialEnquiryForQuote.company_name})`
          : initialEnquiryForQuote.customer_name,
        customer_phone: initialEnquiryForQuote.mobile,
        customer_email: initialEnquiryForQuote.email || '',
        pickup_location: initialEnquiryForQuote.pickup_city,
        destination: initialEnquiryForQuote.destination_city,
        material: initialEnquiryForQuote.material_description,
        weight: initialEnquiryForQuote.approximate_weight,
        vehicle_type: initialEnquiryForQuote.vehicle_preference || prev.vehicle_type,
      }));
      setIsCreateModalOpen(true);
      if (onClearInitialEnquiry) onClearInitialEnquiry();
    }
  }, [initialEnquiryForQuote]);

  // Live Contribution Calculations
  const calculations = calculateQuoteContribution(
    formData.customer_freight,
    formData.transporter_cost,
    formData.other_direct_costs,
    formData.gst_rate
  );

  const handleSelectCustomer = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      setFormData((prev) => ({
        ...prev,
        customer_id: cust.id,
        customer_name: `${cust.customer_name} (${cust.company_name})`,
        customer_phone: cust.phone,
        customer_email: cust.email || '',
        payment_terms: cust.payment_terms || prev.payment_terms,
      }));
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.pickup_location || !formData.destination) {
      alert('Please fill all mandatory quote specifications.');
      return;
    }

    try {
      const quote_reference = generateReference('VM-QUO');

      const newQuoteData = {
        quote_reference,
        enquiry_id: formData.enquiry_id || undefined,
        customer_id: formData.customer_id || undefined,
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        customer_phone: formData.customer_phone.trim(),
        pickup_location: formData.pickup_location.trim(),
        destination: formData.destination.trim(),
        vehicle_type: formData.vehicle_type,
        material: formData.material.trim(),
        weight: formData.weight.trim(),
        customer_freight: Number(formData.customer_freight),
        transporter_cost: Number(formData.transporter_cost),
        other_direct_costs: Number(formData.other_direct_costs),
        estimated_contribution: calculations.estimatedContribution,
        margin_percentage: calculations.marginPercentage,
        gst_rate: Number(formData.gst_rate),
        gst_amount: calculations.gstAmount,
        total_customer_amount: calculations.totalCustomerAmount,
        payment_terms: formData.payment_terms,
        validity_date: formData.validity_date,
        special_conditions: formData.special_conditions,
        status: formData.status,
      };

      await db.createQuotation(newQuoteData);
      setIsCreateModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Error creating quote:', err);
      alert('Failed to save quotation.');
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: QuotationStatus) => {
    await db.updateQuotation(quoteId, { status: newStatus });
    await loadData();
  };

  const filteredQuotes = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    const matchesSearch =
      q.quote_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Freight Quotation Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create commercial quotes, monitor gross contribution margins, and export customer-facing PDFs.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-brand-orange text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-orange-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Commercial Quote</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Quote Ref, Customer Name, Lane..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-md border border-slate-300 bg-white"
          >
            <option value="ALL">All Quotes ({quotations.length})</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Expired">Expired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Quote Ref</th>
                <th className="py-3.5 px-4">Customer &amp; Lane</th>
                <th className="py-3.5 px-4">Customer Total</th>
                <th className="py-3.5 px-4 bg-orange-50/50">Internal Contribution</th>
                <th className="py-3.5 px-4 bg-orange-50/50">Margin %</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No quotations found.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-brand-navy block">
                        {quote.quote_reference}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(quote.created_at)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{quote.customer_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {quote.pickup_location} &rarr; {quote.destination}
                      </div>
                      <div className="text-[10px] text-slate-400">{quote.vehicle_type}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {formatINR(quote.total_customer_amount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Base: {formatINR(quote.customer_freight)} + GST
                      </div>
                    </td>

                    {/* INTERNAL CONTRIBUTION (Hidden from customer) */}
                    <td className="py-3.5 px-4 bg-orange-50/30">
                      {canViewMargins ? (
                        <>
                          <div className="font-bold text-emerald-700">
                            {formatINR(quote.estimated_contribution)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Cost: {formatINR(quote.transporter_cost)}
                          </div>
                        </>
                      ) : (
                        <div className="text-slate-400 text-[11px] italic font-mono">[Restricted]</div>
                      )}
                    </td>

                    {/* INTERNAL MARGIN % */}
                    <td className="py-3.5 px-4 bg-orange-50/30">
                      {canViewMargins ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            quote.margin_percentage >= 10
                              ? 'bg-emerald-100 text-emerald-800'
                              : quote.margin_percentage >= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {quote.margin_percentage.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic font-mono">[Restricted]</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {formatDate(quote.validity_date)}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value as QuotationStatus)}
                        className={`text-[10px] font-bold uppercase rounded px-2 py-1 border ${
                          quote.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : quote.status === 'Sent'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : quote.status === 'Draft'
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Expired">Expired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setPreviewQuote(quote)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-brand-navy"
                        title="View Full Quote Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => generateCustomerQuotationPDF(quote)}
                        className="p-1.5 rounded bg-brand-navy hover:bg-brand-navy-light text-white shadow-sm"
                        title="Download Customer-Facing PDF (Strictly hides internal margins)"
                      >
                        <Download className="w-4 h-4 text-brand-orange" />
                      </button>

                      {quote.status === 'Accepted' && onConvertToBooking && (
                        <button
                          onClick={() => onConvertToBooking(quote)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-colors"
                          title="Convert to Confirmed Booking"
                        >
                          Book Load
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE QUOTATION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200">
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">
                  New Commercial Freight Quotation
                </span>
                <h3 className="text-base sm:text-lg font-bold">
                  Quotation Generator &amp; Margin Calculator
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="p-6 space-y-6">
              {/* SECTION 1: CUSTOMER & LANE */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  1. Client &amp; Route
                </h4>

                {customers.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quick Fill from Customer Directory (Optional)
                    </label>
                    <select
                      value={formData.customer_id}
                      onChange={(e) => handleSelectCustomer(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white"
                    >
                      <option value="">Select Existing B2B Customer...</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company_name} ({c.customer_name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma (Apex Engineering Ltd)"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9820112233"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Origin / Pickup Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bhosari MIDC, Pune"
                      value={formData.pickup_location}
                      onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Destination Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peenya Industrial Area, Bengaluru"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vehicle Type *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="32ft SXL Container"
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Material / Commodity *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Machined Castings"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Weight / Load *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="8.5 Metric Tonnes"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: COMMERCIAL PRICING & CONTRIBUTION CALCULATION */}
              <div className="p-4 rounded-xl bg-orange-50/60 border border-brand-orange/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>2. Financials &amp; Internal Margin Engine</span>
                  </h4>
                  <span className="text-[10px] text-brand-orange font-bold uppercase bg-white px-2 py-0.5 rounded border border-brand-orange/20">
                    Auto-Calculated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">
                      Customer Freight (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="100"
                      value={formData.customer_freight}
                      onChange={(e) => setFormData({ ...formData, customer_freight: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs font-bold rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Transporter Rate Cost (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="100"
                      value={formData.transporter_cost}
                      onChange={(e) => setFormData({ ...formData, transporter_cost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Other Direct Costs (INR)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="50"
                      value={formData.other_direct_costs}
                      onChange={(e) => setFormData({ ...formData, other_direct_costs: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                {/* Calculation Summary Bar */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Contribution</span>
                    <span className="text-sm font-extrabold text-emerald-700">
                      {formatINR(calculations.estimatedContribution)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Margin Percentage</span>
                    <span className="text-sm font-extrabold text-brand-navy">
                      {calculations.marginPercentage.toFixed(2)}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">GST Amount (5%)</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {formatINR(calculations.gstAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Customer Total (Inc. GST)</span>
                    <span className="text-sm font-extrabold text-brand-orange">
                      {formatINR(calculations.totalCustomerAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: TERMS & VALIDITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quote Validity Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validity_date}
                    onChange={(e) => setFormData({ ...formData, validity_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Conditions / Detention Terms
                  </label>
                  <textarea
                    rows={2}
                    value={formData.special_conditions}
                    onChange={(e) => setFormData({ ...formData, special_conditions: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-brand-orange text-white text-xs font-bold uppercase hover:bg-brand-orange-hover shadow-md"
                >
                  Save &amp; Generate Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUOTATION PREVIEW MODAL */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">
                  Quote Preview
                </span>
                <h3 className="text-base font-bold font-mono">{previewQuote.quote_reference}</h3>
              </div>
              <button
                onClick={() => setPreviewQuote(null)}
                className="p-1 rounded hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{previewQuote.customer_name}</div>
                <div className="text-slate-600 font-medium">
                  {previewQuote.pickup_location} &rarr; {previewQuote.destination}
                </div>
                <div className="text-slate-500">
                  {previewQuote.material} &bull; {previewQuote.weight} &bull; {previewQuote.vehicle_type}
                </div>
              </div>

              {/* Financials Breakdown */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Base Freight:</span>
                  <span className="font-bold">{formatINR(previewQuote.customer_freight)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST ({previewQuote.gst_rate}%):</span>
                  <span className="font-semibold">{formatINR(previewQuote.gst_amount)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200 pt-2 font-bold text-brand-navy">
                  <span>Customer Total Payable:</span>
                  <span className="text-brand-orange">{formatINR(previewQuote.total_customer_amount)}</span>
                </div>
              </div>

              {/* Internal Commercials Note */}
              {canViewMargins ? (
                <div className="p-3 bg-orange-50 border border-brand-orange/30 rounded text-slate-700 space-y-1">
                  <span className="font-bold text-brand-orange block text-[11px] uppercase">
                    Internal Profitability Metrics
                  </span>
                  <div className="flex justify-between">
                    <span>Transporter Purchase Rate:</span>
                    <span className="font-semibold">{formatINR(previewQuote.transporter_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Direct Charges:</span>
                    <span className="font-semibold">{formatINR(previewQuote.other_direct_costs)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-orange-200">
                    <span>Estimated Contribution:</span>
                    <span>{formatINR(previewQuote.estimated_contribution)} ({previewQuote.margin_percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 border border-slate-200 rounded text-slate-500 text-xs italic">
                  Internal transporter payout and margin contribution metrics are restricted to Management.
                </div>
              )}

              <div className="pt-2 text-slate-500 text-[11px]">
                Valid Until: <strong>{formatDate(previewQuote.validity_date)}</strong> &bull; Terms: {previewQuote.payment_terms}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setPreviewQuote(null)}
                className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-600"
              >
                Close
              </button>

              <button
                onClick={() => {
                  generateCustomerQuotationPDF(previewQuote);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light shadow-sm"
              >
                <Download className="w-4 h-4 text-brand-orange" />
                <span>Export Customer PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
