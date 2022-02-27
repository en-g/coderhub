const Router = require('koa-router')

const {
  saveAvatarInfo,
  savePictureInfo
} = require('../controller/file-controller')
const {
  verifyAuth
} = require('../middleware/auth-middleware')
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require('../middleware/file-middleware')

const fileRouter = new Router({prefix: '/upload'})


// 上传头像的路由
fileRouter.post('/avatar', verifyAuth, avatarHandler, saveAvatarInfo)
// 上传动态的图片的路由
fileRouter.post('/picture', verifyAuth, pictureHandler, pictureResize, savePictureInfo)


module.exports = fileRouter