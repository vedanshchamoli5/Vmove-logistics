import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../lib/db';
import { calculateQuoteContribution, generateReference } from '../lib/utils';

describe('B2B Freight End-to-End Operational Lifecycle', () => {
  beforeEach(() => {
    // Reset to clean demo state in local storage
    db.resetToDemoData();
  });

  it('registers a new freight enquiry and updates status', async () => {
    const enq = await db.createEnquiry({
      reference_no: generateReference('VM-ENQ'),
      customer_name: 'Test Automotive Shipper',
      company_name: 'AutoTech India Pvt Ltd',
      mobile: '9876543210',
      email: 'logistics@autotech.example.com',
      pickup_city: 'Pune, Maharashtra',
      destination_city: 'Bengaluru, Karnataka',
      material_description: 'Engine Transmission Blocks',
      approximate_weight: '16 MT',
      pickup_date: '2026-11-05',
      vehicle_preference: '32ft Multi-Axle Container',
      status: 'New',
    });

    expect(enq.reference_no).toContain('VM-ENQ-');
    expect(enq.status).toBe('New');

    // Update status to Quoted
    const updated = await db.updateEnquiry(enq.id, { status: 'Quoted', internal_notes: 'Competitive quote issued.' });
    expect(updated?.status).toBe('Quoted');
    expect(updated?.internal_notes).toBe('Competitive quote issued.');
  });

  it('creates commercial quotation with accurate contribution and converts to booking', async () => {
    const calc = calculateQuoteContribution(60000, 51000, 2000, 5.0);
    expect(calc.estimatedContribution).toBe(7000); // 60,000 - 51,000 - 2,000

    const quote = await db.createQuotation({
      quote_reference: generateReference('VM-QUO'),
      customer_name: 'AutoTech India Pvt Ltd',
      customer_phone: '9876543210',
      pickup_location: 'Pune MIDC',
      destination: 'Peenya Industrial Area, Bengaluru',
      vehicle_type: '32ft MXL Container',
      material: 'Engine Blocks',
      weight: '16 MT',
      customer_freight: 60000,
      transporter_cost: 51000,
      other_direct_costs: 2000,
      estimated_contribution: calc.estimatedContribution,
      margin_percentage: calc.marginPercentage,
      gst_rate: 5.0,
      gst_amount: calc.gstAmount,
      total_customer_amount: calc.totalCustomerAmount,
      payment_terms: '15 Days Net',
      validity_date: '2026-11-12',
      status: 'Accepted',
    });

    expect(quote.quote_reference).toContain('VM-QUO-');
    expect(quote.status).toBe('Accepted');

    // Convert accepted quote to confirmed booking
    const booking = await db.createBooking({
      booking_reference: generateReference('VM-BKG'),
      quotation_id: quote.id,
      customer_name: quote.customer_name,
      pickup_location: quote.pickup_location,
      destination: quote.destination,
      material: quote.material,
      weight: quote.weight,
      vehicle_type: quote.vehicle_type,
      vehicle_number: 'MH 12 RN 8899',
      driver_name: 'Gurpreet Singh',
      driver_phone: '9811223344',
      pickup_date: '2026-11-05',
      expected_delivery_date: '2026-11-07',
      status: 'Confirmed',
    });

    expect(booking.booking_reference).toContain('VM-BKG-');
    expect(booking.status).toBe('Confirmed');

    // Add milestone checkpoint update
    const update = await db.addShipmentUpdate(booking.id, 'In Transit', 'Kolhapur Checkpost', 'Vehicle cleared highway toll.');
    expect(update.status).toBe('In Transit');
    expect(update.location).toBe('Kolhapur Checkpost');
  });
});
