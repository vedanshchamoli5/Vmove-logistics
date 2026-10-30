// Database entity types matching PostgreSQL tables

export type UserRole = 'admin' | 'operations' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  customer_name: string;
  company_name: string;
  phone: string;
  email?: string;
  billing_address?: string;
  gstin?: string;
  payment_terms?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'New' | 'Under Review' | 'Quoted' | 'Accepted' | 'Rejected' | 'Closed';

export interface Enquiry {
  id: string;
  reference_no: string;
  customer_name: string;
  company_name?: string;
  mobile: string;
  email?: string;
  pickup_city: string;
  destination_city: string;
  material_description: string;
  approximate_weight: string;
  pickup_date: string;
  vehicle_preference?: string;
  loading_requirements?: string;
  additional_instructions?: string;
  status: EnquiryStatus;
  internal_notes?: string;
  ip_hash?: string;
  customer_id?: string;
  created_at: string;
  updated_at: string;
}

export type TransporterStatus = 'Verified' | 'Pending' | 'Suspended';

export interface Transporter {
  id: string;
  transporter_name: string;
  contact_person: string;
  phone: string;
  email?: string;
  vehicle_types: string[];
  operating_routes: string[];
  verification_status: TransporterStatus;
  payment_terms: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Expired' | 'Rejected';

export interface Quotation {
  id: string;
  quote_reference: string;
  enquiry_id?: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  pickup_location: string;
  destination: string;
  vehicle_type: string;
  material: string;
  weight: string;
  customer_freight: number;
  transporter_cost: number;
  other_direct_costs: number;
  estimated_contribution: number; // customer_freight - transporter_cost - other_direct_costs
  margin_percentage: number;
  gst_rate: number; // default 5.00
  gst_amount: number;
  total_customer_amount: number;
  payment_terms: string;
  validity_date: string;
  special_conditions?: string;
  status: QuotationStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus =
  | 'Confirmed'
  | 'Vehicle Assigned'
  | 'Loading'
  | 'In Transit'
  | 'Delivered'
  | 'Closed'
  | 'Cancelled';

export interface Booking {
  id: string;
  booking_reference: string;
  quotation_id?: string;
  customer_id?: string;
  transporter_id?: string;
  customer_name: string;
  pickup_location: string;
  destination: string;
  material: string;
  weight: string;
  vehicle_type: string;
  vehicle_number?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_license?: string;
  pickup_date: string;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  status: BookingStatus;
  delivery_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentUpdate {
  id: string;
  booking_id: string;
  status: string;
  location?: string;
  notes?: string;
  updated_by?: string;
  created_at: string;
}

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue';

export interface Payment {
  id: string;
  booking_id?: string;
  customer_id?: string;
  transporter_id?: string;
  customer_invoice_ref?: string;
  amount_receivable: number;
  amount_received: number;
  customer_payment_status: PaymentStatus;
  receivable_due_date?: string;
  transporter_amount_payable: number;
  transporter_amount_paid: number;
  transporter_payment_status: 'Pending' | 'Partial' | 'Paid';
  payable_due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changed_by?: string;
  changes?: Record<string, unknown>;
  created_at: string;
}
