'use strict'

const Promise = require('bluebird')
const _ = require('lodash')
const AuthService = require('./auth_service')

const PAGE_SIZE = 10

class MessagesService {
  constructor(messagesRepo, usersRepo) {
    this.messagesRepo = messagesRepo
    this.usersRepo = usersRepo
  }

  _enrichUser(messageOrComment, users) {
    // We do this to avoid the N+1 query problem
    const user = users.find((u) => u.id === messageOrComment.user_id)
    messageOrComment.username = user.name
    return messageOrComment
  }

  async getMessagesSharedToAll(page) {
    const buildResponse = (messages, count, users) => ({
      content: messages.map((m) => this._enrichUser(m, users)),
      currentPage: page,
      size: PAGE_SIZE,
      totalElements: count,
      totalPages: Math.ceil(count / PAGE_SIZE)
    })

    const [sharedMessages, messageCount] = await Promise.all([
      this.messagesRepo.getMessagesSharedToAll(page, PAGE_SIZE),
      this.messagesRepo.getCountOfMessagesSharedToAll()
    ])

    const userIds = sharedMessages.map((m) => m.user_id)
    const users = await this.usersRepo.findAll(userIds)
    return buildResponse(sharedMessages, messageCount[0].count, users)
  }

  async getAllUserMessages(userId) {
    let [userMessages, user] = await Promise.all([
      this.messagesRepo.getAllUserMessages(userId),
      this.usersRepo.findUserBy({ id: userId })
    ])

    if (user.role === AuthService.ADMIN_ROLE) {
      const sharedMessages = await this.messagesRepo.getAllSharedMessages()
      userMessages = _.uniqBy(userMessages.concat(sharedMessages), 'id')
    }

    const users = await this.usersRepo.findAll(
      userMessages.map((m) => m.user_id)
    )
    return userMessages.map((m) => this._enrichUser(m, users))
  }

  async getSharedMessage(msgId) {
    const msg = await this.messagesRepo.getMessageWithComments(msgId)
    if (msg.shared_status !== 'SHARED_WITH_EVERYONE') {
      return {}
    }
    const commentUsers = msg.comments.map((comm) => comm.user_id)
    const users = await this.usersRepo.findAll(
      commentUsers.concat([msg.user_id])
    )
    this._enrichUser(msg, users)
    msg.comments.forEach((comm) => this._enrichUser(comm, users))

    return msg
  }

  async getMessage(msgId) {
    return this.messagesRepo.getMessage(msgId)
  }

  async createMessageForUser(userId, message) {
    return this.messagesRepo.createMessageForUser(userId, message)
  }

  async updateUserMessage(message) {
    return this.messagesRepo.updateMessage(message)
  }

  async addAgreementCount(message) {
    return this.messagesRepo.addAgreementCount(message)
  }

  async deleteUserMessage(msgId) {
    return this.messagesRepo.deleteUserMessage(msgId)
  }
}

module.exports = MessagesService
