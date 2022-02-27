const connection = require('../app/database')

class UserService {
  // 创建用户成功将数据插入数据库
  async create(user) {
    const { name, password } = user
    const statement = `INSERT INTO users (name, password) VALUES (?, ?);`

    const result = await connection.execute(statement, [name, password])

    return result[0]
  }

  // 查看该用户名是否已经注册
  async getUserByName(name) {
    const statement = `SELECT * FROM users WHERE name = ?;`
    const results = await connection.execute(statement, [name])
    return results[0]
  }

  // 将头像地址保存到数据库 users 表中
  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`
    const [results] = await connection.execute(statement, [avatarUrl, userId])
    return results
  }
}

module.exports = new UserService()