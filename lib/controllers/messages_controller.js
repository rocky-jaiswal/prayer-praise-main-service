'use strict';

const Boom   = require('boom');

const MessagesRepo    = require('./../repositories/messages_repo');
const UsersRepo       = require('./../repositories/users_repo');
const MessagesService = require('./../services/messages_service');
const UsersService    = require('./../services/users_service');
const AuthService     = require('./../services/auth_service');

class MessagesController {

  index(request, h) {

    const userId = request.auth.credentials.id;

    return new MessagesService(MessagesRepo, UsersRepo)
      .getAllUserMessages(userId)
      .catch((err) => Boom.badImplementation(err));
  }

  show(request, h) {

    const userId = request.auth.credentials.id;
    const messagesService = new MessagesService(MessagesRepo, UsersRepo);
    const authService = new AuthService(MessagesRepo, UsersRepo);

    return authService
      .checkAuthorization(userId, request.params.id)
      .then(() => messagesService.getMessage(request.params.id))
      .catch((err) => Boom.badImplementation(err));
  }

  delete(request, h) {

    const userId = request.auth.credentials.id;
    const messagesService = new MessagesService(MessagesRepo, UsersRepo);
    const authService = new AuthService(MessagesRepo, UsersRepo);

    return authService
      .checkAuthorization(userId, request.params.id)
      .then(() => messagesService.deleteUserMessage(request.params.id))
      .then(() => messagesService.getAllUserMessages(userId))
      .catch((err) => Boom.badImplementation(err)); // TODO: send 4xx in case of bad auth
  }

  update(request, h) {

    const userId = request.auth.credentials.id;
    const messagesService = new MessagesService(MessagesRepo, UsersRepo);
    const authService = new AuthService(MessagesRepo, UsersRepo);

    return authService
      .checkAuthorization(userId, request.payload.message.id)
      .then(() => messagesService.updateUserMessage(request.payload.message))
      .then(() => ({}))
      .catch((err) => Boom.badImplementation(err)); // TODO: send 4xx in case of bad auth
  }

  create(request, h) {

    const messagesService = new MessagesService(MessagesRepo, UsersRepo);

    return new UsersService(UsersRepo)
      .findAuthorizedUser(request.headers.authorization)
      .then((user) => messagesService.createMessageForUser(user.id, request.payload.message))
      .catch((err) => Boom.badImplementation(err));
  }

}

module.exports = new MessagesController();
