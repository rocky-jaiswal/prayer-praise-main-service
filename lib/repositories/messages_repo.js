'use strict';

const Serialize = require('serialize-javascript');
const DB = require('./db');

const SHARED_WITH_EVERYONE = 'SHARED_WITH_EVERYONE';
// const SHARED_WITH_NOONE = 'SHARED_WITH_NOONE';
const SHARED_WITH_PRAYER_TEAM = 'SHARED_WITH_PRAYER_TEAM';

class MessagesRepo {

  getMessage(id) {

    return DB('messages').where({ id }).first();
  }

  getMessagesSharedToAll(page, pageSize) {

    return DB('messages')
      .where({ sharedStatus: SHARED_WITH_EVERYONE })
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc');
  }

  getCountOfMessagesSharedToAll() {

    return DB('messages')
      .where({ sharedStatus: SHARED_WITH_EVERYONE })
      .count('id');
  }

  getAllSharedMessages() {

    return DB('messages')
      .whereIn('sharedStatus', [SHARED_WITH_EVERYONE, SHARED_WITH_PRAYER_TEAM]);
  }

  getAllUserMessages(userId) {

    return DB('messages').where({ user_id: userId });
  }

  createMessageForUser(userId, message) {

    return DB('messages').insert({
      user_id: userId,
      messageType: JSON.parse(Serialize(message.messageType)),
      messageText: JSON.parse(Serialize(message.messageText)),
      sharedStatus: JSON.parse(Serialize(message.sharedStatus))
    });
  }

  updateMessage(message) {

    return DB('messages')
      .where({ id: message.id })
      .update({
        messageText: JSON.parse(Serialize(message.text)),
        sharedStatus: JSON.parse(Serialize(message.sharedStatus))
      });
  }

  deleteUserMessage(id) {

    return DB('messages').where({ id }).del();
  }

}

module.exports = new MessagesRepo();
