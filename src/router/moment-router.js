const Router = require('koa-router')

const momentRouter = new Router({prefix: '/moment'})

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo
} = require('../controller/moment-controller.js')

const {
  verifyAuth,         // 登录验证
  verifyPermission    // 权限验证
} = require('../middleware/auth-middleware')

const {
  verifyLabelExists
} = require('../middleware/label-middleware')

// 用户发布动态的路由
momentRouter.post('/', verifyAuth, create)
// 获取动态详情（多个）的路由
momentRouter.get('/', list)
// 获取动态详情（单个）的路由
momentRouter.get('/:momentId', detail)
// 修改动态详情的路由
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update)
// 删除动态的路由
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove)

// 给动态添加标签的路由
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels)

// 获取动态的配图的路由
momentRouter.get('/images/:filename', fileInfo)

module.exports = momentRouter