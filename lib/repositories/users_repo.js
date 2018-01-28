'use strict';

const DB = require('./db');

class UsersRepo {

  findUserBy(query) {

    return DB('users').where(query).first();
  }

  findAll(userIds) {

    return DB('users').whereIn('id', userIds);
  }

  createUser(name, picture) {

    return DB('users')
      .insert({ name, picture })
      .then(() => this.findUserBy({ name }));
  }

  findAnonymousUser() {

    return DB('users')
      .where({ role: 'ANONYMOUS_USER' })
      .first();
  }

}

module.exports = new UsersRepo();
