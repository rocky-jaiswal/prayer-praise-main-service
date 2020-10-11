const enrichUser = (messageOrComment, users) => {
  // We do this to avoid the N+1 query problem
  const user = users.find((u) => u.id === messageOrComment.user_id)
  messageOrComment.username = user.name
  return messageOrComment
}

module.exports = {
  enrichUser
}
