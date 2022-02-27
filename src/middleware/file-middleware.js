const Multer = require('koa-multer')
const Jimp = require('jimp')
const path = require('path')

const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path')

// 指定头像保存路径
const avatarUpload = Multer({
  dest: AVATAR_PATH
})
// 接收单个头像图片
const avatarHandler = avatarUpload.single('avatar')


// 指定动态的图片的保存路径
const pictureUpload = Multer({
  dest: PICTURE_PATH
})
// 接收多个配图
const pictureHandler = pictureUpload.array('picture', 9)


// 图片大小处理
const pictureResize = async (ctx, next) => {
  try {
    // 获取所有的图片信息
    const files = ctx.req.files

    // 对图片进行处理（sharp/jimp）
    for (let file of files) {
      const destPath = path.join(file.destination, file.filename)
      // 为上传的图片添加大、中、小图
      Jimp.read(file.path).then(image => {
        image.resize(1280, Jimp.AUTO).write(`${destPath}-large`)
        image.resize(640, Jimp.AUTO).write(`${destPath}-middle`)
        image.resize(320, Jimp.AUTO).write(`${destPath}-small`)
      })
    }
  } catch (e) {
    console.log(e)
  }
  await next()
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize
}