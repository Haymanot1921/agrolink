// server/src/shared/events/verificationEvents.js
// Identity verification lifecycle (SRS §5.3, FR-ADMIN-003).

'use strict';

const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');

const VERIFICATION_SOCKET_EVENTS = Object.freeze({
  SUBMITTED: 'verification:submitted',
  UNDER_REVIEW: 'verification:under_review',
  INFO_REQUESTED: 'verification:info_requested',
  APPROVED: 'verification:approved',
  REJECTED: 'verification:rejected',
  EXPIRED: 'verification:expired',
  QUEUE_UPDATED: 'verification:queue_updated',
});

const VERIFICATION_NOTIFICATION_MAP = Object.freeze({
  [VERIFICATION_SOCKET_EVENTS.SUBMITTED]: NOTIFICATION_TYPES.VERIFICATION_SUBMITTED,
  [VERIFICATION_SOCKET_EVENTS.INFO_REQUESTED]: NOTIFICATION_TYPES.VERIFICATION_INFO_NEEDED,
  [VERIFICATION_SOCKET_EVENTS.APPROVED]: NOTIFICATION_TYPES.VERIFICATION_APPROVED,
  [VERIFICATION_SOCKET_EVENTS.REJECTED]: NOTIFICATION_TYPES.VERIFICATION_REJECTED,
  [VERIFICATION_SOCKET_EVENTS.EXPIRED]: NOTIFICATION_TYPES.VERIFICATION_EXPIRED,
});

/**
 * @param {Object} params
 * @param {string} params.applicationId
 * @param {string} params.applicantId
 * @param {string} [params.adminId]
 * @param {string} [params.previousStatus]
 * @param {string} [params.newStatus]
 * @param {string} [params.rejectionReason]
 * @param {string} [params.reviewNotes]
 */
function buildVerificationEvent(event, params) {
  const {
    applicationId,
    applicantId,
    adminId,
    previousStatus,
    newStatus,
    rejectionReason,
    reviewNotes,
  } = params || {};

  return {
    event,
    emittedAt: new Date().toISOString(),
    payload: {
      applicationId: String(applicationId),
      applicantId: String(applicantId),
      adminId: adminId ? String(adminId) : null,
      previousStatus: previousStatus || null,
      newStatus: newStatus || null,
      rejectionReason: rejectionReason || null,
      reviewNotes: reviewNotes || null,
    },
  };
}

function recipientsFor(event, payload) {
  const rooms = new Set();
  if (payload.applicantId) rooms.add(`user:${payload.applicantId}`);
  if (payload.adminId) rooms.add(`user:${payload.adminId}`);

  // Admin queue events
  const adminScoped = [
    VERIFICATION_SOCKET_EVENTS.SUBMITTED,
    VERIFICATION_SOCKET_EVENTS.APPROVED,
    VERIFICATION_SOCKET_EVENTS.REJECTED,
    VERIFICATION_SOCKET_EVENTS.QUEUE_UPDATED,
  ];
  if (adminScoped.includes(event)) rooms.add('role:admin');
  return Array.from(rooms);
}

module.exports = {
  VERIFICATION_SOCKET_EVENTS,
  VERIFICATION_NOTIFICATION_MAP,
  buildVerificationEvent,
  recipientsFor,
};