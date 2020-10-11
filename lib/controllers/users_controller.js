'use strict'

const Boom = require('@hapi/boom')

const Db = require('./../repositories/db')
const UsersRepo = require('./../repositories/users_repo')
const UsersService = require('./../services/users_service')

const usersRepo = new UsersRepo(Db)
const userService = new UsersService(usersRepo)

class UsersController {
  async show(request, h) {
    try {
      return userService.findUser(request.auth.credentials.id)
    } catch (err) {
      return Boom.badImplementation(err)
    }
  }
}

module.exports = new UsersController()
