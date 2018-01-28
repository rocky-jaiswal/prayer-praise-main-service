'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

class MessagesService {

  constructor(messagesRepo, usersRepo) {

    this.messagesRepo = messagesRepo;
    this.usersRepo = usersRepo;
  }

  getMessagesSharedToAll(userId) {

    // We do this to avoid the N+1 query problem
    const enrichUser = (message, users) => {

      const user = users.find((u) => u.id === message.user_id);
      message.shortUsername = user.name.substr(0, 2);
      message.username = user.name;
      return message;
    };

    return this.messagesRepo.getMessagesSharedToAll()
      .then((messages) => Promise.all([messages, messages.map((m) => m.user_id)]))
      .spread((messages, userIds) => Promise.all([messages, this.usersRepo.findAll(userIds)]))
      .spread((messages, users) => messages.map((m) => enrichUser(m, users)));
  }

  getAllUserMessages(userId) {

    return this.messagesRepo
      .getAllUserMessages(userId)
      .then((myMessages) => Promise.all([myMessages, this.usersRepo.findUserBy({ id: userId })]))
      .spread((myMessages, user) => {

        if (user.role === 'PRAYER_TEAM') {
          return Promise.all([myMessages, this.messagesRepo.getAllSharedMessages()]);
        }
        return Promise.all([myMessages, []]);
      })
      .spread((myMessages, sharedMessages) => _.uniqBy(myMessages.concat(sharedMessages), 'id'));
  }

  getMessage(msgId) {

    return this.messagesRepo.getMessage(msgId);
  }

  createMessageForUser(userId, message) {

    return this.messagesRepo.createMessageForUser(userId, message);
  }

  updateUserMessage(message) {

    return this.messagesRepo.updateMessage(message);
  }

  deleteUserMessage(msgId) {

    return this.messagesRepo.deleteUserMessage(msgId);
  }

}

module.exports = MessagesService;

