'use strict'

const serverInit = require('../../server')
const db = require('../../lib/repositories/db')
const token = require('../../lib/services/token')

describe('messages controller', () => {
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
    await db('messages').truncate()
    await db('users').whereNot({ role: 'ANONYMOUS_USER' }).del()
  })

  describe('validation', () => {
    test('bad payload - no type', async () => {
      const options = {
        method: 'post',
        url: '/messages',
        payload: {
          message: {
            messageType: '',
            messageText: 'Test 1',
            sharedStatus: 'SHARED_WITH_EVERYONE'
          }
        }
      }
      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('bad payload - no shared status', async () => {
      const options = {
        method: 'post',
        url: '/messages',
        payload: {
          message: {
            messageType: 'PRAYER',
            messageText: 'Test 1'
          }
        }
      }
      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('bad payload - no text', async () => {
      const options = {
        method: 'post',
        url: '/messages',
        payload: {
          message: {
            messageType: 'PRAYER',
            messageText: null,
            sharedStatus: 'SHARED_WITH_EVERYONE'
          }
        }
      }
      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('creation', () => {
    const options = {
      method: 'post',
      url: '/messages',
      payload: {
        message: {
          messageType: 'PRAISE',
          messageText: 'Test 1',
          sharedStatus: 'SHARED_WITH_EVERYONE'
        }
      }
    }

    test('anonymous user can create message', async () => {
      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)

      const message = await db('messages').select().first()
      expect(message.message_text).toBe('Test 1')

      const user = await db('users').where({ role: 'ANONYMOUS_USER' }).first()
      expect(message.user_id).toBe(user.id)
    })

    test('logged in user can create message', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      const user = await db('users').where({ name: 'test' }).first()

      const response = await configuredServer.inject(
        Object.assign(options, {
          headers: { Authorization: token.generate(user.id) }
        })
      )
      expect(response.statusCode).toBe(200)

      const message = await db('messages').select().first()
      expect(message.message_text).toBe('Test 1')
      expect(message.user_id).toBe(user.id)
    })
  })

  describe('index', () => {
    test('anonymous user cannot index messages', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      await db('messages').insert(message)

      const options = {
        method: 'get',
        url: `/messages`
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })

    test('user can index their own messages', async () => {
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
        url: `/messages`,
        headers: { Authorization: token.generate(user1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.result.length).toBe(1)
    })
  })

  describe('show', () => {
    test('anonymous user cannot see a message', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'get',
        url: `/messages/${dbMessage.id}`
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })

    test('user can see their message', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      const user = await db('users').where({ name: 'test' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'get',
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('user cannot see someones message', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user1.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'get',
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user2.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })
  })

  describe('updates', () => {
    test('anonymous user cannot update a message', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'put',
        url: `/messages/${dbMessage.id}`
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })

    test('user can update their message', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      const user = await db('users').where({ name: 'test' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'put',
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user.id) },
        payload: {
          message: {
            id: dbMessage.id,
            messageText: 'Test 2',
            sharedStatus: 'SHARED_WITH_EVERYONE'
          }
        }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('user cannot update someones message', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user1.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'put',
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user2.id) },
        payload: {
          message: {
            id: dbMessage.id,
            messageText: 'Test 2',
            sharedStatus: 'SHARED_WITH_EVERYONE'
          }
        }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })
  })

  describe('deletion', () => {
    test('anonymous user cannot delete a message', async () => {
      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: 1
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'delete',
        url: `/messages/${dbMessage.id}`
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })

    test('user can delete their message', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      const user = await db('users').where({ name: 'test' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'delete',
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      const msg = await db('messages').where({ message_text: 'Test 1' })
      expect(msg.length).toBe(0)
    })

    test('user cannot delete someones message', async () => {
      await db('users').insert({ name: 'test', role: 'USER' })
      await db('users').insert({ name: 'test2', role: 'USER' })
      const user1 = await db('users').where({ name: 'test' }).first()
      const user2 = await db('users').where({ name: 'test2' }).first()

      const message = {
        message_type: 'PRAISE',
        message_text: 'Test 1',
        shared_status: 'SHARED_WITH_EVERYONE',
        user_id: user1.id
      }
      await db('messages').insert(message)
      const dbMessage = await db('messages')
        .where({ message_text: 'Test 1' })
        .first()

      const options = {
        method: 'delete',
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user2.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(401)
    })
  })

  describe('admin update', () => {
    test('admin can update someones message', async () => {
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
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user1.id) },
        payload: {
          message: {
            id: dbMessage.id,
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
    test('admin can delete someones message', async () => {
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
        url: `/messages/${dbMessage.id}`,
        headers: { Authorization: token.generate(user1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('admin index', () => {
    test('admin can index all messages', async () => {
      await db('users').insert({ name: 'test', role: 'PRAYER_TEAM' })
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
        url: `/messages`,
        headers: { Authorization: token.generate(user1.id) }
      }

      const response = await configuredServer.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.result.length).toBe(2)
    })
  })
})
