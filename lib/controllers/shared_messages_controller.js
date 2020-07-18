'use strict'

const Boom = require('boom')

const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')
const MessagesService = require('./../services/messages_service')

class SharedMessagesController {
  async index(request, h) {
    const page = request.query && request.query.page ? request.query.page : 1

    try {
      return new MessagesService(
        MessagesRepo,
        UsersRepo
      ).getMessagesSharedToAll(page)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new SharedMessagesController()
