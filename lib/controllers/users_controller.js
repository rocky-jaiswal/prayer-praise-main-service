'use strict';

const Boom = require('boom');

const UsersService = require('./../services/users_service');
const UsersRepo    = require('./../repositories/users_repo');

class UsersController {

  show(request, h) {

    const userId = request.auth.credentials.id;

    return new UsersService(UsersRepo)
      .findUser(userId)
      .catch((err) => Boom.badImplementation(err));
  }

}

module.exports = new UsersController();
