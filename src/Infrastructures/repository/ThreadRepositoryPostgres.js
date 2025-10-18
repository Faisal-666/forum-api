const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const NotFoundError = require('../../Commons/execptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const { title, body, username } = payload;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO thread VALUES($1, $2, $3, $4, $5) RETURNING id, title',
      values: [id, title, body, date, username],
    };
    const { rows } = await this._pool.query(query);

    return {
      id: rows[0].id,
      title: rows[0].title,
    };
  }

  async checkThreadWithId(id) {
    const query = {
      text: 'SELECT * FROM thread WHERE id = $1',
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);

    if(!rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getDetailThread(id) {
    const threadQuery = {
      text: 'SELECT * FROM thread WHERE id = $1',
      values: [id],
    };
    const { rows } = await this._pool.query(threadQuery);

    return rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
