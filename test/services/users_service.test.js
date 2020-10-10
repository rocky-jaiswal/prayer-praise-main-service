'use strict'

const db = require('../../lib/repositories/db')
const UsersService = require('../../lib/services/users_service')
const UsersRepo = require('../../lib/repositories/users_repo')

describe('users service', () => {
  const usersService = new UsersService(new UsersRepo(db))

  afterAll(async () => {
    await db.destroy()
  })

  afterEach(async () => {
    await db.raw('TRUNCATE TABLE comments, messages CASCADE')
    await db('users').whereNot({ role: 'ANONYMOUS_USER' }).del()
  })

  test('finding users', async () => {
    await db('users').insert({ name: 'test', role: 'USER' })
    const user1 = await db('users').where({ name: 'test' }).first()

    const user = await usersService.findUser(user1.id)
    expect(user).toEqual(Object.assign(user1, { admin: false }))
  })

  test('finding users - admin', async () => {
    await db('users').insert({ name: 'test', role: 'PRAYER_TEAM' })
    const user1 = await db('users').where({ name: 'test' }).first()

    const user = await usersService.findUser(user1.id)
    expect(user).toEqual(Object.assign(user1, { admin: true }))
  })
})
