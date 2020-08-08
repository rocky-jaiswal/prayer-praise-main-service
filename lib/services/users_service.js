'use strict'

const util = require('util')
const jwt = require('jsonwebtoken')
const config = require('config')

const verifyToken = util.promisify(jwt.verify)
const token = config.get('token.secret')

const AuthService = require('./auth_service')

class UsersService {
  constructor(usersRepo) {
    this.usersRepo = usersRepo
  }

  async findUser(userId) {
    const user = this.usersRepo.findUserBy({ id: userId })
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
    return this.usersRepo.findAnonymousUser()
  }
}

module.exports = UsersService
