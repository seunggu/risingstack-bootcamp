'use strict';

const redis = require('../../models/redis');

const { CHANNELS } = redis;

describe('Worker "repository" channel', () => {
  it(`should handle message on the ${CHANNELS.collect.repository.v1} channel`);
  it(`should fetch repositories from GitHub & send message to the ${CHANNELS.collect.contributions.v1} channel`);
});
