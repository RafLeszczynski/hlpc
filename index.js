if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load(); // eslint-disable-line global-require
}

const path = require('path');
const express = require('express');
const log = require('pino')();
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const tokenService = require('./server/lib/token-service');
const errorLoggerMiddleware = require('./server/middleware/error-logger');
const errorHandlerMiddleware = require('./server/middleware/error-handler');
const { getLoginPageDataMiddleware, updateLoginPageDataMiddleware } = require('./server/middleware/api');

const fs = require('fs');
fs.stat(path.resolve(__dirname, './build/index.html'), (err, stats) => {
  if (err) {
    log.error(err);
  } else {
    log.info(stats);
  }
});

const app = express();
const port = process.env.PORT_SERVER || 3001;

const checkJwt = jwt({
  // Dynamically provide a signing key based on
  // the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz([process.env.AUTH0_HLPC_EDIT_SCOPE]);

app.use(express.static(path.resolve(__dirname, './build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/login-page-data', checkJwt, checkScopes, getLoginPageDataMiddleware);
app.post('/api/login-page-data', checkJwt, checkScopes, updateLoginPageDataMiddleware);

// For the purpose of easier MVP deployment on Heroku (free instance => 1 web dyno)
// I decided to host from single app
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'));
  });
}

app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);

// get JWT token for using Auth0 Management API before the app starts
tokenService.requestToken()
  .then(() => app.listen(port, () => log.info(`Listening on port ${port}!`)))
  // if requestToken rejects promise, process will exit
  // simple logging to know what happen, should be improved for production use
  .catch(err => log.error(err));

