'use strict'

class CommentsService {
  constructor(commentsRepo, usersRepo) {
    this.commentsRepo = commentsRepo
    this.usersRepo = usersRepo
  }

  _enrichUser(messageOrComment, users) {
    // We do this to avoid the N+1 query problem
    const user = users.find((u) => u.id === messageOrComment.user_id)
    messageOrComment.username = user.name
    return messageOrComment
  }

  async createComment(comment, msgId, userId) {
    await this.commentsRepo.create(comment, msgId, userId)
    return {}
  }

  async getAllComments() {
    const messages = await this.commentsRepo.getAllComments()
    const users = await this.usersRepo.getAllUsers()
    return messages.map((m) => this._enrichUser(m, users))
  }

  async deleteComment(commentId) {
    return this.commentsRepo.deleteComment(commentId)
  }
}

module.exports = CommentsService
