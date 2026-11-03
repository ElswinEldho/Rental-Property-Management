/**
 * Indian Rupee (INR) Currency Utilities
 * Formats according to Indian numbering system (e.g. ₹1,50,000.00).
 */

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a numeric amount or string into INR currency format.
 *
 * @param {number|string} amount
 * @returns {string} e.g. "₹25,000.00"
 */
export function formatINR(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return INR_FORMATTER.format(numeric);
}

/**
 * Converts a rupee decimal to whole paise (cents).
 * Avoids floating-point precision issues by rounding.
 *
 * @param {number|string} rupees
 * @returns {number}
 */
export function toPaise(rupees) {
  const numeric = typeof rupees === 'number' ? rupees : parseFloat(rupees) || 0;
  return Math.round(numeric * 100);
}

/**
 * Converts whole paise to rupees.
 *
 * @param {number} paise
 * @returns {number}
 */
export function toRupees(paise) {
  return Number((paise / 100).toFixed(2));
}

/**
 * Safely adds two monetary amounts to 2 decimal places.
 *
 * @param {number|string} a
 * @param {number|string} b
 * @returns {number}
 */
export function addCurrency(a, b) {
  return toRupees(toPaise(a) + toPaise(b));
}

/**
 * Safely subtracts two monetary amounts (a - b) to 2 decimal places.
 *
 * @param {number|string} a
 * @param {number|string} b
 * @returns {number}
 */
export function subtractCurrency(a, b) {
  return toRupees(toPaise(a) - toPaise(b));
}

