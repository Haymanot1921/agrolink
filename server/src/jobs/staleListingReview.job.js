// server/src/jobs/staleListingReview.job.js
// Escalates listings that have been in `pending_review` for too long and
// auto-expires published listings past their expiry date (SRS FR-MARKET-016).
// Schedule: hourly.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const logger = require('../config/logger');
const { LISTING_STATUSES } = require('../shared/constants/listingStatuses');
const { NOTIFICATION_TYPES } = require('../shared/constants/notificationTypes');
const { emitModerationEvent } = require('../sockets/moderationQueue.socket');
const { MODERATION_SOCKET_EVENTS, MODERATION_TARGETS } = require('../shared/events/moderationEvents');

const NAME = 'staleListingReview';
const SCHEDULE = '0 * * * *'; // hourly
const PENDING_ESCALATE_HOURS = 24;

async function run({ log, now }) {
  // eslint-disable-next-line global-require
  const Listing = require('../modules/farmer/listings/listing.model');
  // eslint-disable-next-line global-require
  const notificationsService = require('../modules/administrator/notifications/notifications.service');

  const pendingCutoff = new Date(now.getTime() - PENDING_ESCALATE_HOURS * 60 * 60 * 1000);
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  // 1. Auto-expire published listings past their expiry date
  try {
    const expiredIds = await Listing.find({
      status: LISTING_STATUSES.PUBLISHED,
      expiresAt: { $lte: now },
    })
      .select('_id farmerId')
      .limit(1000)
      .lean();

    for (const listing of expiredIds) {
      try {
        await Listing.updateOne(
          { _id: listing._id, status: LISTING_STATUSES.PUBLISHED },
          { $set: { status: LISTING_STATUSES.EXPIRED, expiredAt: new Date() } },
        );

        emitModerationEvent(
          MODERATION_SOCKET_EVENTS.LISTING_REMOVED,
          {
            targetType: MODERATION_TARGETS.LISTING,
            targetId: listing._id,
            ownerId: listing.farmerId,
            moderatorId: null,
            reason: 'expired',
          },
          { queueDelta: { expired: 1 } },
        );

        await notificationsService.dispatch({
          userId: String(listing.farmerId),
          type: NOTIFICATION_TYPES.LISTING_EXPIRED,
          title: 'Listing expired',
          body: 'Your listing has expired. Renew to keep it visible.',
          data: { listingId: String(listing._id), deepLink: `/listings/${listing._id}/edit` },
          priority: 'normal',
        });

        processed += 1;
      } catch (err) {
        failed += 1;
        log.error('expire failed', { listingId: String(listing._id), message: err.message });
      }
    }
  } catch (err) {
    failed += 1;
    log.error('expiry query failed', { message: err.message });
  }

  // 2. Escalate stale pending reviews to admin queue alerts
  try {
    const staleCount = await Listing.countDocuments({
      status: LISTING_STATUSES.PENDING_REVIEW,
      createdAt: { $lte: pendingCutoff },
    });

    if (staleCount > 0) {
      // eslint-disable-next-line global-require
      const { emitQueueSnapshot } = require('../sockets/moderationQueue.socket');
      emitQueueSnapshot({ counts: { listingsPendingStale: staleCount } });
      log.warn('stale listings pending review', { staleCount });
    }
  } catch (err) {
    failed += 1;
    log.error('stale query failed', { message: err.message });
  }

  return { processed, skipped, failed, notes: { pendingCutoff: pendingCutoff.toISOString() } };
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };