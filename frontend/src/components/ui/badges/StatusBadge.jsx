import { Badge } from './Badge';
import { StatusVariants } from '@/lib/constants/statusBadges';

/**
 * Automatically maps a domain status string to the correct Badge variant.
 * @param {{
 *   status: string,
 *   size?: 'sm'|'md'|'lg',
 *   className?: string
 * }} props
 */
export function StatusBadge({ status, size, className }) {
  const config = StatusVariants[status] ?? { label: status, variant: 'neutral' };
  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}

export default StatusBadge;

