import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Payment, PaymentStatus } from '../../types/database';
import { formatINR, formatDate, generateReference } from '../../lib/utils';
import {
  CreditCard,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  DollarSign
} from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPaymentModal, setIsAddPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [form, setForm] = useState({
    customer_invoice_ref: '',
    amount_receivable: 50000,
    amount_received: 15000,
    customer_payment_status: 'Partial' as PaymentStatus,
    receivable_due_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
    transporter_amount_payable: 42000,
    transporter_amount_paid: 30000,
    transporter_payment_status: 'Partial' as 'Pending' | 'Partial' | 'Paid',
    payable_due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  const loadData = async () => {
    const list = await db.getPayments();
    setPayments(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Totals
  const totalReceivable = payments.reduce((sum, p) => sum + (Number(p.amount_receivable) || 0), 0);
  const totalReceived = payments.reduce((sum, p) => sum + (Number(p.amount_received) || 0), 0);
  const totalCustomerOutstanding = Math.max(0, totalReceivable - totalReceived);

  const totalPayable = payments.reduce((sum, p) => sum + (Number(p.transporter_amount_payable) || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.transporter_amount_paid) || 0), 0);
  const totalTransporterOutstanding = Math.max(0, totalPayable - totalPaid);

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPayment) {
        await db.updatePayment(editingPayment.id, {
          customer_invoice_ref: form.customer_invoice_ref.trim() || undefined,
          amount_receivable: Number(form.amount_receivable),
          amount_received: Number(form.amount_received),
          customer_payment_status: form.customer_payment_status,
          receivable_due_date: form.receivable_due_date || undefined,
          transporter_amount_payable: Number(form.transporter_amount_payable),
          transporter_amount_paid: Number(form.transporter_amount_paid),
          transporter_payment_status: form.transporter_payment_status,
          payable_due_date: form.payable_due_date || undefined,
          notes: form.notes.trim() || undefined,
        });
      } else {
        const invRef = form.customer_invoice_ref.trim() || generateReference('VM-INV');
        await db.createPayment({
          customer_invoice_ref: invRef,
          amount_receivable: Number(form.amount_receivable),
          amount_received: Number(form.amount_received),
          customer_payment_status: form.customer_payment_status,
          receivable_due_date: form.receivable_due_date || undefined,
          transporter_amount_payable: Number(form.transporter_amount_payable),
          transporter_amount_paid: Number(form.transporter_amount_paid),
          transporter_payment_status: form.transporter_payment_status,
          payable_due_date: form.payable_due_date || undefined,
          notes: form.notes.trim() || undefined,
        });
      }

      setIsAddPaymentModal(false);
      setEditingPayment(null);
      await loadData();
    } catch (err) {
      console.error('Error saving payment record:', err);
    }
  };

  const handleOpenEdit = (p: Payment) => {
    setEditingPayment(p);
    setForm({
      customer_invoice_ref: p.customer_invoice_ref || '',
      amount_receivable: p.amount_receivable,
      amount_received: p.amount_received,
      customer_payment_status: p.customer_payment_status,
      receivable_due_date: p.receivable_due_date || '',
      transporter_amount_payable: p.transporter_amount_payable,
      transporter_amount_paid: p.transporter_amount_paid,
      transporter_payment_status: p.transporter_payment_status,
      payable_due_date: p.payable_due_date || '',
      notes: p.notes || '',
    });
    setIsAddPaymentModal(true);
  };

  const filtered = payments.filter(
    (p) =>
      (p.customer_invoice_ref && p.customer_invoice_ref.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Operational Payment Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor customer invoice receivables vs. partner transporter payables.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPayment(null);
            setForm({
              customer_invoice_ref: generateReference('VM-INV'),
              amount_receivable: 50000,
              amount_received: 0,
              customer_payment_status: 'Pending',
              receivable_due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
              transporter_amount_payable: 42000,
              transporter_amount_paid: 0,
              transporter_payment_status: 'Pending',
              payable_due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
              notes: '',
            });
            setIsAddPaymentModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-brand-orange text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-orange-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice Record</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Operational Accounting Notice:</strong> This module is an internal operational cash flow tracker for consignment advances, trip settlements, and POD dues. It does not replace full statutory accounting software (Tally/Zoho).
        </span>
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customer Receivable Total */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Customer Invoiced</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-brand-navy">{formatINR(totalReceivable)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total invoiced billing</div>
        </div>

        {/* Customer Received */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Customer Received</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">{formatINR(totalReceived)}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Cleared into bank</div>
        </div>

        {/* Customer Outstanding Balance */}
        <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm bg-orange-50/40">
          <div className="flex items-center justify-between text-xs text-brand-orange font-bold uppercase tracking-wider mb-1">
            <span>Outstanding Receivable</span>
            <AlertCircle className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-xl font-extrabold text-brand-orange">{formatINR(totalCustomerOutstanding)}</div>
          <div className="text-[11px] text-brand-orange/80 mt-1 font-medium">Pending from shippers</div>
        </div>

        {/* Transporter Outstanding Payable */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Transporter Payable Due</span>
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-800">{formatINR(totalTransporterOutstanding)}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Total Payable: {formatINR(totalPayable)} (Paid: {formatINR(totalPaid)})
          </div>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
            Operational Payment Records ({payments.length})
          </h3>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search invoice ref / notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice Ref</th>
                <th className="py-3.5 px-4">Customer Receivable</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4">Customer Status</th>
                <th className="py-3.5 px-4">Transporter Payable</th>
                <th className="py-3.5 px-4">Transporter Paid</th>
                <th className="py-3.5 px-4">Net Balance Outstanding</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No payment ledger records found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const custBal = Math.max(0, p.amount_receivable - p.amount_received);
                  const transBal = Math.max(0, p.transporter_amount_payable - p.transporter_amount_paid);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                        {p.customer_invoice_ref || 'UNASSIGNED'}
                        <span className="text-[10px] text-slate-400 block font-sans font-normal">
                          Due: {formatDate(p.receivable_due_date)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatINR(p.amount_receivable)}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        {formatINR(p.amount_received)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.customer_payment_status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.customer_payment_status === 'Partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.customer_payment_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {formatINR(p.transporter_amount_payable)}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        {formatINR(p.transporter_amount_paid)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <span className="text-slate-500">Shipper Due: </span>
                          <strong className="text-brand-orange">{formatINR(custBal)}</strong>
                        </div>
                        <div className="text-[11px]">
                          <span className="text-slate-500">Carrier Due: </span>
                          <strong className="text-slate-700">{formatINR(transBal)}</strong>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-navy hover:text-white text-xs font-semibold transition-colors"
                        >
                          Update Dues
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD / UPDATE PAYMENT MODAL */}
      {isAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-brand-navy">
              {editingPayment ? 'Update Operational Payment Status' : 'Create Payment Ledger Entry'}
            </h3>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Invoice Ref</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VM-INV-2026-042"
                  value={form.customer_invoice_ref}
                  onChange={(e) => setForm({ ...form, customer_invoice_ref: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 font-mono"
                />
              </div>

              {/* Customer Side */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-brand-navy uppercase text-[10px] block">Customer Receivable Side</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Receivable (INR)</label>
                    <input
                      type="number"
                      required
                      value={form.amount_receivable}
                      onChange={(e) => setForm({ ...form, amount_receivable: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Amount Received (INR)</label>
                    <input
                      type="number"
                      value={form.amount_received}
                      onChange={(e) => setForm({ ...form, amount_received: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                    <select
                      value={form.customer_payment_status}
                      onChange={(e) => setForm({ ...form, customer_payment_status: e.target.value as PaymentStatus })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={form.receivable_due_date}
                      onChange={(e) => setForm({ ...form, receivable_due_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Transporter Side */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-brand-navy uppercase text-[10px] block">Transporter Payable Side</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Payable (INR)</label>
                    <input
                      type="number"
                      required
                      value={form.transporter_amount_payable}
                      onChange={(e) => setForm({ ...form, transporter_amount_payable: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Amount Paid (INR)</label>
                    <input
                      type="number"
                      value={form.transporter_amount_paid}
                      onChange={(e) => setForm({ ...form, transporter_amount_paid: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Carrier Status</label>
                    <select
                      value={form.transporter_payment_status}
                      onChange={(e) => setForm({ ...form, transporter_payment_status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Carrier Due Date</label>
                    <input
                      type="date"
                      value={form.payable_due_date}
                      onChange={(e) => setForm({ ...form, payable_due_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Settlement Notes (POD receipt, etc.)</label>
                <textarea
                  rows={2}
                  placeholder="Trip advance paid, balance on original physical POD..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModal(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-brand-orange text-white font-bold uppercase hover:bg-brand-orange-hover"
                >
                  Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
