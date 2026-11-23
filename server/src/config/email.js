// server/src/config/email.js
// Email transport abstraction: SMTP, AWS SES, or SendGrid.
// Returns a uniform `sendMail({ to, subject, html, text, template })` API.

'use strict';

const nodemailer = require('nodemailer');
const env = require('./environment');
const logger = require('./logger');

let transporter = null;

function createSmtpTransporter() {
  return nodemailer.createTransport({
    host: env.email.smtp.host,
    port: env.email.smtp.port,
    secure: env.email.smtp.secure,
    auth:
      env.email.smtp.user && env.email.smtp.pass
        ? { user: env.email.smtp.user, pass: env.email.smtp.pass }
        : undefined,
    pool: true,
    maxConnections: 5,
    maxMessages: 50,
  });
}

function createSesTransporter() {
  // SES over SMTP (simplest cross-provider path)
  return nodemailer.createTransport({
    host: `email-smtp.${env.email.awsSes.region}.amazonaws.com`,
    port: 465,
    secure: true,
    auth: {
      user: env.email.awsSes.accessKeyId,
      pass: env.email.awsSes.secretAccessKey,
    },
  });
}

function init() {
  if (transporter) return transporter;
  switch (env.email.provider) {
    case 'ses':
      transporter = createSesTransporter();
      break;
    case 'sendgrid':
      transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: { user: 'apikey', pass: env.email.sendgrid.apiKey },
      });
      break;
    case 'smtp':
    default:
      transporter = createSmtpTransporter();
      break;
  }
  logger.info('[email] transport initialized', { provider: env.email.provider });
  return transporter;
}

async function sendMail({ to, subject, html, text, from, replyTo, attachments }) {
  if (env.isTest) {
    logger.debug('[email] test mode — skipped', { to, subject });
    return { accepted: [to], skipped: true };
  }

  const tx = init();
  const message = {
    from: from || `"${env.email.fromName}" <${env.email.fromAddress}>`,
    to: Array.isArray(to) ? to.join(',') : to,
    subject,
    html,
    text: text || (html ? undefined : ''),
    replyTo: replyTo || env.email.replyTo,
    attachments,
  };

  const info = await tx.sendMail(message);
  logger.info('[email] sent', { to: message.to, messageId: info.messageId });
  return info;
}

async function verify() {
  try {
    const tx = init();
    await tx.verify();
    return { ok: true };
  } catch (err) {
    logger.error('[email] verify failed', { message: err.message });
    return { ok: false, error: err.message };
  }
}

module.exports = { init, sendMail, verify };