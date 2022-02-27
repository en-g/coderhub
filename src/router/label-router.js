const Router = require('koa-router')

const labelRouter = new Router({prefix: '/label'})

const {
  create,
  list
} = require('../controller/label-controller')
const {
  verifyAuth
} = require('../middleware/auth-middleware')

// 创建标签的路由
labelRouter.post('/', verifyAuth, create)
// 获取标签列表的路由
labelRouter.get('/', list)


module.exports = labelRouter