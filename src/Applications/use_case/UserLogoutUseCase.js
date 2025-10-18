class UserLogoutUseCase {
  constructor({ authRepository }) {
    this._authRepository  = authRepository;
  }

  async execute(payload) {
    const { refreshToken } = payload;
    await this._authRepository.verifyToken(refreshToken);
    await this._authRepository.deleteToken(refreshToken);
  }
}

module.exports = UserLogoutUseCase;
