if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load(); // eslint-disable-line global-require
}

const express = require('express');
const log = require('pino')();
const bodyParser = require('body-parser');
const errorLoggerMiddleware = require('./middleware/error-logger');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => log.info('Listening on port 3000!'));

