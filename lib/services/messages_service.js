'use strict'

const Promise = require('bluebird')

const { enrichUser } = require('./utils')

const PAGE_SIZE = 10

class MessagesService {
  constructor(messagesRepo, usersRepo) {
    this.messagesRepo = messagesRepo
    this.usersRepo = usersRepo
  }

  async getMessagesSharedToAll(page) {
    const buildResponse = (messages, count, users) => ({
      content: messages.map((m) => enrichUser(m, users)),
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
    const [userMessages, user] = await Promise.all([
      this.messagesRepo.getAllUserMessages(userId),
      this.usersRepo.findUserBy({ id: userId })
    ])

    return userMessages.map((m) => enrichUser(m, [user]))
  }

  async getAllMessages() {
    const messages = await this.messagesRepo.getAllMessages()
    const users = await this.usersRepo.getAllUsers()
    return messages.map((m) => enrichUser(m, users))
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

    enrichUser(msg, users)
    msg.comments.forEach((comm) => enrichUser(comm, users))

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
