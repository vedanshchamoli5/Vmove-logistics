-- ============================================================================
-- VMOVE LOGISTICS - DEMO SEED DATA (INDIAN ROAD LOGISTICS)
-- File: supabase/seed.sql
-- Note: This demo data is for testing and preview purposes. All entries are
-- marked with "[DEMO]" or standard mock identifiers and can be cleared in production.
-- ============================================================================

-- Customers
INSERT INTO public.customers (id, customer_name, company_name, phone, email, billing_address, gstin, payment_terms, notes)
VALUES
('a1000000-0000-0000-0000-000000000001', 'Rajesh Sharma', 'Apex Engineering Ltd', '9820112233', 'rajesh.sharma@apexeng.example.com', 'Plot 42, MIDC Industrial Area, Bhosari, Pune, Maharashtra 411026', '27AABCA1234F1Z5', '30 Days Net', 'Regular shipper of automotive metal forgings.'),
('a1000000-0000-0000-0000-000000000002', 'Vikram Singhania', 'Singhania Polytex Pvt Ltd', '9811445566', 'v.singhania@polytex.example.com', 'Sector 18, Udyog Vihar, Gurugram, Haryana 122015', '06AAACS9876D1Z2', '15 Days Net', 'Requires waterproof 32ft closed containers for textile rolls.'),
('a1000000-0000-0000-0000-000000000003', 'Karthik Raman', 'Dakshin Polymers', '9444123890', 'karthik@dakshinpolymers.example.com', 'Ambattur Industrial Estate, Chennai, Tamil Nadu 600058', '33AAACD4567K1ZA', 'Immediate on Delivery', 'High-priority raw polymer granule shipments.')
ON CONFLICT (id) DO NOTHING;

-- Transporters
INSERT INTO public.transporters (id, transporter_name, contact_person, phone, email, vehicle_types, operating_routes, verification_status, payment_terms, internal_notes)
VALUES
('b1000000-0000-0000-0000-000000000001', 'Balaji Freightlines', 'Manpreet Singh', '9876543210', 'ops@balajifreight.example.com', ARRAY['32ft MXL Container', '32ft SXL Container'], ARRAY['Delhi NCR - Mumbai Corridor', 'Jaipur - Ahmedabad'], 'Verified', '70% Advance + 30% on POD', 'Reliable fleet partner with GPS tracking on all 32ft containers.'),
('b1000000-0000-0000-0000-000000000002', 'Sahyadri Roadways', 'Sanjay Patil', '9822334455', 'sahyadri.logistics@example.com', ARRAY['14ft Open Eicher', '19ft Closed Truck', '20ft Container'], ARRAY['Pune - Bengaluru', 'Mumbai - Hyderabad', 'Nashik - Surat'], 'Verified', '80% Advance + 20% on POD', 'Fast turnaround for Maharashtra and Karnataka arterial routes.'),
('b1000000-0000-0000-0000-000000000003', 'Hindustan Heavy Carriers', 'Dinesh Rawat', '9711223344', 'contact@hhcarriers.example.com', ARRAY['40ft High Bed Trailer', '32ft Open Body'], ARRAY['North - South Corridors', 'Industrial Belt Transport'], 'Pending', '50% Advance + 50% on Delivery', 'Undergoing document validation for specialized machinery transport.')
ON CONFLICT (id) DO NOTHING;

-- Enquiries
INSERT INTO public.enquiries (id, reference_no, customer_name, company_name, mobile, email, pickup_city, destination_city, material_description, approximate_weight, pickup_date, vehicle_preference, loading_requirements, additional_instructions, status, internal_notes)
VALUES
('c1000000-0000-0000-0000-000000000001', 'VM-ENQ-2601', 'Rajesh Sharma', 'Apex Engineering Ltd', '9820112233', 'rajesh.sharma@apexeng.example.com', 'Pune, Maharashtra', 'Bengaluru, Karnataka', 'Industrial Machined Spares & Forgings', '8.5 Metric Tonnes', CURRENT_DATE + INTERVAL '2 days', '32ft SXL Container', 'Forklift loading from side required', 'Goods palletized and strapped.', 'Quoted', 'Linked with Quote VM-QUO-8101.'),
('c1000000-0000-0000-0000-000000000002', 'VM-ENQ-2602', 'Amit Kulkarni', 'Kulkarni Electrocraft', '9890123456', 'amit@electrocraft.example.com', 'Gurugram, Haryana', 'Bhiwandi, Maharashtra', 'Electrical Distribution Panels', '4.2 Metric Tonnes', CURRENT_DATE + INTERVAL '3 days', '19ft Closed Truck', 'Top tarpaulin mandatory', 'Fragile electronic instruments included.', 'Under Review', 'Checking transporter rates on Delhi-Mumbai expressway corridor.'),
('c1000000-0000-0000-0000-000000000003', 'VM-ENQ-2603', 'Sunil Bansal', 'Bansal Agro Processors', '9810987654', 'sunil@bansalagro.example.com', 'Indore, Madhya Pradesh', 'Ahmedabad, Gujarat', 'Agricultural Grade Plastic Packaging', '14 Metric Tonnes', CURRENT_DATE + INTERVAL '5 days', '32ft MXL Container', 'Standard warehouse dock loading', 'Dispatch time morning 10 AM.', 'New', 'Fresh customer enquiry received via website form.')
ON CONFLICT (id) DO NOTHING;

