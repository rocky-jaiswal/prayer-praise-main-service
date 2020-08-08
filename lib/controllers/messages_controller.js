'use strict'

const Boom = require('boom')

const messagesRepo = require('./../repositories/messages_repo')
const usersRepo = require('./../repositories/users_repo')

const MessagesService = require('./../services/messages_service')
const UsersService = require('./../services/users_service')
const AuthService = require('./../services/auth_service')

const messagesService = new MessagesService(messagesRepo, usersRepo)
const authService = new AuthService(messagesRepo, usersRepo)
const userService = new UsersService(usersRepo)

class MessagesController {
  async index(request, h) {
    try {
      const userId = request.auth.credentials.id
      return messagesService.getAllUserMessages(userId)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }

  async show(request, h) {
    try {
      const userId = request.auth.credentials.id
      await authService.checkAuthorization(userId, request.params.id)
      return messagesService.getMessage(request.params.id)
    } catch (err) {
      if (err.message.match(/not authorized/)) {
        return Boom.unauthorized('unauthorized user')
      }
      return Boom.badImplementation(err)
    }
  }

  async delete(request, h) {
    try {
      const userId = request.auth.credentials.id
      await authService.checkAuthorization(userId, request.params.id)
      await messagesService.deleteUserMessage(request.params.id)
      return messagesService.getAllUserMessages(userId)
    } catch (err) {
      if (err.message.match(/not authorized/)) {
        return Boom.unauthorized('unauthorized user')
      }
      return Boom.badImplementation(err)
    }
  }

  async update(request, h) {
    try {
      const userId = request.auth.credentials.id
      await authService.checkAuthorization(userId, request.payload.message.id)
      await messagesService.updateUserMessage(request.payload.message)
      return {}
    } catch (err) {
      if (err.message.match(/not authorized/)) {
        return Boom.unauthorized('unauthorized user')
      }
      return Boom.badImplementation(err)
    }
  }

  async create(request, h) {
    try {
      const user = await userService.findAuthorizedUser(
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
