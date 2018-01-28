'use strict';

const Promise = require('bluebird');
const Sinon   = require('sinon');

const MessagesRepo    = require('../../lib/repositories/messages_repo');
const UsersRepo       = require('../../lib/repositories/users_repo');
const MessagesService = require('../../lib/services/messages_service');
const DB              = require('../../lib/repositories/db');

describe('messages service', () => {

  const userId = 42;
  const normalUserId = 43;
  const user = { id: userId, name: 'foo', role: 'PRAYER_TEAM' };
  const normalUser = { id: normalUserId, name: 'bar', role: '' };

  const messageId = 101;
  const userMessages = [{ id: messageId, user_id: userId }];
  const sharedMessages = [{ id: 102, user_id: normalUserId }];

  const stubs = [];

  const service = new MessagesService(MessagesRepo, UsersRepo);

  beforeAll(() => {

    stubs.push(Sinon.stub(MessagesRepo, 'getAllUserMessages').callsFake((id) => Promise.resolve(id === userId ? userMessages : sharedMessages)));
    stubs.push(Sinon.stub(MessagesRepo, 'getAllSharedMessages').callsFake(() => Promise.resolve(sharedMessages)));
    stubs.push(Sinon.stub(MessagesRepo, 'getMessage').callsFake(() => Promise.resolve(userMessages[0])));
    stubs.push(Sinon.stub(MessagesRepo, 'getMessagesSharedToAll').callsFake(() => Promise.resolve(userMessages.concat(sharedMessages))));
    stubs.push(Sinon.stub(UsersRepo, 'findAll').callsFake(() => Promise.resolve([user, normalUser])));
    stubs.push(Sinon.stub(UsersRepo, 'findUserBy').callsFake((obj) => Promise.resolve(obj.id === userId ? user : normalUser)));
  });

  afterAll((done) => {

    stubs.forEach((s) => s.restore());
    DB.destroy().then(done);
  });

  test('get a message', (done) => {

    service.getMessage(messageId).then((msg) => {

      expect(msg.user_id).toEqual(userId);
      done();
    });
  });

  test('gets all shared messages', (done) => {

    service.getMessagesSharedToAll(userId).then((msgs) => {

      expect(msgs).toEqual(userMessages.concat(sharedMessages));
      done();
    });
  });

  test('prayer team can see all shared messages', (done) => {

    service.getAllUserMessages(userId).then((msgs) => {

      expect(msgs).toEqual(userMessages.concat(sharedMessages));
      done();
    });
  });

  test('normal user can only see their messages', (done) => {

    service.getAllUserMessages(normalUserId).then((msgs) => {

      expect(msgs).toEqual(sharedMessages);
      done();
    });
  });

});
