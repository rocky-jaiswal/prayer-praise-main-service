'use strict'

const serverInit = require('../../server')
const db = require('../../lib/repositories/db')

describe('ping controller', () => {
  let configuredServer

  const options = {
    method: 'get',
    url: '/ping'
  }

  beforeAll(async () => {
    configuredServer = await serverInit()
    await configuredServer.initialize()
  })

  afterAll(async () => {
    await configuredServer.stop()
    await db.destroy()
  })

  test('responds with success for ping', async () => {
    const response = await configuredServer.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.result).toBeInstanceOf(Object)
  })
})
