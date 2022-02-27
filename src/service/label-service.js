 const connection = require('../app/database')

class LabelService {
  // 将创建的标签保存到数据库中
  async create(name) {
    const statement = `INSERT INTO label (name) VALUES (?);`
    const [result] = await connection.execute(statement, [name])
    return result
  }

  // 判断标签是否存在于数据库中
  async getLabelByName(name) {
    const statement = `SELECT * FROM label WHERE name = ?;`
    const [result] = await connection.execute(statement, [name])
    return result[0]
  }

  // 获取标签列表
  async getLabels(limit, offset) {
    const statement = `SELECT * FROM label LIMIT ?, ?;`
    const [result] = await connection.execute(statement, [offset, limit])
    return result
  }
}

module.exports = new LabelService()