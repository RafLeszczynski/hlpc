import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@auth0/styleguide-react-components';
import createEditFormDataModel from '../lib/edit-options-data-decorator';
import formComponents from '../helpers/form-components-mapper';

const EditOptionsForm = ({ editOptions, update, save, isSaving }) => (
  <form className="top-padding">
    {
      createEditFormDataModel(editOptions).map((option) => {
        const FormComponent = formComponents[option.type];

        return (
          <FormComponent
            key={option.id}
            handleChange={update}
            {...option}
          />
        );
      })
    }

    <Button
      bsStyle="primary"
      className="btn-margin btn-success"
      bsSize="large"
      block
      disabled={isSaving}
      onClick={save}
    >
      {!isSaving ? 'Save Changes' : 'Saving...'}
    </Button>
  </form>
);

EditOptionsForm.propTypes = {
  editOptions: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])).isRequired,
  update: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired
};

export default EditOptionsForm;
