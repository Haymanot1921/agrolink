// server/src/shared/middleware/notFound.js
// Terminal 404 for unmatched routes. Must be registered AFTER all routers
// and BEFORE errorHandler.

'use strict';

function notFound(req, res, next) {
  const requestId = req.id || req.headers['x-request-id'] || null;
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
    requestId,
    timestamp: new Date().toISOString(),
  });
  // Intentionally do not call next() — this is terminal.
}

module.exports = { notFound };