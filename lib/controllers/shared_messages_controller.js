'use strict'

const Boom = require('@hapi/boom')

const messagesRepo = require('./../repositories/messages_repo')
const usersRepo = require('./../repositories/users_repo')
const MessagesService = require('./../services/messages_service')

const messageService = new MessagesService(messagesRepo, usersRepo)

class SharedMessagesController {
  async index(request, h) {
    try {
      const page = request.query && request.query.page ? request.query.page : 1
      return messageService.getMessagesSharedToAll(page)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new SharedMessagesController()
