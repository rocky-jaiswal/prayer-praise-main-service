'use strict'

exports.up = (knex, _Promise) => {
  return knex.schema.table('messages', (table) => {
    table.bigInteger('agreements').notNull().default(0)
  })
}

exports.down = (knex, _Promise) => {
  return knex.schema.table('messages', (table) => {
    table.dropColumn('agreements')
  })
}
