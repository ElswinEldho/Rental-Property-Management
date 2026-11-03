import { cn } from '@/lib/utils/cn';
import { LoadingState } from '@/components/ui/feedback/LoadingState';
import { EmptyState } from '@/components/ui/feedback/EmptyState';

/**
 * @param {{
 *   columns: Array<{key: string, header: string, render?: (value: any, row: any) => React.ReactNode, className?: string}>,
 *   data: Array<Record<string, any>>,
 *   loading?: boolean,
 *   emptyMessage?: string,
 *   rowKey?: string,
 *   className?: string
 * }} props
 */
export function DataTable({ columns = [], data = [], loading = false, emptyMessage = 'No records found.', rowKey = 'id', className }) {
  if (loading) {
    return <LoadingState />;
  }

  if (!data.length) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-200 bg-white', className)}>
      <table className="min-w-full divide-y divide-slate-100">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr key={row[rowKey] ?? idx} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('px-4 py-3 text-sm text-slate-700', col.className)}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

