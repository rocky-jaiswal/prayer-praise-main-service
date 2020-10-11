'use strict'

const JWT = require('jsonwebtoken')
const Config = require('config')

const secret = Config.get('token.secret')

class TokenService {
  async validate(decoded) {
    if (decoded.id) {
      return { isValid: true }
    }
    return { isValid: false }
  }

  generate(id) {
    return JWT.sign({ id }, secret, { expiresIn: '8h' })
  }
}

module.exports = new TokenService()
