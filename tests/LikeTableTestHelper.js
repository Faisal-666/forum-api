/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', 
    userId = 'user-123',
    commentId = 'comment-123', 
    threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, threadId],
    };

    await pool.query(query);
  },

  async countLikes(id) {
    const query = {
      text: `SELECT comment_id, COUNT(*) AS like_count
             FROM comment_likes WHERE thread_id = $1
             GROUP BY comment_id;`,
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

};

module.exports = LikesTableTestHelper;