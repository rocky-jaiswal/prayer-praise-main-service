'use strict'

const utils = require('../../lib/services/utils')

describe('utils', () => {
  test('normalize user name', async () => {
    expect(utils.normalizeUsername('ANONYMOUS')).toEqual('Anonymous')
    expect(utils.normalizeUsername('foo@example.com')).toEqual('Foo')
    expect(utils.normalizeUsername('Foo.bar@example.com')).toEqual('Foo Bar')
  })
})
