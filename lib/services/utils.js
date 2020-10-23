const _ = require('lodash')

const enrichUser = (messageOrComment, users) => {
  // We do this to avoid the N+1 query problem
  const user = users.find((u) => u.id === messageOrComment.user_id)
  messageOrComment.username = normalizeUsername(user.name)
  return messageOrComment
}

const normalizeUsername = (username) => {
  const name = username || ''

  if (name.match(/(\w+)\.(\w+)@(\w+)/)) {
    const parts = name.match(/(\w+)\.(\w+)@(\w+)/)
    return _.capitalize(parts[1]) + ' ' + _.capitalize(parts[2])
  }

  if (name.match(/@/)) {
    const parts = name.match(/(\w+)@(\w+)/)
    return _.capitalize(parts[1])
  }

  return _.capitalize(name)
}

module.exports = {
  enrichUser,
  normalizeUsername
}
