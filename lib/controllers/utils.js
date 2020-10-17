'use strict'

const Boom = require('@hapi/boom')

const withAdminAuth = async (request, authService, handler) => {
  try {
    await authService.checkAdmin(request.auth.credentials.id)
    return handler()
  } catch (err) {
    if (err.message.match(/not authorized/)) {
      return Boom.unauthorized('unauthorized user')
    }
    return Boom.badImplementation(err)
  }
}

const withUserAuth = async (request, authService, handler) => {
  try {
    const userId = request.auth.credentials.id
    const msgId = request.params.id

    await authService.checkAuthorization(userId, msgId)
    return handler()
  } catch (err) {
    if (err.message.match(/not authorized/)) {
      return Boom.unauthorized('unauthorized user')
    }
    return Boom.badImplementation(err)
  }
}

module.exports = {
  withAdminAuth,
  withUserAuth
}
