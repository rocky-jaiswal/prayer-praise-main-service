'use strict'

const Boom = require('@hapi/boom')

const Db = require('./../repositories/db')
const MessagesRepo = require('./../repositories/messages_repo')
const UsersRepo = require('./../repositories/users_repo')
const MessagesService = require('./../services/messages_service')

const messagesRepo = new MessagesRepo(Db)
const usersRepo = new UsersRepo(Db)
const messageService = new MessagesService(messagesRepo, usersRepo)

class AgreementsController {
  async create(request, h) {
    try {
      const msg = await messageService.getMessage(request.params.id)
      await messageService.addAgreementCount(msg)
      return messageService.getMessage(request.params.id)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new AgreementsController()
