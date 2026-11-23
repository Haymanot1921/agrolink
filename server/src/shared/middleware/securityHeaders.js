// server/src/shared/middleware/securityHeaders.js
// Helmet + a few extra headers tuned for the AgroLink API.
// Also handles CSP for the API JSON surface (no inline assets served).

'use strict';

const helmet = require('helmet');
const env = require('../../config/environment');

const helmetMiddleware = helmet({
  contentSecurityPolicy: env.isProduction
    ? {
        directives: {
          defaultSrc: ["'none'"],
          // API returns JSON only — no assets
          baseUri: ["'none'"],
          frameAncestors: ["'none'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false, // allow images/video embeds from Cloudinary/Jitsi
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: env.isProduction
    ? { maxAge: 15552000, includeSubDomains: true, preload: true }
    : false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  hidePoweredBy: true,
  dnsPrefetchControl: { allow: false },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
});

// Extra headers (Helmet doesn't cover these).
function extraSecurityHeaders(req, res, next) {
  res.setHeader('X-API-Version', 'v1');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=(self)');
  // Explicitly document that this API is JSON-only
  if (!res.getHeader('Content-Type')) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
  next();
}

module.exports = { helmetMiddleware, extraSecurityHeaders };