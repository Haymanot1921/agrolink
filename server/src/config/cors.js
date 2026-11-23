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
  return callback(new Error(`CORS blocked for origin: ${origin}`));
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
    origin: env.socket.corsOrigin === '*' ? '*' : env.socket.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: env.cors.credentials,
    ...extra,
  };
}

module.exports = { corsOptions, buildSocketCors };