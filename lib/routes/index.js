'use strict'

const PingController = require('../controllers/ping_controller')
const MessagesController = require('../controllers/messages_controller')
const SessionController = require('../controllers/session_controller')
const UsersController = require('../controllers/users_controller')
const SharedMessagesController = require('../controllers/shared_messages_controller')
const { creationSchema, updateSchema } = require('./validations')

const Routes = [
  {
    method: 'GET',
    path: '/ping',
    options: { auth: false },
    handler: PingController.show
  },
  {
    method: 'POST',
    path: '/session',
    options: { auth: false },
    handler: SessionController.create
  },
  {
    method: 'GET',
    path: '/me',
    options: { auth: 'jwt' },
    handler: UsersController.show
  },
  {
    method: 'GET',
    path: '/messages',
    options: { auth: 'jwt' },
    handler: MessagesController.index
  },
  {
    method: 'GET',
    path: '/messages/{id}',
    options: { auth: 'jwt' },
    handler: MessagesController.show
  },
  {
    method: 'DELETE',
    path: '/messages/{id}',
    options: { auth: 'jwt' },
    handler: MessagesController.delete
  },
  {
    method: 'PUT',
    path: '/messages/{id}',
    handler: MessagesController.update,
    options: {
      auth: 'jwt',
      validate: {
        payload: updateSchema
      }
    }
  },
  {
    method: 'POST',
    path: '/messages',
    handler: MessagesController.create,
    options: {
      auth: false,
      validate: {
        payload: creationSchema
      }
    }
  },
  {
    method: 'GET',
    path: '/sharedMessages',
    options: { auth: false },
    handler: SharedMessagesController.index
  }
]

module.exports = Routes
