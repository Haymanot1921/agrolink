// mobile/src/shared/constants/consultationStatuses.ts
// Consultation request + session statuses (SRS §5.8).
// Human experts only — no AI (§2.4).

export const CONSULTATION_REQUEST_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  RESCHEDULED: 'rescheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

export type ConsultationRequestStatus =
  typeof CONSULTATION_REQUEST_STATUSES[keyof typeof CONSULTATION_REQUEST_STATUSES];

export const CONSULTATION_REQUEST_STATUS_LIST: ConsultationRequestStatus[] = [
  CONSULTATION_REQUEST_STATUSES.PENDING,
  CONSULTATION_REQUEST_STATUSES.ACCEPTED,
  CONSULTATION_REQUEST_STATUSES.REJECTED,
  CONSULTATION_REQUEST_STATUSES.RESCHEDULED,
  CONSULTATION_REQUEST_STATUSES.IN_PROGRESS,
  CONSULTATION_REQUEST_STATUSES.COMPLETED,
  CONSULTATION_REQUEST_STATUSES.CANCELLED,
  CONSULTATION_REQUEST_STATUSES.NO_SHOW,
];

export const CONSULTATION_REQUEST_STATUS_COLORS: Record<ConsultationRequestStatus, string> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'danger',
  rescheduled: 'warning',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'danger',
  no_show: 'default',
};

export const CONSULTATION_SESSION_STATUSES = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

export type ConsultationSessionStatus =
  typeof CONSULTATION_SESSION_STATUSES[keyof typeof CONSULTATION_SESSION_STATUSES];

export const MEETING_METHODS = {
  IN_PERSON: 'in_person',
  PHONE: 'phone',
  VIDEO: 'video',
} as const;

export type MeetingMethod = typeof MEETING_METHODS[keyof typeof MEETING_METHODS];

export const MEETING_METHOD_LIST: MeetingMethod[] = [
  MEETING_METHODS.IN_PERSON,
  MEETING_METHODS.PHONE,
  MEETING_METHODS.VIDEO,
];

/** Specializations catalog — aligned with SRS §5.8 expert profiles. */
export const EXPERT_SPECIALIZATIONS = [
  'crop_protection',
  'soil_fertility',
  'irrigation',
  'livestock_health',
  'post_harvest',
  'agronomy',
  'horticulture',
  'pest_management',
  'seed_quality',
  'market_access',
] as const;

export type ExpertSpecialization = typeof EXPERT_SPECIALIZATIONS[number];