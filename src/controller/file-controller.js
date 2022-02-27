const fileService = require('../service/file-service')
const userService = require('../service/user-service')
const { APP_HOST, APP_PORT } = require('../app/config')

class FileController {
  // 保存用户上传的头像图片信息
  async saveAvatarInfo(ctx, next) {
    // 获取图像相关信息
    const { filename, mimetype, size } = ctx.req.file
    const { id } = ctx.user

    // 将图像数据保存到数据库中
    const result = await fileService.createAvatar(filename, mimetype, size, id)

    // 将头像地址保存到 users 表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    await userService.updateAvatarUrlById(avatarUrl, id)

    ctx.body = '上传头像成功~'
  }

  // 保存用户在动态中上传的图片
  async savePictureInfo(ctx, next) {
    // 获取图像相关信息
    const files = ctx.req.files
    const { id } = ctx.user
    const { momentId } = ctx.query

    // 将用户在动态中上传的所有图片保存到数据库中
    for (let file of files) {
      const { filename, mimetype, size } = file
      await fileService.createFile(filename, mimetype, size, id, momentId)
    }

    ctx.body = '动态配图上传成功~'
  }
}

module.exports = new FileController()