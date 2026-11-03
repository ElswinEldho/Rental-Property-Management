/**
 * Transactional Outbox Writer
 * Persists critical domain events to the outbox_events table within the same
 * database transaction that mutates business entities, guaranteeing at-least-once delivery.
 */

/**
 * Appends an event to the outbox table inside an existing Prisma transaction.
 *
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @param {object} params
 * @param {string} params.aggregateType - e.g. 'Payment', 'MonthlyBill', 'TenancyAgreement'
 * @param {string} params.aggregateId - UUID of the aggregate
 * @param {string} params.eventType - e.g. DomainEvents.PAYMENT_APPROVED
 * @param {object} params.payload - JSON serializable event payload
 * @returns {Promise<any>}
 */
export async function writeOutboxEvent(tx, {
  aggregateType,
  aggregateId,
  eventType,
  payload,
}) {
  return await tx.outboxEvent.create({
    data: {
      aggregateType,
      aggregateId,
      eventType,
      payload,
      status: 'PENDING',
      retryCount: 0,
    },
  });
}

