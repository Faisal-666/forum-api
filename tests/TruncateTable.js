/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const TruncateTableHelper = {
  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies, comments, thread, users, authentications');
  },
};

module.exports = TruncateTableHelper;