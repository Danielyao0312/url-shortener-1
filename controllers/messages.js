'use strict';

const send = require('koa-send');
const path = require('path');


module.exports.home = function *home() {
  yield send(this, 'index.html', { root: path.join(__dirname, '../views') });
};
