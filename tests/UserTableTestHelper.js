/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const bcrypt = require('bcrypt');

const UserTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'testing', password = 'teamSecret', fullname = 'fullname',
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, hashedPassword, fullname],
    };

    await pool.query(query);
  },

  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users');
  },
};

module.exports = UserTableTestHelper;
