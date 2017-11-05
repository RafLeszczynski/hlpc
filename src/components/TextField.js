import React from 'react';
import { FormGroup, ControlLabel, FormControl } from '@auth0/styleguide-react-components';

export default ({ id, label, handleChange, value }) => {
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <FormControl
        defaultValue={value}
        onBlur={(event) => handleChange(id, event.target.value)}
      />
    </FormGroup>
  );
}
