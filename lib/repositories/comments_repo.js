'use strict'

class CommentsRepo {
  constructor(db) {
    this.db = db
  }

  async create(comment, msgId, userId) {
    return this.db('comments').insert({
      comment_text: comment.commentText,
      message_id: msgId,
      user_id: userId
    })
  }
}

module.exports = CommentsRepo
