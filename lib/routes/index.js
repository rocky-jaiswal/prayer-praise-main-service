'use strict'

const PingController = require('../controllers/ping_controller')
const MessagesController = require('../controllers/messages_controller')
const SessionController = require('../controllers/session_controller')
const UsersController = require('../controllers/users_controller')
const SharedMessagesController = require('../controllers/shared_messages_controller')
const AgreementsController = require('../controllers/agreements_controller')
const CommentsController = require('../controllers/comments_controller')
const {
  messageCreationSchema,
  messageUpdateSchema,
  commentCreationSchema
} = require('./validations')

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
        payload: messageUpdateSchema
      }
    }
  },
  {
    method: 'POST',
    path: '/messages/{id}/agreements',
    handler: AgreementsController.create,
    options: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/messages',
    handler: MessagesController.create,
    options: {
      auth: false,
      validate: {
        payload: messageCreationSchema
      }
    }
  },
  {
    method: 'GET',
    path: '/sharedMessages',
    options: { auth: false },
    handler: SharedMessagesController.index
  },
  {
    method: 'GET',
    path: '/sharedMessages/{id}',
    options: { auth: false },
    handler: SharedMessagesController.get
  },
  {
    method: 'POST',
    path: '/sharedMessages/{id}/comments',
    handler: CommentsController.create,
    options: {
      auth: false,
      validate: {
        payload: commentCreationSchema
      }
    }
  }
]

module.exports = Routes
