// mobile/src/shared/services/paymentGatewayService.ts
// Payment integration (record-only first release).
// SRS refs: §13.1 — a browser/app redirect alone is NOT proof of payment.
//
// The client:
//   1. Asks the backend to create a payment intent
//   2. Opens the payment URL (external app or WebView)
//   3. On return, only *reports* status to the backend
//   4. Backend verifies server-side before order is marked paid.

import { api } from './apiClient';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export type PaymentProvider = 'telebirr' | 'chapa' | 'cash' | 'bank_transfer';

export interface PaymentIntent {
  paymentId: string;
  provider: PaymentProvider;
  /** Amount in ETB */
  amountEtb: number;
  redirectUrl: string;
  /** Return URL the external app will deep-link back to. */
  returnUrl: string;
}

export const paymentGatewayService = {
  /**
   * Ask backend to create a payment intent for an order.
   * Returns null when the backend has decided this order is cash/offline.
   */
  async createIntent(orderId: string, provider: PaymentProvider): Promise<PaymentIntent | null> {
    const res = await api.post<{ intent: PaymentIntent | null }>(
      `/orders/${orderId}/payments/intent`,
      { provider },
    );
    return res.intent ?? null;
  },

  /**
   * Open the payment URL for the given provider.
   * Uses WebBrowser for http(s) — WebBrowser will handle redirects.
   */
  async openPaymentUrl(intent: PaymentIntent): Promise<void> {
    const returnUrl = Linking.createURL('payment/return');
    const url = `${intent.redirectUrl}${intent.redirectUrl.includes('?') ? '&' : '?'}returnUrl=${encodeURIComponent(returnUrl)}`;
    await WebBrowser.openBrowserAsync(url, {
      enableBarCollapsing: true,
      showTitle: false,
      toolbarColor: '#2E7D32',
    });
  },

  /**
   * Notify backend that the user returned from the payment provider.
   * This does NOT mark the order paid — it just tells the backend to
   * re-check the transaction with the provider (SRS §13.1).
   */
  async reportReturn(input: {
    orderId: string;
    paymentId: string;
    statusFromProvider: 'success' | 'failed' | 'cancelled' | 'unknown';
    txRef?: string;
  }): Promise<void> {
    try {
      await api.post(`/orders/${input.orderId}/payments/report`, {
        paymentId: input.paymentId,
        status: input.statusFromProvider,
        txRef: input.txRef,
      });
    } catch {
      // non-blocking — backend will reconcile via provider webhook
    }
  },

  /**
   * Poll the backend until the order is confirmed paid, or timeout.
   * The backend is the source of truth (never trust client state).
   */
  async waitForConfirmation(
    orderId: string,
    opts: { timeoutMs?: number; intervalMs?: number } = {},
  ): Promise<{ paid: boolean; orderStatus: string }> {
    const timeoutMs = opts.timeoutMs ?? 60000;
    const intervalMs = opts.intervalMs ?? 3000;
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      try {
        const order = await api.get<{ paymentStatus: string; status: string }>(
          `/orders/${orderId}`,
        );
        if (order.paymentStatus === 'verified') {
          return { paid: true, orderStatus: order.status };
        }
        if (order.paymentStatus === 'failed') {
          return { paid: false, orderStatus: order.status };
        }
      } catch {
        // keep polling
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return { paid: false, orderStatus: 'pending' };
  },
};