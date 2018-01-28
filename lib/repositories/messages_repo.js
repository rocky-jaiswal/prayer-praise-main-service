'use strict';

const DB = require('./db');

const SHARED_WITH_EVERYONE = 'SHARED_WITH_EVERYONE';
// const SHARED_WITH_NOONE = 'SHARED_WITH_NOONE';
const SHARED_WITH_PRAYER_TEAM = 'SHARED_WITH_PRAYER_TEAM';

class MessagesRepo {

  getMessage(id) {

    return DB('messages').where({ id }).first();
  }

  getMessagesSharedToAll() {

    return DB('messages')
      .where({ sharedStatus: SHARED_WITH_EVERYONE })
      .orderBy('created_at', 'desc');
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
      messageType: message.messageType,
      messageText: message.messageText,
      sharedStatus: message.sharedStatus
    });
  }

  updateMessage(message) {

    return DB('messages')
      .where({ id: message.id })
      .update({
        messageText: message.messageText,
        sharedStatus: message.sharedStatus
      });
  }

  deleteUserMessage(id) {

    return DB('messages').where({ id }).del();
  }

}

module.exports = new MessagesRepo();
