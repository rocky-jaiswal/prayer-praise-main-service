'use strict'

const Promise = require('bluebird')
const Axios = require('axios')
const Config = require('config')

class AuthService {
  constructor(msgRepo, userRepo) {
    this.msgRepo = msgRepo
    this.userRepo = userRepo
  }

  async fetchOrCreateUser(accessToken) {
    const response = await Axios({
      url: `${Config.get('auth0.url')}/userinfo`,
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    const userDetails = response.data
    const user = await this.userRepo.findUserBy({ name: userDetails.name })

    if (user && user.id) {
      return user
    }
    return this.userRepo.createUser(userDetails.name, userDetails.picture)
  }

  checkAuthorization(userId, msgId) {
    return Promise.all([
      this.userRepo.findUserBy({ id: userId }),
      this.msgRepo.getMessage(msgId)
    ]).spread((user, message) => {
      if (user.role === AuthService.ADMIN_ROLE || message.user_id === user.id) {
        return true
      }
      throw new Error('User not authorized for message!')
    })
  }
}

AuthService.ADMIN_ROLE = 'PRAYER_TEAM'

module.exports = AuthService
