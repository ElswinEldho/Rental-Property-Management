/**
 * Billing & Financial Constants
 */
export const AllocationPriority = Object.freeze({
  ELECTRICITY: 1,
  WATER: 2,
  RENT: 3,
  OTHER: 4,
});

export const BillStatus = Object.freeze({
  DRAFT: 'DRAFT',
  GENERATED: 'GENERATED',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
});

export const PaymentMethod = Object.freeze({
  UPI: 'UPI',
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CHEQUE: 'CHEQUE',
});

export const PaymentSubmissionStatus = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
});

export const DepositStatus = Object.freeze({
  PENDING: 'PENDING',
  HELD: 'HELD',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  REFUNDED: 'REFUNDED',
  FORFEITED: 'FORFEITED',
});

