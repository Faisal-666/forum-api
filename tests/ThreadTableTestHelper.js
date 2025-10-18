/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper =  {
  async addthread({
    id = 'thread-123', 
    title = 'test', 
    body = 'test body', 
    username = 'bobpants',
  }) {
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO thread VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, username ],
    };

    await pool.query(query);
  },

  async findThread(id) {
    const query = {
      text: 'SELECT * FROM thread WHERE id = $1',
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread');
  },
};

module.exports = ThreadTableTestHelper;