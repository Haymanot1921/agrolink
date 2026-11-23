// server/src/config/socket.js
// Socket.IO server factory. Auth via JWT; namespaced rooms for buyer,
// farmer, expert, support agent, admin. Emits real-time notifications/messages.

'use strict';

const { Server } = require('socket.io');
const env = require('./environment');
const logger = require('./logger');
const { buildSocketCors } = require('./cors');

let io = null;

const ROOM_PREFIX = {
  user: 'user:',
  role: 'role:',
  conversation: 'conversation:',
  ticket: 'ticket:',
  dispute: 'dispute:',
  admin: 'admin:',
};

function userRoom(userId) {
  return `${ROOM_PREFIX.user}${userId}`;
}
function roleRoom(role) {
  return `${ROOM_PREFIX.role}${role}`;
}

function initSocket(httpServer, { authenticate } = {}) {
  if (!env.socket.enabled) {
    logger.warn('[socket] disabled by config');
    return null;
  }

  io = new Server(httpServer, {
    path: env.socket.path,
    cors: buildSocketCors(),
    pingTimeout: env.socket.pingTimeout,
    pingInterval: env.socket.pingInterval,
    maxHttpBufferSize: env.socket.maxHttpBufferSize,
    transports: env.socket.transports,
  });

  // Auth middleware — expects verifyAccessToken injected by shared/auth.
  io.use(async (socket, next) => {
    try {
      if (typeof authenticate !== 'function') {
        return next(new Error('socket auth not configured'));
      }
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');
      if (!token) return next(new Error('unauthorized'));
      const user = await authenticate(token);
      if (!user) return next(new Error('unauthorized'));
      socket.user = user;
      return next();
    } catch (err) {
      return next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const { _id, role } = socket.user;
    socket.join(userRoom(_id));
    if (role) socket.join(roleRoom(role));

    logger.debug('[socket] connected', { userId: _id, role });

    socket.on('conversation:join', ({ conversationId }) => {
      if (conversationId) socket.join(`${ROOM_PREFIX.conversation}${conversationId}`);
    });
    socket.on('conversation:leave', ({ conversationId }) => {
      if (conversationId) socket.leave(`${ROOM_PREFIX.conversation}${conversationId}`);
    });
    socket.on('ticket:join', ({ ticketId }) => {
      if (ticketId) socket.join(`${ROOM_PREFIX.ticket}${ticketId}`);
    });
    socket.on('dispute:join', ({ disputeId }) => {
      if (disputeId) socket.join(`${ROOM_PREFIX.dispute}${disputeId}`);
    });

    socket.on('disconnect', (reason) => {
      logger.debug('[socket] disconnected', { userId: _id, reason });
    });
  });

  logger.info('[socket] initialized', { path: env.socket.path });
  return io;
}

function getIO() {
  return io;
}

function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(userRoom(userId)).emit(event, payload);
}

function emitToRole(role, event, payload) {
  if (!io) return;
  io.to(roleRoom(role)).emit(event, payload);
}

function emitToConversation(conversationId, event, payload) {
  if (!io) return;
  io.to(`${ROOM_PREFIX.conversation}${conversationId}`).emit(event, payload);
}

function emitToTicket(ticketId, event, payload) {
  if (!io) return;
  io.to(`${ROOM_PREFIX.ticket}${ticketId}`).emit(event, payload);
}

function emitToDispute(disputeId, event, payload) {
  if (!io) return;
  io.to(`${ROOM_PREFIX.dispute}${disputeId}`).emit(event, payload);
}

function emitToAdmins(event, payload) {
  if (!io) return;
  io.to(roleRoom('admin')).emit(event, payload);
}

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToRole,
  emitToConversation,
  emitToTicket,
  emitToDispute,
  emitToAdmins,
  ROOM_PREFIX,
};