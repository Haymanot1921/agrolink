// server/src/jobs/reportGeneration.job.js
// Materializes daily/weekly/monthly admin reports (FR-ADMIN-013,
// FR-ASSISTED-013). Outputs CSV buffers to the export dir; larger
// reports defer to reportExport.service.
// Schedule: daily at 02:00.

'use strict';

const fs = require('fs').promises;
const { execute } = require('./_runtime/jobRunner');
const env = require('../config/environment');
const { buildExport, saveExport } = require('../shared/utils/exportUtils');
const { parseDateRange } = require('../shared/utils/dateTime');
const database = require('../config/database');

const NAME = 'reportGeneration';
const SCHEDULE = '0 2 * * *';

// Report definitions — kept small and explicit so admins can add more later.
const REPORTS = [
  {
    key: 'daily-users',
    title: 'Daily user growth',
    getRows: async ({ from, to }) => {
      // eslint-disable-next-line global-require
      const User = require('../modules/auth/auth.repository');
      return User.aggregateDailyRegistrations({ from, to });
    },
    columns: [
      { key: 'day', label: 'Day', width: 14 },
      { key: 'count', label: 'New users', width: 12 },
      { key: 'buyers', label: 'Buyers', width: 12 },
      { key: 'farmers', label: 'Farmers', width: 12 },
    ],
  },
  {
    key: 'daily-orders',
    title: 'Daily orders + GMV',
    getRows: async ({ from, to }) => {
      const [rows] = await database.query(
        `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day,
                COUNT(*) AS orderCount,
                COALESCE(SUM(total_minor), 0) AS gmvMinor,
                SUM(status = 'cancelled') AS cancelled
         FROM orders WHERE created_at BETWEEN ? AND ?
         GROUP BY DATE(created_at) ORDER BY DATE(created_at)`,
        [from, to],
      );
      return rows.map((row) => ({
        ...row,
        orderCount: Number(row.orderCount),
        gmvMinor: Number(row.gmvMinor),
        cancelled: Number(row.cancelled || 0),
      }));
    },
    columns: [
      { key: 'day', label: 'Day', width: 14 },
      { key: 'orderCount', label: 'Orders', width: 12 },
      { key: 'gmvMinor', label: 'GMV (santim)', width: 18 },
      { key: 'cancelled', label: 'Cancelled', width: 12 },
    ],
  },
  {
    key: 'daily-moderation',
    title: 'Moderation activity',
    getRows: async ({ from, to }) => {
      const [rows] = await database.query(
        `SELECT DATE_FORMAT(h.created_at, '%Y-%m-%d') AS day,
                SUM(h.to_status = 'published') AS approved,
                SUM(h.to_status = 'rejected') AS rejected,
                (SELECT COUNT(*) FROM listings l
                 WHERE l.status = 'pending_review' AND DATE(l.created_at) = DATE(h.created_at)) AS pending
         FROM listing_moderation_history h
         WHERE h.created_at BETWEEN ? AND ?
         GROUP BY DATE(h.created_at) ORDER BY DATE(h.created_at)`,
        [from, to],
      );
      return rows.map((row) => ({
        ...row,
        approved: Number(row.approved || 0),
        rejected: Number(row.rejected || 0),
        pending: Number(row.pending || 0),
      }));
    },
    columns: [
      { key: 'day', label: 'Day', width: 14 },
      { key: 'approved', label: 'Approved', width: 12 },
      { key: 'rejected', label: 'Rejected', width: 12 },
      { key: 'pending', label: 'Pending', width: 12 },
    ],
  },
];

async function run({ log, now }) {
  const dir = env.reports.exportDir;
  await fs.mkdir(dir, { recursive: true });

  const { from, to } = parseDateRange(null, null, { defaultDays: 1 });
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, '');

  let processed = 0;
  let failed = 0;

  for (const def of REPORTS) {
    try {
      const rows = await def.getRows({ from, to });
      const { buffer, filename } = await buildExport({
        format: 'csv',
        rows: rows || [],
        columns: def.columns,
        filenameBase: `${stamp}-${def.key}`,
      });
      await saveExport(buffer, filename);
      log.info('report generated', { key: def.key, rows: (rows || []).length, filename });
      processed += 1;
    } catch (err) {
      failed += 1;
      log.error('report failed', { key: def.key, message: err.message });
    }
  }

  return { processed, failed, notes: { from, to } };
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };