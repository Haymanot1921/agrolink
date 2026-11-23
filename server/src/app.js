
// server/src/app.js
// Express application: middleware chain, route mounting, and terminal handlers.
// Deliberately excludes DB connect, socket init, and job startup — those live
// in server.js so tests can import `app` without side effects.
'use strict';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const crypto = require('crypto');

const env = require('./config/environment');
const logger = require('./config/logger');
const { corsOptions } = require('./config/cors');

const { helmetMiddleware, extraSecurityHeaders } = require('./shared/middleware/securityHeaders');
const { globalLimiter } = require('./shared/middleware/rateLimiter');
const { attachResponseHelpers } = require('./shared/utils/ApiResponse');
const { notFound } = require('./shared/middleware/notFound');
const { errorHandler } = require('./shared/middleware/errorHandler');

// ─── Route modules ──────────────────────────────────────────────────────────
const authRouter = require('./modules/auth/auth.routes');
const usersRouter = require('./modules/users/users.routes');
const notificationsRouter = require('./modules/notifications/notifications.routes');
const uploadsRouter = require('./modules/uploads/upload.routes');
const verificationRouter = require('./modules/verification/verification.routes');

// Feature modules — mounted defensively so the app still boots while a
// particular module is under construction. Once each module is shipped,
// these `tryRequire` calls can be replaced by direct requires.
function tryRequire(path) {
  try {
    return require(path);
  } catch (err) {
    if (err && err.code === 'MODULE_NOT_FOUND' && String(err.message).includes(path)) {
      logger.warn('[app] router not yet available — skipping', { path });
      return null;
    }
    throw err;
  }
}

const adminRouter = tryRequire('./modules/administrator');
const buyerRouter = tryRequire('./modules/buyer');
const farmerRouter = tryRequire('./modules/farmer');
const expertRouter = tryRequire('./modules/expert');
const supportAgentRouter = tryRequire('./modules/support-agent');

// ─── App factory ────────────────────────────────────────────────────────────
const app = express();

// Express "trust proxy" so req.ip honors X-Forwarded-For behind Nginx/ALB.
if (env.isProduction) app.set('trust proxy', 1);

// Disable x-powered-by, expose env
app.disable('x-powered-by');

// ─── Security & infra middleware (order matters) ───────────────────────────
app.use(helmetMiddleware);
app.use(extraSecurityHeaders);
app.use(cors(corsOptions));

// Request IDs for tracing
app.use((req, res, next) => {
  const existing = req.headers['x-request-id'];
  req.id = existing || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Logging (skip in tests)
if (!env.isTest) {
  app.use(
    morgan(env.isProduction ? 'combined' : 'dev', {
      stream: {
        write: (msg) => logger.info(msg.trim()),
      },
      skip: (req) => req.path === '/api/v1/health',
    }),
  );
}

// Compression + body parsers
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Response helpers (res.ok, res.created, res.paginated)
app.use(attachResponseHelpers);

// Global rate limit (skips in test by default; enable with RATELIMIT_IN_TEST)
app.use(globalLimiter);

// ─── Liveness / readiness (before auth) ────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: env.app.name,
    uptime: Math.round(process.uptime()),
    env: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/health/ready', async (req, res) => {
  try {
    // eslint-disable-next-line global-require
    const database = require('./config/database');
    const db = await database.healthCheck();
    const ready = db.status === 'up';
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      checks: { database: db },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({ status: 'not_ready', error: err.message });
  }
});

// ─── Public API routes ─────────────────────────────────────────────────────
const prefix = env.app.apiPrefix;

app.use(`${prefix}/auth`, authRouter);

// ─── Authenticated shared routes ───────────────────────────────────────────
app.use(`${prefix}/users`, usersRouter);
app.use(`${prefix}/notifications`, notificationsRouter);
app.use(`${prefix}/uploads`, uploadsRouter);
app.use(`${prefix}/verification`, verificationRouter);

// ─── Role-scoped modules ───────────────────────────────────────────────────
if (adminRouter) app.use(`${prefix}/admin`, adminRouter);
if (buyerRouter) app.use(`${prefix}/buyers`, buyerRouter);
if (farmerRouter) app.use(`${prefix}/farmers`, farmerRouter);
if (expertRouter) app.use(`${prefix}/experts`, expertRouter);
if (supportAgentRouter) app.use(`${prefix}/support-agents`, supportAgentRouter);

// ─── Root route (helpful for ops) ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: env.app.name,
    version: 'v1',
    docs: `${env.app.baseUrl}${prefix}/health`,
  });
});

// ─── Terminal handlers ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;