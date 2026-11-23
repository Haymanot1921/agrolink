// server/src/config/cloudinary.js
// Cloudinary SDK singleton + guarded helpers (identity verification docs,
// listing images, article media, dispute evidence). Never trusts client MIME.

'use strict';

const { v2: cloudinary } = require('cloudinary');
const env = require('./environment');
const logger = require('./logger');

let configured = false;

function init() {
  if (configured || !env.cloudinary.enabled) return;
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
  configured = true;
  logger.info('[cloudinary] configured');
}

function isEnabled() {
  return env.cloudinary.enabled;
}

function assertEnabled() {
  if (!isEnabled()) {
    const err = new Error('Cloudinary is not configured');
    err.statusCode = 503;
    throw err;
  }
}

async function uploadBuffer(buffer, options = {}) {
  assertEnabled();
  init();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || env.cloudinary.folder,
        resource_type: options.resourceType || 'auto',
        public_id: options.publicId,
        overwrite: options.overwrite ?? false,
        tags: options.tags,
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

async function uploadFile(filePath, options = {}) {
  assertEnabled();
  init();
  return cloudinary.uploader.upload(filePath, {
    folder: options.folder || env.cloudinary.folder,
    resource_type: options.resourceType || 'auto',
    tags: options.tags,
  });
}

async function destroy(publicId, options = {}) {
  assertEnabled();
  init();
  return cloudinary.uploader.destroy(publicId, {
    resource_type: options.resourceType || 'image',
    invalidate: true,
  });
}

function buildSignedUrl(publicId, options = {}) {
  assertEnabled();
  init();
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    ...options,
  });
}

module.exports = {
  cloudinary,
  init,
  isEnabled,
  uploadBuffer,
  uploadFile,
  destroy,
  buildSignedUrl,
};