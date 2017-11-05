import React, { Component } from 'react';
import { Grid, Row, Col, Well } from '@auth0/styleguide-react-components';
import { fetchLoginPageData, updateLoginPageData } from '../../lib/api-client';
import AppNavbar from '../../components/AppNavbar';
import EditOptionsForm from '../../components/EditOptionsForm';
import Preview from '../Preview';
import { AUTH_CONFIG } from '../../config/constants';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editOptions: null,
      error: null,
      loadingEditOptions: false,
      loadingEditOptionsFailed: false,
      savingEditOptions: false
    };

    this.handleEditOptionsChange = this.handleEditOptionsChange.bind(this);
    this.handleEditOptionsSave = this.handleEditOptionsSave.bind(this);
  }

  componentDidMount() {
    const { clientHasWriteAccess } = this.props.auth;

    clientHasWriteAccess() && this.loadLoginPageData();
  }

  componentDidUpdate() {
    const { clientHasWriteAccess } = this.props.auth;

    clientHasWriteAccess() &&
      this.shouldLoadLoginPageData() &&
      this.loadLoginPageData();
  }

  /**
   * Helper method to check if request for login options should be made
   * based on current state
   * @returns {Boolean}
   */
  shouldLoadLoginPageData() {
    const { editOptions, loadingEditOptions, loadingEditOptionsFailed } = this.state;

    return !editOptions && !loadingEditOptions && !loadingEditOptionsFailed;
  }

  /**
   * Loads login page edit options from API adds them to state
   */
  loadLoginPageData() {
    const { getAccessToken } = this.props.auth;

    this.setState({ loadingEditOptions: true });

    fetchLoginPageData(getAccessToken())
      .then(editOptions => this.setState({ editOptions, loadingEditOptions: false }))
      .catch(err => this.setState({
        error: err.message,
        loadingEditOptions: false,
        loadingEditOptionsFailed: true
      }));
  }

  /**
   * Handles state change - method passed to form elements as onChange handler
   * @param {Event} event
   */
  handleEditOptionsChange(event) {
    const { type, name, checked, value } = event.target;

    this.setState({
      editOptions: Object.assign(
        {},
        this.state.editOptions,
        { [name]: type === 'checkbox' ? checked : value })
    });
  }

  /**
   * Handles save edit options action
   */
  handleEditOptionsSave() {
    const { clientHasWriteAccess } = this.props.auth;

    clientHasWriteAccess() &&
      this.shouldUpdateLoginPageData() &&
      this.updateLoginPageData();
  }

  /**
   * Helper method to check if request to update login options should be made
   * based on current state
   * @returns {Boolean}
   */
  shouldUpdateLoginPageData() {
    const { editOptions, savingEditOptions } = this.state;

    return !!editOptions && !savingEditOptions;
  }

  /**
   * Persists edit options changes to
   */
  updateLoginPageData() {
    const { getAccessToken } = this.props.auth;

    this.setState({ savingEditOptions: true });
    updateLoginPageData(getAccessToken(), this.state.editOptions)
      .then(() => this.setState({ savingEditOptions: false }))
      .catch(err => this.setState({ error: err.message, savingEditOptions: false }));
  }

  render() {
    const { isAuthenticated, clientHasWriteAccess, userHasScopes, login, logout } = this.props.auth;

    return (
      <div>
        <AppNavbar
          isAuthenticated={isAuthenticated}
          login={login}
          logout={logout}
          tenantName={AUTH_CONFIG.domain}
        />

        <div className="full-page center-content">
          { !isAuthenticated() && (<Well>Please login in</Well>) }
          {
            isAuthenticated() && !userHasScopes([AUTH_CONFIG.editScope]) && (
              <Well>
                Unfortunately you do not have the appropriate credentials to use this app.
                {' '}
                Please contact with the administrator.
              </Well>
            )
          }
        </div>

        {
          clientHasWriteAccess() && this.state.editOptions && (
            <Grid className="full-page">
              <Row className="show-grid full-height">
                <Col lg={4} className="full-height">
                  <EditOptionsForm
                    editOptions={this.state.editOptions}
                    update={this.handleEditOptionsChange}
                    save={this.handleEditOptionsSave}
                    isSaving={this.state.savingEditOptions}
                  />
                </Col>
                <Col lg={8} className="preview-bg full-height center-content">
                  <Preview editOptions={this.state.editOptions}/>
                </Col>
              </Row>
            </Grid>
          )
        }
      </div>
    );
  }
}

export default App;
