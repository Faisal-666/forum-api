class AuthRepository {
  async verifyUserCredentials(credentials) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async addToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async verifyToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async deleteToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthRepository;
