// server/src/shared/utils/asyncHandler.js
// Wraps async route handlers so thrown errors reach errorHandler without
// try/catch boilerplate. Also propagates per-handler timeout.

'use strict';

const { ApiError } = require('./ApiError');

/**
 * @param {Function} fn — async (req, res, next)
 * @param {{ timeoutMs?: number }} [opts]
 */
function asyncHandler(fn, opts = {}) {
  const { timeoutMs } = opts;

  return function wrapped(req, res, next) {
    let timer;
    const execute = Promise.resolve().then(() => fn(req, res, next));

    if (!timeoutMs) {
      return execute.catch(next);
    }

    const timeout = new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new ApiError('Request timed out', 504, 'REQUEST_TIMEOUT')),
        timeoutMs,
      );
    });

    return Promise.race([execute, timeout])
      .catch(next)
      .finally(() => {
        if (timer) clearTimeout(timer);
      });
  };
}

module.exports = { asyncHandler };