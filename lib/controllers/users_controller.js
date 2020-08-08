'use strict'

const Boom = require('@hapi/boom')

const UsersService = require('./../services/users_service')
const usersRepo = require('./../repositories/users_repo')

const userService = new UsersService(usersRepo)

class UsersController {
  async show(request, h) {
    try {
      const userId = request.auth.credentials.id
      const user = await userService.findUser(userId)
      return user
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new UsersController()
