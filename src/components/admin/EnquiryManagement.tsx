import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Enquiry, EnquiryStatus } from '../../types/database';
import { formatDate, formatDateTime } from '../../lib/utils';
import {
  Search,
  Filter,
  Eye,
  FilePlus,
  Check,
  X,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Truck,
  Building2,
  FileText
} from 'lucide-react';

interface EnquiryManagementProps {
  onCreateQuoteFromEnquiry: (enquiry: Enquiry) => void;
}

export const EnquiryManagement: React.FC<EnquiryManagementProps> = ({ onCreateQuoteFromEnquiry }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [newStatus, setNewStatus] = useState<EnquiryStatus>('New');

  const statusOptions: EnquiryStatus[] = [
    'New',
    'Under Review',
    'Quoted',
    'Accepted',
    'Rejected',
    'Closed',
  ];

  const loadEnquiries = async () => {
    const list = await db.getEnquiries();
    setEnquiries(list);
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  useEffect(() => {
    let result = enquiries;

    if (statusFilter !== 'ALL') {
      result = result.filter((e) => e.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.reference_no.toLowerCase().includes(q) ||
          e.customer_name.toLowerCase().includes(q) ||
          (e.company_name && e.company_name.toLowerCase().includes(q)) ||
          e.pickup_city.toLowerCase().includes(q) ||
          e.destination_city.toLowerCase().includes(q) ||
          e.mobile.includes(q)
      );
    }

    setFilteredEnquiries(result);
  }, [enquiries, searchQuery, statusFilter]);

  const handleOpenDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status);
    setInternalNotes(enq.internal_notes || '');
  };

  const handleSaveDetail = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      const updated = await db.updateEnquiry(selectedEnquiry.id, {
        status: newStatus,
        internal_notes: internalNotes,
      });
      if (updated) {
        setSelectedEnquiry(updated);
        await loadEnquiries();
      }
    } catch (err) {
      console.error('Failed to update enquiry:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Freight Enquiry Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming shipper quote requests from website forms and direct operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Total Shown: <strong className="text-brand-navy">{filteredEnquiries.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Ref No, Customer, Company, Phone, Route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
          >
            <option value="ALL">All Statuses ({enquiries.length})</option>
            {statusOptions.map((status) => {
              const count = enquiries.filter((e) => e.status === status).length;
              return (
                <option key={status} value={status}>
                  {status} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Enquiry Ref</th>
                <th className="py-3.5 px-4">Customer &amp; Company</th>
                <th className="py-3.5 px-4">Route (Origin &rarr; Dest)</th>
                <th className="py-3.5 px-4">Cargo &amp; Weight</th>
                <th className="py-3.5 px-4">Pickup Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No enquiries match the selected filters or search keyword.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-brand-navy block">
                        {enq.reference_no}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(enq.created_at)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{enq.customer_name}</div>
                      {enq.company_name && (
                        <div className="text-[11px] text-slate-500">{enq.company_name}</div>
                      )}
                      <div className="text-[11px] text-slate-400">{enq.mobile}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-brand-navy">
                        {enq.pickup_city} &rarr; {enq.destination_city}
                      </div>
                      {enq.vehicle_preference && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Pref: {enq.vehicle_preference}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{enq.material_description}</div>
                      <div className="text-slate-500 text-[11px] font-semibold">{enq.approximate_weight}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {formatDate(enq.pickup_date)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          enq.status === 'New'
                            ? 'bg-orange-100 text-brand-orange border border-orange-200'
                            : enq.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : enq.status === 'Quoted'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : enq.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : enq.status === 'Rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(enq)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-brand-navy transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onCreateQuoteFromEnquiry(enq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-orange text-white text-[11px] font-semibold hover:bg-brand-orange-hover transition-colors shadow-sm"
                        title="Create Quotation from Enquiry"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>Quote</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENQUIRY DETAILS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* Modal Header */}
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">
                  Freight Enquiry Details
                </span>
                <h3 className="text-lg font-bold font-mono">
                  {selectedEnquiry.reference_no}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Route & Cargo Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs text-slate-400 font-semibold uppercase">Route Requested</div>
                <div className="text-base font-bold text-brand-navy flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>{selectedEnquiry.pickup_city} &rarr; {selectedEnquiry.destination_city}</span>
                </div>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Customer Name</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedEnquiry.customer_name}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Company / Enterprise</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedEnquiry.company_name || 'Individual / Unspecified'}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Contact Mobile</span>
                  <a href={`tel:${selectedEnquiry.mobile}`} className="font-bold text-brand-navy hover:text-brand-orange">
                    {selectedEnquiry.mobile}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Work Email</span>
                  <span className="font-medium text-slate-700">{selectedEnquiry.email || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Material / Commodity</span>
                  <span className="font-semibold text-slate-800">{selectedEnquiry.material_description}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Approximate Weight</span>
                  <span className="font-semibold text-slate-800">{selectedEnquiry.approximate_weight}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Pickup Date Requested</span>
                  <span className="font-semibold text-slate-800">{formatDate(selectedEnquiry.pickup_date)}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Vehicle Preference</span>
                  <span className="font-semibold text-slate-800">{selectedEnquiry.vehicle_preference || 'Standard Recommendation'}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Loading / Unloading Requirements</span>
                  <p className="font-medium text-slate-700 mt-0.5">{selectedEnquiry.loading_requirements || 'None specified.'}</p>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Additional Shipper Instructions</span>
                  <p className="font-medium text-slate-700 mt-0.5">{selectedEnquiry.additional_instructions || 'None.'}</p>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Enquiry Registered At</span>
                  <p className="font-medium text-slate-600 mt-0.5">{formatDateTime(selectedEnquiry.created_at)}</p>
                </div>
              </div>

              {/* Status & Internal Notes Edit */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  Operational Status &amp; Internal Notes
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Update Enquiry Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as EnquiryStatus)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedEnquiry(null);
                        onCreateQuoteFromEnquiry(selectedEnquiry);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors shadow-sm"
                    >
                      <FilePlus className="w-4 h-4" />
                      <span>Create Quotation From This</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Operations Notes (Confidential to Staff)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter rate negotiations, carrier checks, customer follow-up notes..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-md border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={handleSaveDetail}
                disabled={isUpdating}
                className="px-5 py-2 rounded-md bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light disabled:opacity-60"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
