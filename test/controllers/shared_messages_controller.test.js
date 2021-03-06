'use strict'

const serverInit = require('../../server')
const db = require('../../lib/repositories/db')

describe('shared messages controller', () => {
  let configuredServer

  beforeAll(async () => {
    configuredServer = await serverInit()
    await configuredServer.initialize()
  })

  afterAll(async () => {
    await configuredServer.stop()
    await db.destroy()
  })

  afterEach(async () => {
    await db.raw('TRUNCATE TABLE comments, messages CASCADE')
    await db('users').whereNot({ role: 'ANONYMOUS_USER' }).del()
  })

  describe('shared messages - index', () => {
    const options = {
      method: 'get',
      url: '/sharedMessages'
    }

    test('anonymous user can see shared message', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      await db('messages').insert(message)

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.result.content.length).toBe(1)
    })

    test('anonymous user cannot see private message', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_PRAYER_TEAM',
        user_id: 1
      }
      await db('messages').insert(message)

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.result.content.length).toBe(0)
    })
  })

  describe('shared messages - details', () => {
    const options = (id) => ({
      method: 'get',
      url: `/sharedMessages/${id}`
    })

    test('anonymous user can see a shared message', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      const [msgId] = await db('messages').insert(message).returning('id')

      const response = await configuredServer.inject(options(msgId))
      expect(response.statusCode).toBe(200)
      expect(response.result).not.toBeNull()
    })
  })
})
