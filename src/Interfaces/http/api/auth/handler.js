const UserLoginUseCase = require('../../../../Applications/use_case/UserLoginUseCase');
const RefreshTokenUseCase = require('../../../../Applications/use_case/RefreshTokenUseCase');
const UserLogoutUseCase = require('../../../../Applications/use_case/UserLogoutUseCase');

class AuthHandler {
  constructor(container) {
    this._container = container;

    this.postAuthhandler = this.postAuthhandler.bind(this);
    this.putAuthhandler = this.putAuthhandler.bind(this);
    this.deleteAuthhandler = this.deleteAuthhandler.bind(this);
  }

  async postAuthhandler(req, h) {
    const authUseCase = this._container.getInstance(UserLoginUseCase.name);
    const data = await authUseCase.execute(req.payload);

    return h.response({
      status: 'success',
      data,
    }).code(201);
  }

  async putAuthhandler(req, h) {
    const refreshTokenUsecase = this._container.getInstance(RefreshTokenUseCase.name);
    const data = await refreshTokenUsecase.execute(req.payload);

    return h.response({
      status: 'success',
      data,
    }).code(200);
  }

  async deleteAuthhandler(req, h) {
    const deleteTokenUseCase = this._container.getInstance(UserLogoutUseCase.name);
    await deleteTokenUseCase.execute(req.payload);

    return h.response({
      status: 'success',
      message: 'Berhasil hapus refreshToken',
    }).code(200);
  }
}

module.exports = AuthHandler;