// mobile/src/shared/constants/caseStatuses.ts
// Human-guided agricultural cases (SRS §5.8).
// ⚠️ NO automated diagnosis (§2.4). All assessments are recorded by experts.

export const CASE_STATUSES = {
  OPEN: 'open',
  IN_REVIEW: 'in_review',
  AWAITING_FARMER: 'awaiting_farmer',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type CaseStatus = typeof CASE_STATUSES[keyof typeof CASE_STATUSES];

export const CASE_STATUS_LIST: CaseStatus[] = [
  CASE_STATUSES.OPEN,
  CASE_STATUSES.IN_REVIEW,
  CASE_STATUSES.AWAITING_FARMER,
  CASE_STATUSES.RESOLVED,
  CASE_STATUSES.CLOSED,
];

export const CASE_STATUS_COLORS: Record<CaseStatus, string> = {
  open: 'warning',
  in_review: 'info',
  awaiting_farmer: 'primary',
  resolved: 'success',
  closed: 'default',
};

export const CASE_PROBLEM_TYPES = {
  CROP: 'crop',
  LIVESTOCK: 'livestock',
  SOIL: 'soil',
  PEST_DISEASE: 'pest_disease',
  IRRIGATION: 'irrigation',
  OTHER: 'other',
} as const;

export type CaseProblemType = typeof CASE_PROBLEM_TYPES[keyof typeof CASE_PROBLEM_TYPES];

export const CASE_PROBLEM_TYPE_LIST: CaseProblemType[] = [
  CASE_PROBLEM_TYPES.CROP,
  CASE_PROBLEM_TYPES.LIVESTOCK,
  CASE_PROBLEM_TYPES.SOIL,
  CASE_PROBLEM_TYPES.PEST_DISEASE,
  CASE_PROBLEM_TYPES.IRRIGATION,
  CASE_PROBLEM_TYPES.OTHER,
];