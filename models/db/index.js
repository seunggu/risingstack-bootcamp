'use strict';

const knex = require('knex');

const config = require('./config');

const db = knex(config);

function healthCheck() {
  return db.select(1).timeout(config.healthCheck.timeout);
}

module.exports = Object.assign(db, {
  healthCheck,
});
