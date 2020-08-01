'use strict'

const Boom = require('boom')

const AuthService = require('../services/auth_service')
const Token = require('../services/token')

const messagesRepo = require('../repositories/messages_repo')
const usersRepo = require('../repositories/users_repo')

const authService = new AuthService(messagesRepo, usersRepo)

class SessionController {
  async create(request, _h) {
    try {
      const user = await authService.fetchOrCreateUser(
        request.payload.accessToken
      )
      return { token: Token.generate(user.id) }
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new SessionController()
