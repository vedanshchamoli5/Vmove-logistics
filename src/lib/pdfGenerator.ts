import { Quotation } from '../types/database';
import { formatINR, formatDate } from './utils';

/**
 * Generates an official, corporate customer-facing freight quotation PDF.
 * CRITICAL SECURITY & BUSINESS RULE:
 * This customer-facing document STRICTLY EXCLUDES:
 * - Transporter freight costs
 * - Internal margin percentages
 * - Estimated contribution amounts
 * - Confidential operational notes
 */
export async function generateCustomerQuotationPDF(quote: Quotation): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [16, 36, 58]; // #10243A
  const accentColor = [249, 115, 22]; // #F97316
  const textDark = [30, 41, 59];
  const textMuted = [100, 116, 139];
  const bgLight = [248, 250, 252];

  // Header background banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Orange accent bar under banner
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Company Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('VMOVE LOGISTICS', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Moving Business Forward.', 14, 25);
  doc.text('B2B Road Freight & Logistics Solutions', 14, 30);
  doc.text('Phone: +91 7906308640  |  Email: contact@vmovelogistics.com', 14, 35);

  // Document Title / Reference badge (Right aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('FREIGHT QUOTATION', 196, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(254, 215, 170);
  doc.text(`Ref: ${quote.quote_reference}`, 196, 25, { align: 'right' });
  doc.setTextColor(203, 213, 225);
  doc.text(`Date: ${formatDate(quote.created_at)}`, 196, 30, { align: 'right' });
  doc.text(`Valid Until: ${formatDate(quote.validity_date)}`, 196, 35, { align: 'right' });

  // --------------------------------------------------------------------------
  // Recipient / Consignor Details Box
  // --------------------------------------------------------------------------
  let yPos = 54;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(14, yPos, 182, 28, 2, 2, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('QUOTATION ISSUED TO:', 18, yPos + 7);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFontSize(11);
  doc.text(quote.customer_name || 'Valued Commercial Client', 18, yPos + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Contact: ${quote.customer_phone} ${quote.customer_email ? ' | ' + quote.customer_email : ''}`, 18, yPos + 20);

  // --------------------------------------------------------------------------
  // Route & Consignment Specifications
  // --------------------------------------------------------------------------
  yPos += 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('1. CONSIGNMENT & ROUTE SPECIFICATIONS', 14, yPos);

  yPos += 5;
  const specData = [
    ['Origin / Pickup Point:', quote.pickup_location, 'Destination Point:', quote.destination],
    ['Material Type:', quote.material, 'Approx Weight / Load:', quote.weight],
    ['Vehicle Type / Spec:', quote.vehicle_type, 'Transit Route Type:', 'Dedicated Road Transportation (FTL)'],
  ];

  doc.setFontSize(9);
  specData.forEach(row => {
    doc.setFillColor(255, 255, 255);
    doc.rect(14, yPos, 182, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(row[0], 17, yPos + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(row[1], 56, yPos + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(row[2], 108, yPos + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(row[3], 148, yPos + 4.8);

    yPos += 7;
  });

  // --------------------------------------------------------------------------
  // Commercial Charges & Pricing Table
  // --------------------------------------------------------------------------
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('2. COMMERCIAL FREIGHT BREAKDOWN', 14, yPos);

  yPos += 4;
  // Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, yPos, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Description / Service Item', 18, yPos + 5.5);
  doc.text('Basis', 125, yPos + 5.5);
  doc.text('Amount (INR)', 192, yPos + 5.5, { align: 'right' });

  yPos += 8;
  // Freight row
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.rect(14, yPos, 182, 9, 'F');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dedicated Full Truck Load Freight (${quote.pickup_location} to ${quote.destination})`, 18, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Per Trip', 125, yPos + 6);
  doc.text(formatINR(quote.customer_freight), 192, yPos + 6, { align: 'right' });

  // GST Row
  yPos += 9;
  doc.rect(14, yPos, 182, 8, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Goods & Services Tax (GST) @ ${quote.gst_rate}% (GTA Transport Service)`, 18, yPos + 5.5);
  doc.text(`${quote.gst_rate}%`, 125, yPos + 5.5);
  doc.text(formatINR(quote.gst_amount), 192, yPos + 5.5, { align: 'right' });

  // Total Row
  yPos += 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, yPos, 182, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TOTAL PAYABLE AMOUNT (INCL. GST):', 18, yPos + 6.5);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(formatINR(quote.total_customer_amount), 192, yPos + 6.5, { align: 'right' });

  // --------------------------------------------------------------------------
  // Terms & Conditions
  // --------------------------------------------------------------------------
  yPos += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('3. COMMERCIAL TERMS & SPECIAL CONDITIONS', 14, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  const terms = [
    `Payment Terms: ${quote.payment_terms || 'Standard agreed commercial credit / POD'}`,
    `Validity: This quotation is valid up to ${formatDate(quote.validity_date)}. Freight rates are subject to diesel price fluctuations post-validity.`,
    'Loading & Unloading: Standard 24 hours free loading and 24 hours free unloading at destinations. Detention charges applicable post free period.',
    'Transit Insurance: Unless explicitly billed, goods transit risk shall be covered by the consignor/consignee under an open marine transit policy.',
    `Special Condition: ${quote.special_conditions || 'Material handling as per standard B2B road freight safety regulations.'}`,
  ];

  terms.forEach(term => {
    doc.text(`• ${term}`, 16, yPos, { maxWidth: 178 });
    yPos += 5.5;
  });

  // --------------------------------------------------------------------------
  // Authorization & Acceptance Sign-off
  // --------------------------------------------------------------------------
  yPos += 10;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(14, yPos, 88, 30, 2, 2, 'F');
  doc.roundedRect(108, yPos, 88, 30, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('FOR VMOVE LOGISTICS', 18, yPos + 6);
  doc.text('CUSTOMER ACCEPTANCE & WORK ORDER', 112, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Authorized Commercial Representative', 18, yPos + 24);
  doc.text('Signature & Official Stamp / PO Reference', 112, yPos + 24);

  // Footer note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    'This is a computer-generated commercial quotation. Vmove Logistics operates with verified carrier fleet partners across Indian industrial corridors.',
    105,
    288,
    { align: 'center' }
  );

  // Save PDF
  doc.save(`Vmove_Quotation_${quote.quote_reference}.pdf`);
}
