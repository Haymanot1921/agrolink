// server/src/shared/utils/ApiResponse.js
// Uniform response envelope. All controllers call res.ok(...) or
// ApiResponse.send(...) so web/mobile clients have one shape to parse.

'use strict';

class ApiResponse {
  /**
   * @param {*} data
   * @param {Object} [opts]
   * @param {number} [opts.statusCode=200]
   * @param {string} [opts.message]
   * @param {Object} [opts.meta]   — pagination, counts, etc.
   */
  constructor(data, opts = {}) {
    this.success = true;
    this.statusCode = opts.statusCode || 200;
    this.message = opts.message || 'OK';
    this.data = data === undefined ? null : data;
    this.meta = opts.meta || undefined;
    this.timestamp = new Date().toISOString();
  }

  static send(res, data, opts = {}) {
    const body = new ApiResponse(data, opts);
    return res.status(body.statusCode).json(body);
  }

  static ok(res, data, meta) {
    return ApiResponse.send(res, data, { statusCode: 200, meta });
  }

  static created(res, data, message = 'Created') {
    return ApiResponse.send(res, data, { statusCode: 201, message });
  }

  static accepted(res, data, message = 'Accepted') {
    return ApiResponse.send(res, data, { statusCode: 202, message });
  }

  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Paginated response helper — pairs with shared/utils/pagination.js.
   * @param {Array} items
   * @param {{ page, limit, total }} pageInfo
   */
  static paginated(res, items, { page, limit, total }) {
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
    return ApiResponse.send(res, items, {
      statusCode: 200,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }
}

// Convenience middleware — attaches res.ok / res.created / res.paginated.
function attachResponseHelpers(req, res, next) {
  res.ok = (data, meta) => ApiResponse.ok(res, data, meta);
  res.created = (data, message) => ApiResponse.created(res, data, message);
  res.accepted = (data, message) => ApiResponse.accepted(res, data, message);
  res.paginated = (items, pageInfo) => ApiResponse.paginated(res, items, pageInfo);
  res.noContent = () => ApiResponse.noContent(res);
  next();
}

module.exports = { ApiResponse, attachResponseHelpers };