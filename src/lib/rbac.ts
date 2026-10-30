// Vmove Logistics - Enterprise Role-Based Access Control (RBAC) Architecture
// Enforces granular permission separation across commercial logistics operations.

export type GranularRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'FINANCE_MANAGER'
  | 'SALES_EXECUTIVE';

export type UserRole =
  | GranularRole
  | 'admin'
  | 'operations'
  | 'viewer';

export type Permission =
  | 'view_dashboard_kpis'
  | 'view_financial_kpis'
  | 'view_enquiries'
  | 'edit_enquiry_status'
  | 'view_quotations'
  | 'view_internal_margins' // High Sensitivity: Transporter cost and profit margin
  | 'create_quotations'
  | 'manage_bookings'
  | 'update_tracking_milestones'
  | 'manage_customers'
  | 'manage_transporters'
  | 'manage_payments'
  | 'view_audit_logs'
  | 'manage_system_reset';

/**
 * Enterprise RBAC Permission Matrix
 */
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: [
    'view_dashboard_kpis',
    'view_financial_kpis',
    'view_enquiries',
    'edit_enquiry_status',
    'view_quotations',
    'view_internal_margins',
    'create_quotations',
    'manage_bookings',
    'update_tracking_milestones',
    'manage_customers',
    'manage_transporters',
    'manage_payments',
    'view_audit_logs',
    'manage_system_reset',
  ],
  ADMIN: [
    'view_dashboard_kpis',
    'view_financial_kpis',
    'view_enquiries',
    'edit_enquiry_status',
    'view_quotations',
    'view_internal_margins',
    'create_quotations',
    'manage_bookings',
    'update_tracking_milestones',
    'manage_customers',
    'manage_transporters',
    'manage_payments',
    'view_audit_logs',
  ],
  admin: [
    'view_dashboard_kpis',
    'view_financial_kpis',
    'view_enquiries',
    'edit_enquiry_status',
    'view_quotations',
    'view_internal_margins',
    'create_quotations',
    'manage_bookings',
    'update_tracking_milestones',
    'manage_customers',
    'manage_transporters',
    'manage_payments',
    'view_audit_logs',
    'manage_system_reset',
  ],
  OPERATIONS_MANAGER: [
    'view_dashboard_kpis',
    'view_enquiries',
    'edit_enquiry_status',
    'view_quotations',
    // NO view_internal_margins
    'create_quotations',
    'manage_bookings',
    'update_tracking_milestones',
    'manage_customers',
    'manage_transporters',
    // NO manage_payments
  ],
  operations: [
    'view_dashboard_kpis',
    'view_enquiries',
    'edit_enquiry_status',
    'view_quotations',
    'create_quotations',
    'manage_bookings',
    'update_tracking_milestones',
    'manage_customers',
    'manage_transporters',
  ],
  FINANCE_MANAGER: [
    'view_dashboard_kpis',
    'view_financial_kpis',
    'view_enquiries',
    'view_quotations',
    'view_internal_margins',
    'create_quotations',
    'manage_customers',
    'manage_payments',
  ],
  SALES_EXECUTIVE: [
    'view_dashboard_kpis',
    'view_enquiries',
    'edit_enquiry_status',
    'view_quotations',
    // NO view_internal_margins (only customer price)
    'create_quotations',
    'manage_customers',
  ],
  viewer: [
    'view_dashboard_kpis',
    'view_enquiries',
    'view_quotations',
  ],
};

/**
 * Check if a given role possesses a specific permission
 */
export function hasPermission(role: UserRole | string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Get human-friendly label for any role
 */
export function getRoleDisplayName(role: UserRole | string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Administrator';
    case 'ADMIN':
    case 'admin':
      return 'Operations Administrator';
    case 'OPERATIONS_MANAGER':
    case 'operations':
      return 'Operations Manager';
    case 'FINANCE_MANAGER':
      return 'Finance & Billing Manager';
    case 'SALES_EXECUTIVE':
      return 'Commercial Sales Executive';
    case 'viewer':
      return 'Read-Only Auditor';
    default:
      return role;
  }
}
