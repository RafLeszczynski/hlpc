import React from 'react';
import PropTypes from 'prop-types';

const SwitchField = ({ id, label, handleChange, value }) => (
  <div className="ui-switch">
    <strong className="color-black">{label}</strong>
    <input
      name={id}
      type="checkbox"
      checked={value}
      onChange={handleChange}
    />
    <label htmlFor={id} className="status" />
  </div>
);


SwitchField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired
};

export default SwitchField;
