// server/src/shared/middleware/validateRequest.js
// Uniform validation wrapper for Joi / Zod / express-validator style schemas.
// Each module defines schemas in `<module>.validator.js` and hands them here.

'use strict';

const { AppError } = require('../errors/AppError');

function isJoiSchema(schema) {
  return schema && typeof schema.validate === 'function' && typeof schema.describe === 'function';
}

function formatJoiError(err) {
  return err.details.map((d) => ({
    field: d.path.join('.'),
    message: d.message,
    type: d.type,
  }));
}

/**
 * @param {Object} schemas
 * @param {object} [schemas.body]
 * @param {object} [schemas.query]
 * @param {object} [schemas.params]
 * @param {object} [schemas.headers]
 * @param {{ stripUnknown?: boolean, abortEarly?: boolean }} [opts]
 */
function validateRequest(schemas = {}, opts = {}) {
  const { stripUnknown = true, abortEarly = false } = opts;

  return function validator(req, res, next) {
    try {
      const parts = ['params', 'query', 'body', 'headers'];
      const errors = [];

      for (const part of parts) {
        const schema = schemas[part];
        if (!schema) continue;

        if (!isJoiSchema(schema)) {
          // Generic interface: { parse(value) } — e.g. zod
          if (typeof schema.parse === 'function') {
            try {
              req[part] = schema.parse(req[part]);
            } catch (e) {
              const issues = e.issues || e.errors || [];
              issues.forEach((iss) => {
                errors.push({
                  field: (iss.path || []).join('.') || part,
                  message: iss.message,
                  type: iss.code || 'invalid',
                });
              });
            }
            continue;
          }
          return next(new AppError(`Unsupported validator for ${part}`, 500, 'VALIDATOR_MISCONFIGURED'));
        }

        const { error, value } = schema.validate(req[part], {
          abortEarly,
          stripUnknown,
          allowUnknown: !stripUnknown,
          convert: true,
        });

        if (error) {
          errors.push(...formatJoiError(error));
        } else {
          // Mutate safely for query/params on Express 5
          if (part === 'query') {
            Object.keys(req.query).forEach((k) => delete req.query[k]);
            Object.assign(req.query, value);
          } else {
            req[part] = value;
          }
        }
      }

      if (errors.length) {
        return next(new AppError('Validation failed', 422, 'VALIDATION_ERROR', errors));
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { validateRequest };