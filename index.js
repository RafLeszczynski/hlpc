if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load(); // eslint-disable-line global-require
}

const express = require('express');
const log = require('pino')();
const bodyParser = require('body-parser');
const tokenService = require('./lib/token-service');
const errorLoggerMiddleware = require('./middleware/error-logger');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);

// get JWT token for using Auth0 Management API before the app starts
tokenService.requestToken()
  .then(() => app.listen(port, () => log.info(`Listening on port ${port}!`)))
  // if requestToken rejects promise, process will exit
  // simple logging to know what happen, should be improved for production use
  .catch(err => log.error(err));

