const AuthRepository = require('../../Domains/auth/AuthRepository');
const InvariantError = require('../../Commons/execptions/InvariantError');
const AuthenticationError = require('../../Commons/execptions/AuthenticationError');

class AuthRepositoryPostgres extends AuthRepository {
  constructor(pool, passwordHash) {
    super();
    this._pool = pool;
    this._passwordHash = passwordHash;
  }

  async verifyUserCredentials(credentials) {
    const { username, password } = credentials;
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new InvariantError('Username salah');
    }

    const { id, password: hashedPass } = result.rows[0];
    const match = await this._passwordHash.compare(password, hashedPass);

    if(!match) {
      throw new AuthenticationError('Password salah');
    }

    return id;
  }

  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications (token) VALUES($1)',
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
    const { rowCount } = await this._pool.query(query);

    if(!rowCount) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthRepositoryPostgres;
