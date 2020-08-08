'use strict'

const Hapi = require('hapi')
const config = require('config')

const HapiAuthJWT = require('hapi-auth-jwt2')
const HapiPino = require('hapi-pino')

const routes = require('./lib/routes/')
const token = require('./lib/services/token')

// Create a server with a host and port
const server = new Hapi.Server({
  port: config.get('api.port'),
  routes: { cors: config.get('api.cors') }
})

const serverInit = async () => {
  // Register plugins
  await server.register(HapiAuthJWT)
  await server.register({
    plugin: HapiPino,
    options: { redact: ['req.headers.authorization'] }
  })

  // Auth setup
  server.auth.strategy('jwt', 'jwt', {
    key: config.get('token.secret'),
    validate: token.validate,
    verifyOptions: { algorithms: ['HS256'] }
  })
  server.auth.default('jwt')

  // Routes
  server.route(routes)
  return server
}

module.exports = serverInit
