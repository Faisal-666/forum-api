/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper =  {
  async addReply({
    id = 'reply-123', 
    username = 'bobpants',
    content = 'test content', 
    comment_id = 'comment-123',
    is_deleted = false,
  }) {
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, date, username, comment_id, is_deleted,],
    };

    await pool.query(query);
  },

  async findReply(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies');
  },
};

module.exports = ReplyTableTestHelper;