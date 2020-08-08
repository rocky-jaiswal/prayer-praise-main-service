'use strict'

exports.up = (knex, Promise) => {
  return knex.schema.table('messages', (table) => {
    table.bigInteger('user_id').notNull()
    table.foreign('user_id').references('users.id')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.table('messages', (table) => {
    table.dropColumn('user_id')
  })
}
