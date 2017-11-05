import React from 'react';
import { Navbar, Button } from '@auth0/styleguide-react-components';

export default ({ isAuthenticated, login, logout, tenantName }) => (
  <Navbar className="no-border-radius no-bottom-margin" fluid>
    <Navbar.Header className="no-float">
      <Navbar.Brand>
        Hosted Login Pages Configurator -
        <strong> {tenantName}</strong>
      </Navbar.Brand>
      {
        !isAuthenticated() && (
          <Button
            bsStyle="primary"
            className="btn-margin float-right"
            onClick={login}
          >
            Log In
          </Button>
        )
      }
      {
        isAuthenticated() && (
          <Button
            bsStyle="primary"
            className="btn-margin float-right"
            onClick={logout}
          >
            Log Out
          </Button>
        )
      }
    </Navbar.Header>
  </Navbar>
);
