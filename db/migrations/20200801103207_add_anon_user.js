'use strict'

exports.up = async function (knex) {
  const anon = await knex('users').where({ role: 'ANONYMOUS_USER' })
  if (!anon || anon.length === 0) {
    await knex('users').insert({ name: 'ANONYMOUS', role: 'ANONYMOUS_USER' })
  }
  return
}

exports.down = async function (knex) {
  knex('users').where({ role: 'ANONYMOUS_USER' }).del()
}
