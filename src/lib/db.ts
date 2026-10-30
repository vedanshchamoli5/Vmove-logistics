import { supabase, isSupabaseConfigured } from './supabase';
import {
  Customer,
  Enquiry,
  Quotation,
  Transporter,
  Booking,
  ShipmentUpdate,
  Payment,
  AuditLog,
} from '../types/database';
import {
  initialCustomers,
  initialTransporters,
  initialEnquiries,
  initialQuotations,
  initialBookings,
  initialShipmentUpdates,
  initialPayments,
  initialAuditLogs,
} from './mockData';

// Local storage keys
const KEYS = {
  CUSTOMERS: 'vmove_data_customers',
  TRANSPORTERS: 'vmove_data_transporters',
  ENQUIRIES: 'vmove_data_enquiries',
  QUOTATIONS: 'vmove_data_quotations',
  BOOKINGS: 'vmove_data_bookings',
  UPDATES: 'vmove_data_updates',
  PAYMENTS: 'vmove_data_payments',
  AUDIT: 'vmove_data_audit',
};

// In-memory fallback store when localStorage is unavailable (e.g. Node/Vitest test runner)
const memStore: Record<string, string> = {};

function safeStorageGet(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {}
  return memStore[key] || null;
}

function safeStorageSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {}
  memStore[key] = value;
}

