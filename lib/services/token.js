'use strict';

const JWT    = require('jsonwebtoken');
const Config = require('config');

const Token = {

  validate: async function (decoded, request, h) {

    if (!decoded.id) {
      return { valid : false };
    }
    else {
      return { valid : true };
    }
  },

  generate: (userId) => {

    return JWT.sign({ id: userId }, Config.get('token.secret'), { expiresIn: '1h' });
  }

};

module.exports = Token;
