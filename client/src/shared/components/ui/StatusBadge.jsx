// client/src/shared/components/ui/StatusBadge.jsx
// Maps a domain status string to a Badge with the correct tone.
// SRS refs: §11.8, NFR-ACCESS-003 (icon + label + color).

import React from 'react';
import { Badge } from './Badge';

const STATUS_TONES = {
  // Account
  active: 'success',
  pending_verification: 'warning',
  suspended: 'danger',
  deleted: 'neutral',
  // Listing
  draft: 'neutral',
  pending_review: 'warning',
  published: 'success',
  rejected: 'danger',
  inactive: 'neutral',
  sold_out: 'info',
  // Order
  pending: 'warning',
  confirmed: 'info',
  preparing: 'info',
  ready_for_dispatch: 'info',
  completed: 'success',
  cancelled: 'danger',
  disputed: 'danger',
  // Consultation
  accepted: 'success',
  rejected: 'danger',
  rescheduled: 'warning',
  in_progress: 'info',
  // Ticket
  open: 'warning',
  assigned: 'info',
  resolved: 'success',
  closed: 'neutral',
  escalated: 'danger',
  // Verification
  approved: 'success',
  more_info_required: 'warning',
  // Dispute
  under_review: 'info',
  awaiting_evidence: 'warning',
};

export function StatusBadge({ status, label, size = 'sm' }) {
  const tone = STATUS_TONES[status] ?? 'neutral';
  const display = label ?? status?.replace(/_/g, ' ');
  return <Badge tone={tone} size={size}>{display}</Badge>;
}

export default StatusBadge;