// Helper to get from local storage or initialize
function getLocal<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = safeStorageGet(key);
    if (!raw) {
      safeStorageSet(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T[]): void {
  try {
    safeStorageSet(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export const db = {
  // --------------------------------------------------------------------------
  // ENQUIRIES
  // --------------------------------------------------------------------------
  async getEnquiries(): Promise<Enquiry[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Enquiry[];
    }
    return getLocal<Enquiry>(KEYS.ENQUIRIES, initialEnquiries);
  },

  async createEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>): Promise<Enquiry> {
    const newRecord: Enquiry = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('enquiries').insert([enquiry]).select().single();
      if (!error && data) {
        await this.addAuditLog('enquiries', data.id, 'create', 'Public Web Form', { ref: data.reference_no });
        return data as Enquiry;
      }
    }

    const current = getLocal<Enquiry>(KEYS.ENQUIRIES, initialEnquiries);
    const updated = [newRecord, ...current];
    setLocal(KEYS.ENQUIRIES, updated);

    await this.addAuditLog('enquiries', newRecord.id, 'create', 'Public Web Form', { ref: newRecord.reference_no });
    return newRecord;
  },

  async updateEnquiry(id: string, updates: Partial<Enquiry>, userEmail = 'Admin'): Promise<Enquiry | null> {
    const oldList = getLocal<Enquiry>(KEYS.ENQUIRIES, initialEnquiries);
    const oldItem = oldList.find(e => e.id === id);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        await this.addAuditLog('enquiries', id, 'update', userEmail, { old: oldItem, new: data });
        return data as Enquiry;
      }
    }

    const updated = oldList.map(item => (item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item));
    setLocal(KEYS.ENQUIRIES, updated);

    const changedItem = updated.find(e => e.id === id) || null;
    await this.addAuditLog('enquiries', id, 'update', userEmail, { updates });
    return changedItem;
  },

  // --------------------------------------------------------------------------
  // QUOTATIONS
  // --------------------------------------------------------------------------
  async getQuotations(): Promise<Quotation[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Quotation[];
    }
    return getLocal<Quotation>(KEYS.QUOTATIONS, initialQuotations);
  },

  async createQuotation(quote: Omit<Quotation, 'id' | 'created_at' | 'updated_at'>, userEmail = 'Admin'): Promise<Quotation> {
    const newRecord: Quotation = {
      ...quote,
      id: 'quo-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('quotations').insert([quote]).select().single();
      if (!error && data) {
        await this.addAuditLog('quotations', data.id, 'create', userEmail, { ref: data.quote_reference });
        return data as Quotation;
      }
    }

    const current = getLocal<Quotation>(KEYS.QUOTATIONS, initialQuotations);
    const updated = [newRecord, ...current];
    setLocal(KEYS.QUOTATIONS, updated);

    // If linked to an enquiry, auto update enquiry status to 'Quoted'
    if (quote.enquiry_id) {
      await this.updateEnquiry(quote.enquiry_id, { status: 'Quoted' }, userEmail);
    }

    await this.addAuditLog('quotations', newRecord.id, 'create', userEmail, { ref: newRecord.quote_reference });
    return newRecord;
  },

  async updateQuotation(id: string, updates: Partial<Quotation>, userEmail = 'Admin'): Promise<Quotation | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('quotations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        await this.addAuditLog('quotations', id, 'update', userEmail, { updates });
        return data as Quotation;
      }
    }

    const current = getLocal<Quotation>(KEYS.QUOTATIONS, initialQuotations);
    const updated = current.map(item => (item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item));
    setLocal(KEYS.QUOTATIONS, updated);

    await this.addAuditLog('quotations', id, 'update', userEmail, { updates });
    return updated.find(q => q.id === id) || null;
  },

  // --------------------------------------------------------------------------
  // CUSTOMERS
  // --------------------------------------------------------------------------
  async getCustomers(): Promise<Customer[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('company_name', { ascending: true });
      if (!error && data) return data as Customer[];
    }
    return getLocal<Customer>(KEYS.CUSTOMERS, initialCustomers);
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>, userEmail = 'Admin'): Promise<Customer> {
    const newRecord: Customer = {
      ...customer,
      id: 'cust-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('customers').insert([customer]).select().single();
      if (!error && data) {
        await this.addAuditLog('customers', data.id, 'create', userEmail, { company: data.company_name });
        return data as Customer;
      }
    }

    const current = getLocal<Customer>(KEYS.CUSTOMERS, initialCustomers);
    const updated = [newRecord, ...current];
    setLocal(KEYS.CUSTOMERS, updated);

    await this.addAuditLog('customers', newRecord.id, 'create', userEmail, { company: newRecord.company_name });
    return newRecord;
  },

  async updateCustomer(id: string, updates: Partial<Customer>, userEmail = 'Admin'): Promise<Customer | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Customer;
    }

    const current = getLocal<Customer>(KEYS.CUSTOMERS, initialCustomers);
    const updated = current.map(c => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
    setLocal(KEYS.CUSTOMERS, updated);
    await this.addAuditLog('customers', id, 'update', userEmail, { updates });
    return updated.find(c => c.id === id) || null;
  },

  // --------------------------------------------------------------------------
  // TRANSPORTERS
  // --------------------------------------------------------------------------
  async getTransporters(): Promise<Transporter[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('transporters')
        .select('*')
        .order('transporter_name', { ascending: true });
      if (!error && data) return data as Transporter[];
    }
    return getLocal<Transporter>(KEYS.TRANSPORTERS, initialTransporters);
  },

  async createTransporter(transporter: Omit<Transporter, 'id' | 'created_at' | 'updated_at'>, userEmail = 'Admin'): Promise<Transporter> {
    const newRecord: Transporter = {
      ...transporter,
      id: 'trans-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('transporters').insert([transporter]).select().single();
      if (!error && data) return data as Transporter;
    }

    const current = getLocal<Transporter>(KEYS.TRANSPORTERS, initialTransporters);
    const updated = [newRecord, ...current];
    setLocal(KEYS.TRANSPORTERS, updated);
    await this.addAuditLog('transporters', newRecord.id, 'create', userEmail, { name: newRecord.transporter_name });
    return newRecord;
  },

  async updateTransporter(id: string, updates: Partial<Transporter>, userEmail = 'Admin'): Promise<Transporter | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('transporters')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Transporter;
    }

    const current = getLocal<Transporter>(KEYS.TRANSPORTERS, initialTransporters);
    const updated = current.map(t => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));
    setLocal(KEYS.TRANSPORTERS, updated);
    await this.addAuditLog('transporters', id, 'update', userEmail, { updates });
    return updated.find(t => t.id === id) || null;
  },

  // --------------------------------------------------------------------------
  // BOOKINGS
  // --------------------------------------------------------------------------
  async getBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Booking[];
    }
    return getLocal<Booking>(KEYS.BOOKINGS, initialBookings);
  },

  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>, userEmail = 'Admin'): Promise<Booking> {
    const newRecord: Booking = {
      ...booking,
      id: 'bkg-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
      if (!error && data) {
        await this.addShipmentUpdate(data.id, 'Booking Confirmed', 'Origin Hub', 'Booking registered in system.', userEmail);
        return data as Booking;
      }
    }

    const current = getLocal<Booking>(KEYS.BOOKINGS, initialBookings);
    const updated = [newRecord, ...current];
    setLocal(KEYS.BOOKINGS, updated);

    // Initial shipment update
    await this.addShipmentUpdate(newRecord.id, 'Booking Confirmed', newRecord.pickup_location, 'Booking created from quotation.', userEmail);

    await this.addAuditLog('bookings', newRecord.id, 'create', userEmail, { ref: newRecord.booking_reference });
    return newRecord;
  },

  async updateBooking(id: string, updates: Partial<Booking>, userEmail = 'Admin'): Promise<Booking | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Booking;
    }

    const current = getLocal<Booking>(KEYS.BOOKINGS, initialBookings);
    const updated = current.map(b => (b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b));
    setLocal(KEYS.BOOKINGS, updated);
    await this.addAuditLog('bookings', id, 'update', userEmail, { updates });
    return updated.find(b => b.id === id) || null;
  },

  // --------------------------------------------------------------------------
  // SHIPMENT UPDATES
  // --------------------------------------------------------------------------
  async getShipmentUpdates(bookingId: string): Promise<ShipmentUpdate[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('shipment_updates')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });
      if (!error && data) return data as ShipmentUpdate[];
    }
    const all = getLocal<ShipmentUpdate>(KEYS.UPDATES, initialShipmentUpdates);
    return all.filter(u => u.booking_id === bookingId);
  },

  async addShipmentUpdate(bookingId: string, status: string, location?: string, notes?: string, userEmail = 'Admin'): Promise<ShipmentUpdate> {
    const newRecord: ShipmentUpdate = {
      id: 'upd-' + Date.now(),
      booking_id: bookingId,
      status,
      location,
      notes,
      updated_by: userEmail,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('shipment_updates').insert([newRecord]).select().single();
      if (!error && data) return data as ShipmentUpdate;
    }

    const current = getLocal<ShipmentUpdate>(KEYS.UPDATES, initialShipmentUpdates);
    setLocal(KEYS.UPDATES, [...current, newRecord]);
    return newRecord;
  },

  // --------------------------------------------------------------------------
  // PAYMENTS
  // --------------------------------------------------------------------------
  async getPayments(): Promise<Payment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Payment[];
    }
    return getLocal<Payment>(KEYS.PAYMENTS, initialPayments);
  },

  async createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>, userEmail = 'Admin'): Promise<Payment> {
    const newRecord: Payment = {
      ...payment,
      id: 'pay-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('payments').insert([payment]).select().single();
      if (!error && data) return data as Payment;
    }

    const current = getLocal<Payment>(KEYS.PAYMENTS, initialPayments);
    setLocal(KEYS.PAYMENTS, [newRecord, ...current]);
    await this.addAuditLog('payments', newRecord.id, 'create', userEmail, { invoice: newRecord.customer_invoice_ref });
    return newRecord;
  },

  async updatePayment(id: string, updates: Partial<Payment>, userEmail = 'Admin'): Promise<Payment | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('payments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Payment;
    }

    const current = getLocal<Payment>(KEYS.PAYMENTS, initialPayments);
    const updated = current.map(p => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
    setLocal(KEYS.PAYMENTS, updated);
    await this.addAuditLog('payments', id, 'update', userEmail, { updates });
    return updated.find(p => p.id === id) || null;
  },

  // --------------------------------------------------------------------------
  // AUDIT LOGS
  // --------------------------------------------------------------------------
  async getAuditLogs(): Promise<AuditLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (!error && data) return data as AuditLog[];
    }
    return getLocal<AuditLog>(KEYS.AUDIT, initialAuditLogs);
  },

  async addAuditLog(entity_type: string, entity_id: string, action: string, changed_by: string, changes?: Record<string, unknown>): Promise<void> {
    const log: AuditLog = {
      id: 'aud-' + Date.now(),
      entity_type,
      entity_id,
      action,
      changed_by,
      changes,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('audit_logs').insert([log]);
      return;
    }

    const current = getLocal<AuditLog>(KEYS.AUDIT, initialAuditLogs);
    setLocal(KEYS.AUDIT, [log, ...current].slice(0, 150));
  },

  // --------------------------------------------------------------------------
  // DASHBOARD KPIS
  // --------------------------------------------------------------------------
  async getDashboardKPIs() {
    const [enquiries, quotations, bookings, payments] = await Promise.all([
      this.getEnquiries(),
      this.getQuotations(),
      this.getBookings(),
      this.getPayments(),
    ]);

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter(e => e.status === 'New').length;
    const pendingQuotations = quotations.filter(q => q.status === 'Draft' || q.status === 'Sent').length;
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Vehicle Assigned').length;
    const activeShipments = bookings.filter(b => b.status === 'In Transit' || b.status === 'Loading').length;

    // Outstanding customer payments = Total Receivable - Total Received
    const outstandingCustomerPayments = payments.reduce((acc, p) => {
      const outstanding = Math.max(0, p.amount_receivable - p.amount_received);
      return acc + outstanding;
    }, 0);

    // Outstanding transporter payables = Total Payable - Total Paid
    const outstandingTransporterPayables = payments.reduce((acc, p) => {
      const outstanding = Math.max(0, p.transporter_amount_payable - p.transporter_amount_paid);
      return acc + outstanding;
    }, 0);

    return {
      totalEnquiries,
      newEnquiries,
      pendingQuotations,
      confirmedBookings,
      activeShipments,
      outstandingCustomerPayments,
      outstandingTransporterPayables,
    };
  },

  // --------------------------------------------------------------------------
  // RESET / CLEAR DEMO DATA
  // --------------------------------------------------------------------------
  resetToDemoData() {
    safeStorageSet(KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
    safeStorageSet(KEYS.TRANSPORTERS, JSON.stringify(initialTransporters));
    safeStorageSet(KEYS.ENQUIRIES, JSON.stringify(initialEnquiries));
    safeStorageSet(KEYS.QUOTATIONS, JSON.stringify(initialQuotations));
    safeStorageSet(KEYS.BOOKINGS, JSON.stringify(initialBookings));
    safeStorageSet(KEYS.UPDATES, JSON.stringify(initialShipmentUpdates));
    safeStorageSet(KEYS.PAYMENTS, JSON.stringify(initialPayments));
    safeStorageSet(KEYS.AUDIT, JSON.stringify(initialAuditLogs));
  },

  clearAllData() {
    safeStorageSet(KEYS.CUSTOMERS, JSON.stringify([]));
    safeStorageSet(KEYS.TRANSPORTERS, JSON.stringify([]));
    safeStorageSet(KEYS.ENQUIRIES, JSON.stringify([]));
    safeStorageSet(KEYS.QUOTATIONS, JSON.stringify([]));
    safeStorageSet(KEYS.BOOKINGS, JSON.stringify([]));
    safeStorageSet(KEYS.UPDATES, JSON.stringify([]));
    safeStorageSet(KEYS.PAYMENTS, JSON.stringify([]));
    safeStorageSet(KEYS.AUDIT, JSON.stringify([]));
  }
};
