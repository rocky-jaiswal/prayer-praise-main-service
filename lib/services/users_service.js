'use strict'

const util = require('util')
const Promise = require('bluebird')
const Jwt = require('jsonwebtoken')
const Config = require('config')

const verifyToken = util.promisify(Jwt.verify)
const token = Config.get('token.secret')

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
    try {
      if (!authHeader) {
        return this.findAnonymousUser()
      }
      const decoded = await verifyToken(authHeader, token)
      return this.findUser(decoded.id)
    } catch (err) {
      console.error(err)
      throw new Error('Error in finding authorized user')
    }
  }

  async findAnonymousUser() {
    return this.repo.findAnonymousUser()
  }
}

module.exports = UsersService
