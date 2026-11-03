/**
 * Number & Metric Formatting Utilities
 */

/**
 * Formats a number with comma separation and optional decimals.
 *
 * @param {number|string} value
 * @param {number} [decimals=0]
 * @returns {string}
 */
export function formatNumber(value, decimals = 0) {
  const numeric = typeof value === 'number' ? value : parseFloat(value) || 0;
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numeric);
}

/**
 * Formats electricity consumption kWh units (e.g. "124.50 kWh").
 *
 * @param {number|string} units
 * @returns {string}
 */
export function formatUnits(units) {
  return `${formatNumber(units, 2)} kWh`;
}

