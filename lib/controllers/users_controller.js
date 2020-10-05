'use strict'

const Boom = require('@hapi/boom')

const Db = require('./../repositories/db')
const UsersService = require('./../services/users_service')
const UsersRepo = require('./../repositories/users_repo')

const usersRepo = new UsersRepo(Db)
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
