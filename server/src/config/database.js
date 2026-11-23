// server/src/config/database.js
// Mongoose connection manager with retry, graceful shutdown, and health probe.

'use strict';

const mongoose = require('mongoose');
const env = require('./environment');
const logger = require('./logger');

let connectionPromise = null;
let isConnected = false;

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 5;

function attachListeners() {
  const conn = mongoose.connection;

  conn.on('connected', () => {
    isConnected = true;
    logger.info('[db] MongoDB connected', { db: conn.name });
  });

  conn.on('disconnected', () => {
    isConnected = false;
    logger.warn('[db] MongoDB disconnected');
  });

  conn.on('reconnected', () => {
    isConnected = true;
    logger.info('[db] MongoDB reconnected');
  });

  conn.on('error', (err) => {
    logger.error('[db] MongoDB connection error', { message: err.message });
  });
}

async function connectOnce() {
  if (isConnected) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  attachListeners();

  connectionPromise = mongoose
    .connect(env.database.uri, {
      dbName: env.database.dbName,
      autoIndex: env.isProduction ? false : true,
      maxPoolSize: env.database.options.maxPoolSize,
      serverSelectionTimeoutMS: env.database.options.serverSelectionTimeoutMS,
    })
    .then(() => mongoose.connection);

  return connectionPromise;
}

async function connectWithRetry(attempt = 1) {
  try {
    return await connectOnce();
  } catch (err) {
    logger.error('[db] connection failed', { attempt, message: err.message });
    if (attempt >= MAX_RETRIES) {
      logger.error('[db] max retries reached — exiting');
      throw err;
    }
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    return connectWithRetry(attempt + 1);
  }
}

async function connect() {
  const conn = await connectWithRetry();
  return conn;
}

async function disconnect() {
  if (!isConnected) return;
  await mongoose.connection.close(false);
  isConnected = false;
  connectionPromise = null;
  logger.info('[db] connection closed');
}

function getClient() {
  return mongoose.connection.getClient ? mongoose.connection.getClient() : null;
}

async function healthCheck() {
  try {
    if (!isConnected) return { status: 'down' };
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    return { status: result?.ok === 1 ? 'up' : 'degraded' };
  } catch (err) {
    return { status: 'down', error: err.message };
  }
}

function isReady() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connect,
  disconnect,
  getClient,
  healthCheck,
  isReady,
  mongoose,
};