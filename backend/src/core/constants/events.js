/**
 * Cross-Module Domain Event Topics
 * Used for decoupled asynchronous notifications and outbox event streaming.
 */
export const DomainEvents = Object.freeze({
  // Tenancy Events
  TENANCY_CREATED: 'tenancy.created',
  TENANCY_ACTIVATED: 'tenancy.activated',
  TENANCY_TERMINATED: 'tenancy.terminated',

  // Billing Events
  BILL_GENERATED: 'billing.bill_generated',
  BILL_OVERDUE: 'billing.bill_overdue',
  BILL_SETTLED: 'billing.bill_settled',

  // Payment Events
  PAYMENT_SUBMITTED: 'payment.submitted',
  PAYMENT_APPROVED: 'payment.approved',
  PAYMENT_REJECTED: 'payment.rejected',

  // Electricity Events
  READING_RECORDED: 'electricity.reading_recorded',
  TARIFF_UPDATED: 'electricity.tariff_updated',

  // Deposit Events
  DEPOSIT_RECEIVED: 'deposit.received',
  DEPOSIT_DEDUCTED: 'deposit.deducted',
  DEPOSIT_REFUNDED: 'deposit.refunded',
  MOVE_OUT_SETTLED: 'deposit.move_out_settled',
});

