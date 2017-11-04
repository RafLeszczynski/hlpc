const Ajv = require('ajv');
const rp = require('request-promise-native');
const log = require('pino')();
const schema = require('../schemas/token-response.schema.json');
const AppError = require('./app-error');

const tokenRequestOptions = {
  method: 'POST',
  url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
  headers: { 'content-type': 'application/json' },
  json: true,
  body: {
    client_id: process.env.AUTH0_SERVICE_CLIENT_ID,
    client_secret: process.env.AUTH0_SERVICE_CLIENT_SECRET,
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    grant_type: 'client_credentials'
  }
};
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const schemaValidationErrMsg = 'Token API response failed schema validation';

// placeholder for storing token in memory
// for production use I'd prefer to use Redis or something similar
let tokenStore = {};

/**
 * Validates Token API response
 * @param {Object} apiResponseObject
 * @returns {Object}
 * @throws {Error} - if validation fails
 * @private
 */
function validateTokenResponse(apiResponseObject) {
  if (!validate(apiResponseObject)) {
    log.error(schemaValidationErrMsg, { apiResponseObject, errors: validate.errors });
    throw new Error(schemaValidationErrMsg);
  }

  return apiResponseObject;
}

/**
 * Saves JWT in memory together with it expire time based on given timestamp and expire time
 * @param {number} timestamp
 * @param {Object} apiResponseObject
 * @private
 */
function saveToken(timestamp, apiResponseObject) {
  tokenStore = {
    token: `${apiResponseObject.token_type} ${apiResponseObject.access_token}`,
    tokenExpirationTimestamp: timestamp + (apiResponseObject.expires_in * 1000)
  };
}

/**
 * Checks if token is expired or not
 * @returns {Boolean}
 * @private
 */
function validateTokenExpiry() {
  return tokenStore.tokenExpirationTimestamp &&
    (tokenStore.tokenExpirationTimestamp - Date.now()) > 0;
}

/**
 * Calls auth0 oauth/token API endpoint for the token
 * @returns {Promise}
 */
function requestToken() {
  const now = Date.now();

  log.info('Requesting new token');

  return new Promise((resolve, reject) => {
    rp(tokenRequestOptions)
      .then(validateTokenResponse)
      .then(saveToken.bind(null, now))
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

/**
 * Gets token from store, if expired requests a new one
 * @returns {Promise}
 */
function getToken() {
  return new Promise((resolve, reject) => {
    if (validateTokenExpiry()) {
      resolve(tokenStore.token);
      return;
    }

    requestToken()
      .then(() => resolve(tokenStore.token))
      .catch((err) => {
        reject(
          new AppError(
            err.error,
            500,
            'ERR_GET_TOKEN',
            { details: err.error_description }
          )
        );
      });
  });
}

module.exports = { requestToken, getToken };
