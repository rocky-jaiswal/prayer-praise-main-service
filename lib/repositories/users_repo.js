'use strict'

class UsersRepo {
  constructor(db) {
    this.db = db
  }

  async findUserBy(query) {
    return this.db('users').where(query).first()
  }

  async findAll(userIds) {
    return this.db('users').whereIn('id', userIds)
  }

  async createUser(name, picture) {
    await this.db('users').insert({ name, picture })
    return await this.findUserBy({ name })
  }

  async findAnonymousUser() {
    return this.db('users').where({ role: 'ANONYMOUS_USER' }).first()
  }
}

module.exports = UsersRepo
