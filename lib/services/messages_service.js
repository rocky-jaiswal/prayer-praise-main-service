'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const AuthService = require('./auth_service');

const PAGE_SIZE = 10;
class MessagesService {

  constructor(messagesRepo, usersRepo) {

    this.messagesRepo = messagesRepo;
    this.usersRepo = usersRepo;
  }

  _enrichUser(message, users) {

    // We do this to avoid the N+1 query problem
    const user = users.find((u) => u.id === message.user_id);
    message.shortUsername = user.name.substr(0, 2);
    message.username = user.name;
    return message;
  }

  getMessagesSharedToAll(page) {

    const buildResponse = (messages, count, users) => {

      return {
        content: messages.map((m) => this._enrichUser(m, users)),
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

        if (user.role === AuthService.ADMIN_ROLE) {
          return Promise.all([myMessages, this.messagesRepo.getAllSharedMessages()]);
        }
        return Promise.all([myMessages, []]);
      })
      .spread((myMessages, sharedMessages) => _.uniqBy(myMessages.concat(sharedMessages), 'id'))
      .then((messages) => Promise.all([messages, this.usersRepo.findAll(messages.map((m) => m.user_id))]))
      .spread((messages, users) => messages.map((m) => this._enrichUser(m, users)));
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

