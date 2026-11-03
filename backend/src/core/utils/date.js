/**
 * Date & Billing Period Utilities
 */

/**
 * Returns the billing period string in 'YYYY-MM' format.
 *
 * @param {Date|string} [date=new Date()]
 * @returns {string} e.g. "2026-11"
 */
export function getBillingPeriod(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Calculates due date given an issue date and allowed payment days.
 *
 * @param {Date|string} issueDate
 * @param {number} [days=10]
 * @returns {Date}
 */
export function calculateDueDate(issueDate, days = 10) {
  const date = issueDate instanceof Date ? new Date(issueDate.getTime()) : new Date(issueDate);
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Formats a Date object to YYYY-MM-DD string.
 *
 * @param {Date|string} date
 * @returns {string}
 */
export function toISODateString(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Checks if a date has passed compared to now.
 *
 * @param {Date|string} targetDate
 * @returns {boolean}
 */
export function isPastDate(targetDate) {
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate);
  return target.getTime() < Date.now();
}

