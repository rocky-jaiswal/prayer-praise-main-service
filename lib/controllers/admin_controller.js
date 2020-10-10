'use strict'

const Boom = require('@hapi/boom')
const _ = require('lodash')

const Db = require('./../repositories/db')
const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')
const CommentsRepo = require('../repositories/comments_repo')

const MessagesService = require('./../services/messages_service')
const CommentsService = require('../services/comments_service')
const AuthService = require('./../services/auth_service')

const messagesRepo = new MessagesRepo(Db)
const usersRepo = new UsersRepo(Db)
const commentsRepo = new CommentsRepo(Db)

const authService = new AuthService(messagesRepo, usersRepo)
const messagesService = new MessagesService(messagesRepo, usersRepo)
const commentsService = new CommentsService(commentsRepo, usersRepo)

class AdminController {
  static async _wrapper(request, fn) {
    try {
      await authService.checkAdmin(request.auth.credentials.id)
      return fn()
    } catch (err) {
      if (err.message.match(/not authorized/)) {
        return Boom.unauthorized('unauthorized user')
      }
      return Boom.badImplementation(err)
    }
  }

  async indexMessages(request, h) {
    return AdminController._wrapper(request, async () => {
      return messagesService.getAllMessages()
    })
  }

  async indexComments(request, h) {
    return AdminController._wrapper(request, async () => {
      return commentsService.getAllComments()
    })
  }

  async deleteMessage(request, h) {
    return AdminController._wrapper(request, async () => {
      await messagesService.deleteUserMessage(request.params.id)
      return messagesService.getAllMessages()
    })
  }

  async deleteComment(request, h) {
    return AdminController._wrapper(request, async () => {
      await commentsService.deleteComment(request.params.id)
      return commentsService.getAllComments()
    })
  }

  async updateMessage(request, h) {
    return AdminController._wrapper(request, async () => {
      await messagesService.updateUserMessage(
        _.assign(request.payload.message, { id: request.params.id })
      )
      return {}
    })
  }

  // TODO: Implement
  async updateComment(request, h) {
    return AdminController._wrapper(request, async () => {
      await commentsService.updateComment(
        _.assign(request.payload.comment, { id: request.params.id })
      )
      return {}
    })
  }
}

module.exports = new AdminController()
