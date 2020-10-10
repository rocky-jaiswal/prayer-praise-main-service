'use strict'

const USERS_TABLE = 'users'

class UsersRepo {
  constructor(db) {
    this.db = db
  }

  async getAllUsers() {
    return this.db(USERS_TABLE).select()
  }

  async findUserBy(query) {
    return this.db(USERS_TABLE).where(query).first()
  }

  async findAll(userIds) {
    return this.db(USERS_TABLE).whereIn('id', userIds)
  }

  async createUser(name, picture) {
    await this.db(USERS_TABLE).insert({ name, picture })
    return await this.findUserBy({ name })
  }

  async findAnonymousUser() {
    return this.db(USERS_TABLE).where({ role: 'ANONYMOUS_USER' }).first()
  }
}

module.exports = UsersRepo
