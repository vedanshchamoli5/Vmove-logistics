import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { formatINR, formatDate } from '../../lib/utils';
import { AdminTab } from './AdminLayout';
import {
  Inbox,
  FileText,
  PackageCheck,
  Truck,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenCreateQuote?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const [kpis, setKpis] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    pendingQuotations: 0,
    confirmedBookings: 0,
    activeShipments: 0,
    outstandingCustomerPayments: 0,
    outstandingTransporterPayables: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [kpiData, enquiries, bookings] = await Promise.all([
          db.getDashboardKPIs(),
          db.getEnquiries(),
          db.getBookings(),
        ]);
        setKpis(kpiData);
        setRecentEnquiries(enquiries.slice(0, 4));
        setRecentBookings(bookings.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2.5 py-0.5 rounded">
            Enterprise Operations Dashboard
          </span>
          <h1 className="text-2xl font-extrabold text-brand-navy mt-1">
            Vmove Logistics Operations Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time B2B freight pipeline, verified carrier coordination, and financial balance tracking.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('quotations')}
            className="px-4 py-2 rounded-md bg-brand-orange text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-orange-hover transition-colors shadow-sm"
          >
            + Create Quotation
          </button>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="px-3.5 py-2 rounded-md bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy-light transition-colors"
          >
            View Enquiries
          </button>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Track Active Shipments
          </button>
        </div>
      </div>

      {/* KPI METRICS GRID (6 Core Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Enquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-brand-navy/30 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Enquiries
            </span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-brand-navy">
            {isLoading ? '...' : kpis.totalEnquiries}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Lifetime inbound leads</span>
        </div>

        {/* New Enquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm hover:border-brand-orange transition-all cursor-pointer bg-gradient-to-br from-white to-orange-50/40"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">
              New Enquiries
            </span>
            <AlertCircle className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-2xl font-extrabold text-brand-orange">
            {isLoading ? '...' : kpis.newEnquiries}
          </div>
          <span className="text-[10px] text-brand-orange font-semibold mt-1 block">Require initial review</span>
        </div>

        {/* Pending Quotations */}
        <div
          onClick={() => onNavigateTab('quotations')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-brand-navy/30 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Quotes
            </span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-brand-navy">
            {isLoading ? '...' : kpis.pendingQuotations}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Drafted or Sent</span>
        </div>

        {/* Confirmed Bookings */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-brand-navy/30 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Bookings
            </span>
            <PackageCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {isLoading ? '...' : kpis.confirmedBookings}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Confirmed / Assigned</span>
        </div>

        {/* Active Shipments */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-brand-navy/30 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Shipments
            </span>
            <Truck className="w-4 h-4 text-brand-navy" />
          </div>
          <div className="text-2xl font-extrabold text-brand-navy">
            {isLoading ? '...' : kpis.activeShipments}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">In Transit or Loading</span>
        </div>

        {/* Outstanding Receivables */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-brand-navy/30 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Outstanding Dues
            </span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-extrabold text-brand-navy truncate">
            {isLoading ? '...' : formatINR(kpis.outstandingCustomerPayments)}
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Customer balance receivable</span>
        </div>
      </div>

      {/* LOWER CONTENT: RECENT ENQUIRIES & ACTIVE TRANSIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                  Recent Freight Enquiries
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('enquiries')}
                className="text-xs text-brand-orange hover:underline font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentEnquiries.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No freight enquiries found.</p>
              ) : (
                recentEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    onClick={() => onNavigateTab('enquiries')}
                    className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-navy">{enq.reference_no}</span>
                        <span className="font-semibold text-slate-800">&bull; {enq.customer_name}</span>
                      </div>
                      <div className="text-slate-500 mt-1">
                        {enq.pickup_city} &rarr; {enq.destination_city} ({enq.approximate_weight})
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enq.status === 'New'
                          ? 'bg-orange-100 text-brand-orange'
                          : enq.status === 'Quoted'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Click on any enquiry to view consignor specs, change status, or generate a quote.
          </div>
        </div>

        {/* Active Transits Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                  Live Consignments in Transit
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('bookings')}
                className="text-xs text-brand-orange hover:underline font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No active bookings registered.</p>
              ) : (
                recentBookings.map((bkg) => (
                  <div
                    key={bkg.id}
                    onClick={() => onNavigateTab('bookings')}
                    className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-brand-navy">{bkg.booking_reference}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {bkg.status}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800">
                      {bkg.pickup_location} &rarr; {bkg.destination}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Vehicle: {bkg.vehicle_number || 'To be assigned'} ({bkg.vehicle_type})</span>
                      <span>Expected: {formatDate(bkg.expected_delivery_date)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            All partner vehicles operate under commercial road haulage agreements with transit updates.
          </div>
        </div>
      </div>
    </div>
  );
};
