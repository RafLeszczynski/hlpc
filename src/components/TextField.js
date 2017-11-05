import React from 'react';
import { FormGroup, ControlLabel, FormControl } from '@auth0/styleguide-react-components';

export default ({ id, label, placeholder, handleChange, value }) => {
  return (
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
};
