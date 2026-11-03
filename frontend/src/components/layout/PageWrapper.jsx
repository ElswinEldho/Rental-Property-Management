import { cn } from '@/lib/utils/cn';

/**
 * Standard page container with default outer spacing.
 * @param {{
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function PageWrapper({ className, children }) {
  return (
    <main className={cn('min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8', className)}>
      {children}
    </main>
  );
}

export default PageWrapper;

