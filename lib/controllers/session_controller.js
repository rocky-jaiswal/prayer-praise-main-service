'use strict'

const Boom = require('@hapi/boom')

const Db = require('./../repositories/db')
const AuthService = require('../services/auth_service')
const MessagesRepo = require('../repositories/messages_repo')
const UsersRepo = require('../repositories/users_repo')
const tokenService = require('../services/token_service')

const messagesRepo = new MessagesRepo(Db)
const usersRepo = new UsersRepo(Db)
const authService = new AuthService(messagesRepo, usersRepo)

class SessionController {
  async create(request, _h) {
    try {
      const user = await authService.fetchOrCreateUser(
        request.payload.accessToken
      )
      return { token: tokenService.generate(user.id) }
    } catch (err) {
      console.error(JSON.stringify(err))
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new SessionController()
