const service = require('../service/label-service')

// 判断要添加的标签是否存在于数据库中
const verifyLabelExists = async (ctx, next) => {
  // 取出要添加的所有标签
  const { labels } = ctx.request.body

  // 到数据库中查询每一个标签是否存在
  const newLabels = []
  for (let name of labels) {
    const labelResult = await service.getLabelByName(name)
    const label = { name }
    if (!labelResult) {
      // 不存在则创建标签数据，并拿到创建的标签的 id
      const result = await service.create(name)
      label.id = result.insertId
    } else {
      label.id = labelResult.id
    }
    // 保存每一个标签的 name 和 id
    newLabels.push(label)
  }
  ctx.labels = newLabels

  await next()
}

module.exports = {
  verifyLabelExists
}