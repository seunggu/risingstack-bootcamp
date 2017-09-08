'use strict';

const { expect } = require('chai');
const _ = require('lodash');

const db = require('../db');
const User = require('../user');
const Repository = require('../repository');
const Contribution = require('./contribution');

describe('Contribution', () => {
  let repositoryId;
  let userId;
  let contributionToInsert;
  let userToInsert;
  let repositoryToInsert;

  beforeEach(async () => {
    repositoryId = _.random(1000);
    userId = _.random(1000);
    contributionToInsert = {
      repository: repositoryId,
      user: userId,
      line_count: _.random(1000),
    };

    userToInsert = {
      id: userId,
      login: 'developer',
      avatar_url: 'https://developer.com/avatar.png',
      html_url: 'https://github.com/developer',
      type: 'User',
    };

    repositoryToInsert = {
      id: repositoryId,
      owner: userId,
      full_name: '@risingstack/foo',
      description: 'Very foo package, using bar technologies',
      html_url: 'https://github.com/risingstack/foo',
      language: 'Baz',
      stargazers_count: 123,
    };

    await db(User.tableName)
      .insert(userToInsert);

    await db(Repository.tableName)
      .insert(repositoryToInsert);
  });

  afterEach(async () => {
    await db(Repository.tableName)
      .where({ id: repositoryId })
      .delete();
  });

  describe('.insert', () => {
    it('should insert a new contribution', async () => {
      const contributionReturned = await Contribution.insert(contributionToInsert);
      const contributionInDB = await db(Contribution.tableName)
        .where({ repository: repositoryId, user: userId })
        .first();

      expect(contributionInDB).to.eql(contributionToInsert);
      expect(contributionReturned).to.eql(contributionToInsert);
    });

    it('should validate the input params', async () => {
      delete contributionToInsert.user;
      try {
        await Contribution.insert(contributionToInsert);
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError');
        return;
      }

      throw new Error('Did not validate');
    });
  });

  describe('.insertOrReplace', () => {
    it('should insert the contribution if it does not exist', async () => {
      await Contribution.insertOrReplace(contributionToInsert);
      const contributionInDB = await db(Contribution.tableName)
        .where({ repository: repositoryId, user: userId })
        .first();

      expect(contributionToInsert).to.eql(contributionInDB);
    });

    it('should replace the line_count of an existing contribution', async () => {
      await db(Contribution.tableName)
        .insert(contributionToInsert);

      contributionToInsert.line_count = _.random(1000);
      await Contribution.insertOrReplace(contributionToInsert);
      const contributionInDB = await db(Contribution.tableName)
        .where({ user: userId, repository: repositoryId })
        .first();

      expect({
        repository: repositoryId,
        user: userId,
        line_count: contributionToInsert.line_count,
      }).to.eql(contributionInDB);
    });
  });

  describe('.read', () => {
    it('should insert the contribution if it does not exist', async () => {
      await db(Contribution.tableName)
        .insert(contributionToInsert);

      const expected = [{
        line_count: contributionToInsert.line_count,
        user: userToInsert,
        repository: repositoryToInsert,
      }];

      let result = await Contribution.read({
        repository: {
          id: contributionToInsert.repository,
        },
      });
      expect(result).to.eql(expected);

      result = await Contribution.read({
        repository: {
          full_name: repositoryToInsert.full_name,
        },
      });
      expect(result).to.eql(expected);
    });
  });
});
