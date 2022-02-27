const jwt = require('jsonwebtoken')

const errorType = require('../constants/error-types')
const userService = require('../service/user-service')
const authService = require('../service/auth-service')
const md5password = require('../utils/password-handle')
const { PUBLIC_KEY } = require('../app/config')

// 用户登录验证
const verifyLogin = async (ctx, next) => {
  // 获取用户名和密码
  const { name, password } = ctx.request.body

  // 判断用户名和密码是否为空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 判断用户名是否存在
  const result = await userService.getUserByName(name)
  const user = result[0]
  if (!user) {
    const error = new Error(errorType.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 判断密码是否和数据库中的密码一致
  if (md5password(password) !== user.password) {
    const error = new Error(errorType.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }

  // 登录的用户信息
  ctx.user = user

  await next()
}

// 用户的 token 验证
const verifyAuth = async (ctx, next) => {
  // 获取 token
  const authorization = ctx.headers.authorization
  // 如果没有传入 token
  if (!authorization) {
    const error = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')

  // token 验证
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    // 获取 token 解密后的用户信息
    ctx.user = result
    await next()
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
}

/*
* 用户的权限验证（重要）
* 业务接口：
* userId <-> id（匹配即有权限）
* 后台管理系统：
* 一对一：user -> role
* 多对多：role -> permission
* */
const verifyPermission = async (ctx, next) => {
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user

  // 查询是否具备权限
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id)
    if (!isPermission) throw new Error()
    await next()
  } catch (err) {
    const error = new Error(errorType.UNPERMISSION)
    return ctx.app.emit('error', error, ctx)
  }
}
module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}