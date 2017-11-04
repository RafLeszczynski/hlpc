const log = require('pino')();
const tokenService = require('../lib/token-service');
const apiClient = require('../lib/management-api-client');
const editOptionsHelper = require('../lib/edit-options-helper');
const AppError = require('../lib/app-error');
const apiResponseBuilder = require('../lib/api-response-builder');

/**
 * Express middleware for get login page data route
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function getLoginPageDataMiddleware(req, res, next) {
  log.info('Requesting login page data');

  tokenService.getToken()
    .then(apiClient.getLoginPageHTML)
    .then(editOptionsHelper.extractEditOptionsFromHTML)
    .then(editOptionsHelper.validateEditOptions)
    // this is super simplified approach
    // with assumption that if options
    //     - doesn't exist in HTML
    //     - failed to parse
    //     - failed validation
    // default options will be used
    // this could cause overwriting custom HTML template created with code editor in dashboard
    // should be changed / improved before production release
    .then(({ options, valid }) =>
      (valid ? options : editOptionsHelper.getDefaultEditOptions()))
    .then(editOptions => res.json(apiResponseBuilder.createSuccessResponse(editOptions)))
    .catch(err => next(err));
}

/**
 * Express middleware for update login page data route
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function updateLoginPageDataMiddleware(req, res, next) {
  log.info('Updating login page template');

  const { editOptions } = req.body;

  if (!editOptions) {
    next(
      new AppError(
        'Edit options missing',
        400,
        'ERR_EDIT_OPTIONS_MISSING',
        { requestBody: req.body }
      )
    );
    return;
  }

  const validationResult = editOptionsHelper.validateEditOptions(editOptions);

  if (!validationResult.valid) {
    next(
      new AppError(
        'Edit options validation failed',
        400,
        'ERR_INVALID_EDIT_OPTIONS',
        validationResult
      )
    );
    return;
  }

  tokenService.getToken()
    .then(
      apiClient.updateLoginPageHTML.bind(
        null,
        editOptionsHelper.injectEditOptionsToHTML(editOptions)
      )
    )
    .then(() => res.json(apiResponseBuilder.createSuccessResponse()))
    .catch(err => next(err));
}

module.exports = { getLoginPageDataMiddleware, updateLoginPageDataMiddleware };
