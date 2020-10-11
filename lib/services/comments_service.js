'use strict'

const { enrichUser } = require('./utils')

class CommentsService {
  constructor(commentsRepo, usersRepo) {
    this.commentsRepo = commentsRepo
    this.usersRepo = usersRepo
  }

  async createComment(comment, msgId, userId) {
    await this.commentsRepo.create(comment, msgId, userId)
    return {}
  }

  async getAllComments() {
    const messages = await this.commentsRepo.getAllComments()
    const users = await this.usersRepo.getAllUsers()
    return messages.map((m) => enrichUser(m, users))
  }

  async deleteComment(commentId) {
    return this.commentsRepo.deleteComment(commentId)
  }
}

module.exports = CommentsService
