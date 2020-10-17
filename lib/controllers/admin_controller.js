'use strict'

const _ = require('lodash')

const Db = require('./../repositories/db')
const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')
const CommentsRepo = require('../repositories/comments_repo')

const MessagesService = require('./../services/messages_service')
const CommentsService = require('../services/comments_service')
const AuthService = require('./../services/auth_service')

const { withAdminAuth } = require('./utils')

const messagesRepo = new MessagesRepo(Db)
const usersRepo = new UsersRepo(Db)
const commentsRepo = new CommentsRepo(Db)

const authService = new AuthService(messagesRepo, usersRepo)
const messagesService = new MessagesService(messagesRepo, usersRepo)
const commentsService = new CommentsService(commentsRepo, usersRepo)

class AdminController {
  async indexMessages(request, h) {
    return withAdminAuth(request, authService, async () =>
      messagesService.getAllMessages()
    )
  }

  async indexComments(request, h) {
    return withAdminAuth(request, authService, async () =>
      commentsService.getAllComments()
    )
  }

  async deleteMessage(request, h) {
    return withAdminAuth(request, authService, async () => {
      await messagesService.deleteUserMessage(request.params.id)
      return messagesService.getAllMessages()
    })
  }

  async deleteComment(request, h) {
    return withAdminAuth(request, authService, async () => {
      await commentsService.deleteComment(request.params.id)
      return commentsService.getAllComments()
    })
  }

  async updateMessage(request, h) {
    return withAdminAuth(request, authService, async () => {
      await messagesService.updateUserMessage(
        _.assign(request.payload.message, { id: request.params.id })
      )
      return {}
    })
  }

  async updateComment(request, h) {
    return withAdminAuth(request, authService, async () => {
      console.log(request.payload)
      await commentsService.updateComment(
        _.assign(request.payload.comment, { id: request.params.id })
      )
      return {}
    })
  }
}

module.exports = new AdminController()
