// server/src/shared/utils/pagination.js
// Shared pagination helpers used by SQL-backed repositories and plain arrays.

'use strict';

const DEFAULTS = Object.freeze({
  page: 1,
  limit: 20,
  maxLimit: 100,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Parse ?page & ?limit & ?sortBy & ?sortOrder from req.query.
 * Returns { page, limit, skip, sort, sortBy, sortOrder }.
 */
function parsePagination(query = {}, options = {}) {
  const {
    defaultLimit = DEFAULTS.limit,
    maxLimit = DEFAULTS.maxLimit,
    defaultSortBy = DEFAULTS.sortBy,
    defaultSortOrder = DEFAULTS.sortOrder,
    allowedSortFields,
  } = options;

  const page = toInt(query.page, DEFAULTS.page);
  const requestedLimit = toInt(query.limit, defaultLimit);
  const limit = Math.min(requestedLimit, maxLimit);
  const skip = (page - 1) * limit;

  let sortBy = query.sortBy || defaultSortBy;
  if (Array.isArray(allowedSortFields) && !allowedSortFields.includes(sortBy)) {
    sortBy = defaultSortBy;
  }
  const rawOrder = String(query.sortOrder || defaultSortOrder).toLowerCase();
  const sortOrder = rawOrder === 'asc' ? 'asc' : 'desc';
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  return { page, limit, skip, sort, sortBy, sortOrder };
}

/**
 * Build a { data, pagination } envelope from an in-memory array.
 */
function paginateArray(items, { page, limit }) {
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

module.exports = {
  DEFAULTS,
  parsePagination,
  paginateArray,
};