-- Quotations
INSERT INTO public.quotations (id, quote_reference, enquiry_id, customer_id, customer_name, customer_email, customer_phone, pickup_location, destination, vehicle_type, material, weight, customer_freight, transporter_cost, other_direct_costs, margin_percentage, gst_rate, gst_amount, total_customer_amount, payment_terms, validity_date, special_conditions, status)
VALUES
('d1000000-0000-0000-0000-000000000001', 'VM-QUO-8101', 'c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Rajesh Sharma (Apex Engineering Ltd)', 'rajesh.sharma@apexeng.example.com', '9820112233', 'Bhosari MIDC, Pune', 'Peenya Industrial Area, Bengaluru', '32ft SXL Container', 'Industrial Machined Spares', '8.5 Metric Tonnes', 48500.00, 42000.00, 1500.00, 10.31, 5.00, 2425.00, 50925.00, '30 Days Net from physical POD submission', CURRENT_DATE + INTERVAL '7 days', 'Includes transit insurance under customer open policy. Detention charges ₹1,500/day after 24 hours free loading/unloading.', 'Accepted')
ON CONFLICT (id) DO NOTHING;

-- Bookings
INSERT INTO public.bookings (id, booking_reference, quotation_id, customer_id, transporter_id, customer_name, pickup_location, destination, material, weight, vehicle_type, vehicle_number, driver_name, driver_phone, driver_license, pickup_date, expected_delivery_date, status, delivery_notes)
VALUES
('e1000000-0000-0000-0000-000000000001', 'VM-BKG-9011', 'd1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Apex Engineering Ltd', 'Bhosari MIDC, Pune', 'Peenya, Bengaluru', 'Industrial Machined Spares', '8.5 Metric Tonnes', '32ft SXL Container', 'MH 14 EM 4821', 'Ramesh Jadhav', '9823098712', 'MH14-2015004921', CURRENT_DATE - INTERVAL '1 days', CURRENT_DATE + INTERVAL '1 days', 'In Transit', 'Driver checked in near Belagavi toll plaza.')
ON CONFLICT (id) DO NOTHING;

-- Shipment Updates
INSERT INTO public.shipment_updates (booking_id, status, location, notes, updated_by)
VALUES
('e1000000-0000-0000-0000-000000000001', 'Vehicle Assigned', 'Pune Hub', 'Sahyadri Roadways assigned MH 14 EM 4821.', 'Ops Team'),
('e1000000-0000-0000-0000-000000000001', 'Loading', 'Bhosari MIDC, Pune', 'Loading completed at 16:30 hrs. E-way bill verified.', 'Field Executive'),
('e1000000-0000-0000-0000-000000000001', 'In Transit', 'Kolhapur - Belagavi Highway', 'Vehicle crossed Maharashtra-Karnataka border smoothly.', 'Tracking Bot');

-- Payments
INSERT INTO public.payments (id, booking_id, customer_id, transporter_id, customer_invoice_ref, amount_receivable, amount_received, customer_payment_status, receivable_due_date, transporter_amount_payable, transporter_amount_paid, transporter_payment_status, payable_due_date, notes)
VALUES
('f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'VM-INV-2026-042', 50925.00, 15000.00, 'Partial', CURRENT_DATE + INTERVAL '25 days', 42000.00, 30000.00, 'Partial', CURRENT_DATE + INTERVAL '10 days', '₹30,000 diesel & trip advance paid to transporter. Balance ₹12,000 on hardcopy POD.')
ON CONFLICT (id) DO NOTHING;
