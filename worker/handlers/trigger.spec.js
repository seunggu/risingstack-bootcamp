'use strict';

const redis = require('../../models/redis');

const { CHANNELS } = redis;

describe('Woker "contributions" channel', () => {
  it(`should handle message on the ${CHANNELS.collect.trigger.v1} channel`);
  it(`should fetch repositories from GitHub & send message to the ${CHANNELS.collect.repository.v1} channel`);
});
