const fs = require('fs')

const momentService = require('../service/moment-service')
const fileService = require('../service/file-service')
const { PICTURE_PATH } = require('../constants/file-path')

class MomentController {
  // 发布动态
  async create(ctx, next) {
    // 获取数据（user_id, content）
    const userId = ctx.user.id
    const content = ctx.request.body.content

    // 将数据插入到数据库中
    const result = await momentService.create(userId, content)
    ctx.body = result
  }

  // 查询单条动态
  async detail(ctx, next) {
    // 获取数据
    const momentId = ctx.params.momentId
    // 根据 id 去数据库中查询
    const result = await momentService.getMomentById(momentId)
    ctx.body = result
  }

  // 查询动态列表
  async list(ctx, next) {
    // 获取数据（offset/size）
    const { offset, size } = ctx.query
    // 查询列表
    const result = await momentService.getMomentList(offset, size)
    ctx.body = result
  }

  // 修改动态详情
  async update(ctx, next) {
    const { momentId } = ctx.params
    const { content } = ctx.request.body

    const result = await momentService.update(content, momentId)
    ctx.body = result
  }

  // 删除动态
  async remove(ctx, next) {
    const { momentId } = ctx.params

    const result = await momentService.remove(momentId)
    ctx.body = result
  }

  // 给动态添加标签
  async addLabels(ctx, next) {
    // 获取标签和动态 id
    const { labels } = ctx
    const { momentId } = ctx.params

    // 添加所有标签
    for (let label of labels) {
      // 判断动态是否含有该标签
      const isExists = await momentService.hasLabel(momentId, label.id)
      // 不包含则给动态添加该标签
      if (!isExists) {
        await momentService.addLabel(momentId, label.id)
      }
    }

    ctx.body = '给动态添加标签成功~'
  }

  // 获取动态的图片信息
  async fileInfo(ctx, next) {
    // 获取图片名称
    let { filename } = ctx.params

    // 根据图片名称到数据库中查询图片信息
    const fileInfo = await fileService.getFileByFilename(filename)

    // 获取用户要请求的图片大小类型
    const { type } = ctx.query
    const types = ['small', 'middle', 'large']
    if (types.includes(type)) {
      filename = filename + '-' + type
    }

    // 返回图片
    ctx.response.set('content-type', fileInfo.mimeType)
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
  }
}

module.exports = new MomentController()