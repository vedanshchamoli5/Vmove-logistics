import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Customer, Enquiry, Quotation, Booking } from '../../types/database';
import { formatDate, formatINR } from '../../lib/utils';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  PackageCheck,
  Inbox,
  X,
  CreditCard
} from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddCustomerModal, setIsAddCustomerModal] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    customer_name: '',
    company_name: '',
    phone: '',
    email: '',
    billing_address: '',
    gstin: '',
    payment_terms: '30 Days Net',
    notes: '',
  });

  const loadAll = async () => {
    const [cList, eList, qList, bList] = await Promise.all([
      db.getCustomers(),
      db.getEnquiries(),
      db.getQuotations(),
      db.getBookings(),
    ]);
    setCustomers(cList);
    setEnquiries(eList);
    setQuotations(qList);
    setBookings(bList);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.customer_name || !customerForm.company_name || !customerForm.phone) {
      alert('Please fill customer name, company, and phone.');
      return;
    }

    try {
      await db.createCustomer({
        customer_name: customerForm.customer_name.trim(),
        company_name: customerForm.company_name.trim(),
        phone: customerForm.phone.trim(),
        email: customerForm.email.trim() || undefined,
        billing_address: customerForm.billing_address.trim() || undefined,
        gstin: customerForm.gstin.trim() || undefined,
        payment_terms: customerForm.payment_terms,
        notes: customerForm.notes.trim() || undefined,
      });

      setIsAddCustomerModal(false);
      setCustomerForm({
        customer_name: '',
        company_name: '',
        phone: '',
        email: '',
        billing_address: '',
        gstin: '',
        payment_terms: '30 Days Net',
        notes: '',
      });
      await loadAll();
    } catch (err) {
      console.error('Error creating customer:', err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.gstin && c.gstin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">B2B Customer Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered commercial accounts, GST compliance details, and linked transport orders.
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-brand-orange text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-orange-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Commercial Client</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Company Name, Contact Person, Phone, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-brand-navy">{filtered.length}</strong>
        </span>
      </div>

      {/* Customers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No customer accounts found.
          </div>
        ) : (
          filtered.map((cust) => {
            const custQuotes = quotations.filter((q) => q.customer_id === cust.id || q.customer_name.includes(cust.company_name));
            const custBookings = bookings.filter((b) => b.customer_id === cust.id || b.customer_name.includes(cust.company_name));

            return (
              <div
                key={cust.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-premium hover:border-brand-navy/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-brand-navy flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5 text-brand-orange" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      {cust.payment_terms || 'Standard Terms'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-navy leading-tight">
                    {cust.company_name}
                  </h3>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Contact: {cust.customer_name}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 my-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${cust.phone}`} className="hover:text-brand-orange font-medium">
                        {cust.phone}
                      </a>
                    </div>
                    {cust.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{cust.email}</span>
                      </div>
                    )}
                    {cust.gstin && (
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="font-bold text-slate-600">GSTIN:</span>
                        <span className="text-brand-navy font-semibold">{cust.gstin}</span>
                      </div>
                    )}
                    {cust.billing_address && (
                      <div className="flex items-start gap-2 text-[11px] pt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-slate-500">{cust.billing_address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-bold text-brand-navy">{custBookings.length}</span> Bookings &bull;{' '}
                    <span className="font-bold text-brand-navy">{custQuotes.length}</span> Quotes
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="text-xs font-bold text-brand-orange hover:underline"
                  >
                    View Account &rarr;
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CUSTOMER DETAIL PROFILE DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">
                  Customer Profile
                </span>
                <h3 className="text-base font-bold">{selectedCustomer.company_name}</h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium block">Key Representative:</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Mobile Phone:</span>
                  <span className="font-bold text-brand-navy">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Work Email:</span>
                  <span>{selectedCustomer.email || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">GSTIN:</span>
                  <span className="font-mono font-bold text-brand-navy">{selectedCustomer.gstin || 'Not Provided'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Billing Address:</span>
                  <span>{selectedCustomer.billing_address || '—'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Commercial Notes:</span>
                  <span>{selectedCustomer.notes || 'No confidential notes.'}</span>
                </div>
              </div>

              {/* Linked Bookings & Quotes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  Associated Transport Jobs
                </h4>
                {bookings.filter((b) => b.customer_id === selectedCustomer.id || b.customer_name.includes(selectedCustomer.company_name)).length === 0 ? (
                  <p className="text-slate-400 py-3 text-center">No linked bookings recorded yet.</p>
                ) : (
                  bookings
                    .filter((b) => b.customer_id === selectedCustomer.id || b.customer_name.includes(selectedCustomer.company_name))
                    .map((b) => (
                      <div key={b.id} className="p-3 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-brand-navy">{b.booking_reference}</span>
                          <span className="text-slate-500 ml-2">{b.pickup_location} &rarr; {b.destination}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {b.status}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-brand-navy">Register New Commercial Account</h3>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Engineering Ltd"
                  value={customerForm.company_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={customerForm.customer_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, customer_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9820112233"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="procurement@apex.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GSTIN (15 characters)</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="27AABCA1234F1Z5"
                    value={customerForm.gstin}
                    onChange={(e) => setCustomerForm({ ...customerForm, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Billing Address</label>
                <input
                  type="text"
                  placeholder="Plot 42, MIDC Bhosari, Pune..."
                  value={customerForm.billing_address}
                  onChange={(e) => setCustomerForm({ ...customerForm, billing_address: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  placeholder="30 Days Net, Advance on Delivery..."
                  value={customerForm.payment_terms}
                  onChange={(e) => setCustomerForm({ ...customerForm, payment_terms: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModal(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-brand-orange text-white font-bold uppercase hover:bg-brand-orange-hover"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
