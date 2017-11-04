import React, { Component } from 'react';
import { Grid, Row, Col } from '@auth0/styleguide-react-components';
import { fetchLoginPageData } from '../../lib/api-client'
import AppNavbar from '../../components/AppNavbar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editOptions: null,
      error: null,
      loadingEditOptions: false
    };
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;

    isAuthenticated() && this.loadLoginPageData();
  }

  componentDidUpdate() {
    const { isAuthenticated } = this.props.auth;
    const { editOptions, loadingEditOptions } = this.state;

    isAuthenticated() && !editOptions && !loadingEditOptions && this.loadLoginPageData();
  }

  loadLoginPageData() {
    const { getAccessToken } = this.props.auth;

    this.setState({ loadingEditOptions: true });

    fetchLoginPageData(getAccessToken())
      .then(resp => this.setState({ editOptions: resp.data, loadingEditOptions: false }))
      .catch(err => this.setState({ error: err.message, loadingEditOptions: false }));
  }

  createEditControllsDataModel(options) {
    return Object.keys(options).map(key => ({ key, val: options[key], type: typeof options[key]}));
  }

  render() {
    const { isAuthenticated, login, logout } = this.props.auth;

    return (
      <div>
        <AppNavbar isAuthenticated={isAuthenticated} login={login} logout={logout} />
        {
          isAuthenticated() && this.state.editOptions && (
            <Grid className="full-page">
              <Row className="show-grid full-height">
                <Col lg={4} className="full-height">{JSON.stringify(this.state.editOptions)}</Col>
                <Col lg={8} className="preview-bg full-height">Preview</Col>
              </Row>
            </Grid>
          )
        }
      </div>
    );
  }
}

export default App;
