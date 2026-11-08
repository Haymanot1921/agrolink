// mobile/src/shared/constants/verificationStatuses.ts
// KYC verification statuses (SRS §4.1.5 FR-ADMIN-003).

export const VERIFICATION_STATUSES = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  MORE_INFO_REQUIRED: 'more_info_required',
} as const;

export type VerificationStatus = typeof VERIFICATION_STATUSES[keyof typeof VERIFICATION_STATUSES];

export const VERIFICATION_STATUS_LIST: VerificationStatus[] = [
  VERIFICATION_STATUSES.UNVERIFIED,
  VERIFICATION_STATUSES.PENDING,
  VERIFICATION_STATUSES.VERIFIED,
  VERIFICATION_STATUSES.REJECTED,
  VERIFICATION_STATUSES.MORE_INFO_REQUIRED,
];

export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  unverified: 'default',
  pending: 'warning',
  verified: 'success',
  rejected: 'danger',
  more_info_required: 'warning',
};

/** Document types for KYC. Aligned with backend `verification_doc_type` enum. */
export const VERIFICATION_DOCUMENT_TYPES = {
  NATIONAL_ID: 'national_id',
  BUSINESS_LICENSE: 'business_license',
  TAX_CERTIFICATE: 'tax_certificate',
  ACADEMIC_CERTIFICATE: 'academic_certificate',
  PROFESSIONAL_LICENSE: 'professional_license',
  FARM_PHOTO: 'farm_photo',
  OTHER: 'other',
} as const;

export type VerificationDocumentType =
  typeof VERIFICATION_DOCUMENT_TYPES[keyof typeof VERIFICATION_DOCUMENT_TYPES];

export function isVerificationFinal(status: VerificationStatus): boolean {
  return status === VERIFICATION_STATUSES.VERIFIED || status === VERIFICATION_STATUSES.REJECTED;
}