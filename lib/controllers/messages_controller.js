'use strict'

const Boom = require('boom')

const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')
const MessagesService = require('./../services/messages_service')
const UsersService = require('./../services/users_service')
const AuthService = require('./../services/auth_service')

class MessagesController {
  async index(request, h) {
    const userId = request.auth.credentials.id

    try {
      return new MessagesService(MessagesRepo, UsersRepo).getAllUserMessages(
        userId
      )
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }

  async show(request, h) {
    const userId = request.auth.credentials.id
    const messagesService = new MessagesService(MessagesRepo, UsersRepo)
    const authService = new AuthService(MessagesRepo, UsersRepo)

    try {
      await authService.checkAuthorization(userId, request.params.id)
      return messagesService.getMessage(request.params.id)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }

  async delete(request, h) {
    const userId = request.auth.credentials.id
    const messagesService = new MessagesService(MessagesRepo, UsersRepo)
    const authService = new AuthService(MessagesRepo, UsersRepo)

    try {
      await authService.checkAuthorization(userId, request.params.id)
      messagesService.deleteUserMessage(request.params.id)
      return await messagesService.getAllUserMessages(userId)
    } catch (err) {
      return Boom.badImplementation(err)
    } // TODO: send 4xx in case of bad auth
  }

  async update(request, h) {
    const userId = request.auth.credentials.id
    const messagesService = new MessagesService(MessagesRepo, UsersRepo)
    const authService = new AuthService(MessagesRepo, UsersRepo)

    try {
      await authService.checkAuthorization(userId, request.payload.message.id)
      messagesService.updateUserMessage(request.payload.message)
      return {}
    } catch (err) {
      return Boom.badImplementation(err)
    } // TODO: send 4xx in case of bad auth
  }

  async create(request, h) {
    try {
      const messagesService = new MessagesService(MessagesRepo, UsersRepo)

      const user = await new UsersService(UsersRepo).findAuthorizedUser(
        request.headers.authorization
      )

      await messagesService.createMessageForUser(
        user.id,
        request.payload.message
      )

      return {}
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new MessagesController()
