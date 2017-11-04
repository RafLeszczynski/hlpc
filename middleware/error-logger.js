const log = require('pino')();

module.exports = (err, req, res, next) => {
  log[err.httpCode === 400 ? 'warn' : 'error'](err);
  next(err);
};
