'use strict';

const database = require('../../config/database');

async function acquire(name) {
  const connection = await database.getConnection();
  const lockName = `agrolink:${name}`.slice(0, 64);
  let acquired = false;

  try {
    const [rows] = await connection.execute('SELECT GET_LOCK(?, 0) AS acquired', [lockName]);
    acquired = rows[0].acquired === 1;
  } catch (err) {
    connection.release();
    throw err;
  }

  if (!acquired) {
    connection.release();
    return { acquired: false, holder: null, release: async () => {} };
  }

  let released = false;
  return {
    acquired: true,
    holder: process.pid,
    release: async () => {
      if (released) return;
      released = true;
      try {
        await connection.execute('SELECT RELEASE_LOCK(?)', [lockName]);
      } finally {
        connection.release();
      }
    },
  };
}

module.exports = { acquire };