'use strict'

const Boom = require('@hapi/boom')
const _ = require('lodash')

const Db = require('./../repositories/db')
const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')

const MessagesService = require('./../services/messages_service')
const UsersService = require('./../services/users_service')
const AuthService = require('./../services/auth_service')

const { withUserAuth } = require('./utils')

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
    return withUserAuth(request, authService, async () =>
      messagesService.getMessage(request.params.id)
    )
  }

  async delete(request, h) {
    return withUserAuth(request, authService, async () => {
      await messagesService.deleteUserMessage(request.params.id)
      return messagesService.getAllUserMessages(request.auth.credentials.id)
    })
  }

  async update(request, h) {
    return withUserAuth(request, authService, async () => {
      await messagesService.updateUserMessage(
        _.assign(request.payload.message, { id: request.params.id })
      )
      return {}
    })
  }
}

module.exports = new MessagesController()
