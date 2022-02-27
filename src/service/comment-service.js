const connection = require('../app/database')

class CommentService {
  // 将用户发表的评论存入数据库中
  async create(momentId, content, userId) {
    const statement = `INSERT INTO comment (content, moment_id, user_id) VALUES (?, ?, ?);`
    const [result] = await connection.execute(statement, [content, momentId, userId])
    return result
  }

  // 将用户回复别人的评论存入数据库中
  async reply(momentId, content, userId, commentId) {
    const statement = `INSERT INTO comment (content, moment_id, user_id, comment_id) VALUES (?, ?, ?, ?);`
    const [result] = await connection.execute(statement, [content, momentId, userId, commentId])
    return result
  }

  // 将用户修改后的评论存入数据库中
  async update(commentId, content) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`
    const [result] = await connection.execute(statement, [content, commentId])
    return result
  }

  // 将用户要删除的评论从数据库中删除
  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`
    const [result] = await connection.execute(statement, [commentId])
    return result
  }

  // 获取某一动态中的评论列表
  async getCommentsByMomentId(momentId) {
    const statement = `
    SELECT 
      m.id, m.content, m.comment_id commentId, m.createAt createTime,
      JSON_OBJECT('id', u.id, 'name', u.name) user
    FROM comment m
    LEFT JOIN users u ON u.id = m.user_id
    WHERE moment_id = ?;
    `
    const [result] = await connection.execute(statement, [momentId])
    return result
  }
}

module.exports = new CommentService()