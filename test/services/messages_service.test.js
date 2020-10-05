'use strict'

const MessagesService = require('../../lib/services/messages_service')
const db = require('../../lib/repositories/db')
const UsersRepo = require('../../lib/repositories/users_repo')
const MessagesRepo = require('../../lib/repositories/messages_repo')

describe('users service', () => {
  const messagesService = new MessagesService(
    new MessagesRepo(db),
    new UsersRepo(db)
  )
  let user1
  let admin

  afterAll(async () => {
    await db.destroy()
  })

  afterEach(async () => {
    await db.raw('TRUNCATE TABLE comments, messages CASCADE')
    await db('users').whereNot({ role: 'ANONYMOUS_USER' }).del()
  })

  beforeEach(async () => {
    await db('users').insert({ name: 'admin', role: 'PRAYER_TEAM' })
    await db('users').insert({ name: 'user1', role: 'USER' })
    admin = await db('users').where({ name: 'admin' }).first()
    user1 = await db('users').where({ name: 'user1' }).first()

    const message1 = {
      message_type: 'PRAISE',
      message_text: 'Test 1',
      shared_status: 'SHARED_WITH_EVERYONE',
      user_id: user1.id
    }
    await db('messages').insert(message1)

    const message2 = {
      message_type: 'PRAISE',
      message_text: 'Test 2',
      shared_status: 'SHARED_WITH_EVERYONE',
      user_id: admin.id
    }
    await db('messages').insert(message2)

    const message3 = {
      message_type: 'PRAISE',
      message_text: 'Test 2',
      shared_status: 'SHARED_WITH_PRAYER_TEAM',
      user_id: user1.id
    }
    await db('messages').insert(message3)
  })

  test('getMessagesSharedToAll', async () => {
    const messages = await messagesService.getMessagesSharedToAll(1)
    expect(messages.content.length).toEqual(2)
  })

  test('getAllUserMessages', async () => {
    const messages = await messagesService.getAllUserMessages(user1.id)
    expect(messages.length).toEqual(2)
  })

  test('getMessagesSharedToAll - admin', async () => {
    const messages = await messagesService.getAllUserMessages(admin.id)
    expect(messages.length).toEqual(3)
  })
})
