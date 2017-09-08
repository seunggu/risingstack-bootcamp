'use strict';

const fp = require('lodash/fp');
const joi = require('joi');

function validatorFactory(schema) {
  return async function validatorMiddleware(ctx, next) {
    try {
      ['params', 'query', 'body']
        .forEach((partToValidate) => {
          const toValidate = ctx.request[partToValidate] || ctx[partToValidate];
          if (schema[partToValidate]) {
            const validateObject = joi.attempt(toValidate, schema[partToValidate].label(partToValidate));
            Object.assign(toValidate, validateObject);
          }
        });

      if (schema.body && ctx.request.body) {
        ctx.request.body = joi.attempt(ctx.request.body, schema.body.label('body'));
      }
    } catch (err) {
      if (!err.isJoi) {
        throw err;
      }

      const errors = fp.compose([
        fp.mapValues(fp.map('message')),
        fp.groupBy('context.key'),
      ])(err.details);

      ctx.status = 400;
      ctx.body = { errors };

      return;
    }

    await next();
  };
}

module.exports = validatorFactory;
