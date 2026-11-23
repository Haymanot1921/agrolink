// server/src/jobs/disputeDeadlineReminder.job.js
// Reminds admins of disputes approaching SLA breach, and reminds parties
// when evidence is overdue (SRS §5.15 FR-DISPUTE-004..006).
// Schedule: every 2 hours.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const logger = require('../config/logger');
const { DISPUTE_STATUSES, DISPUTE_SLA_HOURS } = require('../shared/constants/disputeStatuses');
const { NOTIFICATION_TYPES } = require('../shared/constants/notificationTypes');
const { emitDisputeEvent } = require('../sockets/disputeUpdates.socket');
const { DISPUTE_SOCKET_EVENTS } = require('../shared/events/disputeEvents');

const NAME = 'disputeDeadlineReminder';
const SCHEDULE = '0 */2 * * *';
const EVIDENCE_OVERDUE_HOURS = 48;

async function run({ log, now }) {
  // eslint-disable-next-line global-require
  const Dispute = require('../modules/administrator/disputes-management/dispute.model');
  // eslint-disable-next-line global-require
  const notificationsService = require('../modules/administrator/notifications/notifications.service');

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  // 1. First-response SLA — admin hasn't touched it
  const firstResponseCutoff = new Date(
    now.getTime() - DISPUTE_SLA_HOURS.firstResponse * 60 * 60 * 1000,
  );

  try {
    const open = await Dispute.find({
      status: DISPUTE_STATUSES.OPEN,
      createdAt: { $lte: firstResponseCutoff },
    })
      .select('_id buyerId farmerId orderId createdAt')
      .limit(500)
      .lean();

    for (const dispute of open) {
      try {
        emitDisputeEvent(DISPUTE_SOCKET_EVENTS.DISPUTE_UPDATED, {
          disputeId: dispute._id,
          buyerId: dispute.buyerId,
          farmerId: dispute.farmerId,
          orderId: dispute.orderId,
          status: DISPUTE_STATUSES.OPEN,
          reason: 'sla_first_response_breach',
        });

        await notificationsService.dispatch({
          userId: 'role:admin',
          type: NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT,
          title: 'Dispute SLA breach',
          body: 'A dispute is awaiting first response beyond SLA',
          data: { disputeId: String(dispute._id), deepLink: `/administrator/disputes/${dispute._id}` },
          priority: 'high',
        });

        processed += 1;
      } catch (err) {
        failed += 1;
        log.error('first-response nudge failed', { disputeId: String(dispute._id), message: err.message });
      }
    }
  } catch (err) {
    failed += 1;
    log.error('open dispute query failed', { message: err.message });
  }

  // 2. Evidence overdue — awaiting_evidence past 48h
  const evidenceCutoff = new Date(now.getTime() - EVIDENCE_OVERDUE_HOURS * 60 * 60 * 1000);
  try {
    const awaiting = await Dispute.find({
      status: DISPUTE_STATUSES.AWAITING_EVIDENCE,
      evidenceRequestedAt: { $lte: evidenceCutoff },
    })
      .select('_id buyerId farmerId evidenceRequestedAt')
      .limit(500)
      .lean();

    for (const dispute of awaiting) {
      try {
        // Notify both parties once per job run.
        for (const uid of [dispute.buyerId, dispute.farmerId]) {
          if (!uid) continue;
          await notificationsService.dispatch({
            userId: String(uid),
            type: NOTIFICATION_TYPES.DISPUTE_EVIDENCE_REQUESTED,
            title: 'Evidence needed',
            body: 'Please upload requested evidence for your dispute',
            data: { disputeId: String(dispute._id), deepLink: `/disputes/${dispute._id}` },
            priority: 'high',
          });
        }
        processed += 1;
      } catch (err) {
        failed += 1;
        log.error('evidence reminder failed', { disputeId: String(dispute._id), message: err.message });
      }
    }
  } catch (err) {
    failed += 1;
    log.error('awaiting-evidence query failed', { message: err.message });
  }

  return { processed, skipped, failed };
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };