'use strict';

const Promise = require('bluebird');
const Jwt     = require('jsonwebtoken');
const Config  = require('config');

class UsersService {

  constructor(repo) {

    this.repo = repo;
  }

  findUser(userId) {

    return this.repo.findUserBy({ id: userId });
  }

  findAuthorizedUser(authHeader) {

    if (!authHeader) {
      return this.findAnonymousUser();
    }
    return new Promise((resolve, reject) => {

      Jwt.verify(authHeader, Config.get('token.secret'), (err, decoded) => {

        if (err) {
          reject('User not found or session invalid!');
        }
        resolve(decoded.id);
      });
    })
      .then((userId) => this.findUser(userId));
  }

  findAnonymousUser() {

    return this.repo.findAnonymousUser();
  }

}

module.exports = UsersService;

