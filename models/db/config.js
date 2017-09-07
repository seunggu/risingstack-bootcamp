'use strict';

const joi = require('joi');
const { parse } = require('pg-connection-string');

const envVarsSchema = joi.object({
  PG_URI: joi.string().uri({ scheme: 'postgres' }).required(),
  PG_SSL_CA: joi.string(),
  PG_SSL_KEY: joi.string(),
  PG_SSL_CERT: joi.string(),
  PG_SSL_ALLOW_UNAUTHORIZED: joi.boolean().truthy('true').falsy('false').default(true),
  PG_POOL_MIN: joi.number().default(1),
  PG_POOL_MAX: joi.number().default(20),
}).unknown()
  .required();

const envVars = joi.attempt(process.env, envVarsSchema);

const config = {
  client: 'pg',
  connection: parse(envVars.PG_URI),
  pool: {
    min: envVars.PG_POOL_MIN,
    max: envVars.PG_POOL_MAX,
  },
};

module.exports = config;
