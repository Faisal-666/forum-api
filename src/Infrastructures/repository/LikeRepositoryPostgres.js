const LikesRepository = require('../../Domains/like/LikeRepository');

class LikesRepositoryPostgres extends LikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async like(payload) {
    const { userId, commentId, threadId } = payload;
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, threadId ],
    };
    await this._pool.query(query);
        
    return { state: 'liked' };
  }

  async dislike(payload) {
    const { userId, commentId } = payload;
    const query = {
      text: 'DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [ userId, commentId ],
    };
    await this._pool.query(query);
        
    return { state: 'unliked' };
  }

  async getLikes(threadId) {
    const query = {
      text: `SELECT comment_id, COUNT(*) AS like_count
             FROM comment_likes WHERE thread_id = $1
             GROUP BY comment_id;`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = LikesRepositoryPostgres;
