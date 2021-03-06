const Router = require('koa-router')

const authRouter = new Router()

const {
  login,
  success
} = require('../controller/auth-controller')
const {
  verifyLogin,
  verifyAuth
} = require('../middleware/auth-middleware')

// 用户登录的路由
authRouter.post('/login', verifyLogin, login)
// 测试是否用户登录成功的路由
authRouter.get('/test', verifyAuth, success)

module.exports = authRouter