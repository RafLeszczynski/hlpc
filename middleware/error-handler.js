const apiResponseBuilder = require('../lib/api-response-builder');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.httpCode || 500)
    .json(apiResponseBuilder.createErrorResponse(err));
};
