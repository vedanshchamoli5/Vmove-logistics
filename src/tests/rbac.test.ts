import { describe, it, expect } from 'vitest';
import { hasPermission, getRoleDisplayName } from '../lib/rbac';

describe('Role-Based Access Control (RBAC) Permission Matrix', () => {
  it('grants full operational and system reset permissions to SUPER_ADMIN', () => {
    expect(hasPermission('SUPER_ADMIN', 'view_dashboard_kpis')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'view_internal_margins')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'manage_payments')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'view_audit_logs')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'manage_system_reset')).toBe(true);
  });

  it('grants full operational access to ADMIN but restricts system reset', () => {
    expect(hasPermission('ADMIN', 'view_dashboard_kpis')).toBe(true);
    expect(hasPermission('ADMIN', 'view_internal_margins')).toBe(true);
    expect(hasPermission('ADMIN', 'manage_payments')).toBe(true);
    expect(hasPermission('ADMIN', 'view_audit_logs')).toBe(true);
    expect(hasPermission('ADMIN', 'manage_system_reset')).toBe(false);
  });

  it('restricts internal margin visibility and payments from OPERATIONS_MANAGER', () => {
    expect(hasPermission('OPERATIONS_MANAGER', 'view_dashboard_kpis')).toBe(true);
    expect(hasPermission('OPERATIONS_MANAGER', 'manage_bookings')).toBe(true);
    expect(hasPermission('OPERATIONS_MANAGER', 'manage_transporters')).toBe(true);

    // CRITICAL: Internal margins must be hidden from dispatchers
    expect(hasPermission('OPERATIONS_MANAGER', 'view_internal_margins')).toBe(false);
    expect(hasPermission('OPERATIONS_MANAGER', 'manage_payments')).toBe(false);
    expect(hasPermission('OPERATIONS_MANAGER', 'view_audit_logs')).toBe(false);
  });

  it('grants margin and payment control to FINANCE_MANAGER while restricting dispatch', () => {
    expect(hasPermission('FINANCE_MANAGER', 'view_financial_kpis')).toBe(true);
    expect(hasPermission('FINANCE_MANAGER', 'view_internal_margins')).toBe(true);
    expect(hasPermission('FINANCE_MANAGER', 'manage_payments')).toBe(true);
    expect(hasPermission('FINANCE_MANAGER', 'manage_transporters')).toBe(false);
  });

  it('restricts internal margins from SALES_EXECUTIVE while allowing quote creation', () => {
    expect(hasPermission('SALES_EXECUTIVE', 'create_quotations')).toBe(true);
    expect(hasPermission('SALES_EXECUTIVE', 'manage_customers')).toBe(true);

    // CRITICAL: Sales executives only see client price, not internal supplier rate
    expect(hasPermission('SALES_EXECUTIVE', 'view_internal_margins')).toBe(false);
    expect(hasPermission('SALES_EXECUTIVE', 'manage_payments')).toBe(false);
    expect(hasPermission('SALES_EXECUTIVE', 'manage_transporters')).toBe(false);
  });

  it('provides clean human-readable titles for each role', () => {
    expect(getRoleDisplayName('SUPER_ADMIN')).toBe('Super Administrator');
    expect(getRoleDisplayName('ADMIN')).toBe('Operations Administrator');
    expect(getRoleDisplayName('OPERATIONS_MANAGER')).toBe('Operations Manager');
    expect(getRoleDisplayName('FINANCE_MANAGER')).toBe('Finance & Billing Manager');
    expect(getRoleDisplayName('SALES_EXECUTIVE')).toBe('Commercial Sales Executive');
  });
});
