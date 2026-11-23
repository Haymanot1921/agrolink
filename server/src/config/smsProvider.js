// server/src/config/smsProvider.js
// SMS abstraction: Africa's Talking (default for ET) or Twilio.
// Uniform `sendSms({ to, message })`.

'use strict';

const axios = require('axios');
const env = require('./environment');
const logger = require('./logger');

function normalizePhone(phone) {
  const digits = String(phone).replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('251')) return `+${digits}`;
  if (digits.startsWith('0')) return `+251${digits.slice(1)}`;
  return `+251${digits}`;
}

async function sendViaAfricasTalking({ to, message }) {
  const url = env.sms.africastalking.baseUrl;
  const params = new URLSearchParams();
  params.append('username', env.sms.africastalking.username);
  params.append('to', Array.isArray(to) ? to.join(',') : to);
  params.append('message', message);
  if (env.sms.senderId) params.append('from', env.sms.senderId);

  const response = await axios.post(url, params.toString(), {
    headers: {
      apiKey: env.sms.africastalking.apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    timeout: 15000,
  });
  return response.data;
}

async function sendViaTwilio({ to, message }) {
  const accountSid = env.sms.twilio.accountSid;
  const authToken = env.sms.twilio.authToken;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams();
  params.append('To', Array.isArray(to) ? to[0] : to);
  params.append('From', env.sms.twilio.fromNumber);
  params.append('Body', message);

  const response = await axios.post(url, params.toString(), {
    auth: { username: accountSid, password: authToken },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  });
  return response.data;
}

async function sendSms({ to, message }) {
  if (env.isTest) {
    logger.debug('[sms] test mode — skipped', { to });
    return { skipped: true };
  }

  const normalized = Array.isArray(to) ? to.map(normalizePhone) : normalizePhone(to);

  try {
    if (env.sms.provider === 'twilio') {
      return await sendViaTwilio({ to: normalized, message });
    }
    return await sendViaAfricasTalking({ to: normalized, message });
  } catch (err) {
    logger.error('[sms] send failed', { message: err.message, provider: env.sms.provider });
    throw err;
  }
}

module.exports = { sendSms, normalizePhone };