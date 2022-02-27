const connection = require('../app/database')

class FileService {
  // 将头像图片信息保存到数据库中
  async createAvatar(filename, mimeType, size, userId) {
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);`
    const [result] = await connection.execute(statement, [filename, mimeType, size, userId])
    return result
  }

  // 根据用户 id 获取用户上传的图片信息
  async getAvatarByUserId(userId) {
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`
    const [result] = await connection.execute(statement, [userId])
    return result[0]
  }

  // 将用户在动态中上传的所有图片保存到数据库中
  async createFile(filename, mimetype, size, userId, momentId) {
    const statement = `INSERT INTO file (filename, mimetype, size, user_id, moment_id) VALUES (?, ?, ?, ?, ?);`
    const [result] = await connection.execute(statement, [filename, mimetype, size, userId, momentId])
    return result
  }

  // 根据图片名称获取对应的图片信息
  async getFileByFilename(filename) {
    const statement = `SELECT * FROM file WHERE filename = ?;`
    const [result] = await connection.execute(statement, [filename])
    return result[0]
  }
}

module.exports = new FileService()