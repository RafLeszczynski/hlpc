if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load(); // eslint-disable-line global-require
}

const path = require('path');
const express = require('express');
const log = require('pino')();
const bodyParser = require('body-parser');
const tokenService = require('./server/lib/token-service');
const errorLoggerMiddleware = require('./server/middleware/error-logger');
const errorHandlerMiddleware = require('./server/middleware/error-handler');
const { getLoginPageDataMiddleware, updateLoginPageDataMiddleware } = require('./server/middleware/api');

const app = express();
const port = process.env.PORT_SERVER || 3001;

app.use(express.static(path.resolve(__dirname, './build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO: secure end points
app.get('/api/login-page-data', getLoginPageDataMiddleware);
app.post('/api/login-page-data', updateLoginPageDataMiddleware);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build/index.html'));
});

app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);

// get JWT token for using Auth0 Management API before the app starts
tokenService.requestToken()
  .then(() => app.listen(port, () => log.info(`Listening on port ${port}!`)))
  // if requestToken rejects promise, process will exit
  // simple logging to know what happen, should be improved for production use
  .catch(err => log.error(err));

