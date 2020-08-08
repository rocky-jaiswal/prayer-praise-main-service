'use strict'

const UsersService = require('../../lib/services/users_service')
const db = require('../../lib/repositories/db')
const usersRepo = require('../../lib/repositories/users_repo')

describe('users service', () => {
  const usersService = new UsersService(usersRepo)

  afterAll(async () => {
    await db.destroy()
  })

  afterEach(async () => {
    await db('messages').truncate()
    await db('users').whereNot({ role: 'ANONYMOUS_USER' }).del()
  })

  test('finding users', async () => {
    await db('users').insert({ name: 'test', role: 'USER' })
    const user1 = await db('users').where({ name: 'test' }).first()

    const user = await usersService.findUser(user1.id)
    expect(user).toEqual(user1)
  })
})
