'use strict'

const serverInit = require('./server')

serverInit()
  .then((server) => server.start())
  .catch((err) => console.error(err))
