'use strict';

const Promise = require('bluebird');
const Axios   = require('axios');
const Config  = require('config');

class AuthService {

  constructor(msgRepo, userRepo) {

    this.msgRepo  = msgRepo;
    this.userRepo = userRepo;
  }

  fetchOrCreateUser(accessToken) {

    return Promise.resolve(
      Axios({
        url: Config.get('auth0_url'),
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }))
      // .tap(console.log)
      .then((userDetails) => {

        return Promise.all([
          this.userRepo.findUserBy({ name: userDetails.data.name }),
          Promise.resolve(userDetails.data)
        ]);
      })
      .spread((user, userDetails) => {

        if (user && user.id) {
          return Promise.resolve(user);
        }
        return this.userRepo.createUser(userDetails.name, userDetails.picture);
      });
  }

  checkAuthorization(userId, msgId) {

    return Promise.all([
      this.userRepo.findUserBy({ id: userId }),
      this.msgRepo.getMessage(msgId)
    ])
      .spread((user, message) => {

        if (user.role === 'PRAYER_TEAM' || message.user_id === user.id) {
          return true;
        }
        throw new Error('User not authorized for message!');
      });
  }

}

module.exports = AuthService;
