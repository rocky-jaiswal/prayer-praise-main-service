'use strict'

const Boom = require('@hapi/boom')

const Db = require('./../repositories/db')
const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')
const MessagesService = require('./../services/messages_service')

const messagesRepo = new MessagesRepo(Db)
const usersRepo = new UsersRepo(Db)
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

  async get(request, h) {
    try {
      return messageService.getSharedMessage(request.params.id)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new SharedMessagesController()
