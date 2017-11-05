import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from '@auth0/styleguide-react-components';

const TextField = ({ id, label, placeholder, handleChange, value }) => (
  <FormGroup>
    <ControlLabel>{label}</ControlLabel>
    <FormControl
      name={id}
      defaultValue={value}
      placeholder={placeholder}
      onBlur={handleChange}
    />
  </FormGroup>
);


TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default TextField;
