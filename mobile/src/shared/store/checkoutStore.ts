// mobile/src/shared/store/checkoutStore.ts
// Ephemeral checkout session state — address, payment method, totals.
// Cleared after successful order creation.
//
// SRS refs: §5.7 FR-ORDER-002..004, §13.1 (record-only payments).
// §2.4 exclusion: no delivery method/fee — physical transport arranged off-platform.

import { create } from 'zustand';
import type { PaymentMethod } from '@constants/paymentStatuses';

export interface CheckoutAddress {
  recipient: string;
  phone: string;
  region: string;
  zone?: string;
  woreda?: string;
  addressLine: string;
  latitude?: number;
  longitude?: number;
}

export type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirm';

interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: CheckoutAddress | null;
  paymentMethod: PaymentMethod | null;
  buyerNotes: string;
  /**
   * ⚠️ SRS §13.1: record-only mode.
   * In release 1 there is no live gateway. Payment is recorded, not charged.
   */
  paymentRecordOnly: boolean;
  // Attempted-submit guard
  isSubmitting: boolean;
  submitError: string | null;
}

interface CheckoutActions {
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setShippingAddress: (address: CheckoutAddress | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setBuyerNotes: (notes: string) => void;
  setPaymentRecordOnly: (recordOnly: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setSubmitError: (error: string | null) => void;
  reset: () => void;
}

const STEP_ORDER: CheckoutStep[] = ['shipping', 'payment', 'review', 'confirm'];

const initialState: CheckoutState = {
  step: 'shipping',
  shippingAddress: null,
  paymentMethod: null,
  buyerNotes: '',
  paymentRecordOnly: true,
  isSubmitting: false,
  submitError: null,
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () => {
    const { step } = get();
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1) set({ step: STEP_ORDER[idx + 1]! });
  },

  prevStep: () => {
    const { step } = get();
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) set({ step: STEP_ORDER[idx - 1]! });
  },

  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setBuyerNotes: (buyerNotes) => set({ buyerNotes }),
  setPaymentRecordOnly: (paymentRecordOnly) => set({ paymentRecordOnly }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitError: (submitError) => set({ submitError }),

  reset: () => set(initialState),
}));