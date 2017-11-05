import React, { Component } from 'react';
import { Grid, Row, Col } from '@auth0/styleguide-react-components';
import { fetchLoginPageData, updateLoginPageData } from '../../lib/api-client'
import AppNavbar from '../../components/AppNavbar';
import EditOptionsForm from "../../components/EditOptionsForm";
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
      savingEditOptions: false
    };

    this.handleEditOptionsChange = this.handleEditOptionsChange.bind(this);
    this.handleEditOptionsSave = this.handleEditOptionsSave.bind(this);
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;

    isAuthenticated() && this.loadLoginPageData();
  }

  componentDidUpdate() {
    const { isAuthenticated } = this.props.auth;
    const { editOptions, loadingEditOptions, error } = this.state;

    isAuthenticated() && !editOptions && !loadingEditOptions && !error && this.loadLoginPageData();
  }

  /**
   * Loads login page edit options from API adds them to state
   */
  loadLoginPageData() {
    const { getAccessToken } = this.props.auth;

    this.setState({ loadingEditOptions: true });

    fetchLoginPageData(getAccessToken())
      .then(editOptions => this.setState({ editOptions, loadingEditOptions: false }))
      .catch(err => this.setState({ error: err.message, loadingEditOptions: false }));
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

  /**
   * Handles state change - method passed to form elements as onChange handler
   * @param {String} key
   * @param {String|Boolean} value
   */
  handleEditOptionsChange(key, value) {
    this.setState({
      editOptions: Object.assign({}, this.state.editOptions, {[key]: value })
    });
  }

  /**
   * Handles save edit options action
   */
  handleEditOptionsSave() {
    const { isAuthenticated } = this.props.auth;
    const { editOptions, savingEditOptions } = this.state;

    isAuthenticated() && editOptions && !savingEditOptions && this.updateLoginPageData();
  }

  render() {
    const { isAuthenticated, login, logout } = this.props.auth;

    return (
      <div>
        <AppNavbar
          isAuthenticated={isAuthenticated}
          login={login}
          logout={logout}
          tenantName={AUTH_CONFIG.domain} />
        {
          isAuthenticated() && this.state.editOptions && (
            <Grid className="full-page">
              <Row className="show-grid full-height">
                <Col lg={4} className="full-height">
                  <EditOptionsForm
                    editOptions={this.state.editOptions}
                    update={this.handleEditOptionsChange}
                    save={this.handleEditOptionsSave}
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
