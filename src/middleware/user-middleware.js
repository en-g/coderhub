const errorType = require('../constants/error-types')
const service = require('../service/user-service')
const md5password = require('../utils/password-handle')

// 该中间件对注册的账号和密码格式进行判断
const verifyUser = async (ctx, next) => {
  // 获取用户名和密码
  const { name, password } = ctx.request.body

  // 判断用户名或密码不能为空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 判断用户名是否已经注册过了
  const result = await service.getUserByName(name)
  if (result.length) {
    const error = new Error(errorType.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  await next()
}

// 用户注册密码加密
const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body
  ctx.request.body.password = md5password(password)
  await next()
}

module.exports = {
  verifyUser,
  handlePassword
}