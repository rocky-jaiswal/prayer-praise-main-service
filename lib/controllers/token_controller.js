'use strict';

const Boom = require('boom');

const AuthService   = require('./../services/auth_service');
const Token         = require('./../services/token');
const MessagesRepo  = require('./../repositories/messages_repo');
const UsersRepo     = require('./../repositories/users_repo');

class TokenController {

  create(request, h) {

    return new AuthService(MessagesRepo, UsersRepo)
      .fetchOrCreateUser(request.payload.accessToken)
      .then((user) => {

        return { token: Token.generate(user.id) };
      })
      .catch((err) => Boom.badImplementation(err));
  }

}

module.exports = new TokenController();
