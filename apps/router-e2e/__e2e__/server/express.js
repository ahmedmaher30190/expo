#!/usr/bin/env node

const path = require('path');
const { createRequestHandler } = require('@expo/server/build/vendor/express');

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const BUILD_DIR = path.join(__dirname, '../../dist-server');

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

process.env.NODE_ENV = 'production';

app.use(
  // Prevent access to expo functions as these may
  // contain sensitive information.
  [/^\/_expo\/functions($|\/)/, '/'],
  express.static(BUILD_DIR, {
    maxAge: '1h',
    extensions: ['html'],
  })
);

app.use(morgan('tiny'));

app.all(
  '*',
  createRequestHandler({
    build: BUILD_DIR,
  })
);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
