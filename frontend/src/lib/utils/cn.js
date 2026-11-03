/**
 * Utility to merge Tailwind CSS and conditional class names.
 * Accepts strings, booleans, null/undefined, objects { [className]: boolean }, or nested arrays.
 *
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value && key) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ').trim();
}

export default cn;

