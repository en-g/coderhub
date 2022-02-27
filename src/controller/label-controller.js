const service = require('../service/label-service')

class LabelController {
  // 创建标签
  async create(ctx, next) {
    const { name } = ctx.request.body

    const result = await service.create(name)
    ctx.body = result
  }

  // 获取标签列表
  async list(ctx, next) {
    const { limit, offset } = ctx.query

    const result = await service.getLabels(limit, offset)
    ctx.body = result
  }
}

module.exports = new LabelController()