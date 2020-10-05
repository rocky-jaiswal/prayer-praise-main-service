'use strict'

const serverInit = require('../../server')
const db = require('../../lib/repositories/db')

describe('comments controller', () => {
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

  describe('shared messages with comments', () => {
    const options = (id, bad = false) => ({
      method: 'post',
      url: `/sharedMessages/${id}/comments`,
      payload: {
        comment: {
          commentText: bad ? '' : 'comment'
        }
      }
    })

    test('bad comment data', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      const [msgId] = await db('messages').insert(message).returning('id')

      const response = await configuredServer.inject(options(msgId, true))
      expect(response.statusCode).toBe(400)
    })

    test('anonymous user can add comment', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      const [msgId] = await db('messages').insert(message).returning('id')

      const response = await configuredServer.inject(options(msgId))
      expect(response.statusCode).toBe(200)
      expect(response.result.comments.length).toBe(1)

      const comments = await db('comments').where({ message_id: msgId })
      expect(comments[0].comment_text).toBe('comment')
    })
  })
})
