const Credentials = require('../../Domains/auth/entities/Credentials');
const AuthenticationToken = require('../../Domains/auth/entities/AuthenticationToken');

class UserLoginUseCase {
  constructor({ authRepository, tokenize }) {
    this._authRepository = authRepository;
    this._tokenize = tokenize;
  }

  async execute(useCasePayload) {
    const credentials = new Credentials(useCasePayload);
    const id = await this._authRepository.verifyUserCredentials(credentials);
    const accessToken = await this._tokenize.generateAccessToken({ id });
    const refreshToken = await this._tokenize.generateRefreshToken({ id });
    await this._authRepository.addToken(refreshToken);
    return new AuthenticationToken({
      accessToken,
      refreshToken,
    });
  }
}

module.exports = UserLoginUseCase;
