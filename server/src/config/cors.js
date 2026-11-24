// server/src/config/cors.js
// CORS options consumed by both Express (http) and Socket.IO.

'use strict';

const env = require('./environment');

function originValidator(origin, callback) {
  // Allow server-to-server / curl / mobile (no origin)
  if (!origin) return callback(null, true);

  if (env.cors.origins.includes('*') || env.cors.origins.includes(origin)) {
    return callback(null, true);
  }
  const error = new Error(`CORS blocked for origin: ${origin}`);
  error.statusCode = 403;
  error.code = 'CORS_ORIGIN_DENIED';
  return callback(error);
}

const corsOptions = {
  origin: originValidator,
  credentials: env.cors.credentials,
  methods: env.cors.methods,
  allowedHeaders: env.cors.allowedHeaders,
  exposedHeaders: ['X-Request-Id', 'Content-Disposition'],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

// Socket.IO has its own shape; keep a shared builder.
function buildSocketCors(extra = {}) {
  return {
    origin: env.socket.corsOrigins.includes('*') ? '*' : env.socket.corsOrigins,
    methods: ['GET', 'POST'],
    credentials: env.cors.credentials,
    ...extra,
  };
}

module.exports = { corsOptions, buildSocketCors };