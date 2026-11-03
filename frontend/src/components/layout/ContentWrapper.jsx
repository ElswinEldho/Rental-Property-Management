import { cn } from '@/lib/utils/cn';

/**
 * Inner content container with max-width.
 * @param {{
 *   size?: 'sm'|'md'|'lg'|'xl'|'full',
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function ContentWrapper({ size = 'lg', className, children }) {
  const sizeClasses = {
    sm: 'max-w-xl',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto w-full', sizeClasses[size] ?? sizeClasses.lg, className)}>
      {children}
    </div>
  );
}

export default ContentWrapper;

