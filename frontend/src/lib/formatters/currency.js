/**
 * Frontend Indian Rupee (INR) Currency Formatter
 */
const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a value into Indian Rupee currency format (e.g., ₹25,000.00).
 *
 * @param {number|string} amount
 * @returns {string}
 */
export function formatINR(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return INR_FORMATTER.format(numeric);
}

export default formatINR;

