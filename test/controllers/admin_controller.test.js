'use strict'

const serverInit = require('../../server')
const db = require('../../lib/repositories/db')
const tokenService = require('../../lib/services/token_service')

describe('admin controller', () => {
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

  describe('admin index', () => {
    test('user cannot index all messages', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()

      const message1 = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user1.id
      }
      const message2 = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user2.id
      }
      await db('messages').insert(message1)
      await db('messages').insert(message2)

      const options = {
        method: 'get',
        url: '/admin/messages',
        headers: { Authorization: tokenService.generate(user1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })

    test('admin can index all messages', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      await db('users').insert({ name: 'admin1', role: 'PRAYER_TEAM' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()
      const admin1 = await db('users').where({ name: 'admin1' }).first()

      const message1 = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user1.id
      }
      const message2 = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user2.id
      }
      await db('messages').insert(message1)
      await db('messages').insert(message2)

      const options = {
        method: 'get',
        url: '/admin/messages',
        headers: { Authorization: tokenService.generate(admin1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.result.length).toBe(2)
    })

    test('admin can index all comments', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      await db('users').insert({ name: 'admin1', role: 'PRAYER_TEAM' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()
      const admin1 = await db('users').where({ name: 'admin1' }).first()

      const message1 = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user1.id
      }
      const message2 = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user2.id
      }
      const [mId1] = await db('messages').insert(message1, 'id')
      const [mId2] = await db('messages').insert(message2, 'id')

      await db('comments').insert({
        comment_text: 'foo',
        message_id: mId1,
        user_id: user1.id
      })

      await db('comments').insert({
        comment_text: 'bar',
        message_id: mId2,
        user_id: user2.id
      })

      const options = {
        method: 'get',
        url: '/admin/comments',
        headers: { Authorization: tokenService.generate(admin1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.result.length).toBe(2)
    })
  })

  describe('admin update', () => {
    test('admin can update anyones message', async () => {
      await db('users').insert({ name: 'test', role: 'PRAYER_TEAM' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user2.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'put',
        url: `/admin/messages/${dbMessage.id}`,
        headers: { Authorization: tokenService.generate(user1.id) },
        payload: {
          message: {
            messageText: 'Test 2',
            sharedStatus: 'SHARED_WITH_EVERYONE'
          }
        }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('admin deletion', () => {
    test('admin can delete anyones message', async () => {
      await db('users').insert({ name: 'test', role: 'PRAYER_TEAM' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user2.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'delete',
        url: `/admin/messages/${dbMessage.id}`,
        headers: { Authorization: tokenService.generate(user1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('admin can delete any comment', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      await db('users').insert({ name: 'admin1', role: 'PRAYER_TEAM' })

      const user1 = await db('users').where({ name: 'test' }).first()
      const admin1 = await db('users').where({ name: 'admin1' }).first()

      const message1 = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user1.id
      }

      const [mId1] = await db('messages').insert(message1, 'id')

      const [cid1] = await db('comments').insert({
        comment_text: 'foo',
        message_id: mId1,
        user_id: user1.id
      }, 'id')

      const options = {
        method: 'delete',
        url: `/admin/comments/${cid1}`,
        headers: { Authorization: tokenService.generate(admin1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.result.length).toBe(0)
    })
  })
})
