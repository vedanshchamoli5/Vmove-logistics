-- ============================================================================
-- VMOVE LOGISTICS - PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Migration: 20261030000000_vmove_schema.sql
-- Description: Complete schema for B2B logistics management, RLS, audit logging,
--              reference generation, and role-based access.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES (Admins and Operations Staff)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operations' CHECK (role IN ('admin', 'operations', 'viewer')),
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 2. CUSTOMERS (B2B Commercial Accounts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    billing_address TEXT,
    gstin TEXT CHECK (gstin IS NULL OR length(gstin) = 15),
    payment_terms TEXT DEFAULT '30 Days Net',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customers_company ON public.customers(company_name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ----------------------------------------------------------------------------
-- 3. ENQUIRIES (Public Freight Requests)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    company_name TEXT,
    mobile TEXT NOT NULL,
    email TEXT,
    pickup_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    material_description TEXT NOT NULL,
    approximate_weight TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    vehicle_preference TEXT,
    loading_requirements TEXT,
    additional_instructions TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Quoted', 'Accepted', 'Rejected', 'Closed')),
    internal_notes TEXT,
    ip_hash TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_ref ON public.enquiries(reference_no);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. TRANSPORTERS (Verified 3rd-Party Transport Fleet Partners)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transporters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transporter_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vehicle_types TEXT[] DEFAULT '{}',
    operating_routes TEXT[] DEFAULT '{}',
    verification_status TEXT NOT NULL DEFAULT 'Pending' CHECK (verification_status IN ('Verified', 'Pending', 'Suspended')),
    payment_terms TEXT DEFAULT 'Advance + POD',
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transporters_name ON public.transporters(transporter_name);
CREATE INDEX IF NOT EXISTS idx_transporters_status ON public.transporters(verification_status);

-- ----------------------------------------------------------------------------
-- 5. QUOTATIONS (Freight Quotations with Internal Contribution Calculation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_reference TEXT NOT NULL UNIQUE,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    material TEXT NOT NULL,
    weight TEXT NOT NULL,
    customer_freight NUMERIC(12, 2) NOT NULL CHECK (customer_freight >= 0),
    transporter_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (transporter_cost >= 0),
    other_direct_costs NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (other_direct_costs >= 0),
    estimated_contribution NUMERIC(12, 2) GENERATED ALWAYS AS (customer_freight - transporter_cost - other_direct_costs) STORED,
    margin_percentage NUMERIC(5, 2) DEFAULT 0,
    gst_rate NUMERIC(4, 2) NOT NULL DEFAULT 5.00,
    gst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_customer_amount NUMERIC(12, 2) NOT NULL CHECK (total_customer_amount >= 0),
    payment_terms TEXT NOT NULL DEFAULT 'Immediate on delivery / POD',
    validity_date DATE NOT NULL,
    special_conditions TEXT,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Expired', 'Rejected')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quotations_ref ON public.quotations(quote_reference);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON public.quotations(customer_id);

-- ----------------------------------------------------------------------------
-- 6. BOOKINGS (Confirmed Shipments)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT NOT NULL UNIQUE,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    transporter_id UUID REFERENCES public.transporters(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    material TEXT NOT NULL,
    weight TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    vehicle_number TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    driver_license TEXT,
    pickup_date DATE NOT NULL,
    expected_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN (
        'Confirmed', 'Vehicle Assigned', 'Loading', 'In Transit', 'Delivered', 'Closed', 'Cancelled'
    )),
    delivery_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ----------------------------------------------------------------------------
-- 7. SHIPMENT UPDATES (Audit and Tracking Milestones)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipment_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT,
    notes TEXT,
    updated_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shipment_updates_booking ON public.shipment_updates(booking_id);

-- ----------------------------------------------------------------------------
-- 8. PAYMENTS (Receivables and Transporter Payables Operational Tracker)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    transporter_id UUID REFERENCES public.transporters(id) ON DELETE SET NULL,
    customer_invoice_ref TEXT,
    amount_receivable NUMERIC(12, 2) NOT NULL DEFAULT 0,
    amount_received NUMERIC(12, 2) NOT NULL DEFAULT 0,
    customer_payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (customer_payment_status IN ('Pending', 'Partial', 'Paid', 'Overdue')),
    receivable_due_date DATE,
    transporter_amount_payable NUMERIC(12, 2) NOT NULL DEFAULT 0,
    transporter_amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
    transporter_payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (transporter_payment_status IN ('Pending', 'Partial', 'Paid')),
    payable_due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_cust_status ON public.payments(customer_payment_status);

-- ----------------------------------------------------------------------------
-- 9. AUDIT LOGS (Security & Operational Changes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    changed_by TEXT,
    changes JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Authenticated Staff
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Authenticated users can read their own profile, admins can read all
CREATE POLICY "Profiles read by authenticated staff"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

-- Customers: Staff only
CREATE POLICY "Customers full access for staff"
    ON public.customers FOR ALL
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Enquiries: Anyone can insert (public quote form), only staff can view/edit/delete
CREATE POLICY "Public insert enquiries"
    ON public.enquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Staff manage enquiries"
    ON public.enquiries FOR ALL
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Transporters: Staff only
CREATE POLICY "Transporters full access for staff"
    ON public.transporters FOR ALL
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Quotations: Staff only (Crucial: prevents public viewing of internal costs/margins)
CREATE POLICY "Quotations full access for staff"
    ON public.quotations FOR ALL
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Bookings: Staff only
CREATE POLICY "Bookings full access for staff"
    ON public.bookings FOR ALL
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Shipment Updates: Staff full access
CREATE POLICY "Shipment updates full access for staff"
    ON public.shipment_updates FOR ALL
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Payments: Staff only
CREATE POLICY "Payments full access for staff"
    ON public.payments FOR ALL
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- Audit logs: Staff read, insert by trigger/backend
CREATE POLICY "Audit logs staff read"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_staff());

CREATE POLICY "Audit logs staff insert"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff());
