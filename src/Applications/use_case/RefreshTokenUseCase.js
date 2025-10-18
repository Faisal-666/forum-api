class RefreshTokenUseCase {
  constructor({ authRepository, tokenize }) {
    this._authRepository = authRepository;
    this._tokenize = tokenize;
  }

  async execute(payload) {
    const { refreshToken } = payload;
    const { id } = await this._tokenize.verifyRefreshToken(refreshToken);
    await this._authRepository.verifyToken(refreshToken);
    const accessToken = await this._tokenize.generateAccessToken({ id });
    return { accessToken };
  }
}

module.exports = RefreshTokenUseCase;
