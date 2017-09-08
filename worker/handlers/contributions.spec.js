'use strict';

const redis = require('../../models/redis');

const { CHANNELS } = redis;

describe('Woker "contributions" channel', () => {
  it(`should handle message on the ${CHANNELS.collect.contributions.v1} channel`);
  it('should fetch the contributions from GitHub & save them to the database');
});
