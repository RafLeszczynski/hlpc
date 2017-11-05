import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import Auth0Lock from 'auth0-lock';
import { AUTH_CONFIG } from '../config/constants';

class Preview extends Component {
  componentDidMount() {
    this.createLockWidget();
  }

  componentDidUpdate(prevProps) {
    if (!deepEqual(prevProps.editOptions, this.props.editOptions)) {
      this.removeLockWidget();
      this.createLockWidget();
    }
  }

  /**
   * Creates Auth0 Lock widget based on current edit options state
   */
  createLockWidget() {
    new Auth0Lock(
      AUTH_CONFIG.clientId,
      AUTH_CONFIG.domain,
      Object.assign(
        {
          rememberLastLogin: false,
          closable: false,
          container: 'preview'
        },
        this.mapEditOptionsToLockOptions()
      )
    ).show();
  }

  /**
   * Removes Auth0 lock widget from DOM
   * This is oversimplified operation just for MVP.
   * For production use we should make sure that memory used for lock widget is correctly cleared
   */
  removeLockWidget() {
    this.lockWrapper.innerHTML = '';
  }

  /**
   * Maps edit options to lock widget constructor options
   * @returns {Object}
   */
  mapEditOptionsToLockOptions() {
    const { editOptions } = this.props;

    return {
      allowShowPassword: editOptions.allowShowPassword,
      allowForgotPassword: editOptions.allowForgotPassword,
      allowSignUp: editOptions.allowSignUp,
      theme: {
        primaryColor: editOptions.primaryColor,
        logo: editOptions.logo || null,
        labeledSubmitButton: editOptions.labeledSubmitButton
      }
    };
  }

  render() {
    return <div id="preview" ref={(lockWrapper) => { this.lockWrapper = lockWrapper; }} />;
  }
}

Preview.propTypes = {
  editOptions: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])).isRequired
};

export default Preview;
