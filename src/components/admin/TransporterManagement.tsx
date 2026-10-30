import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Transporter, TransporterStatus } from '../../types/database';
import { formatDate } from '../../lib/utils';
import {
  Truck,
  Search,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  X,
  CheckCircle2,
  Filter,
  Navigation
} from 'lucide-react';

export const TransporterManagement: React.FC = () => {
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isAddModal, setIsAddModal] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState<Transporter | null>(null);

  const [form, setForm] = useState({
    transporter_name: '',
    contact_person: '',
    phone: '',
    email: '',
    vehicle_types: '32ft Multi-Axle Container, 20ft Container',
    operating_routes: 'Delhi - Mumbai Corridor, Pune - Bengaluru',
    verification_status: 'Verified' as TransporterStatus,
    payment_terms: '70% Advance + 30% on POD',
    internal_notes: '',
  });

  const loadData = async () => {
    const list = await db.getTransporters();
    setTransporters(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.transporter_name || !form.contact_person || !form.phone) {
      alert('Please fill Transporter Name, Contact Person, and Phone.');
      return;
    }

    const vehicleArray = form.vehicle_types.split(',').map((s) => s.trim()).filter(Boolean);
    const routeArray = form.operating_routes.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      if (editingTransporter) {
        await db.updateTransporter(editingTransporter.id, {
          transporter_name: form.transporter_name.trim(),
          contact_person: form.contact_person.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          vehicle_types: vehicleArray,
          operating_routes: routeArray,
          verification_status: form.verification_status,
          payment_terms: form.payment_terms,
          internal_notes: form.internal_notes.trim() || undefined,
        });
      } else {
        await db.createTransporter({
          transporter_name: form.transporter_name.trim(),
          contact_person: form.contact_person.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          vehicle_types: vehicleArray,
          operating_routes: routeArray,
          verification_status: form.verification_status,
          payment_terms: form.payment_terms,
          internal_notes: form.internal_notes.trim() || undefined,
        });
      }

      setIsAddModal(false);
      setEditingTransporter(null);
      await loadData();
    } catch (err) {
      console.error('Error saving transporter:', err);
    }
  };

  const handleOpenEdit = (t: Transporter) => {
    setEditingTransporter(t);
    setForm({
      transporter_name: t.transporter_name,
      contact_person: t.contact_person,
      phone: t.phone,
      email: t.email || '',
      vehicle_types: t.vehicle_types.join(', '),
      operating_routes: t.operating_routes.join(', '),
      verification_status: t.verification_status,
      payment_terms: t.payment_terms,
      internal_notes: t.internal_notes || '',
    });
    setIsAddModal(true);
  };

  const handleOpenAdd = () => {
    setEditingTransporter(null);
    setForm({
      transporter_name: '',
      contact_person: '',
      phone: '',
      email: '',
      vehicle_types: '32ft Multi-Axle Container, 20ft Container',
      operating_routes: 'Delhi - Mumbai Corridor, Pune - Bengaluru',
      verification_status: 'Verified',
      payment_terms: '70% Advance + 30% on POD',
      internal_notes: '',
    });
    setIsAddModal(true);
  };

  const filtered = transporters.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.verification_status === statusFilter;
    const matchesSearch =
      t.transporter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery) ||
      t.operating_routes.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Transporter &amp; Fleet Partner Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified third-party carrier fleet partners, route competencies, and compliance audits.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-brand-orange text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-orange-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Partner</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Transporter Name, Contact, Phone, Corridors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-md border border-slate-300 bg-white"
          >
            <option value="ALL">All Partners ({transporters.length})</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Audit</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Transporter Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No transporters found matching your criteria.
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-premium hover:border-brand-navy/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-navy text-brand-orange flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1 ${
                      t.verification_status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.verification_status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.verification_status}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-brand-navy leading-tight">
                  {t.transporter_name}
                </h3>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  Ops Lead: {t.contact_person}
                </div>

                <div className="space-y-2 text-xs text-slate-500 my-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${t.phone}`} className="hover:text-brand-orange font-medium">
                      {t.phone}
                    </a>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">Primary Operating Routes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.operating_routes.map((route, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">Vehicle Fleet Types:</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">{t.vehicle_types.join(', ')}</span>
                  </div>

                  <div className="pt-1">
                    <span className="font-semibold text-slate-700 text-[11px]">Payment Terms: </span>
                    <span className="text-slate-600">{t.payment_terms}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Added: {formatDate(t.created_at)}</span>
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Edit / Audit Details &rarr;
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT TRANSPORTER MODAL */}
      {isAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-brand-navy">
              {editingTransporter ? 'Edit Carrier Fleet Partner' : 'Onboard New Carrier Partner'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transporter / Fleet Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balaji Freightlines"
                  value={form.transporter_name}
                  onChange={(e) => setForm({ ...form, transporter_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manpreet Singh"
                    value={form.contact_person}
                    onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating Corridors (comma separated)</label>
                <input
                  type="text"
                  placeholder="Delhi - Mumbai Corridor, Pune - Bengaluru"
                  value={form.operating_routes}
                  onChange={(e) => setForm({ ...form, operating_routes: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Fleet Types (comma separated)</label>
                <input
                  type="text"
                  placeholder="32ft MXL Container, 20ft Container, 14ft Open"
                  value={form.vehicle_types}
                  onChange={(e) => setForm({ ...form, vehicle_types: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Verification Status</label>
                  <select
                    value={form.verification_status}
                    onChange={(e) => setForm({ ...form, verification_status: e.target.value as TransporterStatus })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard Payment Terms</label>
                  <input
                    type="text"
                    placeholder="70% Advance + 30% on POD"
                    value={form.payment_terms}
                    onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Operations Notes</label>
                <textarea
                  rows={2}
                  placeholder="GPS capability, driver reliability rating, escalation phone..."
                  value={form.internal_notes}
                  onChange={(e) => setForm({ ...form, internal_notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModal(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-brand-orange text-white font-bold uppercase hover:bg-brand-orange-hover"
                >
                  {editingTransporter ? 'Update Partner' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
