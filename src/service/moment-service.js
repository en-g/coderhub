const connection = require('../app/database')

const sqlFragment = `
  SELECT 
     m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
     JSON_OBJECT('id', u.id, 'name', u.name) user
   FROM moment  m
   LEFT JOIN users u ON m.user_id = u.id
`

class MomentService {
  // 将用户发布的动态保存到数据库中
  async create(userId, content) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`
    const [result] = await connection.execute(statement, [content, userId])
    return result
  }

  // 根据动态的 id 查询详情（包括动态详情、发布的用户详情、评论列表、标签列表）
  async getMomentById(id) {
    const statement = `
    SELECT 
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
      IF(COUNT(l.id), JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL) labels,
      (SELECT IF(COUNT(c.id), JSON_ARRAYAGG(
        JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 
                    'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
      ), NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
      (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/', file.filename)) 
       FROM file WHERE m.id = file.moment_id) images
    FROM moment m
    LEFT JOIN users u ON m.user_id = u.id
    LEFT JOIN moment_label ml ON ml.moment_id = m.id
    LEFT JOIN label l ON ml.label_id = l.id
    WHERE m.id = ?
    GROUP BY m.id;
    `
    const [result] = await connection.execute(statement, [id])
    return result[0]
  }

  // 查询多条动态详情（包括动态详情和发布的用户详情）
  async getMomentList(offset, size) {
    const statement = `
    SELECT 
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT('id', u.id, 'name', u.name) author,
      (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
      (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
      (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/', file.filename)) 
       FROM file WHERE m.id = file.moment_id) images
    FROM moment  m
    LEFT JOIN users u ON m.user_id = u.id
    LIMIT ?, ?;
    `
    const [result] = await connection.execute(statement, [offset, size])
    return result
  }

  // 修改用户发布的动态
  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`
    const [result] = await connection.execute(statement, [content, momentId])
    return result
  }

  // 删除用户发布的动态
  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`
    const [result] = await connection.execute(statement, [momentId])
    return result
  }

  // 判断动态是否含有某一个标签
  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return !!result[0]
  }

  // 给动态添加指定的标签
  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return result
  }
}

module.exports = new MomentService()