const fs = require('fs')

const userService = require('../service/user-service')
const fileService = require('../service/file-service')
const { AVATAR_PATH } = require('../constants/file-path')

class UserController {
  // 处理创建用户的中间件
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body

    // 将数据插入数据库
    const result = await userService.create(user)

    // 返回数据
    ctx.body = result
  }

  // 用户获取头像
  async avatarInfo(ctx, next) {
    const { userId } = ctx.params
    // 根据用户 id 获取用户上传的头像信息
    const avatarInfo = await fileService.getAvatarByUserId(userId)

    // 返回头像
    // 告诉浏览器返回的数据是一张图片，否则浏览器一接收到文件就直接下载而不是展示
    ctx.response.set('content-type', avatarInfo.mimeType)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
  }
}

module.exports = new UserController()