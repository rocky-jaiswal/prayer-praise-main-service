'use strict';

const Boom   = require('boom');

const MessagesRepo    = require('./../repositories/messages_repo');
const UsersRepo       = require('./../repositories/users_repo');
const MessagesService = require('./../services/messages_service');

class SharedMessagesController {

  index(request, h) {

    return new MessagesService(MessagesRepo, UsersRepo)
      .getMessagesSharedToAll()
      .catch((err) => Boom.badImplementation(err));
  }

}

module.exports = new SharedMessagesController();
