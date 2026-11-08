// mobile/src/shared/hooks/usePaymentDeepLink.ts
// Detects return from external payment apps (Telebirr / Chapa).
// SRS refs: §13.1 (record-only — this only observes the return, doesn't auto-verify).
//
// ⚠️ A browser/app redirect alone is NOT proof of payment (SRS §13.1).
// Always verify server-side before marking any order as paid.

import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';

export interface PaymentReturn {
  status: 'success' | 'failed' | 'cancelled' | 'unknown';
  txRef?: string;
  orderId?: string;
  raw: string;
}

export interface UsePaymentDeepLinkOptions {
  onReturn: (result: PaymentReturn) => void;
}

export function usePaymentDeepLink({ onReturn }: UsePaymentDeepLinkOptions): void {
  const handledRef = useRef(false);

  useEffect(() => {
    const sub = Linking.addEventListener('url', (event) => {
      const parsed = Linking.parse(event.url);
      const isPaymentPath =
        parsed.path === 'payment/return' || parsed.path === 'payment/callback';
      if (!isPaymentPath) return;
      if (handledRef.current) return;
      handledRef.current = true;
      setTimeout(() => {
        handledRef.current = false;
      }, 2000);

      const query = (parsed.queryParams ?? {}) as Record<string, string | undefined>;
      const rawStatus = (query.status ?? query.tx_status ?? '').toLowerCase();

      let status: PaymentReturn['status'] = 'unknown';
      if (rawStatus.includes('success') || rawStatus === 'paid') status = 'success';
      else if (rawStatus.includes('cancel')) status = 'cancelled';
      else if (rawStatus.includes('fail') || rawStatus.includes('error')) status = 'failed';

      onReturn({
        status,
        txRef: query.tx_ref ?? query.transaction_ref,
        orderId: query.order_id,
        raw: event.url,
      });
    });
    return () => sub.remove();
  }, [onReturn]);
}