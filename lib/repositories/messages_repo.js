'use strict'

const serialize = require('serialize-javascript')

const MESSAGES_TABLE = 'messages'
const SHARED_WITH_EVERYONE = 'SHARED_WITH_EVERYONE'
const SHARED_WITH_PRAYER_TEAM = 'SHARED_WITH_PRAYER_TEAM'
// const SHARED_WITH_NOONE = 'SHARED_WITH_NOONE'

class MessagesRepo {
  constructor(db) {
    this.db = db
  }

  async getMessage(id) {
    return this.db(MESSAGES_TABLE).where({ id }).first()
  }

  async getAllMessages() {
    return this.db(MESSAGES_TABLE).select()
  }

  async getMessageWithComments(id) {
    const message = await this.db(MESSAGES_TABLE).where({ id }).first()
    const comments = await this.db('comments').where({ message_id: id })
    message.comments = comments
    return message
  }

  async getMessagesSharedToAll(page, pageSize) {
    return this.db(MESSAGES_TABLE)
      .where({ shared_status: SHARED_WITH_EVERYONE })
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
  }

  async getCountOfMessagesSharedToAll() {
    return this.db(MESSAGES_TABLE)
      .where({ shared_status: SHARED_WITH_EVERYONE })
      .count('id')
  }

  async getAllSharedMessages() {
    return this.db(MESSAGES_TABLE).whereIn('shared_status', [
      SHARED_WITH_EVERYONE,
      SHARED_WITH_PRAYER_TEAM
    ])
  }

  async getAllUserMessages(userId) {
    return this.db(MESSAGES_TABLE).where({ user_id: userId })
  }

  async createMessageForUser(userId, message) {
    return this.db(MESSAGES_TABLE).insert({
      user_id: userId,
      message_type: JSON.parse(serialize(message.messageType)),
      message_text: JSON.parse(serialize(message.messageText)),
      shared_status: JSON.parse(serialize(message.sharedStatus))
    })
  }

  async updateMessage(message) {
    return this.db(MESSAGES_TABLE)
      .where({ id: message.id })
      .update({
        message_text: JSON.parse(serialize(message.messageText)),
        shared_status: JSON.parse(serialize(message.sharedStatus))
      })
  }

  async addAgreementCount(message) {
    return this.db(MESSAGES_TABLE)
      .where({ id: message.id })
      .update({
        agreements: message.agreements + 1
      })
  }

  async deleteUserMessage(id) {
    return this.db(MESSAGES_TABLE).where({ id }).del()
  }
}

module.exports = MessagesRepo
