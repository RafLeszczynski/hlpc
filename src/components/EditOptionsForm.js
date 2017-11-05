import React from 'react';
import createEditFormDataModel from '../lib/edit-options-data-decorator';
import formComponents from '../helpers/form-components-mapper';
import { Button } from '@auth0/styleguide-react-components';


export default ({ editOptions, update, save }) => (
  <form>
    {
      createEditFormDataModel(editOptions).map((option) => {
        const FormComponent = formComponents[option.type];

        return <FormComponent
          key={option.id}
          label={option.id}
          handleChange={update}
          {...option}
        />
      })
    }
    <Button
      bsStyle="primary"
      className="btn-margin btn-success"
      onClick={save}
    >
      Save Changes
    </Button>
  </form>
)
