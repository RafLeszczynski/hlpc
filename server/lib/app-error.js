class AppError extends Error {
  /**
   * Creates new instance of AppError
   * @param {String} msg
   * @param {Number?} httpCode
   * @param {String?} errCode
   * @param {Object?} context
   */
  constructor(msg, httpCode, errCode, context) {
    super(msg || 'Unexpected error happen');

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.httpCode = httpCode || 500;
    this.code = errCode || 'ERR_UNEXPECTED_SERVER_ERROR';
    this.context = context || {};
  }

  toString() {
    return [
      `${this.name}: ${this.message}`,
      `code: ${this.code}`,
      `http status code: ${this.httpCode}`,
      `context: ${JSON.stringify(this.context)}`
    ].join(', ');
  }
}

module.exports = AppError;
