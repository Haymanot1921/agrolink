// mobile/src/shared/components/ui/ConfirmDialog.tsx
// Promise-based or callback-based confirmation dialog.

import React from 'react';
import { AppModal } from './AppModal';
import { useTranslation } from '@i18n/hooks/useTranslation';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): React.ReactElement {
  const { t } = useTranslation('common');

  return (
    <AppModal
      visible={visible}
      onClose={onCancel}
      title={title}
      description={message}
      actions={[
        {
          label: cancelLabel ?? t('actions.cancel'),
          onPress: onCancel,
          variant: 'ghost',
        },
        {
          label: confirmLabel ?? t('actions.confirm'),
          onPress: onConfirm,
          variant: destructive ? 'danger' : 'primary',
        },
      ]}
    />
  );
}