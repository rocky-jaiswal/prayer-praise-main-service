'use strict'

const Boom = require('@hapi/boom')

const Db = require('./../repositories/db')
const UsersRepo = require('./../repositories/users_repo')
const CommentsRepo = require('../repositories/comments_repo')
const MessagesRepo = require('./../repositories/messages_repo')

const CommentsService = require('../services/comments_service')
const UsersService = require('./../services/users_service')
const MessagesService = require('./../services/messages_service')

const messagesRepo = new MessagesRepo(Db)
const usersRepo = new UsersRepo(Db)
const messageService = new MessagesService(messagesRepo, usersRepo)

const commentsRepo = new CommentsRepo(Db)
const commentsService = new CommentsService(commentsRepo)
const userService = new UsersService(usersRepo)

class CommentsController {
  async create(request, h) {
    try {
      const user = await userService.findAuthorizedUser(
        request.headers.authorization
      )

      const msgId = request.params.id

      await commentsService.createComment(
        request.payload.comment,
        msgId,
        user.id
      )

      return messageService.getSharedMessage(msgId)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new CommentsController()
