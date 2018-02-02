'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const PAGE_SIZE = 10;

class MessagesService {

  constructor(messagesRepo, usersRepo) {

    this.messagesRepo = messagesRepo;
    this.usersRepo = usersRepo;
  }

  getMessagesSharedToAll(page) {

    // We do this to avoid the N+1 query problem
    const enrichUser = (message, users) => {

      const user = users.find((u) => u.id === message.user_id);
      message.shortUsername = user.name.substr(0, 2);
      message.username = user.name;
      return message;
    };

    const buildResponse = (messages, count, users) => {

      return {
        content: messages.map((m) => enrichUser(m, users)),
        currentPage: page,
        size: PAGE_SIZE,
        totalElements: count,
        totalPages: Math.ceil(count / PAGE_SIZE)
      };
    };

    const queries = Promise.all([
      this.messagesRepo.getMessagesSharedToAll(page, PAGE_SIZE),
      this.messagesRepo.getCountOfMessagesSharedToAll()]);

    return queries
      .spread((messages, count) => Promise.all([messages, count[0].count, messages.map((m) => m.user_id)]))
      .spread((messages, count, userIds) => Promise.all([messages, count, this.usersRepo.findAll(userIds)]))
      .spread((messages, count, users) => buildResponse(messages, count, users));
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

