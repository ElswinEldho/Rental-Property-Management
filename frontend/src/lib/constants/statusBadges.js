export const Roles = Object.freeze({
  ADMIN: 'ADMIN',
  PROPERTY_MANAGER: 'PROPERTY_MANAGER',
  TENANT: 'TENANT',
});

export const StatusVariants = Object.freeze({
  // Bill / Settlement statuses
  PAID: { label: 'Paid', variant: 'success' },
  PARTIALLY_PAID: { label: 'Partially Paid', variant: 'warning' },
  GENERATED: { label: 'Due', variant: 'info' },
  OVERDUE: { label: 'Overdue', variant: 'danger' },
  DRAFT: { label: 'Draft', variant: 'neutral' },
  CANCELLED: { label: 'Cancelled', variant: 'neutral' },

  // Verification & Review statuses
  PENDING: { label: 'Pending Review', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },

  // Lease / Unit statuses
  ACTIVE: { label: 'Active', variant: 'success' },
  OCCUPIED: { label: 'Occupied', variant: 'info' },
  VACANT: { label: 'Vacant', variant: 'neutral' },
  MAINTENANCE: { label: 'Maintenance', variant: 'warning' },
  EXPIRED: { label: 'Expired', variant: 'neutral' },
  TERMINATED: { label: 'Terminated', variant: 'danger' },
});

