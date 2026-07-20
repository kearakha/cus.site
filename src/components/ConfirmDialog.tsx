'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';

type Props = {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when user wants to close (cancel, escape, backdrop click) */
  onClose: () => void;
  /** Called when user confirms the action */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog body description */
  children: ReactNode;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Whether confirm is in loading/pending state */
  isPending?: boolean;
  /** Variant — changes confirm button color */
  variant?: 'danger' | 'default';
};

/**
 * ConfirmDialog — accessible modal dialog for destructive actions.
 *
 * Features:
 * - Keyboard: Escape to close
 * - Focus trap: auto-focuses cancel button on open
 * - Backdrop click to dismiss
 * - Prevents body scroll when open
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  isPending = false,
  variant = 'default',
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when dialog opens
  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        onClose();
      }
    },
    [onClose, isPending],
  );

  if (!open) return null;

  const confirmClasses =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in">
        <h3
          id="confirm-dialog-title"
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          {title}
        </h3>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {children}
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${confirmClasses}`}
          >
            {isPending ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
