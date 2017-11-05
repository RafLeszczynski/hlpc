import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './containers/App/App';
import Callback from './components/Callback/Callback';
import Auth from './lib/Auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

export default () => (
  <Router history={history} component={App}>
    <div>
      <Route path="/" render={props => <App auth={auth} {...props} />} />
      <Route
        path="/callback"
        render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />;
        }}
      />
    </div>
  </Router>
);
