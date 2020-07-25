'use strict'

const DB = require('./db')

class UsersRepo {
  async findUserBy(query) {
    return DB('users').where(query).first()
  }

  async findAll(userIds) {
    return DB('users').whereIn('id', userIds)
  }

  async createUser(name, picture) {
    await DB('users').insert({ name, picture })
    return await this.findUserBy({ name })
  }

  async findAnonymousUser() {
    return DB('users').where({ role: 'ANONYMOUS_USER' }).first()
  }
}

module.exports = new UsersRepo()
