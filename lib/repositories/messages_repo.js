'use strict'

const Serialize = require('serialize-javascript')
const DB = require('./db')

const SHARED_WITH_EVERYONE = 'SHARED_WITH_EVERYONE'
// const SHARED_WITH_NOONE = 'SHARED_WITH_NOONE';
const SHARED_WITH_PRAYER_TEAM = 'SHARED_WITH_PRAYER_TEAM'

class MessagesRepo {
  async getMessage(id) {
    return DB('messages').where({ id }).first()
  }

  async getMessagesSharedToAll(page, pageSize) {
    return DB('messages')
      .where({ sharedStatus: SHARED_WITH_EVERYONE })
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
  }

  async getCountOfMessagesSharedToAll() {
    return DB('messages')
      .where({ sharedStatus: SHARED_WITH_EVERYONE })
      .count('id')
  }

  async getAllSharedMessages() {
    return DB('messages').whereIn('sharedStatus', [
      SHARED_WITH_EVERYONE,
      SHARED_WITH_PRAYER_TEAM
    ])
  }

  async getAllUserMessages(userId) {
    return DB('messages').where({ user_id: userId })
  }

  async createMessageForUser(userId, message) {
    return DB('messages').insert({
      user_id: userId,
      messageType: JSON.parse(Serialize(message.messageType)),
      messageText: JSON.parse(Serialize(message.messageText)),
      sharedStatus: JSON.parse(Serialize(message.sharedStatus))
    })
  }

  async updateMessage(message) {
    return DB('messages')
      .where({ id: message.id })
      .update({
        messageText: JSON.parse(Serialize(message.text)),
        sharedStatus: JSON.parse(Serialize(message.sharedStatus))
      })
  }

  async deleteUserMessage(id) {
    return DB('messages').where({ id }).del()
  }
}

module.exports = new MessagesRepo()
