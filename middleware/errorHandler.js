const { errorResponse } = require('../utils/apiResponse');

/**
 * Global Express Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name}: ${err.message}`);

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, `Resource not found with id: ${err.value}`, 404);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, messages.join(', '), 400);
  }

  return errorResponse(res, err.message || 'Internal Server Error', err.statusCode || 500);
};

module.exports = errorHandler;
