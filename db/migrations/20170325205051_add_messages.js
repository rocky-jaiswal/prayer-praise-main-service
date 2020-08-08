'use strict'

exports.up = (knex, Promise) => {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id').primary()
    table.enu('message_type', ['PRAYER', 'PRAISE']).notNull()
    table.text('message_text').notNull()
    table
      .enu('shared_status', [
        'SHARED_WITH_EVERYONE',
        'SHARED_WITH_NOONE',
        'SHARED_WITH_PRAYER_TEAM'
      ])
      .notNull()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('messages')
}
