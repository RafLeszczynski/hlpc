import { editOptionsMessages } from '../config/messages';

const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

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
    case hexColorPattern.test(val):
      return 'color';
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
      label: editOptionsMessages[key],
      placeholder: editOptionsMessages[`${key}Placeholder`],
      type: mapValueToType(options[key])
    }));
};
