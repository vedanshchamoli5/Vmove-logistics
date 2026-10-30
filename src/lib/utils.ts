import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amounts in Indian Rupee format (INR ₹)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Human-friendly date formatting
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Format date with time
 */
export function formatDateTime(dateString?: string): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Generate sequential-like unique references with timestamp + random suffix
 */
export function generateReference(prefix: 'VM-ENQ' | 'VM-QUO' | 'VM-BKG' | 'VM-INV'): string {
  const datePart = new Date().toISOString().slice(2, 4) + (new Date().getMonth() + 1).toString().padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${datePart}${randomNum}`;
}

/**
 * Calculate commercial contribution & margin safely
 */
export function calculateQuoteContribution(
  customerFreight: number,
  transporterCost: number,
  otherDirectCosts: number = 0,
  gstRate: number = 5.0
) {
  const freight = Number(customerFreight) || 0;
  const transCost = Number(transporterCost) || 0;
  const otherCost = Number(otherDirectCosts) || 0;
  const rate = Number(gstRate) || 0;

  const estimatedContribution = freight - transCost - otherCost;
  const marginPercentage = freight > 0 ? (estimatedContribution / freight) * 100 : 0;
  const gstAmount = (freight * rate) / 100;
  const totalCustomerAmount = freight + gstAmount;

  return {
    estimatedContribution: Math.round(estimatedContribution * 100) / 100,
    marginPercentage: Math.round(marginPercentage * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalCustomerAmount: Math.round(totalCustomerAmount * 100) / 100,
  };
}
