const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const cheerio = require('cheerio');
const log = require('pino')();
const schema = require('../schemas/edit-options.schema.json');
const defaultEditOptions = require('../templates/default-lock-widget-options.json');

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const optionsScriptId = 'auth0HLPCOptions';
const loginTemplate = fs.readFileSync(
  path.join(__dirname, '../templates/login-template.html'),
  'utf8'
);


/**
 * Extract edit options from login page HTML string
 * @param {String} html
 * @returns {Object|null}
 */
function extractEditOptionsFromHTML(html) {
  const $ = cheerio.load(html);
  const optionsStr = $(`#${optionsScriptId}`).html();

  try {
    return JSON.parse(optionsStr);
  } catch (e) {
    log.warn('Failed parsing edit options JSON', { optionsStr });
    return null;
  }
}

/**
 * Injects edit options to login page template and returns it
 * @param {Object} options
 * @returns {String}
 */
function injectEditOptionsToHTML(options) {
  return loginTemplate.replace('{{HLPC_OPTIONS_JSON}}', JSON.stringify(options));
}

/**
 * Validates edit options agains schema and returns object with passed options and validation result
 * @param {Object} options
 * @returns {Object}
 */
function validateEditOptions(options) {
  const valid = validate(options);

  return Object.assign(
    { options, valid },
    !valid ? { errors: validate.errors } : {}
  );
}

/**
 * Returns default edit options
 * @returns {Object}
 */
function getDefaultEditOptions() {
  return defaultEditOptions;
}

module.exports = {
  extractEditOptionsFromHTML,
  injectEditOptionsToHTML,
  validateEditOptions,
  getDefaultEditOptions
};
