// mobile/src/shared/components/ui/StatusBadge.tsx
// Semantic status badge — maps status strings to colors + labels.
// SRS refs: every status list (order, listing, consultation, dispute, etc.).

import React from 'react';
import { Badge, type BadgeVariant } from './Badge';
import { useTranslation } from '@i18n/hooks/useTranslation';
import type { Namespace } from '@i18n/config';

type StatusNamespace =
  | 'farmer'
  | 'buyer'
  | 'input-supplier'
  | 'agricultural-expert'
  | 'support-agent'
  | 'administrator'
  | 'common';

export interface StatusBadgeProps {
  /** e.g. 'pending_review', 'published', 'completed' */
  status: string;
  /** Where the translation lives — usually the current actor's namespace. */
  namespace?: StatusNamespace;
  /** Optional custom mapping overrides. */
  overrides?: Record<string, { label: string; variant: BadgeVariant }>;
}

// Default color per canonical status (works across all modules)
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  // listing
  draft: 'default',
  pending: 'warning',
  pending_review: 'warning',
  published: 'success',
  rejected: 'danger',
  inactive: 'default',
  sold_out: 'default',
  available: 'success',
  out_of_stock: 'danger',
  // order
  confirmed: 'info',
  preparing: 'info',
  ready_for_dispatch: 'primary',
  completed: 'success',
  cancelled: 'danger',
  disputed: 'danger',
  // consultation
  accepted: 'success',
  rescheduled: 'warning',
  in_progress: 'info',
  no_show: 'default',
  // verification
  unverified: 'default',
  verified: 'success',
  more_info_required: 'warning',
  // dispute
  open: 'warning',
  under_review: 'info',
  awaiting_evidence: 'warning',
  resolved: 'success',
  closed: 'default',
  escalated: 'danger',
  // ticket
  assigned: 'info',
  // consent
  active: 'success',
  withdrawn: 'danger',
  expired: 'default',
  // account
  suspended: 'danger',
};

export function StatusBadge({
  status,
  namespace,
  overrides,
}: StatusBadgeProps): React.ReactElement {
  const ns = namespace ?? 'common';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t } = useTranslation(ns as any);
  const key = status.toLowerCase();

  if (overrides?.[key]) {
    return <Badge label={overrides[key].label} variant={overrides[key].variant} />;
  }

  // Try to translate: expect e.g. "status.pending_review" in namespace
  const translated = t(`status.${key}`, { defaultValue: status.replace(/_/g, ' ') });

  return <Badge label={translated} variant={STATUS_VARIANT[key] ?? 'default'} />;
}