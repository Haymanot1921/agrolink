// client/src/shared/components/ui/ConfirmDialog.jsx
// Standard "are you sure?" dialog on top of Modal.
// SRS refs: §11.8, NFR-USE-006 (confirmation before important changes).

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  loading = false,
}) {
  const { t } = useTranslation('common');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel ?? t('actions.cancel')}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel ?? t('actions.confirm')}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;