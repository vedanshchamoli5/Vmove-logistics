import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Booking, BookingStatus, Transporter, ShipmentUpdate } from '../../types/database';
import { formatDate, formatDateTime, generateReference } from '../../lib/utils';
import {
  PackageCheck,
  Truck,
  Search,
  Plus,
  MapPin,
  Calendar,
  User,
  Phone,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Navigation
} from 'lucide-react';

interface BookingManagementProps {
  initialQuoteToConvert?: any;
}

export const BookingManagement: React.FC<BookingManagementProps> = ({ initialQuoteToConvert }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals & Detail
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [shipmentUpdates, setShipmentUpdates] = useState<ShipmentUpdate[]>([]);
  const [isAddMilestoneModal, setIsAddMilestoneModal] = useState(false);
  const [isCreateBookingModal, setIsCreateBookingModal] = useState(false);

  // New milestone form
  const [milestoneStatus, setMilestoneStatus] = useState('In Transit');
  const [milestoneLocation, setMilestoneLocation] = useState('');
  const [milestoneNotes, setMilestoneNotes] = useState('');

  // Create booking form
  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    pickup_location: '',
    destination: '',
    material: '',
    weight: '',
    vehicle_type: '32ft Multi-Axle Container',
    transporter_id: '',
    vehicle_number: '',
    driver_name: '',
    driver_phone: '',
    driver_license: '',
    pickup_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    status: 'Confirmed' as BookingStatus,
    delivery_notes: '',
  });

  const bookingStatuses: BookingStatus[] = [
    'Confirmed',
    'Vehicle Assigned',
    'Loading',
    'In Transit',
    'Delivered',
    'Closed',
    'Cancelled',
  ];

  const loadData = async () => {
    const [bList, tList] = await Promise.all([db.getBookings(), db.getTransporters()]);
    setBookings(bList);
    setTransporters(tList);
  };

  useEffect(() => {
    loadData();
  }, []);

  // When triggered from Quotation to Convert
  useEffect(() => {
    if (initialQuoteToConvert) {
      setBookingForm((prev) => ({
        ...prev,
        customer_name: initialQuoteToConvert.customer_name,
        pickup_location: initialQuoteToConvert.pickup_location,
        destination: initialQuoteToConvert.destination,
        material: initialQuoteToConvert.material,
        weight: initialQuoteToConvert.weight,
        vehicle_type: initialQuoteToConvert.vehicle_type,
      }));
      setIsCreateBookingModal(true);
    }
  }, [initialQuoteToConvert]);

  const handleSelectBooking = async (b: Booking) => {
    setSelectedBooking(b);
    const updates = await db.getShipmentUpdates(b.id);
    setShipmentUpdates(updates);
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    await db.updateBooking(bookingId, { status: newStatus });
    await db.addShipmentUpdate(bookingId, newStatus, 'Operations Checkpoint', `Status changed to ${newStatus}.`);
    if (selectedBooking && selectedBooking.id === bookingId) {
      const updated = { ...selectedBooking, status: newStatus };
      setSelectedBooking(updated);
      const updates = await db.getShipmentUpdates(bookingId);
      setShipmentUpdates(updates);
    }
    await loadData();
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    await db.addShipmentUpdate(
      selectedBooking.id,
      milestoneStatus,
      milestoneLocation.trim() || undefined,
      milestoneNotes.trim() || undefined
    );

    // If milestone is a primary status, optionally sync to booking
    if (bookingStatuses.includes(milestoneStatus as BookingStatus)) {
      await db.updateBooking(selectedBooking.id, { status: milestoneStatus as BookingStatus });
      selectedBooking.status = milestoneStatus as BookingStatus;
    }

    const updates = await db.getShipmentUpdates(selectedBooking.id);
    setShipmentUpdates(updates);
    setIsAddMilestoneModal(false);
    setMilestoneLocation('');
    setMilestoneNotes('');
    await loadData();
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const booking_reference = generateReference('VM-BKG');
      await db.createBooking({
        booking_reference,
        customer_name: bookingForm.customer_name.trim(),
        pickup_location: bookingForm.pickup_location.trim(),
        destination: bookingForm.destination.trim(),
        material: bookingForm.material.trim(),
        weight: bookingForm.weight.trim(),
        vehicle_type: bookingForm.vehicle_type,
        transporter_id: bookingForm.transporter_id || undefined,
        vehicle_number: bookingForm.vehicle_number.trim() || undefined,
        driver_name: bookingForm.driver_name.trim() || undefined,
        driver_phone: bookingForm.driver_phone.trim() || undefined,
        driver_license: bookingForm.driver_license.trim() || undefined,
        pickup_date: bookingForm.pickup_date,
        expected_delivery_date: bookingForm.expected_delivery_date,
        status: bookingForm.status,
        delivery_notes: bookingForm.delivery_notes.trim() || undefined,
      });

      setIsCreateBookingModal(false);
      await loadData();
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.booking_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.vehicle_number && b.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.driver_name && b.driver_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Booking &amp; Consignment Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active highway transport jobs, driver allocations, and transit milestone audits.
          </p>
        </div>

        <button
          onClick={() => setIsCreateBookingModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-brand-orange text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-orange-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Freight Booking</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Booking Ref, Vehicle No, Driver, Lane..."
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
            <option value="ALL">All Bookings ({bookings.length})</option>
            {bookingStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Customer &amp; Lane</th>
                <th className="py-3.5 px-4">Allocated Vehicle &amp; Driver</th>
                <th className="py-3.5 px-4">Pickup Date</th>
                <th className="py-3.5 px-4">Expected Delivery</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No confirmed bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-brand-navy block">
                        {b.booking_reference}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(b.created_at)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.customer_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {b.pickup_location} &rarr; {b.destination}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {b.material} ({b.weight})
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {b.vehicle_number || (
                          <span className="text-amber-600 font-normal">Pending Allocation</span>
                        )}
                      </div>
                      {b.driver_name && (
                        <div className="text-[11px] text-slate-500">
                          {b.driver_name} ({b.driver_phone})
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400">{b.vehicle_type}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {formatDate(b.pickup_date)}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {formatDate(b.expected_delivery_date)}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className={`text-[10px] font-bold uppercase rounded px-2.5 py-1 border ${
                          b.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : b.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : b.status === 'Vehicle Assigned'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : b.status === 'Loading'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : b.status === 'Confirmed'
                            ? 'bg-orange-50 text-brand-orange border-orange-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {bookingStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSelectBooking(b)}
                        className="px-3 py-1.5 rounded bg-brand-navy hover:bg-brand-navy-light text-white text-[11px] font-semibold transition-colors shadow-sm"
                      >
                        Live Tracking
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LIVE TRACKING & MILESTONE DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block">
                  Consignment Milestone Tracking
                </span>
                <h3 className="text-base font-bold font-mono">{selectedBooking.booking_reference}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Trip specs card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Route:</span>
                  <span className="font-bold text-brand-navy">
                    {selectedBooking.pickup_location} &rarr; {selectedBooking.destination}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Current Status:</span>
                  <span className="font-bold text-brand-orange uppercase">{selectedBooking.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Vehicle Allocated:</span>
                  <span className="font-bold">{selectedBooking.vehicle_number || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Driver:</span>
                  <span>{selectedBooking.driver_name || '—'} ({selectedBooking.driver_phone || '—'})</span>
                </div>
              </div>

              {/* Action: Add milestone update button */}
              <div className="flex items-center justify-between pt-2">
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  Transit Milestones Timeline ({shipmentUpdates.length})
                </h4>
                <button
                  onClick={() => setIsAddMilestoneModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Checkpoint</span>
                </button>
              </div>

              {/* Milestone Timeline List */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 pl-8">
                {shipmentUpdates.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No checkpoint logs recorded yet.</p>
                ) : (
                  shipmentUpdates.map((item) => (
                    <div key={item.id} className="relative text-xs space-y-1">
                      <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-brand-orange ring-4 ring-white" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy text-xs">{item.status}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(item.created_at)}</span>
                      </div>
                      {item.location && (
                        <div className="text-slate-600 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.notes && <p className="text-slate-500 text-[11px]">{item.notes}</p>}
                      <div className="text-[10px] text-slate-400">Logged by: {item.updated_by || 'Operations'}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOG CHECKPOINT MILESTONE MODAL */}
      {isAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-brand-navy">Record Transit Checkpoint</h4>

            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Milestone Status
                </label>
                <select
                  value={milestoneStatus}
                  onChange={(e) => setMilestoneStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white"
                >
                  <option value="Vehicle Assigned">Vehicle Assigned</option>
                  <option value="Loading">Loading at Shipper Point</option>
                  <option value="Dispatch from Origin">Dispatch from Origin</option>
                  <option value="In Transit">In Transit (Highway Checkpoint)</option>
                  <option value="State Border Crossed">State Border Toll Crossed</option>
                  <option value="Arrived at Destination">Arrived at Destination Hub</option>
                  <option value="Delivered">Delivered &amp; POD Received</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Location / Toll Checkpoint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Belagavi Highway Toll Plaza"
                  value={milestoneLocation}
                  onChange={(e) => setMilestoneLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Checkpoint Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Driver confirmed no issues, e-way bill valid..."
                  value={milestoneNotes}
                  onChange={(e) => setMilestoneNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-brand-orange text-white text-xs font-bold uppercase hover:bg-brand-orange-hover"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW BOOKING MODAL */}
      {isCreateBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-base font-bold">Register Confirmed Freight Booking</h3>
              <button
                onClick={() => setIsCreateBookingModal(false)}
                className="p-1 rounded hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customer_name}
                    onChange={(e) => setBookingForm({ ...bookingForm, customer_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Carrier Partner
                  </label>
                  <select
                    value={bookingForm.transporter_id}
                    onChange={(e) => setBookingForm({ ...bookingForm, transporter_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white"
                  >
                    <option value="">Select Verified Transporter...</option>
                    {transporters.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.transporter_name} ({t.verification_status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Origin Pickup *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.pickup_location}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickup_location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.destination}
                    onChange={(e) => setBookingForm({ ...bookingForm, destination: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MH 14 EM 4821"
                    value={bookingForm.vehicle_number}
                    onChange={(e) => setBookingForm({ ...bookingForm, vehicle_number: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Jadhav"
                    value={bookingForm.driver_name}
                    onChange={(e) => setBookingForm({ ...bookingForm, driver_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver Mobile Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9823098712"
                    value={bookingForm.driver_phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, driver_phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.pickup_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickup_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.expected_delivery_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, expected_delivery_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateBookingModal(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-brand-orange text-white text-xs font-bold uppercase hover:bg-brand-orange-hover"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
