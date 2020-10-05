'use strict'

class CommentsService {
  constructor(commentsRepo) {
    this.commentsRepo = commentsRepo
  }

  async createComment(comment, msgId, userId) {
    await this.commentsRepo.create(comment, msgId, userId)
    return {}
  }
}

module.exports = CommentsService
