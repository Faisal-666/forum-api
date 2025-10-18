const CommentRepository = require('../../Domains/comment/CommentRepository');
const AuthorizationError = require('../../Commons/execptions/AuthorizationError');
const NotFoundError = require('../../Commons/execptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload) {
    const { threadId, content, username, } = payload;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content',
      values: [id, username, date, content, threadId, false, ],
    };
    const { rows } = await this._pool.query(query);
    return {
      id: rows[0].id,
      content: rows[0].content,
    };
  }

  async checkCommentWithId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async verifyAccess(username, commentId) {
    const query = {
      text: 'SELECT username FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    const owner = result.rows[0].username;
    if (owner !== username) {
      throw new AuthorizationError('Hanya owner yang bisa meghapus komentar');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: 'SELECT id, username, date, content, is_deleted FROM comments WHERE thread_id = $1 ORDER BY date ASC',
      values: [id],
    };
    const { rows } = await this._pool.query(query);

    return rows;
  }

}

module.exports = CommentRepositoryPostgres;
