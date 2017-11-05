/**
 * Maps options value to type used fo choosing appropriate component
 * @param {*} val
 * @returns {String}
 * @private
 */
function mapValueToType(val) {
  switch (true) {
    case typeof val === 'boolean':
      return 'boolean';
    default:
      return 'text';
  }
}

/**
 * Creates data model for rendering Edit options form
 * @param {Object} options
 * @returns {Array}
 */
export default (options) => {
  return Object
    .keys(options)
    .map(key => ({
      id: key,
      value: options[key],
      type: mapValueToType(options[key])
    }));
}
