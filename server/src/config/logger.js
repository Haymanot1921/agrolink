// server/src/config/logger.js
// Structured logger (winston). Console by default; optional rotating files.
// Redacts secrets; consistent JSON in production, colorized in dev.

'use strict';

const path = require('path');
const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');
const env = require('./environment');

const redact = winston.format((info) => {
  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (env.logging.redactKeys.includes(key)) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        walk(obj[key]);
      }
    }
    return obj;
  };
  return walk(info);
});

const consoleFormat = env.isProduction
  ? winston.format.combine(redact(), winston.format.timestamp(), winston.format.json())
  : winston.format.combine(
      redact(),
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${message}${extras}`;
      }),
    );

const transports = [new winston.transports.Console({ format: consoleFormat })];

if (env.logging.enableFile) {
  if (!fs.existsSync(env.logging.dir)) {
    fs.mkdirSync(env.logging.dir, { recursive: true });
  }

  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: env.logging.dir,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(redact(), winston.format.timestamp(), winston.format.json()),
    }),
  );

  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: env.logging.dir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(redact(), winston.format.timestamp(), winston.format.json()),
    }),
  );
}

const logger = winston.createLogger({
  level: env.logging.level,
  defaultMeta: { service: 'agrolink-api', env: env.nodeEnv },
  transports,
  exitOnError: false,
});

// Helper to attach request ids in HTTP middleware
logger.childWithRequestId = (requestId) => logger.child({ requestId });

module.exports = logger;