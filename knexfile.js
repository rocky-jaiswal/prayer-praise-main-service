'use strict';

const Config = require('config');

const dbConfiguration = {
  client: 'postgresql',
  useNullAsDefault: true,
  connection: {
    host:     Config.get('db.host'),
    database: Config.get('db.name'),
    user:     Config.get('db.user'),
    password: Config.get('db.password')
  },
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
