'use strict'

const Boom = require('@hapi/boom')
const _ = require('lodash')

const Db = require('./../repositories/db')
const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')

const MessagesService = require('./../services/messages_service')
const UsersService = require('./../services/users_service')
const AuthService = require('./../services/auth_service')

const messagesRepo = new MessagesRepo(Db)
const usersRepo = new UsersRepo(Db)
const messagesService = new MessagesService(messagesRepo, usersRepo)
const authService = new AuthService(messagesRepo, usersRepo)
const userService = new UsersService(usersRepo)

class MessagesController {
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

  async index(request, h) {
    try {
      return messagesService.getAllUserMessages(request.auth.credentials.id)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }

  async show(request, h) {
    try {
      const userId = request.auth.credentials.id
      const msgId = request.params.id

      await authService.checkAuthorization(userId, msgId)
      return messagesService.getMessage(msgId)
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
      const msgId = request.params.id

      await authService.checkAuthorization(userId, msgId)
      await messagesService.deleteUserMessage(msgId)
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
      const msgId = request.params.id

      await authService.checkAuthorization(userId, msgId)
      await messagesService.updateUserMessage(
        _.assign(request.payload.message, { id: msgId })
      )
      return {}
    } catch (err) {
      if (err.message.match(/not authorized/)) {
        return Boom.unauthorized('unauthorized user')
      }
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new MessagesController()
