const rp = require('request-promise-native');
const AppError = require('./app-error');

const clientAPIendPoint = `https://${process.env.AUTH0_DOMAIN}/api/v2/clients/${process.env.AUTH0_GLOBAL_CLIENT_ID}`;

/**
 * Creates request headers object with passed JWT token for authorization
 * @param {String} token
 * @returns {Object}
 * @private
 */
function setHeaders(token) {
  return {
    'content-type': 'application/json',
    authorization: token
  };
}

/**
 * Sends request to Auth0 Management API to get login page HTML for Global client
 * @param {String} token
 * @returns {Promise}
 */
function getLoginPageHTML(token) {
  return new Promise((resolve, reject) => {
    rp({
      method: 'GET',
      url: clientAPIendPoint,
      headers: setHeaders(token),
      qs: {
        fields: 'custom_login_page',
        include_fields: true
      },
      json: true
    })
      .then(resp => resolve(resp.custom_login_page))
      .catch(err => reject(
        new AppError(
          err.message,
          err.statusCode,
          err.code,
          { token }
        )
      ));
  });
}

/**
 * Sends request to Auth0 Management API to update login page HTML for Global client
 * @param {String} newHtml
 * @param {String} token
 * @returns {Promise}
 */
function updateLoginPageHTML(newHtml, token) {
  return new Promise((resolve, reject) => {
    rp({
      method: 'PATCH',
      url: clientAPIendPoint,
      headers: setHeaders(token),
      body: {
        custom_login_page: newHtml,
        custom_login_page_on: true // to make sure it will be enabled
      },
      json: true
    })
      .then(resp => resolve(resp))
      .catch(err => reject(
        new AppError(
          err.message,
          err.statusCode,
          err.code,
          { newHtml, token }
        )
      ));
  });
}

module.exports = { getLoginPageHTML, updateLoginPageHTML };
