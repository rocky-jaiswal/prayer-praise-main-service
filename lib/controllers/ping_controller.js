'use strict'

class Ping {
  show(request, h) {
    return { pong: true }
  }
}

module.exports = new Ping()
