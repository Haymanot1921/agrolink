// server/src/modules/notifications/notification.model.js
'use strict';

const mongoose = require('mongoose');
const { NOTIFICATION_TYPE_LIST, NOTIFICATION_CHANNEL_LIST } = require('../../shared/constants/notificationTypes');

const ChannelStateSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      enum: ['queued', 'sending', 'sent', 'retrying', 'failed', 'skipped'],
      default: 'queued',
    },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: null },
    sentAt: { type: Date, default: null },
    lastError: { type: String, default: null },
  },
  { _id: false },
);

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPE_LIST, required: true, index: true },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'critical'],
      default: 'normal',
      index: true,
    },

    title: { type: String, default: null },
    body: { type: String, default: null },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },

    channels: { type: [String], enum: NOTIFICATION_CHANNEL_LIST, default: ['in_app'] },
    channelStatus: {
      email: { type: ChannelStateSchema, default: undefined },
      sms: { type: ChannelStateSchema, default: undefined },
      push: { type: ChannelStateSchema, default: undefined },
    },

    recipientEmail: { type: String, default: null },
    recipientPhone: { type: String, default: null },

    isMandatory: { type: Boolean, default: false },
    language: { type: String, enum: ['en', 'am'], default: 'en' },

    // Read-state (for in_app channel)
    readAt: { type: Date, default: null, index: true },
    readBy: { type: mongoose.Schema.Types.ObjectId, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Efficient index for inbox queries: user + unread + recency
NotificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
NotificationSchema.index({ 'channelStatus.email.state': 1, createdAt: 1 });
NotificationSchema.index({ 'channelStatus.sms.state': 1, createdAt: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);