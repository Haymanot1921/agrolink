// MySQL connection pool with retry, graceful shutdown, and health probe.
'use strict';

const mysql = require('mysql2/promise');
const env = require('./environment');
const logger = require('./logger');

let pool = null;
let connectionPromise = null;
let isConnected = false;

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 5;

function getClient() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.database.host,
      port: env.database.port,
      user: env.database.user,
      password: env.database.password,
      database: env.database.name,
      waitForConnections: true,
      connectionLimit: env.database.options.connectionLimit,
      connectTimeout: env.database.options.connectTimeout,
      timezone: env.database.options.timezone,
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: false,
    });
  }
  return pool;
}

async function connectOnce() {
  if (isConnected) return getClient();
  if (connectionPromise) return connectionPromise;

  const activePool = getClient();
  connectionPromise = (async () => {
    const connection = await activePool.getConnection();
    try {
      await connection.ping();
    } finally {
      connection.release();
    }

    isConnected = true;
    logger.info('[db] MySQL connected', {
      host: env.database.host,
      database: env.database.name,
    });
    return activePool;
  })().catch((err) => {
    connectionPromise = null;
    isConnected = false;
    throw err;
  });

  return connectionPromise;
}

async function connectWithRetry(attempt = 1) {
  try {
    return await connectOnce();
  } catch (err) {
    logger.error('[db] MySQL connection failed', { attempt, message: err.message });
    if (attempt >= MAX_RETRIES) {
      logger.error('[db] max retries reached — exiting');
      throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return connectWithRetry(attempt + 1);
  }
}

async function connect() {
  return connectWithRetry();
}

async function disconnect() {
  if (!pool) return;
  const activePool = pool;
  pool = null;
  connectionPromise = null;
  isConnected = false;
  await activePool.end();
  logger.info('[db] MySQL pool closed');
}

async function query(sql, params = []) {
  return getClient().execute(sql, params);
}

async function transaction(callback) {
  const connection = await getClient().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function healthCheck() {
  try {
    const [rows] = await query('SELECT 1 AS ok');
    isConnected = rows[0].ok === 1;
    return { status: isConnected ? 'up' : 'degraded' };
  } catch (err) {
    isConnected = false;
    return { status: 'down', error: err.message };
  }
}

function isReady() {
  return isConnected;
}

module.exports = {
  connect,
  disconnect,
  getClient,
  getConnection: () => getClient().getConnection(),
  query,
  transaction,
  healthCheck,
  isReady,
};
