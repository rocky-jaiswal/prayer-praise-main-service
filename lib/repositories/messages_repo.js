'use strict'

const serialize = require('serialize-javascript')

const SHARED_WITH_EVERYONE = 'SHARED_WITH_EVERYONE'
// const SHARED_WITH_NOONE = 'SHARED_WITH_NOONE'
const SHARED_WITH_PRAYER_TEAM = 'SHARED_WITH_PRAYER_TEAM'

class MessagesRepo {
  constructor(db) {
    this.db = db
  }

  async getMessage(id) {
    return this.db('messages').where({ id }).first()
  }

  async getMessageWithComments(id) {
    const message = await this.db('messages').where({ id }).first()
    const comments = await this.db('comments').where({ message_id: id })
    message.comments = comments
    return message
  }

  async getMessagesSharedToAll(page, pageSize) {
    return this.db('messages')
      .where({ shared_status: SHARED_WITH_EVERYONE })
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
  }

  async getCountOfMessagesSharedToAll() {
    return this.db('messages')
      .where({ shared_status: SHARED_WITH_EVERYONE })
      .count('id')
  }

  async getAllSharedMessages() {
    return this.db('messages').whereIn('shared_status', [
      SHARED_WITH_EVERYONE,
      SHARED_WITH_PRAYER_TEAM
    ])
  }

  async getAllUserMessages(userId) {
    return this.db('messages').where({ user_id: userId })
  }

  async createMessageForUser(userId, message) {
    return this.db('messages').insert({
      user_id: userId,
      message_type: JSON.parse(serialize(message.messageType)),
      message_text: JSON.parse(serialize(message.messageText)),
      shared_status: JSON.parse(serialize(message.sharedStatus))
    })
  }

  async updateMessage(message) {
    return this.db('messages')
      .where({ id: message.id })
      .update({
        message_text: JSON.parse(serialize(message.messageText)),
        shared_status: JSON.parse(serialize(message.sharedStatus))
      })
  }

  async addAgreementCount(message) {
    return this.db('messages')
      .where({ id: message.id })
      .update({
        agreements: message.agreements + 1
      })
  }

  async deleteUserMessage(id) {
    return this.db('messages').where({ id }).del()
  }
}

module.exports = MessagesRepo
