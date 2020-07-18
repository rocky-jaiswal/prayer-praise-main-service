'use strict'

const JWT = require('jsonwebtoken')
const Config = require('config')

const Token = {
  validate: function (decoded, request, h) {
    if (!decoded.id) {
      return { valid: false }
    }
    return { valid: true }
  },

  generate: (userId) => {
    return JWT.sign({ id: userId }, Config.get('token.secret'), {
      expiresIn: '8h'
    })
  }
}

module.exports = Token
