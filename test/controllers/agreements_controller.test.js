'use strict'

const serverInit = require('../../server')
const db = require('../../lib/repositories/db')

describe('agreements controller', () => {
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

  describe('creation', () => {
    const options = (id) => ({
      method: 'post',
      url: `/messages/${id}/agreements`
    })

    test('anonymous user can add agreement', async () => {
      await db('users').insert({ name: 'admin', role: 'PRAYER_TEAM' })
      const admin = await db('users').where({ name: 'admin' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 225',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: admin.id
      }
      const [id] = await db('messages').insert(message, 'id')

      const response = await configuredServer.inject(options(id))
      expect(response.statusCode).toBe(200)

      const messageAfter = await db('messages')
        .where({ message_text: 'Test 225' })
        .first()
      expect(messageAfter.agreements).toBe(1)
    })
  })
})
