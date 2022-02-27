const fs = require('fs')

// 读取 router 文件夹下的路由并进行注册
const useRoutes =function() {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return
    const router = require(`./${file}`)
    this.use(router.routes())
    this.use(router.allowedMethods())
  })
}

module.exports = useRoutes