'use client';

import { ModalWrapper } from './ModalWrapper';
import { Button } from '@/components/ui/buttons/Button';

/**
 * Confirmation dialog modal.
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   title?: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   danger?: boolean,
 *   loading?: boolean
 * }} props
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
}) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </ModalWrapper>
  );
}

export default ConfirmDialog;

