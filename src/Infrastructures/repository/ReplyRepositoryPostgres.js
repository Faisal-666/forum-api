const ReplyRepository = require('../../Domains/reply/ReplyRepository');
const AuthorizationError = require('../../Commons/execptions/AuthorizationError');
const NotFoundError = require('../../Commons/execptions/NotFoundError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload) {
    const { commentId, content, username, } = payload;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content',
      values: [id, content, date, username, commentId, false, ],
    };
    const { rows } = await this._pool.query(query);
    return {
      id: rows[0].id,
      content: rows[0].content,
    };
  }

  async checkReplyWithId(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
  }

  async verifyAccess(username, replyId) {
    const query = {
      text: 'SELECT username FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    const owner = result.rows[0].username;
    if (owner !== username) {
      throw new AuthorizationError('Hanya owner yang bisa meghapus komentar');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }

  async getRepliesByThreadId(id) {
    const query = {
      text: `SELECT r.id, r.content, r.date, r.username, 
             r.comment_id, r.is_deleted FROM replies r
             JOIN comments c ON r.comment_id = c.id
             WHERE c.thread_id = $1 ORDER BY r.date ASC`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);

    return rows;
  }

}

module.exports = ReplyRepositoryPostgres;
