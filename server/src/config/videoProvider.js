// server/src/config/videoProvider.js
// Consultation video rooms (SRS §5.8). Supports Jitsi (default, self-hostable)
// and Daily.co. NO delivery tracking, NO AI.

'use strict';

const axios = require('axios');
const { randomUUID } = require('crypto');
const env = require('./environment');
const logger = require('./logger');

function buildJitsiRoom(consultationId) {
  const roomName = `agrolink-consult-${consultationId || randomUUID()}`;
  const domain = env.video.jitsi.domain;
  return {
    provider: 'jitsi',
    roomName,
    url: `https://${domain}/${roomName}`,
    maxSessionMinutes: env.video.maxSessionMinutes,
  };
}

async function buildDailyRoom(consultationId) {
  const roomName = `agrolink-consult-${consultationId || randomUUID()}`;
  const response = await axios.post(
    `${env.video.daily.baseUrl}/rooms`,
    {
      name: roomName,
      properties: {
        exp: Math.floor(Date.now() / 1000) + env.video.maxSessionMinutes * 60,
        enable_chat: true,
        start_video_off: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${env.video.daily.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    },
  );
  return {
    provider: 'daily',
    roomName: response.data.name,
    url: response.data.url,
    maxSessionMinutes: env.video.maxSessionMinutes,
  };
}

async function createConsultationRoom({ consultationId } = {}) {
  try {
    if (env.video.provider === 'daily') {
      return await buildDailyRoom(consultationId);
    }
    return buildJitsiRoom(consultationId);
  } catch (err) {
    logger.error('[video] room creation failed', { message: err.message, provider: env.video.provider });
    throw err;
  }
}

module.exports = { createConsultationRoom };