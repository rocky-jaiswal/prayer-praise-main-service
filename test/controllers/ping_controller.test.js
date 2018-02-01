'use strict';

const Server = require('../../');
const DB     = require('../../lib/repositories/db');

describe('ping controller', () => {

  const options = {
    method: 'GET',
    url: '/ping'
  };

  beforeAll((done) => {

    Server.events.on('start', done);
  });

  afterAll((done) => {

    Server.events.on('stop', () => {

      DB.destroy()
        .then(() => done());
    });
    Server.stop();
  });

  test('responds with success for ping', async () => {

    const response = await Server.inject(options);
    expect(response.statusCode).toBe(200);
    expect(response.result).toBeInstanceOf(Object);
  });

});
