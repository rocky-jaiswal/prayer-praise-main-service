'use strict'

const Hapi = require('hapi')
const Config = require('config')
const HapiAuthJWT = require('hapi-auth-jwt2')
const HapiPino = require('hapi-pino')

const Routes = require('./lib/routes/')
const Token = require('./lib/services/token')

// Create a server with a host and port
const server = new Hapi.Server({
  port: Config.get('api.port'),
  routes: { cors: Config.get('api.cors') }
})

const init = async () => {
  // Register plugins
  await server.register(HapiAuthJWT)
  await server.register(HapiPino)

  // Auth setup
  server.auth.strategy('jwt', 'jwt', {
    key: Config.get('token.secret'),
    validate: Token.validate,
    verifyOptions: { algorithms: ['HS256'] }
  })
  server.auth.default('jwt')

  // Routes
  server.route(Routes)

  await server.start()
  return server
}

init().catch((err) => console.error(err))

module.exports = server
