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

  async getMessagesSharedToAll(page) {

    const buildResponse = (messages, count, users) => (
      {
        content: messages.map((m) => this._enrichUser(m, users)),
        currentPage: page,
        size: PAGE_SIZE,
        totalElements: count,
        totalPages: Math.ceil(count / PAGE_SIZE)
      }
    );

    const [sharedMessages, messageCount] = await Promise.all([
      this.messagesRepo.getMessagesSharedToAll(page, PAGE_SIZE),
      this.messagesRepo.getCountOfMessagesSharedToAll()]);

    const userIds = sharedMessages.map((m) => m.user_id);
    const users = await this.usersRepo.findAll(userIds);
    return buildResponse(sharedMessages, messageCount[0].count, users);
  }

  async getAllUserMessages(userId) {

    const [userMessages, user] = await Promise.all([
      this.messagesRepo.getAllUserMessages(userId),
      this.usersRepo.findUserBy({ id: userId })
    ]);

    if (user.role === AuthService.ADMIN_ROLE) {
      const sharedMessages = await this.messagesRepo.getAllSharedMessages();
      userMessages = _.uniqBy(userMessages.concat(sharedMessages), 'id');
    }

    const users = await this.usersRepo.findAll(userMessages.map((m) => m.user_id));
    return userMessages.map((m) => this._enrichUser(m, users));
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

