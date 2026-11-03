import { cn } from '@/lib/utils/cn';

const sizeClasses = {
  xl: 'text-4xl font-bold tracking-tight',
  lg: 'text-3xl font-bold tracking-tight',
  md: 'text-2xl font-semibold',
  sm: 'text-xl font-semibold',
  xs: 'text-lg font-medium',
};

/**
 * @param {{ as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6', size?: 'xl'|'lg'|'md'|'sm'|'xs', className?: string, children: React.ReactNode }} props
 */
export function Heading({ as: Tag = 'h2', size = 'md', className, children, ...props }) {
  return (
    <Tag className={cn('text-slate-900', sizeClasses[size] ?? sizeClasses.md, className)} {...props}>
      {children}
    </Tag>
  );
}

export default Heading;
