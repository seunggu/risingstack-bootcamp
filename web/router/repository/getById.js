'use strict';

const joi = require('joi');
const compose = require('koa-compose');

const Repository = require('../../../models/repository');
const middleware = require('../../middleware');

const paramsSchema = joi.object({
  id: joi.number().integer().required(),
}).required();

async function getById(ctx) {
  const { id } = ctx.params;
  const result = await Repository.read({ id });
  if (!result) {
    ctx.status = 404;
    return;
  }

  ctx.body = result;
}

module.exports = compose([
  middleware.validator({
    params: paramsSchema,
  }),
  getById,
]);
