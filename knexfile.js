'use strict';

const Config = require('config');

const dbConfiguration = {
  client: 'postgresql',
  useNullAsDefault: true,
  connection: Config.get('db.connString'),
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

module.exports = {
  development: dbConfiguration,
  test: dbConfiguration,
  canary: dbConfiguration,
  production: dbConfiguration
};
