import { cn } from '@/lib/utils/cn';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

/**
 * Avatar — shows image or initials fallback.
 * @param {{
 *   name?: string,
 *   src?: string,
 *   size?: 'sm'|'md'|'lg'|'xl',
 *   className?: string
 * }} props
 */
export function Avatar({ name = '', src, size = 'md', className }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizeClasses[size] ?? sizeClasses.md, className)}
      />
    );
  }

  return (
    <div
      aria-label={name || 'Avatar'}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 select-none',
        sizeClasses[size] ?? sizeClasses.md,
        className
      )}
    >
      {initials || '?'}
    </div>
  );
}

export default Avatar;

