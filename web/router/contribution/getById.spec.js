'use strict';

const _ = require('lodash');
const request = require('super-request');
const { expect } = require('chai');

const Contribution = require('../../../models/contribution');
const server = require('../../server');

const url = '/api/v1/repository/:id/contributions';
describe(`GET ${url}`, () => {
  it('should response with 200 when repository exists with contributions', async function () {
    const id = _.random(1000);
    const lineCount = _.random(1000);
    this.sandbox.stub(Contribution, 'read').resolves([{ line_count: lineCount }]);

    const { body } = await request(server.listen())
      .get(url.replace(':id', id))
      .expect(200)
      .json(true)
      .end();

    expect(body).to.eql([{ line_count: lineCount }]);
    expect(Contribution.read).to.have.been.calledWith({ repository: { id } });
  });

  it('should response with 404 when the repository does not exist', async function () {
    const id = _.random(1000);
    this.sandbox.stub(Contribution, 'read').resolves([]);

    await request(server.listen())
      .get(url.replace(':id', id))
      .expect(404)
      .json(true)
      .end();

    expect(Contribution.read).to.have.been.calledWith({ repository: { id } });
  });
});
