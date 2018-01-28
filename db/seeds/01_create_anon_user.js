'use strict';

exports.seed = (knex, Promise) => {
  return knex('users')
    .where({ name: 'Anonymous User', role: 'ANONYMOUS_USER' })
    .del()
    .then(() => knex('users').insert({ name: 'Anonymous User', role: 'ANONYMOUS_USER' }));
};
