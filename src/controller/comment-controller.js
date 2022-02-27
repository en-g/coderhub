const service = require('../service/comment-service.js')

class CommentController {
  // 用户发表评论
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body
    const { id } = ctx.user

    const result = await service.create(momentId, content, id)

    ctx.body = result
  }

  // 用户回复其他人的评论
  async reply(ctx, next) {
    const { momentId, content } = ctx.request.body
    const { commentId } = ctx.params    // 被回复的评论 id
    const { id } = ctx.user

    const result = await service.reply(momentId, content, id, commentId)

    ctx.body = result
  }

  // 用户修改评论
  async update(ctx, next) {
    const { content } = ctx.request.body
    const { commentId } = ctx.params

    const result = await service.update(commentId, content)
    ctx.body = result
  }

  // 用户删除评论
  async remove(ctx, next) {
    const { commentId } = ctx.params

    const result = await service.remove(commentId)
    ctx.body = result
  }

  // 评论列表
  async list(ctx, next) {
    const { momentId } = ctx.query

    const result = await service.getCommentsByMomentId(momentId)
    ctx.body = result
  }
}

module.exports = new CommentController()