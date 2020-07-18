'use strict'

const Boom = require('boom')

const AuthService = require('../services/auth_service')
const Token = require('../services/token')
const MessagesRepo = require('../repositories/messages_repo')
const UsersRepo = require('../repositories/users_repo')

class SessionController {
  async create(request, _h) {
    try {
      const user = await new AuthService(
        MessagesRepo,
        UsersRepo
      ).fetchOrCreateUser(request.payload.accessToken)
      return { token: Token.generate(user.id) }
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new SessionController()