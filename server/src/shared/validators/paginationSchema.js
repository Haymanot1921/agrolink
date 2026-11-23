// server/src/shared/validators/paginationSchema.js
// Reusable pagination + sort + date-range query schema for list endpoints.
// Pairs with shared/utils/pagination.js — parsePagination() reads the
// already-validated req.query.

'use strict';

const Joi = require('joi');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * @param {Object} [opts]
 * @param {string[]} [opts.allowedSortFields] — whitelist for sortBy
 * @param {string}   [opts.defaultSortBy]
 * @param {'asc'|'desc'} [opts.defaultSortOrder]
 * @param {boolean}  [opts.allowDateRange=true]
 * @param {number}   [opts.maxDateRangeDays=366]
 */
function buildPaginationSchema(opts = {}) {
  const {
    allowedSortFields = ['createdAt'],
    defaultSortBy = 'createdAt',
    defaultSortOrder = 'desc',
    allowDateRange = true,
    maxDateRangeDays = 366,
  } = opts;

  const base = {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    sortBy: Joi.string()
      .valid(...allowedSortFields)
      .default(defaultSortBy),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default(defaultSortOrder),
  };

  if (allowDateRange) {
    base.from = Joi.date().iso().optional();
    base.to = Joi.date().iso().optional();
  }

  const schema = Joi.object(base).custom((value, helpers) => {
    if (allowDateRange && value.from && value.to) {
      const fromMs = new Date(value.from).getTime();
      const toMs = new Date(value.to).getTime();
      if (toMs < fromMs) {
        return helpers.error('any.invalid', { message: '`to` must be after `from`' });
      }
      const days = Math.ceil((toMs - fromMs) / (1000 * 60 * 60 * 24));
      if (days > maxDateRangeDays) {
        return helpers.error('any.invalid', {
          message: `Date range exceeds ${maxDateRangeDays} days`,
        });
      }
    }
    return value;
  });

  return schema;
}

// Pre-built schema for the common case.
const paginationSchema = buildPaginationSchema();

module.exports = {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  buildPaginationSchema,
  paginationSchema,
};