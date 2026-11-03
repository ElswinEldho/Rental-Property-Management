/**
 * Date Formatting Utilities
 */

/**
 * Formats a date into a localized Indian format (e.g., "01 Jan 2026").
 *
 * @param {Date|string} date
 * @param {'short'|'medium'|'long'} [format='medium']
 * @returns {string}
 */
export function formatDate(date, format = 'medium') {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '-';

  if (format === 'short') {
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns a human-friendly relative time string (e.g., "2 days ago", "in 3 days").
 *
 * @param {Date|string} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, 'day');
  }

  return formatDate(d);
}

