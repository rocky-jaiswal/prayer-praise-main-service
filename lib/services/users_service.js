'use strict'

const Promise = require('bluebird')
const Jwt = require('jsonwebtoken')
const Config = require('config')

const AuthService = require('./auth_service')

class UsersService {
  constructor(repo) {
    this.repo = repo
  }

  async findUser(userId) {
    const user = this.repo.findUserBy({ id: userId })
    user.admin = user.role === AuthService.ADMIN_ROLE
    return user
  }

  async findAuthorizedUser(authHeader) {
    if (!authHeader) {
      return this.findAnonymousUser()
    }
    return new Promise((resolve, reject) => {
      Jwt.verify(authHeader, Config.get('token.secret'), (err, decoded) => {
        if (err) {
          reject(new Error('User not found or session invalid!'))
        }
        resolve(decoded.id)
      })
    }).then((userId) => this.findUser(userId))
  }

  async findAnonymousUser() {
    return this.repo.findAnonymousUser()
  }
}

module.exports = UsersService
