'use strict'

exports.up = (knex, Promise) => {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary()
    table.text('comment_text').notNull()

    table.bigInteger('user_id').notNull()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')

    table.bigInteger('message_id').notNull()
    table.foreign('message_id').references('messages.id').onDelete('CASCADE')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('comments')
}
