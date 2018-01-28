'use strict';

const Promise = require('bluebird');
const Sinon   = require('sinon');

const Server  = require('../../');

const MessagesRepo = require('../../lib/repositories/messages_repo');
const UsersRepo    = require('../../lib/repositories/users_repo');
const DB           = require('../../lib/repositories/db');

describe('messages controller', () => {

  const userId = 42;
  const messageId = 101;
  const role = 'PRAYER_TEAM';
  const user = { id: userId, name: 'foo', role };
  const messages = [{ id: messageId, user_id: userId }];
  const stubs = [];

  beforeAll((done) => {

    stubs.push(Sinon.stub(MessagesRepo, 'getMessagesSharedToAll').callsFake(() => Promise.resolve(messages)));
    stubs.push(Sinon.stub(UsersRepo, 'findAll').callsFake(() => Promise.resolve([user])));
    Server.on('start', done);
  });

  afterAll((done) => {

    stubs.forEach((s) => s.restore());
    Server.on('stop', () => {

      DB.destroy()
        .then(() => done());
    });
    Server.stop();
  });

  describe('get all messages', () => {

    const options = {
      method: 'GET',
      url: '/sharedmessages'
    };

    test('fetch all messages which are shared', (done) => {

      Server.inject(options, (response) => {

        expect(response.statusCode).toBe(200);
        expect(response.result).toEqual(messages);
        done();
      });
    });
  });

});
