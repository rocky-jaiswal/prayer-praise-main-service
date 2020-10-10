'use strict'

const COMMENTS_TABLE = 'comments'

class CommentsRepo {
  constructor(db) {
    this.db = db
  }

  async create(comment, msgId, userId) {
    return this.db(COMMENTS_TABLE).insert({
      comment_text: comment.commentText,
      message_id: msgId,
      user_id: userId
    })
  }

  async getAllComments() {
    return this.db(COMMENTS_TABLE).select()
  }

  async deleteComment(id) {
    return this.db(COMMENTS_TABLE).where({ id }).del()
  }
}

module.exports = CommentsRepo
