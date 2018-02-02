'use strict';

const PingController     = require('../controllers/ping_controller');
const MessagesController = require('../controllers/messages_controller');
const TokenController    = require('../controllers/token_controller');
const UsersController    = require('../controllers/users_controller');
const SharedMessagesController = require('../controllers/shared_messages_controller');

const Routes = [
  { method: 'GET',   path: '/ping',           options: { auth: false }, handler: PingController.show       },
  { method: 'POST',  path: '/token',          options: { auth: false }, handler: TokenController.create    },
  { method: 'GET',   path: '/me',             options: { auth: 'jwt' }, handler: UsersController.show      },
  { method: 'GET',   path: '/messages',       options: { auth: 'jwt' }, handler: MessagesController.index  },
  { method: 'GET',   path: '/messages/{id}',  options: { auth: 'jwt' }, handler: MessagesController.show   },
  { method: 'DELETE',path: '/messages/{id}',  options: { auth: 'jwt' }, handler: MessagesController.delete },
  { method: 'PUT',   path: '/messages/{id}',  options: { auth: 'jwt' }, handler: MessagesController.update },
  { method: 'POST',  path: '/messages',       options: { auth: false }, handler: MessagesController.create },
  { method: 'GET',   path: '/sharedMessages', options: { auth: false }, handler: SharedMessagesController.index  }
];

module.exports = Routes;
