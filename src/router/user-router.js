const Router = require('koa-router')
const {
  create,
  avatarInfo
} = require('../controller/user-controller')
const {
  verifyUser,
  handlePassword
} = require('../middleware/user-middleware')

const userRouter = new Router({prefix: '/users'})

// 用户注册的路由
userRouter.post('/', verifyUser, handlePassword, create)

// 用户获取头像的路由
userRouter.get('/:userId/avatar', avatarInfo)

module.exports = userRouter