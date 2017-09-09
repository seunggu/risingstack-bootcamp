'use strict';

const _ = require('lodash');
const { expect } = require('chai');
const request = require('super-request');

const Repository = require('../../../models/repository');
const server = require('../../server');

const url = '/api/v1/repository/:id';
describe(`GET ${url}`, () => {
  it('should response with 200 when the repository exists', async function a() {
    const id = _.random(1000);
    this.sandbox.stub(Repository, 'read').resolves({ id });

    const { body } = await request(server.listen())
      .get(url.replace(':id', id))
      .expect(200)
      .json(true)
      .end();

    expect(body).is.eql({ id });
    expect(Repository.read).to.have.been.calledWith({ id });
  });

  it('should response with 404 when the repository not exist', async function a() {
    const id = _.random(1000);
    this.sandbox.stub(Repository, 'read').resolves(undefined);

    await request(server.listen())
      .get(url.replace(':id', id))
      .expect(404)
      .end();

    expect(Repository.read).to.have.been.calledWith({ id });
  });
});
