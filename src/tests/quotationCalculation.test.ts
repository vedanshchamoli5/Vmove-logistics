import { describe, it, expect } from 'vitest';
import { calculateQuoteContribution, formatINR, generateReference } from '../lib/utils';

describe('Quotation Commercial Calculations', () => {
  it('correctly calculates Estimated Contribution: Customer Freight - Transporter Cost - Other Costs', () => {
    // Customer Freight = 48,500; Transporter Cost = 42,000; Other Costs = 1,500
    // Expected Contribution = 48,500 - 42,000 - 1,500 = 5,000
    const result = calculateQuoteContribution(48500, 42000, 1500, 5.0);
    expect(result.estimatedContribution).toBe(5000);
  });

  it('correctly calculates margin percentage: (Contribution / Freight) * 100', () => {
    // 5000 / 48500 * 100 = 10.31%
    const result = calculateQuoteContribution(48500, 42000, 1500, 5.0);
    expect(result.marginPercentage).toBe(10.31);
  });

  it('keeps GST calculation separate and accurately adds to total customer amount', () => {
    // Freight = 50,000, 5% GST = 2,500. Total Customer Amount = 52,500
    const result = calculateQuoteContribution(50000, 40000, 0, 5.0);
    expect(result.gstAmount).toBe(2500);
    expect(result.totalCustomerAmount).toBe(52500);
  });

  it('handles zero freight gracefully without dividing by zero', () => {
    const result = calculateQuoteContribution(0, 0, 0, 5.0);
    expect(result.estimatedContribution).toBe(0);
    expect(result.marginPercentage).toBe(0);
    expect(result.gstAmount).toBe(0);
    expect(result.totalCustomerAmount).toBe(0);
  });
});

describe('Formatting and Reference Generation', () => {
  it('formats currency in Indian Rupees format', () => {
    const formatted = formatINR(50925);
    expect(formatted).toContain('50,925');
  });

  it('generates compliant reference codes for enquiries, quotes, and bookings', () => {
    const enqRef = generateReference('VM-ENQ');
    const quoRef = generateReference('VM-QUO');
    const bkgRef = generateReference('VM-BKG');

    expect(enqRef).toMatch(/^VM-ENQ-\d{8}$/);
    expect(quoRef).toMatch(/^VM-QUO-\d{8}$/);
    expect(bkgRef).toMatch(/^VM-BKG-\d{8}$/);
  });
});
