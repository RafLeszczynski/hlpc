/**
 * Creates success API response
 * @param {*?} payload
 * @returns {Object}
 */
function createSuccessResponse(payload) {
  return Object.assign(
    { success: true },
    payload ? { payload } : {}
  );
}

/**
 * Creates error API response
 * @param {Error} err
 * @returns {Object}
 */
function createErrorResponse(err) {
  return {
    success: false,
    payload: {
      message: err.message,
      errCode: err.code,
      contrext: err.context
    }
  };
}

module.exports = { createSuccessResponse, createErrorResponse };
