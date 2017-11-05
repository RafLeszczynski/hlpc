import React from 'react';
import { FormGroup, Checkbox } from '@auth0/styleguide-react-components';

export default ({ id, label, handleChange, value }) => {
  return (
    <FormGroup>
      <Checkbox
        checked={value}
        onChange={(event) => handleChange(id, !value) }
      >
        {label}
      </Checkbox>
    </FormGroup>
  );
}
