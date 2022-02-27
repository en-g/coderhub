const Router = require('koa-router')

const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth-middleware')
const {
  create,
  reply,
  update,
  remove,
  list
} = require('../controller/comment-controller.js')

const commentRouter = new Router({prefix: '/comment'})

// 用户对某一条动态发表评论的路由
commentRouter.post('/', verifyAuth, create)
// 用户回复某一条评论的路由
commentRouter.post('/:commentId/reply', verifyAuth, reply)
// 用户修改评论的路由
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
// 用户删除评论的路由
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)

// 获取某一动态的评论列表的路由
commentRouter.get('/', list)

module.exports = commentRouter