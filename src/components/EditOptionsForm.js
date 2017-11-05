import React from 'react';
import { Button } from '@auth0/styleguide-react-components';
import createEditFormDataModel from '../lib/edit-options-data-decorator';
import formComponents from '../helpers/form-components-mapper';

export default ({ editOptions, update, save, isSaving }) => (
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
