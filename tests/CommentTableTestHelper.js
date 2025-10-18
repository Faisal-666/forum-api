/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper =  {
  async addComment({
    id = 'comment-123', 
    username = 'bobpants',
    content = 'test content', 
    thread_id = 'thread-123',
    is_deleted = false,
  }) {
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, username, date, content, thread_id, is_deleted,],
    };

    await pool.query(query);
  },

  async findComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments');
  },
};

module.exports = CommentsTableTestHelper;